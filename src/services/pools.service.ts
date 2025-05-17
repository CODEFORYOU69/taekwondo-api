// src/services/pools.service.ts
import prisma from "../config/database";
import {
  AddCompetitorToPoolDto,
  CreatePoolDto,
  GeneratePoolMatchesDto,
  UpdatePoolDto,
} from "../dto/pools";
import { ApiError } from "../interfaces/error.interface";

export class PoolsService {
  /**
   * Récupérer toutes les poules
   */
  static async getAllPools(filters: any = {}) {
    const { eventId } = filters;

    const whereClause: any = {};

    if (eventId) {
      whereClause.eventId = eventId;
    }

    return prisma.pool.findMany({
      where: whereClause,
      orderBy: {
        name: "asc",
      },
    });
  }

  /**
   * Récupérer une poule par son ID
   */
  static async getPoolById(id: string) {
    const pool = await prisma.pool.findUnique({
      where: { id },
      include: {
        event: true,
      },
    });

    if (!pool) {
      const error = new Error("Poule non trouvée") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    return pool;
  }

  /**
   * Créer une nouvelle poule
   */
  static async createPool(data: CreatePoolDto) {
    // Vérifier que l'événement existe
    const event = await prisma.event.findUnique({
      where: { id: data.eventId },
    });

    if (!event) {
      const error = new Error("Événement non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    return prisma.pool.create({
      data,
    });
  }

  /**
   * Mettre à jour une poule
   */
  static async updatePool(id: string, data: UpdatePoolDto) {
    // Vérifier que la poule existe
    await this.getPoolById(id);

    return prisma.pool.update({
      where: { id },
      data,
    });
  }

  /**
   * Supprimer une poule
   */
  static async deletePool(id: string) {
    // Vérifier que la poule existe
    await this.getPoolById(id);

    // Vérifier si des matchs ont déjà été joués
    const matchesCount = await prisma.poolMatch.count({
      where: {
        poolId: id,
        match: {
          scheduleStatus: "FINISHED",
        },
      },
    });

    if (matchesCount > 0) {
      const error = new Error(
        "Impossible de supprimer une poule avec des matchs terminés"
      ) as ApiError;
      error.statusCode = 400;
      throw error;
    }

    // Supprimer en cascade les relations
    await prisma.$transaction([
      // Supprimer les classements
      prisma.poolStanding.deleteMany({
        where: { poolId: id },
      }),

      // Supprimer les matchs
      prisma.poolMatch.deleteMany({
        where: { poolId: id },
      }),

      // Supprimer les compétiteurs de la poule
      prisma.poolCompetitor.deleteMany({
        where: { poolId: id },
      }),

      // Supprimer la poule
      prisma.pool.delete({
        where: { id },
      }),
    ]);

    return { success: true };
  }

  /**
   * Récupérer les compétiteurs d'une poule
   */
  static async getPoolCompetitors(id: string) {
    // Vérifier que la poule existe
    await this.getPoolById(id);

    const poolCompetitors = await prisma.poolCompetitor.findMany({
      where: { poolId: id },
      include: {
        competitor: {
          include: {
            participants: true,
            organization: true,
          },
        },
      },
    });

    return poolCompetitors.map((pc) => pc.competitor);
  }

  /**
   * Ajouter un compétiteur à une poule
   */
  static async addCompetitorToPool(id: string, data: AddCompetitorToPoolDto) {
    // Vérifier que la poule existe
    const pool = await this.getPoolById(id);

    // Vérifier que le compétiteur existe
    const competitor = await prisma.competitor.findUnique({
      where: { id: data.competitorId },
    });

    if (!competitor) {
      const error = new Error("Compétiteur non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    // Vérifier que le compétiteur appartient au même événement que la poule
    if (competitor.eventId !== pool.eventId) {
      const error = new Error(
        "Le compétiteur n'appartient pas au même événement que la poule"
      ) as ApiError;
      error.statusCode = 400;
      throw error;
    }

    // Vérifier si le compétiteur est déjà dans la poule
    const existingCompetitor = await prisma.poolCompetitor.findFirst({
      where: {
        poolId: id,
        competitorId: data.competitorId,
      },
    });

    if (existingCompetitor) {
      const error = new Error(
        "Le compétiteur est déjà dans cette poule"
      ) as ApiError;
      error.statusCode = 400;
      throw error;
    }

    // Vérifier que la poule n'est pas déjà pleine
    const currentCompetitorsCount = await prisma.poolCompetitor.count({
      where: { poolId: id },
    });

    if (currentCompetitorsCount >= pool.maxAthletes) {
      const error = new Error("La poule est déjà complète") as ApiError;
      error.statusCode = 400;
      throw error;
    }

    // Ajouter le compétiteur à la poule
    const poolCompetitor = await prisma.poolCompetitor.create({
      data: {
        poolId: id,
        competitorId: data.competitorId,
      },
    });

    // Créer un enregistrement pour le classement
    await prisma.poolStanding.create({
      data: {
        poolId: id,
        competitorId: data.competitorId,
        matchesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        pointsDifference: 0,
        totalPoints: 0,
      },
    });

    return poolCompetitor;
  }

  /**
   * Retirer un compétiteur d'une poule
   */
  static async removeCompetitorFromPool(id: string, competitorId: string) {
    // Vérifier que la poule existe
    await this.getPoolById(id);

    // Vérifier si le compétiteur est dans la poule
    const poolCompetitor = await prisma.poolCompetitor.findFirst({
      where: {
        poolId: id,
        competitorId,
      },
    });

    if (!poolCompetitor) {
      const error = new Error(
        "Le compétiteur n'est pas dans cette poule"
      ) as ApiError;
      error.statusCode = 404;
      throw error;
    }

    // Vérifier si des matchs ont déjà été joués par ce compétiteur
    const matchesExist = await prisma.poolMatch.findFirst({
      where: {
        poolId: id,
        match: {
          OR: [
            { homeCompetitorId: competitorId },
            { awayCompetitorId: competitorId },
          ],
          scheduleStatus: {
            in: ["RUNNING", "FINISHED"],
          },
        },
      },
    });

    if (matchesExist) {
      const error = new Error(
        "Impossible de retirer un compétiteur qui a déjà des matchs joués"
      ) as ApiError;
      error.statusCode = 400;
      throw error;
    }

    // Supprimer les matchs planifiés pour ce compétiteur
    const poolMatches = await prisma.poolMatch.findMany({
      where: {
        poolId: id,
        match: {
          OR: [
            { homeCompetitorId: competitorId },
            { awayCompetitorId: competitorId },
          ],
          scheduleStatus: "SCHEDULED",
        },
      },
      include: {
        match: true,
      },
    });

    await prisma.$transaction([
      // Supprimer les matchs
      ...poolMatches.map((pm) =>
        prisma.match.delete({ where: { id: pm.matchId } })
      ),

      // Supprimer les entrées de poolMatch
      ...poolMatches.map((pm) =>
        prisma.poolMatch.delete({ where: { id: pm.id } })
      ),

      // Supprimer le classement
      prisma.poolStanding.deleteMany({
        where: {
          poolId: id,
          competitorId,
        },
      }),

      // Supprimer le compétiteur de la poule
      prisma.poolCompetitor.deleteMany({
        where: {
          poolId: id,
          competitorId,
        },
      }),
    ]);

    return { success: true };
  }

  /**
   * Récupérer les matchs d'une poule
   */
  static async getPoolMatches(id: string) {
    // Vérifier que la poule existe
    await this.getPoolById(id);

    const poolMatches = await prisma.poolMatch.findMany({
      where: { poolId: id },
      include: {
        match: {
          include: {
            homeCompetitor: true,
            awayCompetitor: true,
            event: true,
            session: true,
          },
        },
      },
      orderBy: {
        matchOrder: "asc",
      },
    });

    return poolMatches.map((pm) => pm.match);
  }

  /**
   * Générer automatiquement les matchs d'une poule
   */
  static async generatePoolMatches(id: string, data: GeneratePoolMatchesDto) {
    // Vérifier que la poule existe
    const pool = await this.getPoolById(id);

    // Vérifier que la session existe
    const session = await prisma.session.findUnique({
      where: { id: data.sessionId },
    });

    if (!session) {
      const error = new Error("Session non trouvée") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    // Récupérer les compétiteurs de la poule
    const competitors = await this.getPoolCompetitors(id);

    if (competitors.length < 2) {
      const error = new Error(
        "Il faut au moins 2 compétiteurs pour générer des matchs"
      ) as ApiError;
      error.statusCode = 400;
      throw error;
    }

    // Vérifier s'il existe déjà des matchs pour cette poule
    const existingMatches = await prisma.poolMatch.count({
      where: { poolId: id },
    });

    if (existingMatches > 0) {
      const error = new Error(
        "Des matchs existent déjà pour cette poule"
      ) as ApiError;
      error.statusCode = 400;
      throw error;
    }

    // Générer toutes les combinaisons possibles de matchs
    const matches = [];
    for (let i = 0; i < competitors.length; i++) {
      for (let j = i + 1; j < competitors.length; j++) {
        matches.push({
          home: competitors[i],
          away: competitors[j],
        });
      }
    }

    // Limiter le nombre de matchs par athlète si spécifié
    let finalMatches = matches;
    if (pool.matchesPerAthlete) {
      // Logique de limitation - ceci est une version simplifiée
      // Une implémentation plus complexe devrait assurer que chaque athlète a exactement
      // le nombre de matchs spécifiés, et que les matchs sont répartis équitablement
      finalMatches = [];
      const matchesByCompetitor = new Map<string, number>();

      // Initialiser le compteur pour chaque compétiteur
      competitors.forEach((c) => matchesByCompetitor.set(c.id, 0));

      for (const match of matches) {
        const homeMatches = matchesByCompetitor.get(match.home.id) || 0;
        const awayMatches = matchesByCompetitor.get(match.away.id) || 0;

        if (
          homeMatches < pool.matchesPerAthlete &&
          awayMatches < pool.matchesPerAthlete
        ) {
          finalMatches.push(match);
          matchesByCompetitor.set(match.home.id, homeMatches + 1);
          matchesByCompetitor.set(match.away.id, awayMatches + 1);
        }
      }
    }

    // Créer les matchs en base de données
    const createdMatches = [];
    let matchNumber = 1;

    for (const match of finalMatches) {
      // Créer le match
      const newMatch = await prisma.match.create({
        data: {
          eventId: pool.eventId,
          sessionId: data.sessionId,
          mat: data.mat,
          number: `P${id.slice(-4)}-${matchNumber.toString().padStart(2, "0")}`,
          phase: "R16", // Phase générique pour les matchs de poule
          positionReference: `P${id.slice(-4)}-${matchNumber}`,
          scheduleStatus: "SCHEDULED",
          resultStatus: "UNCONFIRMED",
          homeCompetitorId: match.home.id,
          awayCompetitorId: match.away.id,
        },
      });

      // Associer le match à la poule
      const poolMatch = await prisma.poolMatch.create({
        data: {
          poolId: id,
          matchId: newMatch.id,
          matchOrder: matchNumber,
        },
        include: {
          match: {
            include: {
              homeCompetitor: true,
              awayCompetitor: true,
            },
          },
        },
      });

      createdMatches.push(poolMatch);
      matchNumber++;
    }

    return {
      success: true,
      count: createdMatches.length,
      matches: createdMatches.map((pm) => pm.match),
    };
  }

  /**
   * Récupérer le classement d'une poule
   */
  static async getPoolStandings(id: string) {
    // Vérifier que la poule existe
    await this.getPoolById(id);

    const standings = await prisma.poolStanding.findMany({
      where: { poolId: id },
      include: {
        competitor: {
          include: {
            participants: true,
            organization: true,
          },
        },
      },
      orderBy: [
        { rank: "asc" },
        { totalPoints: "desc" },
        { pointsDifference: "desc" },
      ],
    });

    return standings;
  }

  /**
   * Mettre à jour le classement d'une poule
   */
  static async updatePoolStandings(id: string) {
    // Vérifier que la poule existe
    const pool = await this.getPoolById(id);

    // Récupérer tous les matchs de la poule qui sont terminés
    const poolMatches = await prisma.poolMatch.findMany({
      where: {
        poolId: id,
        match: {
          scheduleStatus: "FINISHED",
        },
      },
      include: {
        match: {
          include: {
            results: {
              where: {
                status: "OFFICIAL",
              },
              orderBy: {
                timestamp: "desc",
              },
              take: 1,
            },
          },
        },
      },
    });

    // Initialiser les statistiques pour chaque compétiteur
    const stats = new Map();

    // Récupérer tous les compétiteurs de la poule
    const competitors = await this.getPoolCompetitors(id);

    for (const competitor of competitors) {
      stats.set(competitor.id, {
        competitorId: competitor.id,
        matchesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        pointsDifference: 0,
        totalPoints: 0,
        headToHead: new Map(), // Pour départager les égalités
      });
    }

    // Calculer les statistiques à partir des matchs terminés
    for (const poolMatch of poolMatches) {
      if (poolMatch.match.results.length === 0) continue;

      const result = poolMatch.match.results[0];
      const homeCompetitorId = poolMatch.match.homeCompetitorId;
      const awayCompetitorId = poolMatch.match.awayCompetitorId;

      const homeStats = stats.get(homeCompetitorId);
      const awayStats = stats.get(awayCompetitorId);

      if (!homeStats || !awayStats) continue;

      // Mettre à jour les matchs joués
      homeStats.matchesPlayed++;
      awayStats.matchesPlayed++;

      // Mettre à jour les points pour/contre
      homeStats.pointsFor += result.homeScore;
      homeStats.pointsAgainst += result.awayScore;
      awayStats.pointsFor += result.awayScore;
      awayStats.pointsAgainst += result.homeScore;

      // Mettre à jour les victoires/défaites/nuls
      if (result.homeScore > result.awayScore) {
        // Victoire de l'équipe à domicile
        homeStats.wins++;
        awayStats.losses++;
        homeStats.totalPoints += pool.pointsForWin;
        awayStats.totalPoints += pool.pointsForLoss;

        // Head-to-head
        if (!homeStats.headToHead.has(awayCompetitorId)) {
          homeStats.headToHead.set(awayCompetitorId, 0);
        }
        homeStats.headToHead.set(
          awayCompetitorId,
          homeStats.headToHead.get(awayCompetitorId) + 1
        );
      } else if (result.homeScore < result.awayScore) {
        // Victoire de l'équipe à l'extérieur
        homeStats.losses++;
        awayStats.wins++;
        homeStats.totalPoints += pool.pointsForLoss;
        awayStats.totalPoints += pool.pointsForWin;

        // Head-to-head
        if (!awayStats.headToHead.has(homeCompetitorId)) {
          awayStats.headToHead.set(homeCompetitorId, 0);
        }
        awayStats.headToHead.set(
          homeCompetitorId,
          awayStats.headToHead.get(homeCompetitorId) + 1
        );
      } else {
        // Match nul
        homeStats.draws++;
        awayStats.draws++;
        homeStats.totalPoints += pool.pointsForDraw;
        awayStats.totalPoints += pool.pointsForDraw;
      }
    }

    // Calculer la différence de points
    for (const [, competitorStats] of stats) {
      competitorStats.pointsDifference =
        competitorStats.pointsFor - competitorStats.pointsAgainst;
    }

    // Trier les compétiteurs par points, puis différence de points
    const sortedCompetitors = Array.from(stats.values()).sort((a, b) => {
      if (a.totalPoints !== b.totalPoints) {
        return b.totalPoints - a.totalPoints; // Plus grand nombre de points d'abord
      }
      if (a.pointsDifference !== b.pointsDifference) {
        return b.pointsDifference - a.pointsDifference; // Meilleure différence de points ensuite
      }
      if (a.pointsFor !== b.pointsFor) {
        return b.pointsFor - a.pointsFor; // Plus grand nombre de points marqués ensuite
      }
      // Autres critères possibles: victoires directes, etc.
      return 0;
    });

    // Attribuer les rangs et marquer les qualifiés
    for (let i = 0; i < sortedCompetitors.length; i++) {
      sortedCompetitors[i].rank = i + 1;
      sortedCompetitors[i].qualified = i < pool.qualifyingPlaces;
    }

    // Mettre à jour les classements en base de données
    const updatedStandings = [];

    for (const competitorStats of sortedCompetitors) {
      const {
        competitorId,
        matchesPlayed,
        wins,
        draws,
        losses,
        pointsFor,
        pointsAgainst,
        pointsDifference,
        totalPoints,
        rank,
        qualified,
      } = competitorStats;

      const updatedStanding = await prisma.poolStanding.update({
        where: {
          poolId_competitorId: {
            poolId: id,
            competitorId,
          },
        },
        data: {
          matchesPlayed,
          wins,
          draws,
          losses,
          pointsFor,
          pointsAgainst,
          pointsDifference,
          totalPoints,
          rank,
          qualified,
        },
        include: {
          competitor: true,
        },
      });

      updatedStandings.push(updatedStanding);
    }

    return updatedStandings;
  }
}
