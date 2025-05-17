// src/controllers/notifications.controller.ts
import { NotificationType } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import {
  createNotificationSchema,
  notificationFilterSchema,
} from "../dto/notifications";
import { TokenPayload } from "../interfaces/auth.interface";
import { NotificationsService } from "../services/notifications.service";

/**
 * Récupérer toutes les notifications de l'utilisateur connecté
 */
export const getAllNotifications = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ message: "Non authentifié" });
      return;
    }

    const userId = req.user.userId;
    const { seen, type } = req.query;

    const filters = notificationFilterSchema.safeParse({
      seen: seen === "true" ? true : seen === "false" ? false : undefined,
      type:
        type &&
        Object.values(NotificationType).includes(type as NotificationType)
          ? (type as NotificationType)
          : undefined,
    });

    if (!filters.success) {
      res.status(400).json({
        message: "Paramètres de filtre invalides",
        errors: filters.error.errors,
      });
      return;
    }

    const notifications = await NotificationsService.getAllNotifications(
      userId,
      filters.data
    );
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

/**
 * Créer une nouvelle notification
 */
export const createNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validation des données
    const validationResult = createNotificationSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const notification = await NotificationsService.createNotification(
      validationResult.data
    );
    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer une notification par son ID
 */
export const getNotificationById = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ message: "Non authentifié" });
      return;
    }

    const { id } = req.params;
    const notification = await NotificationsService.getNotificationById(id);

    // Vérifier que l'utilisateur est autorisé à voir cette notification
    if (notification.userId !== req.user.userId) {
      res.status(403).json({ message: "Accès non autorisé" });
      return;
    }

    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
};

/**
 * Marquer une notification comme lue
 */
export const markNotificationAsRead = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ message: "Non authentifié" });
      return;
    }

    const { id } = req.params;

    // D'abord, vérifier que la notification appartient à l'utilisateur
    const notification = await NotificationsService.getNotificationById(id);

    if (notification.userId !== req.user.userId) {
      res.status(403).json({ message: "Accès non autorisé" });
      return;
    }

    const updatedNotification =
      await NotificationsService.markNotificationAsRead(id);
    res.status(200).json(updatedNotification);
  } catch (error) {
    next(error);
  }
};

/**
 * Marquer toutes les notifications de l'utilisateur comme lues
 */
export const markAllNotificationsAsRead = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ message: "Non authentifié" });
      return;
    }

    const userId = req.user.userId;
    const result = await NotificationsService.markAllNotificationsAsRead(
      userId
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer une notification
 */
export const deleteNotification = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ message: "Non authentifié" });
      return;
    }

    const userId = req.user.userId;
    const { id } = req.params;

    await NotificationsService.deleteNotification(id, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Obtenir les statistiques des notifications de l'utilisateur
 */
export const getUserNotificationStats = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ message: "Non authentifié" });
      return;
    }

    const userId = req.user.userId;
    const stats = await NotificationsService.getNotificationStats(userId);
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};
