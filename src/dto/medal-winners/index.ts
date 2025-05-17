// src/dto/medal-winners/index.ts
import { MedalType } from "@prisma/client";
import { z } from "zod";

// Convertir les enums Prisma en enums Zod
const MedalTypeEnum = z.nativeEnum(MedalType);

// Schéma pour créer un médaillé
export const createMedalWinnerSchema = z.object({
  eventId: z.string(),
  competitorId: z.string(),
  medalType: MedalTypeEnum,
  position: z.number().int().positive(),
});

export type CreateMedalWinnerDto = z.infer<typeof createMedalWinnerSchema>;

// Schéma pour mettre à jour un médaillé
export const updateMedalWinnerSchema = z.object({
  medalType: MedalTypeEnum.optional(),
  position: z.number().int().positive().optional(),
});

export type UpdateMedalWinnerDto = z.infer<typeof updateMedalWinnerSchema>;

// Type pour représenter le classement des médailles
export interface MedalStandingsDto {
  country: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}
