// src/dto/licenses/index.ts
import { LicenseStatus, LicenseType } from "@prisma/client";
import { z } from "zod";

// Convertir les enums Prisma en enums Zod
const LicenseTypeEnum = z.nativeEnum(LicenseType);
const LicenseStatusEnum = z.nativeEnum(LicenseStatus);

// Schéma pour créer une licence
export const createLicenseSchema = z.object({
  type: LicenseTypeEnum,
  organizationId: z.string(),
  maxEvents: z.number().int().positive().default(1),
  maxParticipants: z.number().int().positive().default(100),
  maxUsers: z.number().int().positive().default(5),
  expiresAt: z.string().datetime(),
  features: z.record(z.any()).optional(),
  machineId: z.string().optional(),
});

export type CreateLicenseDto = z.infer<typeof createLicenseSchema>;

// Schéma pour mettre à jour une licence
export const updateLicenseSchema = z.object({
  status: LicenseStatusEnum.optional(),
  maxEvents: z.number().int().positive().optional(),
  maxParticipants: z.number().int().positive().optional(),
  maxUsers: z.number().int().positive().optional(),
  expiresAt: z.string().datetime().optional(),
  features: z.record(z.any()).optional(),
});

export type UpdateLicenseDto = z.infer<typeof updateLicenseSchema>;

// Schéma pour vérifier une licence
export const verifyLicenseSchema = z.object({
  key: z.string(),
  machineId: z.string(),
});

export type VerifyLicenseDto = z.infer<typeof verifyLicenseSchema>;

// Interface pour les statistiques d'utilisation
export interface UsageStatsDto {
  events: {
    used: number;
    max: number;
    percentage: number;
  };
  participants: {
    used: number;
    max: number;
    percentage: number;
  };
  users: {
    used: number;
    max: number;
    percentage: number;
  };
  activity: {
    date: string;
    actions: number;
  }[];
}

// Interface pour le résultat de vérification de licence
export interface LicenseVerificationResult {
  valid: boolean;
  license?: {
    type: LicenseType;
    status: LicenseStatus;
    expiresAt: Date | null;
    maxEvents: number;
    maxParticipants: number;
    maxUsers: number;
    features: Record<string, any>;
  };
  message?: string;
}
