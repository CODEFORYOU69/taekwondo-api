// src/dto/organizations/index.ts
import { CountryCode } from "@prisma/client";
import { z } from "zod";

// Convertir l'enum Prisma en enum Zod
const CountryCodeEnum = z.nativeEnum(CountryCode);

// Schéma pour créer une organisation
export const createOrganizationSchema = z.object({
  name: z.string().min(2).max(100),
  country: CountryCodeEnum,
  billingEmail: z.string().email().optional(),
  billingAddress: z.string().optional(),
  vatNumber: z.string().optional(),
});

export type CreateOrganizationDto = z.infer<typeof createOrganizationSchema>;

// Schéma pour mettre à jour une organisation
export const updateOrganizationSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  country: CountryCodeEnum.optional(),
  billingEmail: z.string().email().optional().nullable(),
  billingAddress: z.string().optional().nullable(),
  vatNumber: z.string().optional().nullable(),
});

export type UpdateOrganizationDto = z.infer<typeof updateOrganizationSchema>;

// Schéma pour les filtres de recherche
export const organizationFiltersSchema = z.object({
  country: CountryCodeEnum.optional(),
  name: z.string().optional(),
});

export type OrganizationFiltersDto = z.infer<typeof organizationFiltersSchema>;
