// src/dto/matches/index.ts
import { z } from "zod";
import {
  MatchPhase,
  ResultStatus,
  ScheduleStatus,
  ActionType,
  VictoryType,
  ResultType,
  ActionSource,
  OfficialRole,
} from "@prisma/client";

// Convertir les enums Prisma en enums Zod
const MatchPhaseEnum = z.nativeEnum(MatchPhase);
const ResultStatusEnum = z.nativeEnum(ResultStatus);
const ScheduleStatusEnum = z.nativeEnum(ScheduleStatus);
const ActionTypeEnum = z.nativeEnum(ActionType);
const VictoryTypeEnum = z.nativeEnum(VictoryType);
const ResultTypeEnum = z.nativeEnum(ResultType);
const ActionSourceEnum = z.nativeEnum(ActionSource);
const OfficialRoleEnum = z.nativeEnum(OfficialRole);

// Schéma pour créer un match
export const createMatchSchema = z.object({
  mat: z.number().int().positive(),
  number: z.string().min(1).max(10),
  phase: MatchPhaseEnum,
  positionReference: z.string().min(1).max(10),
  scheduleStatus: ScheduleStatusEnum.default("SCHEDULED"),
  scheduledStart: z.string().datetime().optional(),
  eventId: z.string(),
  sessionId: z.string(),
  homeCompetitorId: z.string(),
  awayCompetitorId: z.string(),
});

export type CreateMatchDto = z.infer<typeof createMatchSchema>;

// Schéma pour mettre à jour un match
export const updateMatchSchema = z.object({
  mat: z.number().int().positive().optional(),
  number: z.string().min(1).max(10).optional(),
  scheduleStatus: ScheduleStatusEnum.optional(),
  scheduledStart: z.string().datetime().optional(),
  sessionId: z.string().optional(),
});

export type UpdateMatchDto = z.infer<typeof updateMatchSchema>;

// Schéma pour générer des matchs pour un événement
export const generateMatchesSchema = z.object({
  eventId: z.string(),
  sessionId: z.string(),
  mat: z.number().int().positive().default(1),
});

export type GenerateMatchesDto = z.infer<typeof generateMatchesSchema>;

// Schéma pour ajouter une action à un match
export const matchActionSchema = z.object({
  action: ActionTypeEnum,
  hitlevel: z.number().int().optional(),
  round: z.number().int().positive(),
  roundTime: z.string().regex(/^\d{1,2}:\d{2}$/), // Format: "MM:SS"
  position: z.number().int().positive().optional(),
  homeScore: z.number().int().optional(),
  awayScore: z.number().int().optional(),
  homePenalties: z.number().int().optional(),
  awayPenalties: z.number().int().optional(),
  description: z.string().optional(),
  source: ActionSourceEnum.optional(),
});

export type MatchActionDto = z.infer<typeof matchActionSchema>;

// Schéma pour ajouter un résultat à un match
export const matchResultSchema = z.object({
  status: ResultStatusEnum,
  round: z.number().int().optional(),
  position: z.number().int().positive(),
  decision: VictoryTypeEnum.optional(),
  homeType: ResultTypeEnum.optional(),
  awayType: ResultTypeEnum.optional(),
  homeScore: z.number().int(),
  awayScore: z.number().int(),
  homePenalties: z.number().int(),
  awayPenalties: z.number().int(),
  description: z.string().optional(),
});

export type MatchResultDto = z.infer<typeof matchResultSchema>;

// Schéma pour la configuration d'un match
export const matchConfigurationSchema = z.object({
  rules: z.enum(["CONVENTIONAL", "BESTOF3"]),
  rounds: z.number().int().positive(),
  roundTime: z.string().regex(/^\d{1,2}:\d{2}$/), // Format: "MM:SS"
  restTime: z.string().regex(/^\d{1,2}:\d{2}$/),
  injuryTime: z.string().regex(/^\d{1,2}:\d{2}$/),
  bodyThreshold: z.number().int().positive(),
  headThreshold: z.number().int().positive(),
  homeVideoReplayQuota: z.number().int().nonnegative(),
  awayVideoReplayQuota: z.number().int().nonnegative(),
  goldenPointEnabled: z.boolean(),
  goldenPointTime: z.string().regex(/^\d{1,2}:\d{2}$/),
  maxDifference: z.number().int().positive(),
  maxPenalties: z.number().int().positive(),
});

export type MatchConfigurationDto = z.infer<typeof matchConfigurationSchema>;

// Schéma pour assigner des arbitres à un match
export const matchRefereeAssignmentSchema = z.object({
  refJ1Id: z.string().optional(),
  refJ2Id: z.string().optional(),
  refJ3Id: z.string().optional(),
  refCRId: z.string().optional(),
  refRJId: z.string().optional(),
  refTAId: z.string().optional(),
});

export type MatchRefereeAssignmentDto = z.infer<
  typeof matchRefereeAssignmentSchema
>;

// Schéma pour assigner des équipements à un match
export const matchEquipmentAssignmentSchema = z.object({
  competitorId: z.string(),
  chestSensorId: z.string(),
  headSensorId: z.string(),
  deviceType: z.enum(["KPNP", "DAEDO"]).optional(),
});

export type MatchEquipmentAssignmentDto = z.infer<
  typeof matchEquipmentAssignmentSchema
>;
