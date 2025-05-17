import { z } from "zod";

// Schéma pour les messages entrants du PSS
const PssMessageSchema = z.object({
  event: z.enum(["match:start", "match:stop", "match:action", "match:config"]),
  data: z
    .object({
      matchId: z.string(),
      timestamp: z.string().transform((str) => new Date(str)),
    })
    .and(
      z.union([
        // Schéma pour match:start
        z.object({
          // Données additionnelles pour le démarrage
        }),

        // Schéma pour match:stop
        z.object({
          homeScore: z.number(),
          awayScore: z.number(),
          resultType: z.string().optional(),
        }),

        // Schéma pour match:action
        z.object({
          actionType: z.string(),
          competitorId: z.string(),
          roundNumber: z.number(),
          points: z.number().optional(),
        }),

        // Schéma pour match:config
        z.object({
          roundDuration: z.number(),
          numberOfRounds: z.number(),
          breakDuration: z.number(),
          kyeShiDuration: z.number(),
          goldenPointEnabled: z.boolean().optional(),
          goldenPointDuration: z.number().optional(),
          sensorThresholds: z.record(z.string(), z.number()).optional(),
        }),
      ])
    ),
});

// Fonction pour valider les messages entrants
export function validatePssMessage(message: unknown) {
  return PssMessageSchema.parse(message);
}
