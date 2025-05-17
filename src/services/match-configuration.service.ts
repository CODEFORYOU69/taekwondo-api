// src/services/match-configuration.service.ts
import prisma from "../config/database";
import { MatchConfigurationDto } from "../dto/matches";
import { ApiError } from "../interfaces/error.interface";

export class MatchConfigurationService {
  /**
   * Récupérer la configuration d'un match par l'ID du match
   */
  static async getConfigurationByMatchId(matchId: string) {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      const error = new Error("Match non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    const config = await prisma.matchConfiguration.findUnique({
      where: { matchId },
    });

    if (!config) {
      const error = new Error("Configuration de match non trouvée") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    return config;
  }

  /**
   * Créer ou mettre à jour la configuration d'un match
   */
  static async createOrUpdateConfiguration(
    matchId: string,
    data: MatchConfigurationDto
  ) {
    // Vérifier si le match existe
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      const error = new Error("Match non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    // Vérifier si une configuration existe déjà pour ce match
    const existingConfig = await prisma.matchConfiguration.findUnique({
      where: { matchId },
    });

    if (existingConfig) {
      // Mettre à jour la configuration existante
      return prisma.matchConfiguration.update({
        where: { matchId },
        data: {
          rules: data.rules,
          rounds: data.rounds,
          roundTime: data.roundTime,
          restTime: data.restTime,
          injuryTime: data.injuryTime,
          bodyThreshold: data.bodyThreshold,
          headThreshold: data.headThreshold,
          homeVideoReplayQuota: data.homeVideoReplayQuota,
          awayVideoReplayQuota: data.awayVideoReplayQuota,
          goldenPointEnabled: data.goldenPointEnabled,
          goldenPointTime: data.goldenPointTime,
          maxDifference: data.maxDifference,
          maxPenalties: data.maxPenalties,
        },
      });
    } else {
      // Créer une nouvelle configuration
      return prisma.matchConfiguration.create({
        data: {
          matchId,
          rules: data.rules,
          rounds: data.rounds,
          roundTime: data.roundTime,
          restTime: data.restTime,
          injuryTime: data.injuryTime,
          bodyThreshold: data.bodyThreshold,
          headThreshold: data.headThreshold,
          homeVideoReplayQuota: data.homeVideoReplayQuota,
          awayVideoReplayQuota: data.awayVideoReplayQuota,
          goldenPointEnabled: data.goldenPointEnabled,
          goldenPointTime: data.goldenPointTime,
          maxDifference: data.maxDifference,
          maxPenalties: data.maxPenalties,
        },
      });
    }
  }

  /**
   * Supprimer la configuration d'un match
   */
  static async deleteConfiguration(matchId: string) {
    const config = await prisma.matchConfiguration.findUnique({
      where: { matchId },
    });

    if (!config) {
      const error = new Error("Configuration de match non trouvée") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    return prisma.matchConfiguration.delete({
      where: { matchId },
    });
  }

  /**
   * Récupérer les configurations par défaut basées sur les règles et la division
   */
  static getDefaultConfiguration(
    rules: string,
    division?: string
  ): MatchConfigurationDto {
    // Configuration de base
    const baseConfig: MatchConfigurationDto = {
      rules: rules as "CONVENTIONAL" | "BESTOF3",
      rounds: rules === "BESTOF3" ? 3 : 3,
      roundTime: "02:00",
      restTime: "01:00",
      injuryTime: "01:00",
      bodyThreshold: 20,
      headThreshold: 10,
      homeVideoReplayQuota: 1,
      awayVideoReplayQuota: 1,
      goldenPointEnabled: true,
      goldenPointTime: "01:00",
      maxDifference: 20,
      maxPenalties: 10,
    };

    // Ajuster en fonction de la division
    if (division) {
      switch (division) {
        case "SENIORS":
          // Rien à changer, c'est la configuration de base
          break;
        case "JUNIORS":
          baseConfig.roundTime = "01:30";
          break;
        case "CADETS":
          baseConfig.roundTime = "01:30";
          baseConfig.rounds = 3;
          break;
        case "KIDS":
          baseConfig.roundTime = "01:00";
          baseConfig.rounds = 2;
          break;
        case "OLYMPIC":
          // Configuration spécifique pour les Jeux Olympiques
          baseConfig.rounds = 3;
          baseConfig.roundTime = "02:00";
          baseConfig.homeVideoReplayQuota = 2;
          baseConfig.awayVideoReplayQuota = 2;
          break;
      }
    }

    return baseConfig;
  }
}
