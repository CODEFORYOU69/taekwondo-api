// src/dto/sessions/index.ts
import { ScheduleStatus } from "@prisma/client";
import { z } from "zod";

// Convertir les enums Prisma en enums Zod
const ScheduleStatusEnum = z.nativeEnum(ScheduleStatus);

// Schéma pour créer une session
export const createSessionSchema = z.object({
  name: z.string().min(3).max(100),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  scheduleStatus: ScheduleStatusEnum.default("SCHEDULED"),
  competitionId: z.string(),
});

export type CreateSessionDto = z.infer<typeof createSessionSchema>;

// Schéma pour mettre à jour une session
export const updateSessionSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  scheduleStatus: ScheduleStatusEnum.optional(),
});

export type UpdateSessionDto = z.infer<typeof updateSessionSchema>;
