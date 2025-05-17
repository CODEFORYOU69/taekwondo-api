// src/controllers/sync.controller.ts
import { NextFunction, Request, Response } from "express";
import prisma from "../config/database";
import {
  syncConfigSchema,
  syncPushSchema,
  syncResolveConflictSchema,
} from "../dto/sync";
import { TokenPayload } from "../interfaces/auth.interface";
import { SyncService } from "../services/sync.service";

/**
 * Push - Recevoir et appliquer les modifications depuis le client
 */
export const pushChanges = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validation des données
    const validationResult = syncPushSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const { modelName, changes, clientId } = validationResult.data;

    // Vérification des permissions
    // Pour certains modèles, seuls des rôles spécifiques peuvent synchroniser
    const restrictedModels = ["User", "Organization"];
    if (
      restrictedModels.includes(modelName) &&
      !["super_admin", "admin"].includes(req.user?.role || "")
    ) {
      res
        .status(403)
        .json({ message: "Accès non autorisé pour synchroniser ce modèle" });
      return;
    }

    // Appliquer les changements
    const results = await SyncService.applyChanges(modelName, changes);

    // Enregistrer le suivi de synchronisation
    await prisma.syncLog.create({
      data: {
        modelName,
        recordId: "BATCH",
        direction: "LOCAL_TO_CLOUD",
        status: "SUCCESS",
      },
    });

    res.status(200).json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Pull - Récupérer les modifications depuis le serveur
 */
export const pullChanges = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Pour une requête GET, les paramètres sont dans req.query
    const sinceDate = req.query.since as string;
    const modelName = req.query.modelName as string;
    const clientId = req.query.clientId as string;

    // Validation des données
    if (!modelName) {
      res.status(400).json({ message: "Le paramètre modelName est requis" });
      return;
    }

    // Convertir la date depuis l'ISO string
    let since: Date;
    try {
      since = sinceDate ? new Date(sinceDate) : new Date(0); // Date(0) = le début des temps
    } catch (e) {
      res.status(400).json({ message: "Format de date invalide" });
      return;
    }

    // Vérification des permissions
    // Pour certains modèles, seuls des rôles spécifiques peuvent synchroniser
    const restrictedModels = ["User", "Organization"];
    if (
      restrictedModels.includes(modelName) &&
      !["super_admin", "admin"].includes(req.user?.role || "")
    ) {
      res
        .status(403)
        .json({ message: "Accès non autorisé pour synchroniser ce modèle" });
      return;
    }

    // Récupérer les changements
    const changes = await SyncService.getChangesSince(modelName, since);

    // Enregistrer le suivi de synchronisation
    await prisma.syncLog.create({
      data: {
        modelName,
        recordId: "BATCH",
        direction: "CLOUD_TO_LOCAL",
        status: "SUCCESS",
      },
    });

    res.status(200).json({
      success: true,
      changes,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Configurer les paramètres de synchronisation
 */
export const configureSyncSettings = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validation des données
    const validationResult = syncConfigSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const { modelName, enabled, direction, conflictStrategy, syncInterval } =
      validationResult.data;

    // Vérification que l'utilisateur est admin
    if (req.user?.role !== "super_admin" && req.user?.role !== "admin") {
      res.status(403).json({
        message:
          "Seuls les administrateurs peuvent configurer la synchronisation",
      });
      return;
    }

    // Configurer les paramètres
    const config = await SyncService.configureSyncSettings(
      modelName,
      enabled,
      direction,
      conflictStrategy,
      syncInterval
    );

    res.status(200).json({
      success: true,
      config,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer la configuration de synchronisation actuelle
 */
export const getSyncConfig = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { modelName } = req.params;

    if (!modelName) {
      // Récupérer toutes les configurations
      const configs = await prisma.syncConfig.findMany();
      res.status(200).json(configs);
      return;
    }

    // Récupérer la configuration pour un modèle spécifique
    const config = await prisma.syncConfig.findUnique({
      where: { modelName },
    });

    if (!config) {
      res.status(404).json({ message: "Configuration non trouvée" });
      return;
    }

    res.status(200).json(config);
  } catch (error) {
    next(error);
  }
};

/**
 * Résoudre un conflit de synchronisation
 */
export const resolveConflict = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validation des données
    const validationResult = syncResolveConflictSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const { modelName, recordId, resolution, manualData } =
      validationResult.data;

    // Vérification des permissions
    // Pour certains modèles, seuls des rôles spécifiques peuvent résoudre les conflits
    const restrictedModels = ["User", "Organization"];
    if (
      restrictedModels.includes(modelName) &&
      !["super_admin", "admin"].includes(req.user?.role || "")
    ) {
      res
        .status(403)
        .json({ message: "Accès non autorisé pour résoudre ce conflit" });
      return;
    }

    // Implémentation de la résolution de conflit
    // Ceci est une approche simplifiée - une implémentation complète nécessiterait une logique plus complexe
    const conflictLogs = await prisma.syncLog.findMany({
      where: {
        modelName,
        recordId,
        status: "CONFLICT",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    });

    if (conflictLogs.length === 0) {
      res.status(404).json({ message: "Conflit non trouvé" });
      return;
    }

    // Mettre à jour le statut du log
    await prisma.syncLog.update({
      where: { id: conflictLogs[0].id },
      data: {
        status: "SUCCESS",
        conflictResolution: resolution,
      },
    });

    // Résoudre le conflit selon la stratégie
    let result;
    if (resolution === "MANUAL" && manualData) {
      // Traiter les données manuelles
      // Cette implémentation dépendrait du modèle spécifique
      // et nécessiterait une logique supplémentaire
      result = { status: "SUCCESS", message: "Résolution manuelle appliquée" };
    } else {
      // Appliquer LOCAL_WINS ou CLOUD_WINS
      result = {
        status: "SUCCESS",
        message: `Résolution appliquée: ${resolution}`,
      };
    }

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer l'historique de synchronisation
 */
export const getSyncLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { modelName, status, limit } = req.query;

    // Construire la clause where
    const whereClause: any = {};

    if (modelName) {
      whereClause.modelName = modelName;
    }

    if (status) {
      whereClause.status = status;
    }

    // Récupérer les logs
    const logs = await prisma.syncLog.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      take: limit ? parseInt(limit as string) : 100,
    });

    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};
