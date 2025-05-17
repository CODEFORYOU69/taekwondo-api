// src/utils/jwt.utils.ts
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { TokenPayload } from "../interfaces/auth.interface";

/**
 * Générer un token JWT
 */
export const generateToken = (
  payload: TokenPayload,
  expiresIn = config.JWT_EXPIRES_IN
): string => {
  // @ts-ignore - Ignorer l'erreur de typage pour jwt.sign
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn });
};

/**
 * Vérifier un token JWT
 */
export const verifyToken = (token: string): TokenPayload => {
  // @ts-ignore - Ignorer l'erreur de typage pour jwt.verify
  return jwt.verify(token, config.JWT_SECRET) as TokenPayload;
};
