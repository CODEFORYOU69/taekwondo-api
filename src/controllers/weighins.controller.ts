// src/controllers/weighins.controller.ts
import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import prisma from "../config/database";
import { TokenPayload } from "../interfaces/auth.interface";
import { WeighInStatus } from "@prisma/client";

// Schémas de validation Zod
const createWeighInSchema = z.object({
  weight: z.number().positive(),
  status: z.nativeEnum(WeighInStatus),
  attemptDate: z.string().datetime().optional(),
  competitionId: z.string().optional(), // Champ optionnel pour le moment
  random: z.boolean().optional().default(false),
});

const updateWeighInSchema = z.object({
  weight: z.number().positive().optional(),
  status: z.nativeEnum(WeighInStatus).optional(),
  attemptDate: z.string().datetime().optional(),
  random: z.boolean().optional(),
});

// Récupérer toutes les pesées
export const getAllWeighIns = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { competitionId, status } = req.query;

    // Construction du filtre en fonction des paramètres
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (competitionId) {
      filter.competitionId = competitionId as string;
    }

    // Si l'utilisateur est d'un club ou coach, restreindre aux pesées des participants de son organisation
    if (req.user?.role === "club" || req.user?.role === "coach") {
      if (req.user.organizationId) {
        filter.participant = {
          organizationId: req.user.organizationId,
        };
      }
    }

    const weighIns = await prisma.weighIn.findMany({
      where: filter,
      include: {
        participant: {
          select: {
            id: true,
            licenseNumber: true,
            passportGivenName: true,
            passportFamilyName: true,
            printName: true,
            gender: true,
            country: true,
            status: true,
            organizationId: true,
            organization: {
              select: {
                id: true,
                name: true,
                country: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        attemptDate: "desc",
      },
    });

    res.status(200).json(weighIns);
  } catch (error) {
    next(error);
  }
};

// Récupérer une pesée par ID
export const getWeighInById = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const weighIn = await prisma.weighIn.findUnique({
      where: { id },
      include: {
        participant: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!weighIn) {
      res.status(404).json({ message: "Pesée non trouvée" });
      return;
    }

    // Vérifier les droits d'accès pour les utilisateurs non-admin
    if (req.user?.role === "club" || req.user?.role === "coach") {
      const participant = await prisma.participant.findUnique({
        where: { id: weighIn.participantId },
      });

      if (
        !participant ||
        req.user.organizationId !== participant.organizationId
      ) {
        res.status(403).json({ message: "Accès non autorisé" });
        return;
      }
    }

    res.status(200).json(weighIn);
  } catch (error) {
    next(error);
  }
};

// Mettre à jour une pesée
export const updateWeighIn = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Vérifier si la pesée existe
    const weighIn = await prisma.weighIn.findUnique({
      where: { id },
      include: {
        participant: true,
      },
    });

    if (!weighIn) {
      res.status(404).json({ message: "Pesée non trouvée" });
      return;
    }

    // Vérifier les droits d'accès
    if (req.user?.role !== "admin" && req.user?.role !== "federation") {
      if (
        req.user?.role !== "coach" ||
        req.user?.mainRole !== "WEIGH_IN_OFFICIAL"
      ) {
        res.status(403).json({ message: "Accès non autorisé" });
        return;
      }
    }

    // Validation des données
    const validationResult = updateWeighInSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const data = validationResult.data;

    // Mise à jour de la pesée
    const updatedWeighIn = await prisma.weighIn.update({
      where: { id },
      data: {
        weight: data.weight,
        status: data.status,
        attemptDate: data.attemptDate ? new Date(data.attemptDate) : undefined,
        random: data.random,
      },
      include: {
        participant: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.status(200).json(updatedWeighIn);
  } catch (error) {
    next(error);
  }
};

// Supprimer une pesée
export const deleteWeighIn = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Vérifier si la pesée existe
    const weighIn = await prisma.weighIn.findUnique({
      where: { id },
    });

    if (!weighIn) {
      res.status(404).json({ message: "Pesée non trouvée" });
      return;
    }

    // Seuls admin et federation peuvent supprimer des pesées
    if (req.user?.role !== "admin" && req.user?.role !== "federation") {
      res.status(403).json({ message: "Accès non autorisé" });
      return;
    }

    await prisma.weighIn.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Récupérer les pesées d'un participant
export const getParticipantWeighIns = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { competitionId } = req.query;

    // Vérifier si le participant existe
    const participant = await prisma.participant.findUnique({
      where: { id },
    });

    if (!participant) {
      res.status(404).json({ message: "Participant non trouvé" });
      return;
    }

    // Vérifier les droits d'accès
    if (req.user?.role === "club" || req.user?.role === "coach") {
      if (req.user.organizationId !== participant.organizationId) {
        res.status(403).json({ message: "Accès non autorisé" });
        return;
      }
    }

    // Construire le filtre
    const filter: any = { participantId: id };

    if (competitionId) {
      filter.competitionId = competitionId as string;
    }

    const weighIns = await prisma.weighIn.findMany({
      where: filter,
      orderBy: { attemptDate: "desc" },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.status(200).json(weighIns);
  } catch (error) {
    next(error);
  }
};

// Ajouter une pesée pour un participant
export const addWeighIn = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validation des données
    const validationResult = createWeighInSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const data = validationResult.data;

    // Vérifier si le participant existe
    const participant = await prisma.participant.findUnique({
      where: { id },
    });

    if (!participant) {
      res.status(404).json({ message: "Participant non trouvé" });
      return;
    }

    // Seuls admin, federation et coach avec le rôle spécial peuvent ajouter des pesées
    if (req.user?.role !== "admin" && req.user?.role !== "federation") {
      if (
        req.user?.role !== "coach" ||
        req.user?.mainRole !== "WEIGH_IN_OFFICIAL"
      ) {
        res.status(403).json({ message: "Accès non autorisé" });
        return;
      }
    }

    // Création de la pesée
    const weighInData: any = {
      participant: {
        connect: { id },
      },
      weight: data.weight,
      status: data.status,
      attemptDate: data.attemptDate ? new Date(data.attemptDate) : new Date(),
      random: data.random,
      user: req.user?.userId ? { connect: { id: req.user.userId } } : undefined,
    };

    // Si competitionId est fourni, ajouter la connexion à la compétition
    if (data.competitionId) {
      weighInData.competition = {
        connect: { id: data.competitionId },
      };
    }

    const weighIn = await prisma.weighIn.create({
      data: weighInData,
      include: {
        participant: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.status(201).json(weighIn);
  } catch (error) {
    next(error);
  }
};
