// src/controllers/sessions.controller.ts
import { NextFunction, Request, Response } from "express";
import { createSessionSchema, updateSessionSchema } from "../dto/sessions";
import { TokenPayload } from "../interfaces/auth.interface";
import { SessionsService } from "../services/sessions.service";

/**
 * Récupérer toutes les sessions
 */
export const getAllSessions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { competitionId, status, startDate } = req.query;

    const filters = {
      competitionId: competitionId as string,
      status: status as string,
      startDate: startDate as string,
    };

    const sessions = await SessionsService.getAllSessions(filters);
    res.status(200).json(sessions);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer une session par son ID
 */
export const getSessionById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const session = await SessionsService.getSessionById(id);
    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
};

/**
 * Créer une nouvelle session
 */
export const createSession = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validation des données
    const validationResult = createSessionSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const session = await SessionsService.createSession(validationResult.data);
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour une session
 */
export const updateSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validation des données
    const validationResult = updateSessionSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const session = await SessionsService.updateSession(
      id,
      validationResult.data
    );
    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer une session
 */
export const deleteSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await SessionsService.deleteSession(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer les matchs d'une session
 */
export const getSessionMatches = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const matches = await SessionsService.getSessionMatches(id);
    res.status(200).json(matches);
  } catch (error) {
    next(error);
  }
};
