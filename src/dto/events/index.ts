// src/dto/events/index.ts
import { z } from "zod";
import { CountryCode, Gender, WTDiscipline, WTDivision } from "@prisma/client";

// Convertir les enums Prisma en enums Zod
const GenderEnum = z.nativeEnum(Gender);
const DisciplineEnum = z.nativeEnum(WTDiscipline);
const DivisionEnum = z.nativeEnum(WTDivision);
const CountryCodeEnum = z.nativeEnum(CountryCode);

// Schéma pour créer un événement
export const createEventSchema = z.object({
  discipline: DisciplineEnum,
  division: DivisionEnum,
  gender: GenderEnum,
  name: z.string().min(3).max(100),
  abbreviation: z.string().min(1).max(20),
  weightCategory: z.string().optional(),
  sportClass: z.string().optional(),
  category: z.string().optional(),
  role: z.string(),
  competitionId: z.string(),
  competitionType: z
    .enum(["ELIMINATION", "POOL", "POOL_ELIMINATION"])
    .default("ELIMINATION"),
});

export type CreateEventDto = z.infer<typeof createEventSchema>;

// Schéma pour mettre à jour un événement
export const updateEventSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  abbreviation: z.string().min(1).max(20).optional(),
  weightCategory: z.string().optional(),
  sportClass: z.string().optional(),
  category: z.string().optional(),
  competitionType: z
    .enum(["ELIMINATION", "POOL", "POOL_ELIMINATION"])
    .optional(),
});

export type UpdateEventDto = z.infer<typeof updateEventSchema>;

// Schéma pour configurer les poules d'un événement
export const eventPoolConfigSchema = z.object({
  usePoolSystem: z.boolean().default(false),
  minAthletesPerPool: z.number().int().min(2).default(3),
  maxAthletesPerPool: z.number().int().min(3).default(5),
  poolDistribution: z.enum(["EQUAL", "SEEDED", "RANDOM"]).default("EQUAL"),
  qualifyingPlaces: z.number().int().min(1).default(2),
  tieBreakCriteria: z
    .array(
      z.enum([
        "POINTS_DIFFERENCE",
        "HEAD_TO_HEAD",
        "POINTS_FOR",
        "POINTS_AGAINST",
        "WINS",
        "RANDOM",
      ])
    )
    .default(["POINTS_DIFFERENCE", "HEAD_TO_HEAD", "POINTS_FOR"]),
});

export type EventPoolConfigDto = z.infer<typeof eventPoolConfigSchema>;
