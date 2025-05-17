// src/services/matches.service.ts
import {
  ActionType,
  MatchPhase,
  OfficialRole,
  PssDeviceType,
  ResultStatus,
  ScheduleStatus,
} from "@prisma/client";
import prisma from "../config/database";
import {
  CreateMatchDto,
  GenerateMatchesDto,
  MatchActionDto,
  MatchEquipmentAssignmentDto,
  MatchRefereeAssignmentDto,
  MatchResultDto,
  UpdateMatchDto,
} from "../dto/matches";
import { ApiError } from "../interfaces/error.interface";

export class MatchesService {
  /**
   * Récupérer tous les matchs avec possibilité de filtrage
   */
  static async getAllMatches(
    filters: {
      eventId?: string;
      mat?: number;
      status?: string;
      phase?: MatchPhase;
      competitorId?: string;
    } = {}
  ) {
    const where: any = {};

    if (filters.eventId) {
      where.eventId = filters.eventId;
    }

    if (filters.mat) {
      where.mat = filters.mat;
    }

    if (filters.phase) {
      where.phase = filters.phase;
    }

    // Filtre spécial pour le statut qui combine scheduleStatus et resultStatus
    if (filters.status === "available") {
      where.scheduleStatus = { in: ["SCHEDULED", "DELAYED", "RESCHEDULED"] };
    } else if (filters.status === "finished") {
      where.scheduleStatus = "FINISHED";
    } else if (filters.status) {
      where.scheduleStatus = filters.status;
    }

    // Filtre pour trouver les matchs d'un compétiteur spécifique
    if (filters.competitorId) {
      where.OR = [
        { homeCompetitorId: filters.competitorId },
        { awayCompetitorId: filters.competitorId },
      ];
    }

    return prisma.match.findMany({
      where,
      include: {
        event: true,
        session: true,
        homeCompetitor: {
          include: {
            participants: true,
            organization: true,
          },
        },
        awayCompetitor: {
          include: {
            participants: true,
            organization: true,
          },
        },
        matchConfiguration: true,
        refereeAssignments: {
          include: {
            refJ1: true,
            refJ2: true,
            refJ3: true,
            refCR: true,
            refRJ: true,
            refTA: true,
          },
        },
        results: {
          orderBy: {
            position: "desc",
          },
          take: 1,
        },
      },
      orderBy: [{ mat: "asc" }, { scheduledStart: "asc" }],
    });
  }

  /**
   * Récupérer un match par son ID
   */
  static async getMatchById(id: string) {
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        event: true,
        session: true,
        homeCompetitor: {
          include: {
            participants: true,
            organization: true,
          },
        },
        awayCompetitor: {
          include: {
            participants: true,
            organization: true,
          },
        },
        matchConfiguration: true,
        refereeAssignments: {
          include: {
            refJ1: true,
            refJ2: true,
            refJ3: true,
            refCR: true,
            refRJ: true,
            refTA: true,
          },
        },
        results: {
          orderBy: {
            position: "desc",
          },
        },
        actions: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!match) {
      const error = new Error("Match non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    return match;
  }

  /**
   * Créer un nouveau match
   */
  static async createMatch(data: CreateMatchDto) {
    try {
      // Vérifier si l'événement existe
      const event = await prisma.event.findUnique({
        where: { id: data.eventId },
      });

      if (!event) {
        const error = new Error("Événement non trouvé") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Vérifier si la session existe
      const session = await prisma.session.findUnique({
        where: { id: data.sessionId },
      });

      if (!session) {
        const error = new Error("Session non trouvée") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Vérifier si les compétiteurs existent
      const homeCompetitor = await prisma.competitor.findUnique({
        where: { id: data.homeCompetitorId },
      });

      if (!homeCompetitor) {
        const error = new Error("Compétiteur domicile non trouvé") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      const awayCompetitor = await prisma.competitor.findUnique({
        where: { id: data.awayCompetitorId },
      });

      if (!awayCompetitor) {
        const error = new Error("Compétiteur extérieur non trouvé") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Vérifier que les compétiteurs appartiennent au même événement
      if (
        homeCompetitor.eventId !== data.eventId ||
        awayCompetitor.eventId !== data.eventId
      ) {
        const error = new Error(
          "Les compétiteurs doivent appartenir à l'événement spécifié"
        ) as ApiError;
        error.statusCode = 400;
        throw error;
      }

      // Créer le match
      const match = await prisma.match.create({
        data: {
          ...data,
          resultStatus: ResultStatus.UNCONFIRMED,
        },
        include: {
          event: true,
          session: true,
          homeCompetitor: true,
          awayCompetitor: true,
        },
      });

      // Créer automatiquement la configuration du match avec les valeurs par défaut
      // en fonction du type d'événement
      await prisma.matchConfiguration.create({
        data: {
          matchId: match.id,
          rules: event.discipline === "TKW_K" ? "CONVENTIONAL" : "BESTOF3",
          rounds: 3,
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
        },
      });

      return this.getMatchById(match.id);
    } catch (error) {
      if (!(error as ApiError).statusCode) {
        const apiError = new Error(
          "Erreur lors de la création du match"
        ) as ApiError;
        apiError.statusCode = 400;
        throw apiError;
      }
      throw error;
    }
  }

  /**
   * Mettre à jour un match
   */
  static async updateMatch(id: string, data: UpdateMatchDto) {
    try {
      // Vérifier si le match existe
      const matchExists = await prisma.match.findUnique({
        where: { id },
      });

      if (!matchExists) {
        const error = new Error("Match non trouvé") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Vérifier si la session existe, si spécifiée
      if (data.sessionId) {
        const sessionExists = await prisma.session.findUnique({
          where: { id: data.sessionId },
        });

        if (!sessionExists) {
          const error = new Error("Session non trouvée") as ApiError;
          error.statusCode = 404;
          throw error;
        }
      }

      const match = await prisma.match.update({
        where: { id },
        data,
        include: {
          event: true,
          session: true,
          homeCompetitor: true,
          awayCompetitor: true,
        },
      });

      return match;
    } catch (error) {
      if (!(error as ApiError).statusCode) {
        const apiError = new Error(
          "Erreur lors de la mise à jour du match"
        ) as ApiError;
        apiError.statusCode = 400;
        throw apiError;
      }
      throw error;
    }
  }

  /**
   * Supprimer un match
   */
  static async deleteMatch(id: string) {
    // Vérifier si le match existe
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        results: true,
        actions: true,
        refereeAssignments: true,
        equipmentAssignments: true,
      },
    });

    if (!match) {
      const error = new Error("Match non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    // Supprimer toutes les données liées dans une transaction
    await prisma.$transaction([
      // Supprimer les actions
      prisma.matchAction.deleteMany({
        where: { matchId: id },
      }),
      // Supprimer les résultats
      prisma.matchResult.deleteMany({
        where: { matchId: id },
      }),
      // Supprimer les assignations d'arbitres
      prisma.matchRefereeAssignment.deleteMany({
        where: { matchId: id },
      }),
      // Supprimer les assignations d'équipements
      prisma.matchEquipmentAssignment.deleteMany({
        where: { matchId: id },
      }),
      // Si le match est dans un pool, supprimer cette référence
      prisma.poolMatch.deleteMany({
        where: { matchId: id },
      }),
      // Enfin, supprimer la configuration du match
      prisma.matchConfiguration.deleteMany({
        where: { matchId: id },
      }),
      // Supprimer le match lui-même
      prisma.match.delete({
        where: { id },
      }),
    ]);

    return true;
  }

  /**
   * Générer automatiquement les matchs pour un événement
   */
  static async generateMatchesForEvent(data: GenerateMatchesDto) {
    try {
      // Vérifier si l'événement existe
      const event = await prisma.event.findUnique({
        where: { id: data.eventId },
        include: {
          competitors: true,
        },
      });

      if (!event) {
        const error = new Error("Événement non trouvé") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Vérifier si la session existe
      const session = await prisma.session.findUnique({
        where: { id: data.sessionId },
      });

      if (!session) {
        const error = new Error("Session non trouvée") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Obtenir tous les compétiteurs de l'événement
      const competitors = event.competitors;

      if (competitors.length < 2) {
        const error = new Error(
          "Au moins 2 compétiteurs sont nécessaires pour générer des matchs"
        ) as ApiError;
        error.statusCode = 400;
        throw error;
      }

      // Trouver la taille du bracket (2^n)
      const totalCompetitors = competitors.length;
      const bracketSize = Math.pow(2, Math.ceil(Math.log2(totalCompetitors)));
      const byeCount = bracketSize - totalCompetitors;

      // Trier les compétiteurs par seed (si disponible)
      const sortedCompetitors = [...competitors].sort((a, b) => {
        if (a.seed !== null && b.seed !== null) {
          return a.seed - b.seed;
        } else if (a.seed !== null) {
          return -1;
        } else if (b.seed !== null) {
          return 1;
        }
        return 0;
      });

      // Calculer les positions de départ selon la taille du bracket
      let phase: MatchPhase = "R16";
      if (bracketSize === 4) phase = "SF";
      else if (bracketSize === 8) phase = "QF";
      else if (bracketSize === 16) phase = "R16";
      else if (bracketSize === 32) phase = "R32";
      else if (bracketSize === 64) phase = "R64";
      else if (bracketSize === 128) phase = "R128";
      else if (bracketSize > 128) {
        const error = new Error(
          "Tableau trop grand, maximum 128 participants"
        ) as ApiError;
        error.statusCode = 400;
        throw error;
      }

      // Générer la structure du bracket avec des BYE
      const bracket: { homeIndex: number; awayIndex: number }[] = [];

      // Appliquer l'algorithme standard de bracketing pour le premier tour
      // Premier et dernier, deuxième et avant-dernier, etc.
      for (let i = 0; i < bracketSize / 2; i++) {
        const homeIndex = i;
        const awayIndex = bracketSize - 1 - i;
        bracket.push({ homeIndex, awayIndex });
      }

      // Créer les matchs basés sur le bracket
      const matches = [];
      let matchNumber = 101; // Commencer à 101 par convention

      for (let i = 0; i < bracket.length; i++) {
        const { homeIndex, awayIndex } = bracket[i];
        const homeCompetitor =
          homeIndex < sortedCompetitors.length
            ? sortedCompetitors[homeIndex]
            : null;
        const awayCompetitor =
          awayIndex < sortedCompetitors.length
            ? sortedCompetitors[awayIndex]
            : null;

        // Si deux compétiteurs existent, créer un match
        if (homeCompetitor && awayCompetitor) {
          const positionReference = `${phase}-${i + 1}`;

          const match = await prisma.match.create({
            data: {
              mat: data.mat,
              number: String(matchNumber),
              phase,
              positionReference,
              scheduleStatus: ScheduleStatus.SCHEDULED,
              resultStatus: ResultStatus.UNCONFIRMED,
              eventId: data.eventId,
              sessionId: data.sessionId,
              homeCompetitorId: homeCompetitor.id,
              awayCompetitorId: awayCompetitor.id,
            },
          });

          // Créer la configuration du match
          await prisma.matchConfiguration.create({
            data: {
              matchId: match.id,
              rules: event.discipline === "TKW_K" ? "CONVENTIONAL" : "BESTOF3",
              rounds: 3,
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
            },
          });

          matches.push(match);
          matchNumber++;
        }
        // Si seulement un compétiteur existe (BYE), avancer directement au tour suivant
        // Note: cela nécessiterait de créer les tours suivants aussi, mais pour simplifier,
        // nous ne le faisons pas ici. On pourrait implémenter cette logique dans une version future.
      }

      return {
        success: true,
        count: matches.length,
        matches: matches,
      };
    } catch (error) {
      if (!(error as ApiError).statusCode) {
        const apiError = new Error(
          "Erreur lors de la génération des matchs"
        ) as ApiError;
        apiError.statusCode = 400;
        throw apiError;
      }
      throw error;
    }
  }

  /**
   * Récupérer les actions d'un match
   */
  static async getMatchActions(matchId: string) {
    // Vérifier si le match existe
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      const error = new Error("Match non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    return prisma.matchAction.findMany({
      where: { matchId },
      orderBy: { position: "asc" },
      include: {
        competitor: true,
      },
    });
  }

  /**
   * Ajouter une action à un match
   */
  static async addMatchAction(matchId: string, data: MatchActionDto) {
    try {
      // Vérifier si le match existe
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
          homeCompetitor: true,
          awayCompetitor: true,
        },
      });

      if (!match) {
        const error = new Error("Match non trouvé") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Récupérer le nombre actuel d'actions pour déterminer la position
      const actionsCount = await prisma.matchAction.count({
        where: { matchId },
      });

      // Déterminer le competitorId si nécessaire (pour certains types d'actions)
      let competitorId = null;
      if (data.action.includes("HOME")) {
        competitorId = match.homeCompetitorId;
      } else if (data.action.includes("AWAY")) {
        competitorId = match.awayCompetitorId;
      }

      // Mise à jour du statut du match si nécessaire
      let scheduleStatus = match.scheduleStatus;
      let resultStatus = match.resultStatus;

      if (data.action === ActionType.MATCH_LOADED) {
        scheduleStatus = ScheduleStatus.GETTING_READY;
      } else if (
        data.action === ActionType.MATCH_START ||
        data.action === ActionType.ROUND_START
      ) {
        scheduleStatus = ScheduleStatus.RUNNING;
        resultStatus = ResultStatus.LIVE;
      } else if (data.action === ActionType.MATCH_END) {
        scheduleStatus = ScheduleStatus.FINISHED;
        resultStatus = ResultStatus.UNCONFIRMED;
      }

      // Créer l'action
      const action = await prisma.matchAction.create({
        data: {
          matchId,
          action: data.action,
          hitlevel: data.hitlevel,
          round: data.round,
          roundTime: data.roundTime,
          position: data.position || actionsCount + 1,
          homeScore: data.homeScore,
          awayScore: data.awayScore,
          homePenalties: data.homePenalties,
          awayPenalties: data.awayPenalties,
          description: data.description,
          source: data.source,
          competitorId,
        },
      });

      // Mettre à jour le match si le statut a changé
      if (
        scheduleStatus !== match.scheduleStatus ||
        resultStatus !== match.resultStatus
      ) {
        await prisma.match.update({
          where: { id: matchId },
          data: {
            scheduleStatus,
            resultStatus,
            // Mettre à jour le round et roundTime si disponibles
            round: data.round,
            roundTime: data.roundTime,
            // Mettre à jour les scores si disponibles
            homeScore: data.homeScore,
            awayScore: data.awayScore,
            homePenalties: data.homePenalties,
            awayPenalties: data.awayPenalties,
          },
        });
      }

      return action;
    } catch (error) {
      if (!(error as ApiError).statusCode) {
        const apiError = new Error(
          "Erreur lors de l'ajout de l'action"
        ) as ApiError;
        apiError.statusCode = 400;
        throw apiError;
      }
      throw error;
    }
  }

  /**
   * Récupérer les résultats d'un match
   */
  static async getMatchResults(matchId: string) {
    // Vérifier si le match existe
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      const error = new Error("Match non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    return prisma.matchResult.findMany({
      where: { matchId },
      orderBy: { position: "desc" },
      include: {
        match: true,
      },
    });
  }

  /**
   * Ajouter un résultat à un match
   */
  static async addMatchResult(matchId: string, data: MatchResultDto) {
    try {
      // Vérifier si le match existe
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
          homeCompetitor: true,
          awayCompetitor: true,
          event: true,
        },
      });

      if (!match) {
        const error = new Error("Match non trouvé") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      let winnerId = null;
      let loserId = null;

      // Déterminer le gagnant et le perdant
      if (data.homeType === "WIN" && data.awayType === "LOSS") {
        winnerId = match.homeCompetitorId;
        loserId = match.awayCompetitorId;
      } else if (data.homeType === "LOSS" && data.awayType === "WIN") {
        winnerId = match.awayCompetitorId;
        loserId = match.homeCompetitorId;
      }

      // Créer le résultat
      const result = await prisma.matchResult.create({
        data: {
          matchId,
          status: data.status,
          round: data.round,
          position: data.position,
          decision: data.decision,
          homeType: data.homeType,
          awayType: data.awayType,
          homeScore: data.homeScore,
          awayScore: data.awayScore,
          homePenalties: data.homePenalties,
          awayPenalties: data.awayPenalties,
          description: data.description,
          winnerId,
          loserId,
        },
      });

      // Mettre à jour le statut du match
      await prisma.match.update({
        where: { id: matchId },
        data: {
          resultStatus: data.status,
          scheduleStatus:
            data.status === ResultStatus.OFFICIAL
              ? ScheduleStatus.FINISHED
              : match.scheduleStatus,
          resultDecision: data.decision,
          homeScore: data.homeScore,
          awayScore: data.awayScore,
          homePenalties: data.homePenalties,
          awayPenalties: data.awayPenalties,
        },
      });

      // Si le résultat est officiel et pour une finale ou une 3e place, créer un médaillé
      if (
        data.status === ResultStatus.OFFICIAL &&
        (match.phase === "F" || match.phase === "BMC")
      ) {
        const medalType =
          match.phase === "F"
            ? data.homeType === "WIN"
              ? "GOLD"
              : "SILVER"
            : "BRONZE";

        const competitorId =
          match.phase === "F"
            ? data.homeType === "WIN"
              ? match.homeCompetitorId
              : match.awayCompetitorId
            : data.homeType === "WIN"
            ? match.homeCompetitorId
            : match.awayCompetitorId;

        // Vérifier si le médaillé existe déjà
        const existingMedal = await prisma.medalWinner.findUnique({
          where: { competitorId },
        });

        if (!existingMedal) {
          await prisma.medalWinner.create({
            data: {
              eventId: match.eventId,
              competitorId,
              medalType,
              position:
                medalType === "GOLD" ? 1 : medalType === "SILVER" ? 2 : 3,
            },
          });
        }
      }

      return result;
    } catch (error) {
      if (!(error as ApiError).statusCode) {
        const apiError = new Error(
          "Erreur lors de l'ajout du résultat"
        ) as ApiError;
        apiError.statusCode = 400;
        throw apiError;
      }
      throw error;
    }
  }

  /**
   * Récupérer un match avec sa configuration complète
   */
  static async getMatchWithConfiguration(matchId: string) {
    return prisma.match.findUnique({
      where: { id: matchId },
      include: { matchConfiguration: true },
    });
  }

  /**
   * Assigner des arbitres à un match
   */
  static async assignReferees(
    matchId: string,
    data: MatchRefereeAssignmentDto
  ) {
    try {
      // Vérifier si le match existe
      const match = await prisma.match.findUnique({
        where: { id: matchId },
      });

      if (!match) {
        const error = new Error("Match non trouvé") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Vérifier si une assignation existe déjà
      const existingAssignment = await prisma.matchRefereeAssignment.findFirst({
        where: { matchId },
      });

      let assignment;

      // Vérifier que tous les arbitres sont valides
      const refereeIds = [
        data.refJ1Id,
        data.refJ2Id,
        data.refJ3Id,
        data.refCRId,
        data.refRJId,
        data.refTAId,
      ].filter((id) => id !== undefined && id !== null) as string[];

      if (refereeIds.length > 0) {
        const referees = await prisma.participant.findMany({
          where: {
            id: { in: refereeIds },
            mainRole: "REFEREE",
          },
        });

        if (referees.length !== refereeIds.length) {
          const error = new Error(
            "Un ou plusieurs arbitres spécifiés n'existent pas ou ne sont pas des arbitres"
          ) as ApiError;
          error.statusCode = 400;
          throw error;
        }
      }

      if (existingAssignment) {
        // Mettre à jour l'assignation existante
        assignment = await prisma.matchRefereeAssignment.update({
          where: { id: existingAssignment.id },
          data: {
            refJ1Id: data.refJ1Id || null,
            refJ2Id: data.refJ2Id || null,
            refJ3Id: data.refJ3Id || null,
            refCRId: data.refCRId || null,
            refRJId: data.refRJId || null,
            refTAId: data.refTAId || null,
          },
          include: {
            match: true,
            refJ1: true,
            refJ2: true,
            refJ3: true,
            refCR: true,
            refRJ: true,
            refTA: true,
          },
        });
      } else {
        // Créer une nouvelle assignation
        assignment = await prisma.matchRefereeAssignment.create({
          data: {
            matchId,
            role: "ALL" as OfficialRole,
            refJ1Id: data.refJ1Id || null,
            refJ2Id: data.refJ2Id || null,
            refJ3Id: data.refJ3Id || null,
            refCRId: data.refCRId || null,
            refRJId: data.refRJId || null,
            refTAId: data.refTAId || null,
          },
          include: {
            match: true,
            refJ1: true,
            refJ2: true,
            refJ3: true,
            refCR: true,
            refRJ: true,
            refTA: true,
          },
        });
      }

      // Créer des entrées de journal pour chaque arbitre assigné
      for (const [role, refId] of Object.entries({
        CR: data.refCRId,
        J1: data.refJ1Id,
        J2: data.refJ2Id,
        J3: data.refJ3Id,
        RJ: data.refRJId,
        TA: data.refTAId,
      })) {
        if (refId) {
          await prisma.refereeAssignmentLog.create({
            data: {
              matchId,
              refereeId: refId,
              role: role as OfficialRole,
            },
          });
        }
      }

      return assignment;
    } catch (error) {
      if (!(error as ApiError).statusCode) {
        const apiError = new Error(
          "Erreur lors de l'assignation des arbitres"
        ) as ApiError;
        apiError.statusCode = 400;
        throw apiError;
      }
      throw error;
    }
  }

  /**
   * Assigner des équipements à un match
   */
  static async assignEquipment(
    matchId: string,
    data: MatchEquipmentAssignmentDto
  ) {
    try {
      // Vérifier si le match existe
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
          homeCompetitor: true,
          awayCompetitor: true,
        },
      });

      if (!match) {
        const error = new Error("Match non trouvé") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Vérifier si le compétiteur appartient bien au match
      if (
        data.competitorId !== match.homeCompetitorId &&
        data.competitorId !== match.awayCompetitorId
      ) {
        const error = new Error(
          "Le compétiteur spécifié n'appartient pas à ce match"
        ) as ApiError;
        error.statusCode = 400;
        throw error;
      }

      // Vérifier si une assignation existe déjà pour ce compétiteur
      const existingAssignment =
        await prisma.matchEquipmentAssignment.findFirst({
          where: {
            matchId,
            competitorId: data.competitorId,
          },
        });

      if (existingAssignment) {
        // Mettre à jour l'assignation existante
        return prisma.matchEquipmentAssignment.update({
          where: { id: existingAssignment.id },
          data: {
            chestSensorId: data.chestSensorId,
            headSensorId: data.headSensorId,
            deviceType: (data.deviceType as PssDeviceType) || null,
          },
        });
      } else {
        // Créer une nouvelle assignation
        return prisma.matchEquipmentAssignment.create({
          data: {
            matchId,
            competitorId: data.competitorId,
            chestSensorId: data.chestSensorId,
            headSensorId: data.headSensorId,
            deviceType: (data.deviceType as PssDeviceType) || null,
          },
        });
      }
    } catch (error) {
      if (!(error as ApiError).statusCode) {
        const apiError = new Error(
          "Erreur lors de l'assignation des équipements"
        ) as ApiError;
        apiError.statusCode = 400;
        throw apiError;
      }
      throw error;
    }
  }
}
