// src/dto/competitors/index.ts
import { CompetitorType, CountryCode } from "@prisma/client";
import { z } from "zod";

// Convertir les enums Prisma en enums Zod
const CompetitorTypeEnum = z.nativeEnum(CompetitorType);
const CountryCodeEnum = z.nativeEnum(CountryCode);

// Schéma pour mettre à jour un compétiteur
export const updateCompetitorSchema = z.object({
  printName: z.string().min(2).max(70).optional(),
  printInitialName: z.string().min(2).max(50).optional(),
  tvName: z.string().min(2).max(70).optional(),
  tvInitialName: z.string().min(2).max(50).optional(),
  scoreboardName: z.string().min(2).max(50).optional(),
  rank: z.number().int().optional(),
  seed: z.number().int().optional(),
  country: CountryCodeEnum.optional(),
});

export type UpdateCompetitorDto = z.infer<typeof updateCompetitorSchema>;

// Schéma pour créer un nouveau compétiteur
export const createCompetitorSchema = z.object({
  competitorType: CompetitorTypeEnum,
  printName: z.string().min(2).max(70),
  printInitialName: z.string().min(2).max(50),
  tvName: z.string().min(2).max(70),
  tvInitialName: z.string().min(2).max(50),
  scoreboardName: z.string().min(2).max(50),
  rank: z.number().int().optional(),
  seed: z.number().int().optional(),
  country: CountryCodeEnum,
  eventId: z.string(),
  organizationId: z.string(),
  participantIds: z.array(z.string()).optional(), // Pour les compétiteurs de type Team
});

export type CreateCompetitorDto = z.infer<typeof createCompetitorSchema>;
