// src/controllers/match-configuration.controller.ts
import { NextFunction, Request, Response } from "express";
import { MatchConfigurationService } from "../services/match-configuration.service";
import { matchConfigurationSchema } from "../dto/matches";

/**
 * Récupérer la configuration d'un match
 */
export const getMatchConfiguration = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { matchId } = req.params;
    const configuration =
      await MatchConfigurationService.getConfigurationByMatchId(matchId);
    res.status(200).json(configuration);
  } catch (error) {
    next(error);
  }
};

/**
 * Créer ou mettre à jour la configuration d'un match
 */
export const createOrUpdateMatchConfiguration = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { matchId } = req.params;

    // Validation des données
    const validationResult = matchConfigurationSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const configuration =
      await MatchConfigurationService.createOrUpdateConfiguration(
        matchId,
        validationResult.data
      );
    res.status(200).json(configuration);
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer la configuration d'un match
 */
export const deleteMatchConfiguration = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { matchId } = req.params;
    await MatchConfigurationService.deleteConfiguration(matchId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer la configuration par défaut pour un type de règles et une division
 */
export const getDefaultMatchConfiguration = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { rules, division } = req.query;

    if (!rules || typeof rules !== "string") {
      res.status(400).json({
        message: "Le paramètre 'rules' est obligatoire",
      });
      return;
    }

    const configuration = MatchConfigurationService.getDefaultConfiguration(
      rules,
      division as string | undefined
    );
    res.status(200).json(configuration);
  } catch (error) {
    next(error);
  }
};
