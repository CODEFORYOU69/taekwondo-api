// src/middleware/auth.middleware.ts
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { TokenPayload } from "../interfaces/auth.interface";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Authentification requise" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      config.JWT_SECRET as jwt.Secret
    ) as TokenPayload;

    // Ajouter les informations d'utilisateur à la requête
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

// Ajouter cette fonction pour la vérification des rôles
export const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Authentification requise" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: "Accès non autorisé" });
      return;
    }

    next();
  };
};
