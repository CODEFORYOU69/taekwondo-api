import prisma from '../config/database';
import { CreateCompetitionDto, UpdateCompetitionDto } from '../dto/competition.dto';
import { ApiError } from '../interfaces/error.interface';

export class CompetitionService {
  /**
   * Récupérer toutes les compétitions
   */
  static async getAllCompetitions() {
    return prisma.competition.findMany({
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
  }

  /**
   * Récupérer une compétition par son ID
   */
  static async getCompetitionById(id: string) {
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
      const error = new Error('Compétition non trouvée') as ApiError;
      error.statusCode = 404;
      throw error;
    }

    return competition;
  }

  /**
   * Créer une nouvelle compétition
   */
  static async createCompetition(data: CreateCompetitionDto, userId: string) {
    return prisma.competition.create({
      data: {
        name: data.name,
        hostCity: data.hostCity,
        hostCountry: data.hostCountry,
        location: data.location,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        dateFormat: data.dateFormat || 'EEE dd MMM yyyy',
        discipline: data.discipline,
        grade: data.grade,
        isWT: data.isWT || false,
        isPublic: data.isPublic !== undefined ? data.isPublic : true,
        organizer: {
          connect: { id: data.organizerId }
        },
        createdBy: {
          connect: { id: userId }
        }
      }
    });
  }

  /**
   * Mettre à jour une compétition
   */
  static async updateCompetition(id: string, data: UpdateCompetitionDto) {
    try {
      return await prisma.competition.update({
        where: { id },
        data: {
          name: data.name,
          hostCity: data.hostCity,
          hostCountry: data.hostCountry,
          location: data.location,
          startDate: data.startDate ? new Date(data.startDate) : undefined,
          endDate: data.endDate ? new Date(data.endDate) : undefined,
          dateFormat: data.dateFormat,
          discipline: data.discipline,
          grade: data.grade,
          isWT: data.isWT,
          isPublic: data.isPublic
        }
      });
    } catch (error) {
      const apiError = new Error('Erreur lors de la mise à jour de la compétition') as ApiError;
      apiError.statusCode = 400;
      throw apiError;
    }
  }

  /**
   * Supprimer une compétition
   */
  static async deleteCompetition(id: string) {
    try {
      return await prisma.competition.delete({
        where: { id }
      });
    } catch (error) {
      const apiError = new Error('Erreur lors de la suppression de la compétition') as ApiError;
      apiError.statusCode = 400;
      throw apiError;
    }
  }
}
