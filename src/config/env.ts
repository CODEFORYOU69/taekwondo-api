// src/config/env.ts
import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default("3000"),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(1).default("default_secret_change_in_production"),
  JWT_EXPIRES_IN: z.string().default("24h"),
  // Correction ici: transformer la chaîne en booléen
  SYNC_ENABLED: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  // Correction ici: transformer la chaîne en nombre
  SYNC_INTERVAL: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default("15"),
});

export const config = envSchema.parse(process.env);
