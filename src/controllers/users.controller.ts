// src/controllers/users.controller.ts
import { NextFunction, Request, Response } from "express";
import {
  createUserSchema,
  updateUserSchema,
  changePasswordSchema,
} from "../dto/users";
import { UsersService } from "../services/users.service";
import { TokenPayload } from "../interfaces/auth.interface";

/**
 * Récupérer tous les utilisateurs
 */
export const getAllUsers = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { role, organizationId } = req.query;

    const filters: any = {};

    if (role) {
      filters.role = role;
    }

    // Si l'utilisateur n'est pas super_admin, limiter aux utilisateurs de son organisation
    if (req.user?.role !== "super_admin") {
      if (
        organizationId &&
        req.user?.role !== "admin" &&
        req.user?.organizationId !== organizationId
      ) {
        res
          .status(403)
          .json({ message: "Accès non autorisé à cette organisation" });
        return;
      }

      // Si fédération ou admin club, limiter à son organisation
      if (req.user?.role === "federation" || req.user?.role === "club") {
        filters.organizationId = req.user.organizationId;
      }
    } else if (organizationId) {
      filters.organizationId = organizationId;
    }

    const users = await UsersService.getAllUsers(filters);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * Créer un nouvel utilisateur
 */
export const createUser = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validation des données
    const validationResult = createUserSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const data = validationResult.data;

    // Si l'utilisateur n'est pas super_admin ou admin, il ne peut créer que des utilisateurs pour son organisation
    if (req.user?.role !== "super_admin" && req.user?.role !== "admin") {
      if (
        !data.organizationId ||
        data.organizationId !== req.user?.organizationId
      ) {
        data.organizationId = req.user?.organizationId;
      }

      // Limiter les rôles que peuvent créer les non-admins
      if (
        data.role === "super_admin" ||
        data.role === "admin" ||
        data.role === "federation"
      ) {
        res
          .status(403)
          .json({
            message: "Vous n'êtes pas autorisé à créer ce type d'utilisateur",
          });
        return;
      }
    }

    const user = await UsersService.createUser(data);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer un utilisateur par son ID
 */
export const getUserById = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Vérifier les droits d'accès
    if (req.user?.role !== "super_admin" && req.user?.role !== "admin") {
      // Les utilisateurs standards ne peuvent voir que leur propre profil
      if (req.user?.id !== id) {
        const user = await UsersService.getUserById(id);

        // Vérifier que l'utilisateur fait partie de la même organisation
        if (
          !user.organizationId ||
          user.organizationId !== req.user?.organizationId
        ) {
          res.status(403).json({ message: "Accès non autorisé" });
          return;
        }
      }
    }

    const user = await UsersService.getUserById(id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour un utilisateur
 */
export const updateUser = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validation des données
    const validationResult = updateUserSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const data = validationResult.data;

    // Vérifier les droits d'accès
    if (req.user?.role !== "super_admin" && req.user?.role !== "admin") {
      // Les utilisateurs standards ne peuvent modifier que leur propre profil
      if (req.user?.id !== id) {
        res.status(403).json({ message: "Accès non autorisé" });
        return;
      }

      // Et ne peuvent pas changer leur rôle ou organisation
      delete data.role;
      delete data.organizationId;
    }

    const user = await UsersService.updateUser(id, data);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Changer le mot de passe
 */
export const changePassword = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Vérifier les droits d'accès
    if (req.user?.id !== id && req.user?.role !== "super_admin") {
      res.status(403).json({ message: "Accès non autorisé" });
      return;
    }

    // Validation des données
    const validationResult = changePasswordSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const data = validationResult.data;
    const result = await UsersService.changePassword(id, data);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer un utilisateur
 */
export const deleteUser = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Seul un super_admin peut supprimer un compte
    if (req.user?.role !== "super_admin") {
      res.status(403).json({ message: "Accès non autorisé" });
      return;
    }

    await UsersService.deleteUser(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer les notifications d'un utilisateur
 */
export const getUserNotifications = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { seen } = req.query;

    // Vérifier les droits d'accès
    if (
      req.user?.id !== id &&
      req.user?.role !== "super_admin" &&
      req.user?.role !== "admin"
    ) {
      res.status(403).json({ message: "Accès non autorisé" });
      return;
    }

    const notifications = await UsersService.getUserNotifications(
      id,
      seen === "true" ? true : seen === "false" ? false : undefined
    );

    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};
