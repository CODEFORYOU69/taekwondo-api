// src/dto/users/index.ts
import { Role } from "@prisma/client";
import { z } from "zod";

// Convertir l'enum Prisma en enum Zod
const RoleEnum = z.nativeEnum(Role);

// Schéma pour créer un utilisateur
export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: RoleEnum.default("club"),
  language: z.string().default("fr"),
  organizationId: z.string().optional().nullable(),
  deviceToken: z.string().optional().nullable(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

// Schéma pour mettre à jour un utilisateur
export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  role: RoleEnum.optional(),
  language: z.string().optional(),
  organizationId: z.string().optional().nullable(),
  deviceToken: z.string().optional().nullable(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;

// Schéma pour changer le mot de passe
export const changePasswordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;

// Schéma pour les filtres de recherche
export const userFiltersSchema = z.object({
  role: RoleEnum.optional(),
  organizationId: z.string().optional(),
});

export type UserFiltersDto = z.infer<typeof userFiltersSchema>;

// Schéma pour login
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginDto = z.infer<typeof loginSchema>;

// Schéma pour les réponses d'authentification
export const authResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    role: z.string(),
    language: z.string(),
    organizationId: z.string().optional().nullable(),
  }),
});

export type AuthResponseDto = z.infer<typeof authResponseSchema>;
