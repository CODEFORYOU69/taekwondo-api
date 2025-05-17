// src/dto/sync/index.ts
import { z } from "zod";

// Schéma pour les requêtes push
export const syncPushSchema = z.object({
  modelName: z.string(),
  changes: z.array(z.any()),
  clientId: z.string().optional(), // Identifiant unique du client pour le suivi
  timestamp: z.string().datetime().optional(),
});

export type SyncPushDto = z.infer<typeof syncPushSchema>;

// Schéma pour les requêtes pull
export const syncPullSchema = z.object({
  modelName: z.string(),
  since: z.string().datetime(),
  clientId: z.string().optional(),
});

export type SyncPullDto = z.infer<typeof syncPullSchema>;

// Schéma pour la configuration de synchronisation
export const syncConfigSchema = z.object({
  modelName: z.string(),
  enabled: z.boolean().default(true),
  direction: z.enum(["LOCAL_TO_CLOUD", "CLOUD_TO_LOCAL", "BIDIRECTIONAL"]),
  conflictStrategy: z.enum([
    "LOCAL_WINS",
    "CLOUD_WINS",
    "NEWEST_WINS",
    "MANUAL",
  ]),
  syncInterval: z.number().int().min(0).default(15), // En minutes, 0 = manuel uniquement
});

export type SyncConfigDto = z.infer<typeof syncConfigSchema>;

// Types pour les résultats de synchronisation
export const syncResultSchema = z.object({
  success: z.boolean(),
  results: z.array(
    z.object({
      id: z.string().optional(),
      status: z.enum(["SUCCESS", "ERROR", "CONFLICT"]),
      message: z.string().optional(),
    })
  ),
  timestamp: z.string().datetime(),
});

export type SyncResultDto = z.infer<typeof syncResultSchema>;

// Schéma pour la réponse pull
export const syncPullResponseSchema = z.object({
  success: z.boolean(),
  changes: z.array(z.any()),
  timestamp: z.string().datetime(),
});

export type SyncPullResponseDto = z.infer<typeof syncPullResponseSchema>;

// Schéma pour résoudre les conflits
export const syncResolveConflictSchema = z.object({
  modelName: z.string(),
  recordId: z.string(),
  resolution: z.enum(["LOCAL_WINS", "CLOUD_WINS", "MANUAL"]),
  manualData: z.any().optional(), // Données manuelles si résolution = MANUAL
});

export type SyncResolveConflictDto = z.infer<typeof syncResolveConflictSchema>;
