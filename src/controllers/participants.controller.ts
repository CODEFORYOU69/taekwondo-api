// src/controllers/participants.controller.ts
import {
  CountryCode,
  Gender,
  ParticipantSource,
  ParticipantStatus,
  WeighInStatus,
} from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import prisma from "../config/database";
import { TokenPayload } from "../interfaces/auth.interface";

// Schémas de validation Zod
const createParticipantSchema = z.object({
  licenseNumber: z.string().min(3).max(20),
  passportGivenName: z.string().min(2).max(50),
  passportFamilyName: z.string().min(2).max(50),
  preferredGivenName: z.string().min(2).max(50),
  preferredFamilyName: z.string().min(2).max(50),
  gender: z.nativeEnum(Gender),
  birthDate: z.string().refine(
    (date) => {
      // Validation de la date de naissance (âge minimum, format, etc.)
      const birthDate = new Date(date);
      return !isNaN(birthDate.getTime());
    },
    { message: "Format de date invalide" }
  ),
  mainRole: z.string(),
  country: z.nativeEnum(CountryCode),
  organizationId: z.string(),
  galNumber: z.string().optional(),
  source: z.nativeEnum(ParticipantSource).optional(),
  status: z.nativeEnum(ParticipantStatus).optional(),
});

const updateParticipantSchema = z.object({
  licenseNumber: z.string().min(3).max(20).optional(),
  passportGivenName: z.string().min(2).max(50).optional(),
  passportFamilyName: z.string().min(2).max(50).optional(),
  preferredGivenName: z.string().min(2).max(50).optional(),
  preferredFamilyName: z.string().min(2).max(50).optional(),
  gender: z.nativeEnum(Gender).optional(),
  birthDate: z.string().optional(),
  mainRole: z.string().optional(),
  country: z.nativeEnum(CountryCode).optional(),
  organizationId: z.string().optional(),
  galNumber: z.string().optional(),
  status: z.nativeEnum(ParticipantStatus).optional(),
});

const registerToEventSchema = z.object({
  eventId: z.string(),
});

const weighInSchema = z.object({
  weight: z.number().positive(),
  status: z.nativeEnum(WeighInStatus),
  attemptDate: z.string().datetime().optional(),
});

// Récupérer tous les participants
export const getAllParticipants = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, organizationId } = req.query;

    // Construction du filtre en fonction des paramètres
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (organizationId) {
      filter.organizationId = organizationId as string;
    }

    // Si l'utilisateur est d'un club ou coach, restreindre aux participants de son organisation
    if (req.user?.role === "club" || req.user?.role === "coach") {
      if (req.user.organizationId) {
        filter.organizationId = req.user.organizationId;
      }
    }

    const participants = await prisma.participant.findMany({
      where: filter,
      include: {
        organization: true,
        competitors: {
          include: {
            event: true,
          },
        },
      },
    });

    res.status(200).json(participants);
  } catch (error) {
    next(error);
  }
};

// Récupérer un participant par ID
export const getParticipantById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const participant = await prisma.participant.findUnique({
      where: { id },
      include: {
        organization: true,
        competitors: {
          include: {
            event: true,
          },
        },
        weighIns: {
          orderBy: {
            attemptDate: "desc",
          },
        },
      },
    });

    if (!participant) {
      res.status(404).json({ message: "Participant non trouvé" });
      return;
    }

    // Vérifier si l'utilisateur a le droit d'accéder à ce participant
    if (req.user?.role === "club" || req.user?.role === "coach") {
      if (req.user.organizationId !== participant.organizationId) {
        res.status(403).json({ message: "Accès non autorisé" });
        return;
      }
    }

    res.status(200).json(participant);
  } catch (error) {
    next(error);
  }
};

// Créer un nouveau participant
export const createParticipant = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validation des données
    const validationResult = createParticipantSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const data = validationResult.data;

    // Vérifier si le numéro de licence existe déjà
    const existingParticipant = await prisma.participant.findUnique({
      where: { licenseNumber: data.licenseNumber },
    });

    if (existingParticipant) {
      res
        .status(400)
        .json({ message: "Ce numéro de licence est déjà utilisé" });
      return;
    }

    // Si l'utilisateur est club ou coach, forcer l'organizationId
    if (
      (req.user?.role === "club" || req.user?.role === "coach") &&
      req.user?.organizationId
    ) {
      data.organizationId = req.user.organizationId;
    }

    // Format standard WT pour les noms
    const participant = await prisma.participant.create({
      data: {
        licenseNumber: data.licenseNumber,
        passportGivenName: data.passportGivenName,
        passportFamilyName: data.passportFamilyName.toUpperCase(), // Standard WT: nom de famille en MAJUSCULES
        preferredGivenName: data.preferredGivenName,
        preferredFamilyName: data.preferredFamilyName,
        // Format standard WT pour les différentes variantes de noms
        printName: `${data.passportFamilyName.toUpperCase()} ${
          data.passportGivenName
        }`,
        printInitialName: `${data.passportFamilyName.toUpperCase()} ${data.passportGivenName.charAt(
          0
        )}.`,
        tvName: `${
          data.passportGivenName
        } ${data.passportFamilyName.toUpperCase()}`,
        tvInitialName: `${data.passportGivenName.charAt(
          0
        )}. ${data.passportFamilyName.toUpperCase()}`,
        scoreboardName: `${data.passportFamilyName.toUpperCase()} ${data.passportGivenName.charAt(
          0
        )}.`,
        gender: data.gender,
        birthDate: new Date(data.birthDate),
        mainRole: data.mainRole,
        country: data.country,
        galNumber: data.galNumber,
        source: data.source || "INTERNAL",
        status: data.status || "REGISTERED",
        organization: {
          connect: { id: data.organizationId },
        },
      },
    });

    res.status(201).json(participant);
  } catch (error) {
    next(error);
  }
};

// Mettre à jour un participant
export const updateParticipant = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Vérifier si le participant existe
    const existingParticipant = await prisma.participant.findUnique({
      where: { id },
    });

    if (!existingParticipant) {
      res.status(404).json({ message: "Participant non trouvé" });
      return;
    }

    // Vérifier les droits d'accès
    if (req.user?.role === "club" || req.user?.role === "coach") {
      if (req.user.organizationId !== existingParticipant.organizationId) {
        res.status(403).json({ message: "Accès non autorisé" });
        return;
      }
    }

    // Validation des données
    const validationResult = updateParticipantSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const data = validationResult.data;

    // Si l'utilisateur essaie de changer l'organisation et qu'il n'est pas admin ou federation
    if (
      data.organizationId &&
      data.organizationId !== existingParticipant.organizationId &&
      req.user?.role !== "admin" &&
      req.user?.role !== "federation"
    ) {
      res
        .status(403)
        .json({ message: "Non autorisé à changer l'organisation" });
      return;
    }

    // Préparer les données de mise à jour
    const updateData: any = { ...data };

    // Mise à jour des formats de nom si les noms ont changé
    if (data.passportFamilyName || data.passportGivenName) {
      const familyName =
        data.passportFamilyName?.toUpperCase() ||
        existingParticipant.passportFamilyName;
      const givenName =
        data.passportGivenName || existingParticipant.passportGivenName;

      updateData.printName = `${familyName} ${givenName}`;
      updateData.printInitialName = `${familyName} ${givenName.charAt(0)}.`;
      updateData.tvName = `${givenName} ${familyName}`;
      updateData.tvInitialName = `${givenName.charAt(0)}. ${familyName}`;
      updateData.scoreboardName = `${familyName} ${givenName.charAt(0)}.`;
    }

    // Si on a un nouveau numéro de licence, vérifier qu'il n'existe pas déjà
    if (
      data.licenseNumber &&
      data.licenseNumber !== existingParticipant.licenseNumber
    ) {
      const licenseExists = await prisma.participant.findUnique({
        where: { licenseNumber: data.licenseNumber },
      });

      if (licenseExists) {
        res
          .status(400)
          .json({ message: "Ce numéro de licence est déjà utilisé" });
        return;
      }
    }

    // Convertir birthDate en Date si défini
    if (data.birthDate) {
      updateData.birthDate = new Date(data.birthDate);
    }

    const updatedParticipant = await prisma.participant.update({
      where: { id },
      data: updateData,
      include: {
        organization: true,
        competitors: true,
      },
    });

    res.status(200).json(updatedParticipant);
  } catch (error) {
    next(error);
  }
};

// Supprimer un participant
export const deleteParticipant = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Vérifier si le participant existe
    const participant = await prisma.participant.findUnique({
      where: { id },
      include: {
        competitors: true,
      },
    });

    if (!participant) {
      res.status(404).json({ message: "Participant non trouvé" });
      return;
    }

    // Vérifier les droits d'accès (seuls admin et federation peuvent supprimer)
    if (req.user?.role !== "admin" && req.user?.role !== "federation") {
      res.status(403).json({ message: "Accès non autorisé" });
      return;
    }

    // Si le participant a des compétiteurs, vérifier d'abord s'il peut être supprimé
    if (participant.competitors.length > 0) {
      // Vérifier si des matchs sont associés à ces compétiteurs
      const competitorIds = participant.competitors.map((c) => c.id);

      const matchesCount = await prisma.match.count({
        where: {
          OR: [
            { homeCompetitorId: { in: competitorIds } },
            { awayCompetitorId: { in: competitorIds } },
          ],
        },
      });

      if (matchesCount > 0) {
        res.status(400).json({
          message:
            "Impossible de supprimer le participant : des matchs sont associés",
        });
        return;
      }
    }

    // Transaction pour supprimer le participant et ses relations
    await prisma.$transaction([
      // Supprimer d'abord les WeighIns
      prisma.weighIn.deleteMany({
        where: { participantId: id },
      }),

      // Supprimer les compétiteurs
      ...participant.competitors.map((competitor) =>
        prisma.competitor.delete({
          where: { id: competitor.id },
        })
      ),

      // Enfin, supprimer le participant
      prisma.participant.delete({
        where: { id },
      }),
    ]);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Inscrire un participant à un événement
export const registerToEvent = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validation des données
    const validationResult = registerToEventSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Données invalides",
        errors: validationResult.error.errors,
      });
      return;
    }

    const { eventId } = validationResult.data;

    // Vérifier si le participant existe
    const participant = await prisma.participant.findUnique({
      where: { id },
      include: {
        competitors: true,
      },
    });

    if (!participant) {
      res.status(404).json({ message: "Participant non trouvé" });
      return;
    }

    // Vérifier si l'événement existe
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      res.status(404).json({ message: "Événement non trouvé" });
      return;
    }

    // Vérifier les droits d'accès
    if (req.user?.role === "club" || req.user?.role === "coach") {
      if (req.user.organizationId !== participant.organizationId) {
        res.status(403).json({ message: "Accès non autorisé" });
        return;
      }
    }

    // Vérifier si le participant est déjà inscrit à cet événement
    const existingCompetitor = participant.competitors.find(
      (c) => c.eventId === eventId
    );

    if (existingCompetitor) {
      res
        .status(400)
        .json({ message: "Ce participant est déjà inscrit à cet événement" });
      return;
    }

    // Créer un competitor pour ce participant dans cet événement
    const competitor = await prisma.competitor.create({
      data: {
        competitorType: "A", // Athlète individuel
        printName: participant.printName,
        printInitialName: participant.printInitialName,
        tvName: participant.tvName,
        tvInitialName: participant.tvInitialName,
        scoreboardName: participant.scoreboardName,
        country: participant.country,
        event: {
          connect: { id: eventId },
        },
        organization: {
          connect: { id: participant.organizationId },
        },
        participants: {
          connect: { id: participant.id },
        },
      },
      include: {
        event: true,
        organization: true,
      },
    });

    res.status(200).json(competitor);
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

    const weighIns = await prisma.weighIn.findMany({
      where: { participantId: id },
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

    // Mise à jour du schéma Zod pour inclure competitionId si nécessaire
    const weighInSchema = z.object({
      weight: z.number().positive(),
      status: z.nativeEnum(WeighInStatus),
      attemptDate: z.string().datetime().optional(),
      competitionId: z.string(), // Ajout du champ competitionId obligatoire
      random: z.boolean().optional().default(false),
    });

    // Validation des données
    const validationResult = weighInSchema.safeParse(req.body);

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

    // Vérifier si la compétition existe
    const competition = await prisma.competition.findUnique({
      where: { id: data.competitionId },
    });

    if (!competition) {
      res.status(404).json({ message: "Compétition non trouvée" });
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

    // Création de la pesée avec la relation à la compétition
    const weighIn = await prisma.weighIn.create({
      data: {
        participant: {
          connect: { id },
        },
        competition: {
          // Ajouter la relation avec la compétition
          connect: { id: data.competitionId },
        },
        weight: data.weight,
        status: data.status,
        attemptDate: data.attemptDate ? new Date(data.attemptDate) : new Date(),
        random: data.random || false,
        user: req.user?.userId
          ? { connect: { id: req.user.userId } }
          : undefined,
      },
      include: {
        participant: true,
        competition: true, // Inclure les données de la compétition dans la réponse
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
