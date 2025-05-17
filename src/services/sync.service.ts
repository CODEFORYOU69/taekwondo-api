// src/services/sync.service.ts
import prisma from "../config/database";
import { ApiError } from "../interfaces/error.interface";

export class SyncService {
  /**
   * Obtenir les modifications à synchroniser depuis une date donnée
   */
  static async getChangesSince(modelName: string, since: Date) {
    try {
      // Vérifier si le modèle est valide
      if (!this.isValidModel(modelName)) {
        const error = new Error(
          `Modèle ${modelName} non valide pour la synchronisation`
        ) as ApiError;
        error.statusCode = 400;
        throw error;
      }

      // Récupérer le modèle Prisma correspondant
      const model = (prisma as any)[modelName.toLowerCase()];

      // Récupérer les modifications depuis la date donnée
      const changes = await model.findMany({
        where: {
          updatedAt: {
            gt: since,
          },
        },
      });

      return changes;
    } catch (error) {
      if ((error as ApiError).statusCode) {
        throw error;
      }

      const apiError = new Error(
        "Erreur lors de la récupération des modifications"
      ) as ApiError;
      apiError.statusCode = 400;
      throw apiError;
    }
  }

  /**
   * Appliquer les modifications reçues
   */
  static async applyChanges(modelName: string, changes: any[]) {
    try {
      // Vérifier si le modèle est valide
      if (!this.isValidModel(modelName)) {
        const error = new Error(
          `Modèle ${modelName} non valide pour la synchronisation`
        ) as ApiError;
        error.statusCode = 400;
        throw error;
      }

      // Récupérer le modèle Prisma correspondant
      const model = (prisma as any)[modelName.toLowerCase()];

      // Résultats de l'application des modifications
      const results = [];

      // Appliquer les modifications
      for (const change of changes) {
        try {
          // Créer un log de synchronisation
          const log = await prisma.syncLog.create({
            data: {
              modelName,
              recordId: change.id || "UNKNOWN",
              direction: "CLOUD_TO_LOCAL",
              status: "PROCESSING",
            },
          });

          // Vérifier si l'enregistrement existe déjà
          const existingRecord = await model.findUnique({
            where: { id: change.id },
          });

          let result;
          if (existingRecord) {
            // Mettre à jour l'enregistrement
            result = await model.update({
              where: { id: change.id },
              data: change,
            });
          } else {
            // Créer l'enregistrement
            result = await model.create({
              data: change,
            });
          }

          // Mettre à jour le log de synchronisation
          await prisma.syncLog.update({
            where: { id: log.id },
            data: {
              status: "SUCCESS",
            },
          });

          results.push({
            id: change.id,
            status: "SUCCESS",
          });
        } catch (error) {
          // Enregistrer l'erreur dans les logs
          await prisma.syncLog.create({
            data: {
              modelName,
              recordId: change.id || "UNKNOWN",
              direction: "CLOUD_TO_LOCAL",
              status: "ERROR",
              errorMessage:
                error instanceof Error ? error.message : "Erreur inconnue",
            },
          });

          results.push({
            id: change.id,
            status: "ERROR",
            message: error instanceof Error ? error.message : "Erreur inconnue",
          });
        }
      }

      return results;
    } catch (error) {
      if ((error as ApiError).statusCode) {
        throw error;
      }

      const apiError = new Error(
        "Erreur lors de l'application des modifications"
      ) as ApiError;
      apiError.statusCode = 400;
      throw apiError;
    }
  }

  /**
   * Configurer les paramètres de synchronisation
   */
  static async configureSyncSettings(
    modelName: string,
    enabled: boolean,
    direction: string,
    conflictStrategy: string,
    syncInterval: number
  ) {
    try {
      // Vérifier si le modèle est valide
      if (!this.isValidModel(modelName)) {
        const error = new Error(
          `Modèle ${modelName} non valide pour la synchronisation`
        ) as ApiError;
        error.statusCode = 400;
        throw error;
      }

      // Vérifier si la direction est valide
      if (
        !["LOCAL_TO_CLOUD", "CLOUD_TO_LOCAL", "BIDIRECTIONAL"].includes(
          direction
        )
      ) {
        const error = new Error(
          "Direction de synchronisation non valide"
        ) as ApiError;
        error.statusCode = 400;
        throw error;
      }

      // Vérifier si la stratégie de conflit est valide
      if (
        !["LOCAL_WINS", "CLOUD_WINS", "NEWEST_WINS", "MANUAL"].includes(
          conflictStrategy
        )
      ) {
        const error = new Error("Stratégie de conflit non valide") as ApiError;
        error.statusCode = 400;
        throw error;
      }

      // Créer ou mettre à jour la configuration
      const config = await prisma.syncConfig.upsert({
        where: { modelName },
        create: {
          modelName,
          enabled,
          direction,
          conflictStrategy,
          syncInterval,
        },
        update: {
          enabled,
          direction,
          conflictStrategy,
          syncInterval,
        },
      });

      return config;
    } catch (error) {
      if ((error as ApiError).statusCode) {
        throw error;
      }

      const apiError = new Error(
        "Erreur lors de la configuration de la synchronisation"
      ) as ApiError;
      apiError.statusCode = 400;
      throw apiError;
    }
  }

  /**
   * Récupérer les configurations de synchronisation
   */
  static async getSyncConfigurations() {
    return prisma.syncConfig.findMany({
      orderBy: {
        modelName: "asc",
      },
    });
  }

  /**
   * Récupérer les logs de synchronisation
   */
  static async getSyncLogs(limit: number = 100) {
    return prisma.syncLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  }

  /**
   * Vérifier si un modèle est valide pour la synchronisation
   */
  private static isValidModel(modelName: string): boolean {
    // Liste des modèles synchronisables
    const syncableModels = [
      "Competition",
      "Event",
      "Session",
      "Participant",
      "Competitor",
      "Match",
      "MatchAction",
      "MatchResult",
      "MatchRefereeAssignment",
      "MatchEquipmentAssignment",
      "WeighIn",
      "MedalWinner",
      "Pool",
      "PoolCompetitor",
      "PoolMatch",
      "PoolStanding",
    ];

    return syncableModels.includes(modelName);
  }
}
