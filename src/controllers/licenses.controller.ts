// src/controllers/licenses.controller.ts
import { NextFunction, Request, Response } from "express";
import { LicensesService } from "../services/licenses.service";
import {
  createLicenseSchema,
  updateLicenseSchema,
  verifyLicenseSchema,
} from "../dto/licenses";
import { LicenseStatus, LicenseType } from "@prisma/client";

/**
 * Récupérer toutes les licences
 */
export const getAllLicenses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { organizationId, status, type } = req.query;

    const filters: {
      organizationId?: string;
      status?: LicenseStatus;
      type?: LicenseType;
    } = {};

    if (organizationId) {
      filters.organizationId = organizationId as string;
    }

    if (
      status &&
      Object.values(LicenseStatus).includes(status as LicenseStatus)
    ) {
      filters.status = status as LicenseStatus;
    }

    if (type && Object.values(LicenseType).includes(type as LicenseType)) {
      filters.type = type as LicenseType;
    }

    const licenses = await LicensesService.getAllLicenses(filters);
    res.status(200).json(licenses);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer une licence par son ID
 */
export const getLicenseById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const license = await LicensesService.getLicenseById(id);
    res.status(200).json(license);
  } catch (error) {
    next(error);
  }
};

/**
 * Créer une nouvelle licence
 */
export const createLicense = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validation des données
    const validationResult = createLicenseSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const license = await LicensesService.createLicense(validationResult.data);
    res.status(201).json(license);
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour une licence
 */
export const updateLicense = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validation des données
    const validationResult = updateLicenseSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const license = await LicensesService.updateLicense(
      id,
      validationResult.data
    );
    res.status(200).json(license);
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer une licence
 */
export const deleteLicense = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await LicensesService.deleteLicense(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Vérifier une licence
 */
export const verifyLicense = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validation des données
    const validationResult = verifyLicenseSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const result = await LicensesService.verifyLicense(validationResult.data);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtenir les statistiques d'utilisation d'une licence
 */
export const getLicenseUsage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const usageStats = await LicensesService.getLicenseUsage(id);
    res.status(200).json(usageStats);
  } catch (error) {
    next(error);
  }
};
