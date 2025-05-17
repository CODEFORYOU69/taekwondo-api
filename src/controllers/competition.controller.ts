import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { CreateCompetitionDto, UpdateCompetitionDto } from '../dto/competition.dto';
import { TokenPayload } from '../interfaces/auth.interface';

// Récupérer toutes les compétitions
export const getAllCompetitions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const competitions = await prisma.competition.findMany({
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            country: true
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });
    
    res.status(200).json(competitions);
  } catch (error) {
    next(error);
  }
};

// Récupérer une compétition par son ID
export const getCompetitionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    const competition = await prisma.competition.findUnique({
      where: { id },
      include: {
        organizer: true,
        events: {
          include: {
            competitors: true
          }
        },
        sessions: true
      }
    });
    
    if (!competition) {
      res.status(404).json({ message: 'Compétition non trouvée' });
      return;
    }
    
    res.status(200).json(competition);
  } catch (error) {
    next(error);
  }
};

// Créer une nouvelle compétition
export const createCompetition = async (req: Request & { user?: TokenPayload }, res: Response, next: NextFunction): Promise<void> => {
  try {
    const competitionData: CreateCompetitionDto = req.body;
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({ message: 'Non authentifié' });
      return;
    }
    
    const competition = await prisma.competition.create({
      data: {
        name: competitionData.name,
        hostCity: competitionData.hostCity,
        hostCountry: competitionData.hostCountry,
        location: competitionData.location,
        startDate: new Date(competitionData.startDate),
        endDate: new Date(competitionData.endDate),
        dateFormat: competitionData.dateFormat || 'EEE dd MMM yyyy',
        discipline: competitionData.discipline,
        grade: competitionData.grade,
        isWT: competitionData.isWT || false,
        isPublic: competitionData.isPublic !== undefined ? competitionData.isPublic : true,
        organizer: {
          connect: { id: competitionData.organizerId }
        },
        createdBy: {
          connect: { id: userId }
        }
      }
    });
    
    res.status(201).json(competition);
  } catch (error) {
    next(error);
  }
};

// Mettre à jour une compétition
export const updateCompetition = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const competitionData: UpdateCompetitionDto = req.body;
    
    const updatedCompetition = await prisma.competition.update({
      where: { id },
      data: {
        name: competitionData.name,
        hostCity: competitionData.hostCity,
        hostCountry: competitionData.hostCountry,
        location: competitionData.location,
        startDate: competitionData.startDate ? new Date(competitionData.startDate) : undefined,
        endDate: competitionData.endDate ? new Date(competitionData.endDate) : undefined,
        dateFormat: competitionData.dateFormat,
        discipline: competitionData.discipline,
        grade: competitionData.grade,
        isWT: competitionData.isWT,
        isPublic: competitionData.isPublic
      }
    });
    
    res.status(200).json(updatedCompetition);
  } catch (error) {
    next(error);
  }
};

// Supprimer une compétition
export const deleteCompetition = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    await prisma.competition.delete({
      where: { id }
    });
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
