// src/controllers/events.controller.ts
import { NextFunction, Request, Response } from "express";
import {
  createEventSchema,
  eventPoolConfigSchema,
  updateEventSchema,
} from "../dto/events";
import { TokenPayload } from "../interfaces/auth.interface";
import { EventsService } from "../services/events.service";

/**
 * Récupérer tous les événements
 */
export const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { competitionId, discipline, gender, division } = req.query;

    const filters = {
      competitionId: competitionId as string,
      discipline: discipline as string,
      gender: gender as string,
      division: division as string,
    };

    const events = await EventsService.getAllEvents(filters);
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer un événement par son ID
 */
export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const event = await EventsService.getEventById(id);
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

/**
 * Créer un nouvel événement
 */
export const createEvent = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validation des données
    const validationResult = createEventSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const event = await EventsService.createEvent(validationResult.data);
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour un événement
 */
export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validation des données
    const validationResult = updateEventSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const event = await EventsService.updateEvent(id, validationResult.data);
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer un événement
 */
export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await EventsService.deleteEvent(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer les compétiteurs d'un événement
 */
export const getEventCompetitors = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const competitors = await EventsService.getEventCompetitors(id);
    res.status(200).json(competitors);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer les matchs d'un événement
 */
export const getEventMatches = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const matches = await EventsService.getEventMatches(id);
    res.status(200).json(matches);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer les médaillés d'un événement
 */
export const getEventMedalWinners = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const medalWinners = await EventsService.getEventMedalWinners(id);
    res.status(200).json(medalWinners);
  } catch (error) {
    next(error);
  }
};

/**
 * Configurer les paramètres de poule pour un événement
 */
export const configureEventPools = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validation des données
    const validationResult = eventPoolConfigSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const config = await EventsService.configureEventPools(
      id,
      validationResult.data
    );
    res.status(200).json(config);
  } catch (error) {
    next(error);
  }
};
