// src/dto/weighins/index.ts
import { z } from "zod";
import { WeighInStatus } from "@prisma/client";

// Schéma pour créer une pesée
export const createWeighInSchema = z.object({
  weight: z.number().positive(),
  status: z.nativeEnum(WeighInStatus),
  attemptDate: z.string().datetime().optional(),
  competitionId: z.string().optional(),
  random: z.boolean().optional().default(false),
});

export type CreateWeighInDto = z.infer<typeof createWeighInSchema>;

// Schéma pour mettre à jour une pesée
export const updateWeighInSchema = z.object({
  weight: z.number().positive().optional(),
  status: z.nativeEnum(WeighInStatus).optional(),
  attemptDate: z.string().datetime().optional(),
  random: z.boolean().optional(),
});

export type UpdateWeighInDto = z.infer<typeof updateWeighInSchema>;
