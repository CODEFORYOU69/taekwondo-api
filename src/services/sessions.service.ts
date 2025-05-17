// src/services/sessions.service.ts
import prisma from "../config/database";
import { CreateSessionDto, UpdateSessionDto } from "../dto/sessions";
import { ApiError } from "../interfaces/error.interface";

export class SessionsService {
  /**
   * Récupérer toutes les sessions avec filtres optionnels
   */
  static async getAllSessions(filters: {
    competitionId?: string;
    status?: string;
    startDate?: string;
  }) {
    const { competitionId, status, startDate } = filters;

    const whereClause: any = {};

    if (competitionId) {
      whereClause.competitionId = competitionId;
    }

    if (status) {
      whereClause.scheduleStatus = status;
    }

    if (startDate) {
      // Filtrer par date de début (YYYY-MM-DD)
      const date = new Date(startDate);
      const nextDay = new Date(startDate);
      nextDay.setDate(nextDay.getDate() + 1);

      whereClause.startTime = {
        gte: date,
        lt: nextDay,
      };
    }

    return prisma.session.findMany({
      where: whereClause,
      include: {
        competition: true,
        _count: {
          select: {
            matches: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });
  }

  /**
   * Récupérer une session par son ID
   */
  static async getSessionById(id: string) {
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        competition: true,
        _count: {
          select: {
            matches: true,
          },
        },
      },
    });

    if (!session) {
      const error = new Error("Session non trouvée") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    return session;
  }

  /**
   * Créer une nouvelle session
   */
  static async createSession(data: CreateSessionDto) {
    try {
      // Vérifier si la compétition existe
      const competition = await prisma.competition.findUnique({
        where: { id: data.competitionId },
      });

      if (!competition) {
        const error = new Error("Compétition non trouvée") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Vérifier que l'heure de fin est ultérieure à l'heure de début
      const startTime = new Date(data.startTime);
      const endTime = new Date(data.endTime);

      if (endTime <= startTime) {
        const error = new Error(
          "L'heure de fin doit être ultérieure à l'heure de début"
        ) as ApiError;
        error.statusCode = 400;
        throw error;
      }

      return prisma.session.create({
        data: {
          name: data.name,
          startTime,
          endTime,
          scheduleStatus: data.scheduleStatus,
          competition: {
            connect: { id: data.competitionId },
          },
        },
        include: {
          competition: true,
        },
      });
    } catch (error) {
      if ((error as ApiError).statusCode) {
        throw error;
      }

      const apiError = new Error(
        "Erreur lors de la création de la session"
      ) as ApiError;
      apiError.statusCode = 400;
      throw apiError;
    }
  }

  /**
   * Mettre à jour une session
   */
  static async updateSession(id: string, data: UpdateSessionDto) {
    try {
      // Vérifier si la session existe
      const session = await prisma.session.findUnique({
        where: { id },
      });

      if (!session) {
        const error = new Error("Session non trouvée") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Vérifier que l'heure de fin est ultérieure à l'heure de début si les deux sont fournies
      if (data.startTime && data.endTime) {
        const startTime = new Date(data.startTime);
        const endTime = new Date(data.endTime);

        if (endTime <= startTime) {
          const error = new Error(
            "L'heure de fin doit être ultérieure à l'heure de début"
          ) as ApiError;
          error.statusCode = 400;
          throw error;
        }
      } else if (data.startTime && !data.endTime) {
        // Si seule l'heure de début est fournie, vérifier qu'elle est antérieure à l'heure de fin existante
        const startTime = new Date(data.startTime);
        const existingEndTime = session.endTime;

        if (existingEndTime <= startTime) {
          const error = new Error(
            "L'heure de début doit être antérieure à l'heure de fin existante"
          ) as ApiError;
          error.statusCode = 400;
          throw error;
        }
      } else if (!data.startTime && data.endTime) {
        // Si seule l'heure de fin est fournie, vérifier qu'elle est ultérieure à l'heure de début existante
        const endTime = new Date(data.endTime);
        const existingStartTime = session.startTime;

        if (endTime <= existingStartTime) {
          const error = new Error(
            "L'heure de fin doit être ultérieure à l'heure de début existante"
          ) as ApiError;
          error.statusCode = 400;
          throw error;
        }
      }

      // Mettre à jour la session
      return prisma.session.update({
        where: { id },
        data: {
          name: data.name,
          startTime: data.startTime ? new Date(data.startTime) : undefined,
          endTime: data.endTime ? new Date(data.endTime) : undefined,
          scheduleStatus: data.scheduleStatus,
        },
        include: {
          competition: true,
        },
      });
    } catch (error) {
      if ((error as ApiError).statusCode) {
        throw error;
      }

      const apiError = new Error(
        "Erreur lors de la mise à jour de la session"
      ) as ApiError;
      apiError.statusCode = 400;
      throw apiError;
    }
  }

  /**
   * Supprimer une session
   */
  static async deleteSession(id: string) {
    try {
      // Vérifier si la session existe
      const session = await prisma.session.findUnique({
        where: { id },
        include: {
          matches: true,
        },
      });

      if (!session) {
        const error = new Error("Session non trouvée") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Vérifier si des matchs sont associés à cette session
      if (session.matches.length > 0) {
        const error = new Error(
          "Impossible de supprimer une session avec des matchs associés"
        ) as ApiError;
        error.statusCode = 400;
        throw error;
      }

      return prisma.session.delete({
        where: { id },
      });
    } catch (error) {
      if ((error as ApiError).statusCode) {
        throw error;
      }

      const apiError = new Error(
        "Erreur lors de la suppression de la session"
      ) as ApiError;
      apiError.statusCode = 400;
      throw apiError;
    }
  }

  /**
   * Récupérer les matchs d'une session
   */
  static async getSessionMatches(id: string) {
    const session = await prisma.session.findUnique({
      where: { id },
    });

    if (!session) {
      const error = new Error("Session non trouvée") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    return prisma.match.findMany({
      where: { sessionId: id },
      include: {
        homeCompetitor: true,
        awayCompetitor: true,
        event: true,
      },
      orderBy: [{ scheduledStart: "asc" }, { mat: "asc" }, { number: "asc" }],
    });
  }
}
