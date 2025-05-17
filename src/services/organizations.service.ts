// src/services/organizations.service.ts
import prisma from "../config/database";
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from "../dto/organizations";
import { ApiError } from "../interfaces/error.interface";

export class OrganizationsService {
  /**
   * Récupérer toutes les organisations avec filtres optionnels
   */
  static async getAllOrganizations(filters: any = {}) {
    const { country, name } = filters;

    const whereClause: any = {};

    if (country) {
      whereClause.country = country;
    }

    if (name) {
      whereClause.name = {
        contains: name,
        mode: "insensitive",
      };
    }

    return prisma.organization.findMany({
      where: whereClause,
      orderBy: {
        name: "asc",
      },
    });
  }

  /**
   * Récupérer une organisation par son ID
   */
  static async getOrganizationById(id: string) {
    const organization = await prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      const error = new Error("Organisation non trouvée") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    return organization;
  }

  /**
   * Créer une nouvelle organisation
   */
  static async createOrganization(data: CreateOrganizationDto) {
    return prisma.organization.create({
      data,
    });
  }

  /**
   * Mettre à jour une organisation
   */
  static async updateOrganization(id: string, data: UpdateOrganizationDto) {
    try {
      // Vérifier si l'organisation existe
      await this.getOrganizationById(id);

      return prisma.organization.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof Error && (error as ApiError).statusCode === 404) {
        throw error;
      }

      const apiError = new Error(
        "Erreur lors de la mise à jour de l'organisation"
      ) as ApiError;
      apiError.statusCode = 500;
      throw apiError;
    }
  }

  /**
   * Supprimer une organisation
   */
  static async deleteOrganization(id: string) {
    try {
      // Vérifier si l'organisation existe
      await this.getOrganizationById(id);

      // Vérifier les relations (pour éviter les erreurs de contrainte)
      const participantsCount = await prisma.participant.count({
        where: { organizationId: id },
      });

      if (participantsCount > 0) {
        const error = new Error(
          "Impossible de supprimer l'organisation car elle contient des participants"
        ) as ApiError;
        error.statusCode = 400;
        throw error;
      }

      const usersCount = await prisma.user.count({
        where: { organizationId: id },
      });

      if (usersCount > 0) {
        const error = new Error(
          "Impossible de supprimer l'organisation car elle contient des utilisateurs"
        ) as ApiError;
        error.statusCode = 400;
        throw error;
      }

      const competitionsCount = await prisma.competition.count({
        where: { organizerId: id },
      });

      if (competitionsCount > 0) {
        const error = new Error(
          "Impossible de supprimer l'organisation car elle est liée à des compétitions"
        ) as ApiError;
        error.statusCode = 400;
        throw error;
      }

      return prisma.organization.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Error && (error as ApiError).statusCode) {
        throw error;
      }

      const apiError = new Error(
        "Erreur lors de la suppression de l'organisation"
      ) as ApiError;
      apiError.statusCode = 500;
      throw apiError;
    }
  }

  /**
   * Récupérer les participants d'une organisation
   */
  static async getOrganizationParticipants(id: string) {
    // Vérifier si l'organisation existe
    await this.getOrganizationById(id);

    return prisma.participant.findMany({
      where: { organizationId: id },
      include: {
        competitors: true,
      },
      orderBy: {
        passportFamilyName: "asc",
      },
    });
  }

  /**
   * Récupérer les utilisateurs d'une organisation
   */
  static async getOrganizationUsers(id: string) {
    // Vérifier si l'organisation existe
    await this.getOrganizationById(id);

    return prisma.user.findMany({
      where: {
        organizationId: id,
        isDeleted: false,
      },
      select: {
        id: true,
        email: true,
        role: true,
        language: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
