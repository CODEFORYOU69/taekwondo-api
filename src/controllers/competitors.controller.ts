// src/controllers/competitors.controller.ts
import { NextFunction, Request, Response } from "express";
import { CompetitorsService } from "../services/competitors.service";
import { updateCompetitorSchema } from "../dto/competitors";
import { TokenPayload } from "../interfaces/auth.interface";

/**
 * Récupérer tous les compétiteurs
 */
export const getAllCompetitors = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { eventId, organizationId, country } = req.query;

    const filters = {
      eventId: eventId as string,
      organizationId: organizationId as string,
      country: country as string,
    };

    const competitors = await CompetitorsService.getAllCompetitors(filters);
    res.status(200).json(competitors);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer un compétiteur par son ID
 */
export const getCompetitorById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const competitor = await CompetitorsService.getCompetitorById(id);
    res.status(200).json(competitor);
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour un compétiteur
 */
export const updateCompetitor = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validation des données
    const validationResult = updateCompetitorSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const competitor = await CompetitorsService.updateCompetitor(
      id,
      validationResult.data
    );
    res.status(200).json(competitor);
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer un compétiteur
 */
export const deleteCompetitor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await CompetitorsService.deleteCompetitor(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer les matchs d'un compétiteur
 */
export const getCompetitorMatches = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const matches = await CompetitorsService.getCompetitorMatches(id);
    res.status(200).json(matches);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer les participants d'un compétiteur (pour les équipes)
 */
export const getCompetitorParticipants = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const participants = await CompetitorsService.getCompetitorParticipants(id);
    res.status(200).json(participants);
  } catch (error) {
    next(error);
  }
};
