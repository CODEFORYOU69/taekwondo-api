// src/services/competitors.service.ts
import prisma from "../config/database";
import { UpdateCompetitorDto } from "../dto/competitors";
import { ApiError } from "../interfaces/error.interface";

export class CompetitorsService {
  /**
   * Récupérer tous les compétiteurs avec filtres optionnels
   */
  static async getAllCompetitors(filters: {
    eventId?: string;
    organizationId?: string;
    country?: string;
  }) {
    const { eventId, organizationId, country } = filters;

    const whereClause: any = {};

    if (eventId) {
      whereClause.eventId = eventId;
    }

    if (organizationId) {
      whereClause.organizationId = organizationId;
    }

    if (country) {
      whereClause.country = country;
    }

    return prisma.competitor.findMany({
      where: whereClause,
      include: {
        event: true,
        organization: true,
      },
      orderBy: {
        seed: "asc",
      },
    });
  }

  /**
   * Récupérer un compétiteur par son ID
   */
  static async getCompetitorById(id: string) {
    const competitor = await prisma.competitor.findUnique({
      where: { id },
      include: {
        event: true,
        organization: true,
        participants: true,
      },
    });

    if (!competitor) {
      const error = new Error("Compétiteur non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    return competitor;
  }

  /**
   * Mettre à jour un compétiteur
   */
  static async updateCompetitor(id: string, data: UpdateCompetitorDto) {
    try {
      // Vérifier si le compétiteur existe
      const exists = await prisma.competitor.findUnique({
        where: { id },
      });

      if (!exists) {
        const error = new Error("Compétiteur non trouvé") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      return await prisma.competitor.update({
        where: { id },
        data,
        include: {
          event: true,
          organization: true,
        },
      });
    } catch (error) {
      if ((error as ApiError).statusCode) {
        throw error;
      }

      const apiError = new Error(
        "Erreur lors de la mise à jour du compétiteur"
      ) as ApiError;
      apiError.statusCode = 400;
      throw apiError;
    }
  }

  /**
   * Supprimer un compétiteur
   */
  static async deleteCompetitor(id: string) {
    try {
      // Vérifier si le compétiteur existe
      const competitor = await prisma.competitor.findUnique({
        where: { id },
        include: {
          matchesHome: true,
          matchesAway: true,
        },
      });

      if (!competitor) {
        const error = new Error("Compétiteur non trouvé") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Vérifier si le compétiteur est utilisé dans des matchs
      if (
        competitor.matchesHome.length > 0 ||
        competitor.matchesAway.length > 0
      ) {
        const error = new Error(
          "Impossible de supprimer un compétiteur utilisé dans des matchs"
        ) as ApiError;
        error.statusCode = 400;
        throw error;
      }

      return await prisma.competitor.delete({
        where: { id },
      });
    } catch (error) {
      if ((error as ApiError).statusCode) {
        throw error;
      }

      const apiError = new Error(
        "Erreur lors de la suppression du compétiteur"
      ) as ApiError;
      apiError.statusCode = 400;
      throw apiError;
    }
  }

  /**
   * Récupérer les matchs d'un compétiteur
   */
  static async getCompetitorMatches(id: string) {
    const competitor = await prisma.competitor.findUnique({
      where: { id },
    });

    if (!competitor) {
      const error = new Error("Compétiteur non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    return prisma.match.findMany({
      where: {
        OR: [{ homeCompetitorId: id }, { awayCompetitorId: id }],
      },
      include: {
        event: true,
        session: true,
        homeCompetitor: true,
        awayCompetitor: true,
      },
      orderBy: {
        scheduledStart: "asc",
      },
    });
  }

  /**
   * Récupérer les participants d'un compétiteur (pour les équipes)
   */
  static async getCompetitorParticipants(id: string) {
    const competitor = await prisma.competitor.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!competitor) {
      const error = new Error("Compétiteur non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    return competitor.participants;
  }
}
