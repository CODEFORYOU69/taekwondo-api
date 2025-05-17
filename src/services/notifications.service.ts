// src/services/notifications.service.ts
import { NotificationType } from "@prisma/client";
import prisma from "../config/database";
import {
  CreateNotificationDto,
  MarkAllReadResult,
  NotificationFilterDto,
  NotificationStatsDto,
} from "../dto/notifications";
import { ApiError } from "../interfaces/error.interface";

export class NotificationsService {
  /**
   * Récupérer toutes les notifications d'un utilisateur avec filtrage
   */
  static async getAllNotifications(
    userId: string,
    filters: NotificationFilterDto = {}
  ) {
    const where: any = { userId };

    if (filters.seen !== undefined) {
      where.seen = filters.seen;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    return prisma.notification.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Récupérer une notification par son ID
   */
  static async getNotificationById(id: string) {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      const error = new Error("Notification non trouvée") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    return notification;
  }

  /**
   * Créer une nouvelle notification
   */
  static async createNotification(data: CreateNotificationDto) {
    try {
      // Vérifier si l'utilisateur existe
      const user = await prisma.user.findUnique({
        where: { id: data.userId },
      });

      if (!user) {
        const error = new Error("Utilisateur non trouvé") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Créer la notification
      const notification = await prisma.notification.create({
        data: {
          userId: data.userId,
          type: data.type,
          title: data.title,
          body: data.body,
          seen: false,
        },
      });

      // TODO: Si nécessaire, implémenter l'envoi de notification push en temps réel
      // basé sur le deviceToken de l'utilisateur (si disponible)

      return notification;
    } catch (error) {
      if (!(error as ApiError).statusCode) {
        const apiError = new Error(
          "Erreur lors de la création de la notification"
        ) as ApiError;
        apiError.statusCode = 400;
        throw apiError;
      }
      throw error;
    }
  }

  /**
   * Marquer une notification comme lue
   */
  static async markNotificationAsRead(id: string) {
    // Vérifier si la notification existe
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      const error = new Error("Notification non trouvée") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    // Mettre à jour la notification
    return prisma.notification.update({
      where: { id },
      data: { seen: true },
    });
  }

  /**
   * Marquer toutes les notifications d'un utilisateur comme lues
   */
  static async markAllNotificationsAsRead(
    userId: string
  ): Promise<MarkAllReadResult> {
    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const error = new Error("Utilisateur non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    // Compter les notifications non lues
    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        seen: false,
      },
    });

    // Marquer toutes les notifications comme lues
    await prisma.notification.updateMany({
      where: {
        userId,
        seen: false,
      },
      data: { seen: true },
    });

    return {
      success: true,
      count: unreadCount,
    };
  }

  /**
   * Supprimer une notification
   */
  static async deleteNotification(id: string, userId: string) {
    // Vérifier si la notification existe et appartient à l'utilisateur
    const notification = await prisma.notification.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!notification) {
      const error = new Error(
        "Notification non trouvée ou accès non autorisé"
      ) as ApiError;
      error.statusCode = 404;
      throw error;
    }

    // Supprimer la notification
    await prisma.notification.delete({
      where: { id },
    });

    return true;
  }

  /**
   * Obtenir des statistiques sur les notifications d'un utilisateur
   */
  static async getNotificationStats(
    userId: string
  ): Promise<NotificationStatsDto> {
    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const error = new Error("Utilisateur non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    // Compter toutes les notifications
    const totalCount = await prisma.notification.count({
      where: { userId },
    });

    // Compter les notifications non lues
    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        seen: false,
      },
    });

    // Compter les notifications par type
    const notificationTypes = Object.values(NotificationType);
    const byType = await Promise.all(
      notificationTypes.map(async (type) => {
        const count = await prisma.notification.count({
          where: {
            userId,
            type,
          },
        });

        const unreadCount = await prisma.notification.count({
          where: {
            userId,
            type,
            seen: false,
          },
        });

        return {
          type,
          count,
          unreadCount,
        };
      })
    );

    return {
      totalCount,
      unreadCount,
      byType: byType.filter((typeStats) => typeStats.count > 0), // Ne retourner que les types qui ont des notifications
    };
  }

  /**
   * Créer une notification système pour un événement (match qui approche, résultat, etc.)
   */
  static async createEventNotification(
    userId: string,
    type: NotificationType,
    eventId: string,
    title: string,
    body: string
  ) {
    try {
      // Vérifier si l'utilisateur existe
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error(`Utilisateur ${userId} non trouvé`);
      }

      // Créer la notification avec métadonnées
      const notification = await prisma.notification.create({
        data: {
          userId,
          type,
          title,
          body,
          seen: false,
          // Utiliser le champ `meta` qui serait à ajouter au modèle Notification
          // meta: {
          //   eventId,
          //   timestamp: new Date()
          // } as any
        },
      });

      // TODO: Implémenter l'envoi de notification push en temps réel si nécessaire

      return notification;
    } catch (error) {
      console.error(
        "Erreur lors de la création de la notification d'événement:",
        error
      );
      throw error;
    }
  }
}
