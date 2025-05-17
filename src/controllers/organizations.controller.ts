// src/controllers/organizations.controller.ts
import { NextFunction, Request, Response } from "express";
import {
  createOrganizationSchema,
  updateOrganizationSchema,
} from "../dto/organizations";
import { TokenPayload } from "../interfaces/auth.interface";
import { OrganizationsService } from "../services/organizations.service";

/**
 * Récupérer toutes les organisations
 */
export const getAllOrganizations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { country, name } = req.query;

    const filters: any = {};

    if (country) {
      filters.country = country;
    }

    if (name) {
      filters.name = name;
    }

    const organizations = await OrganizationsService.getAllOrganizations(
      filters
    );
    res.status(200).json(organizations);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer une organisation par son ID
 */
export const getOrganizationById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const organization = await OrganizationsService.getOrganizationById(id);
    res.status(200).json(organization);
  } catch (error) {
    next(error);
  }
};

/**
 * Créer une nouvelle organisation
 */
export const createOrganization = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validation des données
    const validationResult = createOrganizationSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const data = validationResult.data;
    const organization = await OrganizationsService.createOrganization(data);

    res.status(201).json(organization);
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour une organisation
 */
export const updateOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validation des données
    const validationResult = updateOrganizationSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const data = validationResult.data;
    const organization = await OrganizationsService.updateOrganization(
      id,
      data
    );

    res.status(200).json(organization);
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer une organisation
 */
export const deleteOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await OrganizationsService.deleteOrganization(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer les participants d'une organisation
 */
export const getOrganizationParticipants = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const participants = await OrganizationsService.getOrganizationParticipants(
      id
    );
    res.status(200).json(participants);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer les utilisateurs d'une organisation
 */
export const getOrganizationUsers = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Vérification supplémentaire des droits d'accès
    if (
      req.user?.role !== "super_admin" &&
      req.user?.role !== "admin" &&
      req.user?.role !== "federation"
    ) {
      if (req.user?.organizationId !== id) {
        res.status(403).json({ message: "Accès non autorisé" });
        return;
      }
    }

    const users = await OrganizationsService.getOrganizationUsers(id);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
