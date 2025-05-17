// src/controllers/pools.controller.ts
import { NextFunction, Request, Response } from "express";
import {
  addCompetitorToPoolSchema,
  createPoolSchema,
  generatePoolMatchesSchema,
  updatePoolSchema,
} from "../dto/pools";
import { TokenPayload } from "../interfaces/auth.interface";
import { PoolsService } from "../services/pools.service";

/**
 * Récupérer toutes les poules
 */
export const getAllPools = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { eventId } = req.query;

    const filters: any = {};

    if (eventId) {
      filters.eventId = eventId;
    }

    const pools = await PoolsService.getAllPools(filters);
    res.status(200).json(pools);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer une poule par son ID
 */
export const getPoolById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const pool = await PoolsService.getPoolById(id);
    res.status(200).json(pool);
  } catch (error) {
    next(error);
  }
};

/**
 * Créer une nouvelle poule
 */
export const createPool = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validation des données
    const validationResult = createPoolSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const data = validationResult.data;
    const pool = await PoolsService.createPool(data);

    res.status(201).json(pool);
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour une poule
 */
export const updatePool = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validation des données
    const validationResult = updatePoolSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const data = validationResult.data;
    const pool = await PoolsService.updatePool(id, data);

    res.status(200).json(pool);
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer une poule
 */
export const deletePool = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await PoolsService.deletePool(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer les compétiteurs d'une poule
 */
export const getPoolCompetitors = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const competitors = await PoolsService.getPoolCompetitors(id);
    res.status(200).json(competitors);
  } catch (error) {
    next(error);
  }
};

/**
 * Ajouter un compétiteur à une poule
 */
export const addCompetitorToPool = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validation des données
    const validationResult = addCompetitorToPoolSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const data = validationResult.data;
    const result = await PoolsService.addCompetitorToPool(id, data);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Retirer un compétiteur d'une poule
 */
export const removeCompetitorFromPool = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, competitorId } = req.params;
    await PoolsService.removeCompetitorFromPool(id, competitorId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer les matchs d'une poule
 */
export const getPoolMatches = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const matches = await PoolsService.getPoolMatches(id);
    res.status(200).json(matches);
  } catch (error) {
    next(error);
  }
};

/**
 * Générer automatiquement les matchs d'une poule
 */
export const generatePoolMatches = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validation des données
    const validationResult = generatePoolMatchesSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const data = validationResult.data;
    const result = await PoolsService.generatePoolMatches(id, data);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer le classement d'une poule
 */
export const getPoolStandings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const standings = await PoolsService.getPoolStandings(id);
    res.status(200).json(standings);
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour le classement d'une poule
 */
export const updatePoolStandings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const standings = await PoolsService.updatePoolStandings(id);
    res.status(200).json(standings);
  } catch (error) {
    next(error);
  }
};
