// src/controllers/matches.controller.ts
import { MatchPhase } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import {
  createMatchSchema,
  generateMatchesSchema,
  matchActionSchema,
  matchEquipmentAssignmentSchema,
  matchRefereeAssignmentSchema,
  matchResultSchema,
  updateMatchSchema,
} from "../dto/matches";
import { TokenPayload } from "../interfaces/auth.interface";
import { MatchesService } from "../services/matches.service";

/**
 * Récupérer tous les matchs
 */
export const getAllMatches = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { eventId, mat, status, phase, competitorId } = req.query;

    const filters: {
      eventId?: string;
      mat?: number;
      status?: string;
      phase?: MatchPhase;
      competitorId?: string;
    } = {};

    if (eventId) filters.eventId = eventId as string;
    if (mat) filters.mat = parseInt(mat as string);
    if (status) filters.status = status as string;
    if (phase && Object.values(MatchPhase).includes(phase as MatchPhase)) {
      filters.phase = phase as MatchPhase;
    }
    if (competitorId) filters.competitorId = competitorId as string;

    const matches = await MatchesService.getAllMatches(filters);
    res.status(200).json(matches);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer un match par son ID
 */
export const getMatchById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const match = await MatchesService.getMatchById(id);
    res.status(200).json(match);
  } catch (error) {
    next(error);
  }
};

/**
 * Créer un nouveau match
 */
export const createMatch = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validation des données
    const validationResult = createMatchSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const match = await MatchesService.createMatch(validationResult.data);
    res.status(201).json(match);
  } catch (error) {
    next(error);
  }
};

/**
 * Générer automatiquement les matchs pour un événement
 */
export const generateMatchesForEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validation des données
    const validationResult = generateMatchesSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const result = await MatchesService.generateMatchesForEvent(
      validationResult.data
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour un match
 */
export const updateMatch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validation des données
    const validationResult = updateMatchSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const match = await MatchesService.updateMatch(id, validationResult.data);
    res.status(200).json(match);
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer un match
 */
export const deleteMatch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await MatchesService.deleteMatch(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer les actions d'un match
 */
export const getMatchActions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const actions = await MatchesService.getMatchActions(id);
    res.status(200).json(actions);
  } catch (error) {
    next(error);
  }
};

/**
 * Ajouter une action à un match
 */
export const addMatchAction = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validation des données
    const validationResult = matchActionSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const action = await MatchesService.addMatchAction(
      id,
      validationResult.data
    );
    res.status(201).json(action);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer les résultats d'un match
 */
export const getMatchResults = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const results = await MatchesService.getMatchResults(id);
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

/**
 * Ajouter un résultat à un match
 */
export const addMatchResult = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validation des données
    const validationResult = matchResultSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const result = await MatchesService.addMatchResult(
      id,
      validationResult.data
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Assigner des arbitres à un match
 */
export const assignReferees = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validation des données
    const validationResult = matchRefereeAssignmentSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const assignment = await MatchesService.assignReferees(
      id,
      validationResult.data
    );
    res.status(201).json(assignment);
  } catch (error) {
    next(error);
  }
};

/**
 * Assigner des équipements à un match
 */
export const assignEquipment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validation des données
    const validationResult = matchEquipmentAssignmentSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const assignment = await MatchesService.assignEquipment(
      id,
      validationResult.data
    );
    res.status(201).json(assignment);
  } catch (error) {
    next(error);
  }
};
/**
 * Récupérer un match avec sa configuration
 */
export const getMatchWithConfiguration = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const match = await MatchesService.getMatchWithConfiguration(id);

    if (!match) {
      res.status(404).json({ message: "Match non trouvé" });
      return;
    }

    res.status(200).json(match);
  } catch (error) {
    next(error);
  }
};
