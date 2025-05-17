import {
  ActionSource,
  ActionType,
  PrismaClient,
  ResultStatus,
  VictoryType,
} from "@prisma/client";
import { SocketService } from "../socket/socketService";
import { logger } from "../utils/logger";

export class PssService {
  private prisma: PrismaClient;
  private socketService: SocketService;

  constructor() {
    this.prisma = new PrismaClient();
    this.socketService = new SocketService();
  }

  async handleMatchStart(data: any) {
    try {
      const match = await this.prisma.match.findUnique({
        where: { id: data.matchId },
      });

      if (!match) throw new Error("Match " + data.matchId + " non trouvé");

      await this.prisma.match.update({
        where: { id: data.matchId },
        data: {
          resultStatus: ResultStatus.RUNNING,
          actualStart: new Date(),
        },
      });

      this.socketService.emitMatchUpdate(data.matchId, { status: "RUNNING" });
      logger.info("Match " + data.matchId + " démarré");
    } catch (error) {
      logger.error("Erreur lors du démarrage du match:", error);
      throw error;
    }
  }

  async handleMatchStop(data: any) {
    try {
      const updatedMatch = await this.prisma.match.update({
        where: { id: data.matchId },
        data: {
          resultStatus: ResultStatus.COMPLETED,
          homeScore: data.homeScore,
          awayScore: data.awayScore,
        },
      });

      await this.prisma.matchResult.create({
        data: {
          match: { connect: { id: data.matchId } },
          winnerId:
            data.homeScore > data.awayScore
              ? updatedMatch.homeCompetitorId
              : updatedMatch.awayCompetitorId,
          decision: data.decision || VictoryType.PTF,
          status: "COMPLETED",
          position: 0,
          homeScore: data.homeScore,
          awayScore: data.awayScore,
          homePenalties: 0,
          awayPenalties: 0,
        },
      });

      this.socketService.emitMatchUpdate(data.matchId, {
        status: "COMPLETED",
        homeScore: data.homeScore,
        awayScore: data.awayScore,
      });

      logger.info("Match " + data.matchId + " terminé");
    } catch (error) {
      logger.error("Erreur lors de l'arrêt du match:", error);
      throw error;
    }
  }

  async handleMatchAction(data: any) {
    try {
      const existingAction = await this.prisma.matchAction.findFirst({
        where: {
          matchId: data.matchId,
          action: data.actionType,
          timestamp: {
            gte: new Date(new Date(data.timestamp).getTime() - 1000),
            lte: new Date(new Date(data.timestamp).getTime() + 1000),
          },
        },
      });

      if (existingAction) {
        logger.warn("Action dupliquée ignorée pour le match " + data.matchId);
        return;
      }

      const match = await this.prisma.match.findUnique({
        where: { id: data.matchId },
      });

      const isHome = match?.homeCompetitorId === data.competitorId;

      const action = await this.prisma.matchAction.create({
        data: {
          matchId: data.matchId,
          action: this.mapPssActionType(data.actionType, isHome),
          source: ActionSource.CR, // CR = Computer Referee (PSS)
          competitorId: data.competitorId,
          round: data.roundNumber,
          roundTime: data.roundTime,
          value: data.points || 0,
          timestamp: new Date(data.timestamp),
        },
      });

      if (match) {
        const scoreField = isHome ? "homeScore" : "awayScore";
        const currentScore = match[scoreField] ?? 0;

        await this.prisma.match.update({
          where: { id: data.matchId },
          data: { [scoreField]: currentScore + (data.points || 0) },
        });
      }

      this.socketService.emitMatchAction(data.matchId, action);
      logger.info(
        "Action enregistrée pour le match " +
          data.matchId +
          ": " +
          data.actionType
      );
    } catch (error) {
      logger.error("Erreur lors de l'enregistrement de l'action:", error);
      throw error;
    }
  }

  async handleMatchConfig(data: any) {
    try {
      await this.prisma.matchConfiguration.upsert({
        where: { matchId: data.matchId },
        update: {
          rounds: data.numberOfRounds,
          roundTime: data.roundDuration,
          restTime: data.breakDuration,
          injuryTime: data.kyeShiDuration,
          goldenPointEnabled: data.goldenPointEnabled || false,
          goldenPointTime: data.goldenPointDuration,
          bodyThreshold: data.sensorThresholds?.body,
          headThreshold: data.sensorThresholds?.head,
          rules: "WT_COMPETITION",
          homeVideoReplayQuota: 1,
          awayVideoReplayQuota: 1,
          maxDifference: 12,
          maxPenalties: 5,
        },
        create: {
          match: { connect: { id: data.matchId } },
          rounds: data.numberOfRounds,
          roundTime: data.roundDuration,
          restTime: data.breakDuration,
          injuryTime: data.kyeShiDuration,
          goldenPointEnabled: data.goldenPointEnabled || false,
          goldenPointTime: data.goldenPointDuration,
          bodyThreshold: data.sensorThresholds?.body,
          headThreshold: data.sensorThresholds?.head,
          rules: "WT_COMPETITION",
          homeVideoReplayQuota: 1,
          awayVideoReplayQuota: 1,
          maxDifference: 12,
          maxPenalties: 5,
        },
      });

      logger.info("Configuration enregistrée pour le match " + data.matchId);
    } catch (error) {
      logger.error(
        "Erreur lors de l'enregistrement de la configuration:",
        error
      );
      throw error;
    }
  }

  private mapPssActionType(pssType: string, isHome: boolean): ActionType {
    const side = isHome ? "HOME" : "AWAY";
    const map: Record<string, string> = {
      head: `SCORE_${side}_HEAD`,
      punch: `SCORE_${side}_PUNCH`,
      kick: `SCORE_${side}_KICK`,
      tkick: `SCORE_${side}_TKICK`,
      thead: `SCORE_${side}_THEAD`,
      gamjeom: `PENALTY_${side}`,
    };
    if (!map[pssType]) {
      logger.warn(`Action PSS inconnue: ${pssType}, fallback ADJUST_SCORE`);
    }

    const actionTypeString = map[pssType] || "ADJUST_SCORE";

    if (!(actionTypeString in ActionType)) {
      throw new Error(`Type d'action PSS inconnu ou non mappé : ${pssType}`);
    }

    return ActionType[actionTypeString as keyof typeof ActionType];
  }
}
