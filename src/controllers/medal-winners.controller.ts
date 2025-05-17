// src/controllers/medal-winners.controller.ts
import { MedalType } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import {
  createMedalWinnerSchema,
  updateMedalWinnerSchema,
} from "../dto/medal-winners";
import { MedalWinnersService } from "../services/medal-winners.service";

/**
 * Récupérer tous les médaillés
 */
export const getAllMedalWinners = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { eventId, medalType } = req.query;

    const filters: {
      eventId?: string;
      medalType?: MedalType;
    } = {};

    if (eventId) {
      filters.eventId = eventId as string;
    }

    if (
      medalType &&
      Object.values(MedalType).includes(medalType as MedalType)
    ) {
      filters.medalType = medalType as MedalType;
    }

    const medalWinners = await MedalWinnersService.getAllMedalWinners(filters);
    res.status(200).json(medalWinners);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer un médaillé par son ID
 */
export const getMedalWinnerById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const medalWinner = await MedalWinnersService.getMedalWinnerById(id);
    res.status(200).json(medalWinner);
  } catch (error) {
    next(error);
  }
};

/**
 * Créer un nouveau médaillé
 */
export const createMedalWinner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validation des données
    const validationResult = createMedalWinnerSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const medalWinner = await MedalWinnersService.createMedalWinner(
      validationResult.data
    );
    res.status(201).json(medalWinner);
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour un médaillé
 */
export const updateMedalWinner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validation des données
    const validationResult = updateMedalWinnerSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const medalWinner = await MedalWinnersService.updateMedalWinner(
      id,
      validationResult.data
    );
    res.status(200).json(medalWinner);
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer un médaillé
 */
export const deleteMedalWinner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await MedalWinnersService.deleteMedalWinner(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer le classement des médailles par compétition
 */
export const getMedalStandingsByCompetition = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { competitionId } = req.params;
    const standings = await MedalWinnersService.getMedalStandingsByCompetition(
      competitionId
    );
    res.status(200).json(standings);
  } catch (error) {
    next(error);
  }
};
