// src/dto/participants/index.ts
import {
  CountryCode,
  Gender,
  ParticipantSource,
  ParticipantStatus,
  WeighInStatus,
} from "@prisma/client";
import { z } from "zod";

// Convertir les enums Prisma en enums Zod
const GenderEnum = z.nativeEnum(Gender);
const CountryCodeEnum = z.nativeEnum(CountryCode);
const ParticipantStatusEnum = z.nativeEnum(ParticipantStatus);
const ParticipantSourceEnum = z.nativeEnum(ParticipantSource);
const WeighInStatusEnum = z.nativeEnum(WeighInStatus);

// Schéma pour créer un participant
export const createParticipantSchema = z.object({
  licenseNumber: z.string().min(3).max(20),
  passportGivenName: z.string().min(2).max(50),
  passportFamilyName: z.string().min(2).max(50),
  preferredGivenName: z.string().min(2).max(50),
  preferredFamilyName: z.string().min(2).max(50),
  gender: GenderEnum,
  birthDate: z.string().refine(
    (date) => {
      // Validation de la date de naissance
      const birthDate = new Date(date);
      return !isNaN(birthDate.getTime());
    },
    { message: "Format de date invalide" }
  ),
  mainRole: z.string(),
  country: CountryCodeEnum,
  organizationId: z.string(),
  galNumber: z.string().optional(),
  source: ParticipantSourceEnum.optional(),
  status: ParticipantStatusEnum.optional(),
});

export type CreateParticipantDto = z.infer<typeof createParticipantSchema>;

// Schéma pour mettre à jour un participant
export const updateParticipantSchema = z.object({
  licenseNumber: z.string().min(3).max(20).optional(),
  passportGivenName: z.string().min(2).max(50).optional(),
  passportFamilyName: z.string().min(2).max(50).optional(),
  preferredGivenName: z.string().min(2).max(50).optional(),
  preferredFamilyName: z.string().min(2).max(50).optional(),
  gender: GenderEnum.optional(),
  birthDate: z.string().optional(),
  mainRole: z.string().optional(),
  country: CountryCodeEnum.optional(),
  organizationId: z.string().optional(),
  galNumber: z.string().optional(),
  status: ParticipantStatusEnum.optional(),
});

export type UpdateParticipantDto = z.infer<typeof updateParticipantSchema>;

// Schéma pour enregistrer à un événement
export const registerToEventSchema = z.object({
  eventId: z.string(),
});

export type RegisterToEventDto = z.infer<typeof registerToEventSchema>;

// Schéma pour ajouter une pesée
export const weighInSchema = z.object({
  weight: z.number().positive(),
  status: WeighInStatusEnum,
  attemptDate: z.string().datetime().optional(),
});

export type WeighInDto = z.infer<typeof weighInSchema>;
