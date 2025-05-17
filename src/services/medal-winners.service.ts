// src/services/medal-winners.service.ts
import { MedalType } from "@prisma/client";
import prisma from "../config/database";
import { ApiError } from "../interfaces/error.interface";
import {
  CreateMedalWinnerDto,
  MedalStandingsDto,
  UpdateMedalWinnerDto,
} from "../dto/medal-winners";

export class MedalWinnersService {
  /**
   * Récupérer tous les médaillés
   */
  static async getAllMedalWinners(
    filters: {
      eventId?: string;
      medalType?: MedalType;
    } = {}
  ) {
    const where: any = {};

    if (filters.eventId) {
      where.eventId = filters.eventId;
    }

    if (filters.medalType) {
      where.medalType = filters.medalType;
    }

    return prisma.medalWinner.findMany({
      where,
      include: {
        event: true,
        competitor: {
          include: {
            organization: true,
            participants: {
              take: 1,
            },
          },
        },
      },
      orderBy: [{ eventId: "asc" }, { position: "asc" }],
    });
  }

  /**
   * Récupérer un médaillé par son ID
   */
  static async getMedalWinnerById(id: string) {
    const medalWinner = await prisma.medalWinner.findUnique({
      where: { id },
      include: {
        event: true,
        competitor: {
          include: {
            organization: true,
            participants: true,
          },
        },
      },
    });

    if (!medalWinner) {
      const error = new Error("Médaillé non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    return medalWinner;
  }

  /**
   * Créer un nouveau médaillé
   */
  static async createMedalWinner(data: CreateMedalWinnerDto) {
    // Vérifier si l'événement existe
    const event = await prisma.event.findUnique({
      where: { id: data.eventId },
    });

    if (!event) {
      const error = new Error("Événement non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    // Vérifier si le compétiteur existe
    const competitor = await prisma.competitor.findUnique({
      where: { id: data.competitorId },
    });

    if (!competitor) {
      const error = new Error("Compétiteur non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    // Vérifier si le compétiteur appartient bien à l'événement
    if (competitor.eventId !== data.eventId) {
      const error = new Error(
        "Le compétiteur n'est pas inscrit à cet événement"
      ) as ApiError;
      error.statusCode = 400;
      throw error;
    }

    // Vérifier si le compétiteur est déjà médaillé
    const existingMedal = await prisma.medalWinner.findUnique({
      where: { competitorId: data.competitorId },
    });

    if (existingMedal) {
      const error = new Error("Ce compétiteur est déjà médaillé") as ApiError;
      error.statusCode = 400;
      throw error;
    }

    // Vérifier si une personne a déjà cette position pour cet événement
    const existingPosition = await prisma.medalWinner.findFirst({
      where: {
        eventId: data.eventId,
        position: data.position,
        medalType: data.medalType,
      },
    });

    if (existingPosition) {
      const error = new Error(
        `Un médaillé existe déjà à la position ${data.position} avec le type de médaille ${data.medalType}`
      ) as ApiError;
      error.statusCode = 400;
      throw error;
    }

    return prisma.medalWinner.create({
      data,
      include: {
        event: true,
        competitor: true,
      },
    });
  }

  /**
   * Mettre à jour un médaillé
   */
  static async updateMedalWinner(id: string, data: UpdateMedalWinnerDto) {
    // Vérifier si le médaillé existe
    const medalWinner = await prisma.medalWinner.findUnique({
      where: { id },
    });

    if (!medalWinner) {
      const error = new Error("Médaillé non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    // Vérifier si la position est déjà prise par quelqu'un d'autre
    if (data.position) {
      const existingPosition = await prisma.medalWinner.findFirst({
        where: {
          eventId: medalWinner.eventId,
          position: data.position,
          medalType: data.medalType || medalWinner.medalType,
          id: { not: id },
        },
      });

      if (existingPosition) {
        const error = new Error(
          `Un médaillé existe déjà à la position ${data.position}`
        ) as ApiError;
        error.statusCode = 400;
        throw error;
      }
    }

    return prisma.medalWinner.update({
      where: { id },
      data,
      include: {
        event: true,
        competitor: true,
      },
    });
  }

  /**
   * Supprimer un médaillé
   */
  static async deleteMedalWinner(id: string) {
    // Vérifier si le médaillé existe
    const medalWinner = await prisma.medalWinner.findUnique({
      where: { id },
    });

    if (!medalWinner) {
      const error = new Error("Médaillé non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    return prisma.medalWinner.delete({
      where: { id },
    });
  }

  /**
   * Récupérer le classement des médailles par compétition
   */
  static async getMedalStandingsByCompetition(
    competitionId: string
  ): Promise<MedalStandingsDto[]> {
    // Vérifier si la compétition existe
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
    });

    if (!competition) {
      const error = new Error("Compétition non trouvée") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    // Récupérer tous les événements de cette compétition
    const events = await prisma.event.findMany({
      where: { competitionId },
      select: { id: true },
    });

    const eventIds = events.map((e) => e.id);

    // Récupérer tous les médaillés pour ces événements
    const medals = await prisma.medalWinner.findMany({
      where: { eventId: { in: eventIds } },
      include: {
        competitor: {
          include: {
            organization: true,
          },
        },
      },
    });

    // Regrouper les médailles par pays
    const countryMedals: Record<
      string,
      { gold: number; silver: number; bronze: number }
    > = {};

    medals.forEach((medal) => {
      const country = medal.competitor.country;

      if (!countryMedals[country]) {
        countryMedals[country] = { gold: 0, silver: 0, bronze: 0 };
      }

      if (medal.medalType === "GOLD") {
        countryMedals[country].gold++;
      } else if (medal.medalType === "SILVER") {
        countryMedals[country].silver++;
      } else if (medal.medalType === "BRONZE") {
        countryMedals[country].bronze++;
      }
    });

    // Convertir en tableau et calculer le total
    const standings: MedalStandingsDto[] = Object.entries(countryMedals).map(
      ([country, medals]) => ({
        country,
        gold: medals.gold,
        silver: medals.silver,
        bronze: medals.bronze,
        total: medals.gold + medals.silver + medals.bronze,
      })
    );

    // Trier par nombre de médailles d'or, puis d'argent, puis de bronze
    standings.sort((a, b) => {
      if (a.gold !== b.gold) return b.gold - a.gold;
      if (a.silver !== b.silver) return b.silver - a.silver;
      if (a.bronze !== b.bronze) return b.bronze - a.bronze;
      return 0;
    });

    return standings;
  }
}
