// src/dto/pools/index.ts
import { z } from "zod";

// Schéma pour créer une poule
export const createPoolSchema = z.object({
  eventId: z.string(),
  name: z.string().min(1).max(50),
  maxAthletes: z.number().int().min(2),
  matchesPerAthlete: z.number().int().optional(),
  pointsForWin: z.number().int().default(3),
  pointsForDraw: z.number().int().default(1),
  pointsForLoss: z.number().int().default(0),
  qualifyingPlaces: z.number().int().default(2),
});

export type CreatePoolDto = z.infer<typeof createPoolSchema>;

// Schéma pour mettre à jour une poule
export const updatePoolSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  maxAthletes: z.number().int().min(2).optional(),
  matchesPerAthlete: z.number().int().optional().nullable(),
  pointsForWin: z.number().int().optional(),
  pointsForDraw: z.number().int().optional(),
  pointsForLoss: z.number().int().optional(),
  qualifyingPlaces: z.number().int().optional(),
});

export type UpdatePoolDto = z.infer<typeof updatePoolSchema>;

// Schéma pour ajouter un compétiteur à une poule
export const addCompetitorToPoolSchema = z.object({
  competitorId: z.string(),
});

export type AddCompetitorToPoolDto = z.infer<typeof addCompetitorToPoolSchema>;

// Schéma pour générer les matchs d'une poule
export const generatePoolMatchesSchema = z.object({
  sessionId: z.string(),
  mat: z.number().int().positive().default(1),
});

export type GeneratePoolMatchesDto = z.infer<typeof generatePoolMatchesSchema>;

// Schéma pour filtrer les poules
export const poolFiltersSchema = z.object({
  eventId: z.string().optional(),
});

export type PoolFiltersDto = z.infer<typeof poolFiltersSchema>;

// Schéma pour résultat du classement d'une poule
export const poolStandingsResultSchema = z.object({
  id: z.string(),
  poolId: z.string(),
  competitorId: z.string(),
  matchesPlayed: z.number().int(),
  wins: z.number().int(),
  draws: z.number().int(),
  losses: z.number().int(),
  pointsFor: z.number().int(),
  pointsAgainst: z.number().int(),
  pointsDifference: z.number().int(),
  totalPoints: z.number().int(),
  rank: z.number().int().nullable(),
  qualified: z.boolean(),
});

export type PoolStandingsResultDto = z.infer<typeof poolStandingsResultSchema>;

// Type des critères de départage
export const tieBreakCriteriaSchema = z.enum([
  "POINTS_DIFFERENCE",
  "HEAD_TO_HEAD",
  "POINTS_FOR",
  "POINTS_AGAINST",
  "WINS",
  "RANDOM",
]);

export type TieBreakCriteria = z.infer<typeof tieBreakCriteriaSchema>;
