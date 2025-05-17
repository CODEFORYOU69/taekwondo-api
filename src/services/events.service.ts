// src/services/events.service.ts
import prisma from "../config/database";
import {
  CreateEventDto,
  UpdateEventDto,
  EventPoolConfigDto,
} from "../dto/events";
import { ApiError } from "../interfaces/error.interface";

export class EventsService {
  /**
   * Récupérer tous les événements
   */
  static async getAllEvents(filters: any = {}) {
    const where: any = {};

    if (filters.competitionId) {
      where.competitionId = filters.competitionId;
    }

    if (filters.discipline) {
      where.discipline = filters.discipline;
    }

    if (filters.gender) {
      where.gender = filters.gender;
    }

    if (filters.division) {
      where.division = filters.division;
    }

    return prisma.event.findMany({
      where,
      include: {
        competition: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
          },
        },
        competitors: {
          select: {
            id: true,
            _count: true,
          },
        },
        _count: {
          select: {
            matches: true,
            competitors: true,
            medalWinners: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  /**
   * Récupérer un événement par son ID
   */
  static async getEventById(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        competition: true,
        poolConfig: true,
        _count: {
          select: {
            matches: true,
            competitors: true,
            medalWinners: true,
            pools: true,
          },
        },
      },
    });

    if (!event) {
      const error = new Error("Événement non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    return event;
  }

  /**
   * Créer un nouvel événement
   */
  static async createEvent(data: CreateEventDto) {
    // Vérifier si la compétition existe
    const competition = await prisma.competition.findUnique({
      where: { id: data.competitionId },
    });

    if (!competition) {
      const error = new Error("Compétition non trouvée") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    // Vérifier si un événement similaire existe déjà pour cette compétition
    const existingEvent = await prisma.event.findFirst({
      where: {
        competitionId: data.competitionId,
        discipline: data.discipline,
        gender: data.gender,
        name: data.name,
      },
    });

    if (existingEvent) {
      const error = new Error(
        "Un événement similaire existe déjà pour cette compétition"
      ) as ApiError;
      error.statusCode = 400;
      throw error;
    }

    return prisma.event.create({
      data: {
        discipline: data.discipline,
        division: data.division,
        gender: data.gender,
        name: data.name,
        abbreviation: data.abbreviation,
        weightCategory: data.weightCategory,
        sportClass: data.sportClass,
        category: data.category,
        role: data.role,
        competitionType: data.competitionType,
        competition: {
          connect: { id: data.competitionId },
        },
      },
    });
  }

  /**
   * Mettre à jour un événement
   */
  static async updateEvent(id: string, data: UpdateEventDto) {
    // Vérifier si l'événement existe
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        matches: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!event) {
      const error = new Error("Événement non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    // Si des matchs sont déjà créés, vérifier s'il est possible de modifier certains champs
    if (event.matches.length > 0 && (data.competitionType || data.name)) {
      const error = new Error(
        "Impossible de modifier le type de compétition ou le nom car des matchs existent déjà"
      ) as ApiError;
      error.statusCode = 400;
      throw error;
    }

    return prisma.event.update({
      where: { id },
      data: {
        name: data.name,
        abbreviation: data.abbreviation,
        weightCategory: data.weightCategory,
        sportClass: data.sportClass,
        category: data.category,
        competitionType: data.competitionType,
      },
    });
  }

  /**
   * Supprimer un événement
   */
  static async deleteEvent(id: string) {
    // Vérifier si l'événement existe
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        matches: {
          select: {
            id: true,
          },
        },
        competitors: {
          select: {
            id: true,
          },
        },
        medalWinners: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!event) {
      const error = new Error("Événement non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    // Vérifier s'il y a des dépendances
    if (
      event.matches.length > 0 ||
      event.competitors.length > 0 ||
      event.medalWinners.length > 0
    ) {
      const error = new Error(
        "Impossible de supprimer cet événement car il a des matchs, compétiteurs ou médaillés associés"
      ) as ApiError;
      error.statusCode = 400;
      throw error;
    }

    return prisma.event.delete({
      where: { id },
    });
  }

  /**
   * Récupérer les compétiteurs d'un événement
   */
  static async getEventCompetitors(id: string) {
    // Vérifier si l'événement existe
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      const error = new Error("Événement non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    return prisma.competitor.findMany({
      where: { eventId: id },
      include: {
        organization: true,
        participants: {
          include: {
            organization: true,
          },
        },
      },
      orderBy: [{ seed: "asc" }, { rank: "asc" }, { printName: "asc" }],
    });
  }

  /**
   * Récupérer les matchs d'un événement
   */
  static async getEventMatches(id: string) {
    // Vérifier si l'événement existe
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      const error = new Error("Événement non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    return prisma.match.findMany({
      where: { eventId: id },
      include: {
        homeCompetitor: {
          include: {
            organization: true,
          },
        },
        awayCompetitor: {
          include: {
            organization: true,
          },
        },
        session: true,
      },
      orderBy: [
        {
          scheduledStart: "asc",
        },
      ],
    });
  }

  /**
   * Récupérer les médaillés d'un événement
   */
  static async getEventMedalWinners(id: string) {
    // Vérifier si l'événement existe
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      const error = new Error("Événement non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    return prisma.medalWinner.findMany({
      where: { eventId: id },
      include: {
        competitor: {
          include: {
            organization: true,
            participants: true,
          },
        },
      },
      orderBy: {
        position: "asc",
      },
    });
  }

  /**
   * Configurer les paramètres de poule pour un événement
   */
  static async configureEventPools(id: string, data: EventPoolConfigDto) {
    // Vérifier si l'événement existe
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        poolConfig: true,
        matches: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!event) {
      const error = new Error("Événement non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    // Vérifier que l'événement est de type POOL ou POOL_ELIMINATION
    if (
      event.competitionType !== "POOL" &&
      event.competitionType !== "POOL_ELIMINATION"
    ) {
      const error = new Error(
        "Cet événement n'est pas configuré pour utiliser des poules"
      ) as ApiError;
      error.statusCode = 400;
      throw error;
    }

    // Si des matchs existent déjà, on ne peut pas modifier la configuration
    if (event.matches.length > 0) {
      const error = new Error(
        "Impossible de modifier la configuration des poules car des matchs existent déjà"
      ) as ApiError;
      error.statusCode = 400;
      throw error;
    }

    // Mettre à jour ou créer la configuration
    if (event.poolConfig) {
      return prisma.eventPoolConfig.update({
        where: { id: event.poolConfig.id },
        data: {
          usePoolSystem: data.usePoolSystem,
          minAthletesPerPool: data.minAthletesPerPool,
          maxAthletesPerPool: data.maxAthletesPerPool,
          poolDistribution: data.poolDistribution,
          qualifyingPlaces: data.qualifyingPlaces,
          tieBreakCriteria: data.tieBreakCriteria,
        },
      });
    } else {
      return prisma.eventPoolConfig.create({
        data: {
          usePoolSystem: data.usePoolSystem,
          minAthletesPerPool: data.minAthletesPerPool,
          maxAthletesPerPool: data.maxAthletesPerPool,
          poolDistribution: data.poolDistribution,
          qualifyingPlaces: data.qualifyingPlaces,
          tieBreakCriteria: data.tieBreakCriteria,
          event: {
            connect: { id },
          },
        },
      });
    }
  }
}
