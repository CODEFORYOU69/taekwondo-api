// src/services/licenses.service.ts
import { LicenseStatus, LicenseType } from "@prisma/client";
import { randomUUID } from "crypto";
import prisma from "../config/database";
import {
  CreateLicenseDto,
  LicenseVerificationResult,
  UpdateLicenseDto,
  UsageStatsDto,
  VerifyLicenseDto,
} from "../dto/licenses";
import { ApiError } from "../interfaces/error.interface";

export class LicensesService {
  /**
   * Récupérer toutes les licences avec filtrage
   */
  static async getAllLicenses(
    filters: {
      organizationId?: string;
      status?: LicenseStatus;
      type?: LicenseType;
    } = {}
  ) {
    const where: any = {};

    if (filters.organizationId) {
      where.organizationId = filters.organizationId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    return prisma.license.findMany({
      where,
      include: {
        organization: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Récupérer une licence par son ID
   */
  static async getLicenseById(id: string) {
    const license = await prisma.license.findUnique({
      where: { id },
      include: {
        organization: true,
      },
    });

    if (!license) {
      const error = new Error("Licence non trouvée") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    return license;
  }

  /**
   * Créer une nouvelle licence
   */
  static async createLicense(data: CreateLicenseDto): Promise<any> {
    try {
      // Vérifier si l'organisation existe
      const organization = await prisma.organization.findUnique({
        where: { id: data.organizationId },
      });

      if (!organization) {
        const error = new Error("Organisation non trouvée") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Générer une clé de licence unique
      const key = `${data.type.substring(0, 3)}-${
        randomUUID().split("-")[0]
      }-${Date.now().toString(36)}`.toUpperCase();

      // Créer la licence
      const license = await prisma.license.create({
        data: {
          key,
          type: data.type,
          status: LicenseStatus.ACTIVE,
          machineId: data.machineId || "",
          activatedAt: null,
          expiresAt: new Date(data.expiresAt),
          lastVerifiedAt: null,
          maxEvents: data.maxEvents,
          maxParticipants: data.maxParticipants,
          maxUsers: data.maxUsers,
          features: data.features || {},
          organizationId: data.organizationId,
        },
        include: {
          organization: true,
        },
      });

      // Créer une entrée dans le journal d'utilisation
      await prisma.usageLog.create({
        data: {
          licenseId: license.id,
          action: "LICENSE_CREATED",
          details: {
            type: license.type,
            expiresAt: license.expiresAt,
          },
        },
      });

      return license;
    } catch (error) {
      if (!(error as ApiError).statusCode) {
        const apiError = new Error(
          "Erreur lors de la création de la licence"
        ) as ApiError;
        apiError.statusCode = 400;
        throw apiError;
      }
      throw error;
    }
  }

  /**
   * Mettre à jour une licence
   */
  static async updateLicense(id: string, data: UpdateLicenseDto) {
    try {
      // Vérifier si la licence existe
      const existingLicense = await prisma.license.findUnique({
        where: { id },
      });

      if (!existingLicense) {
        const error = new Error("Licence non trouvée") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Mise à jour de la licence
      const license = await prisma.license.update({
        where: { id },
        data: {
          status: data.status,
          maxEvents: data.maxEvents,
          maxParticipants: data.maxParticipants,
          maxUsers: data.maxUsers,
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
          features: data.features !== undefined ? data.features : undefined,
        },
        include: {
          organization: true,
        },
      });

      // Créer une entrée dans le journal d'utilisation
      await prisma.usageLog.create({
        data: {
          licenseId: license.id,
          action: "LICENSE_UPDATED",
          details: {
            status: data.status,
            expiresAt: data.expiresAt,
          },
        },
      });

      return license;
    } catch (error) {
      if (!(error as ApiError).statusCode) {
        const apiError = new Error(
          "Erreur lors de la mise à jour de la licence"
        ) as ApiError;
        apiError.statusCode = 400;
        throw apiError;
      }
      throw error;
    }
  }

  /**
   * Supprimer une licence
   */
  static async deleteLicense(id: string) {
    try {
      // Vérifier si la licence existe
      const license = await prisma.license.findUnique({
        where: { id },
      });

      if (!license) {
        const error = new Error("Licence non trouvée") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Vérifier si la licence est utilisée par des événements
      const eventsCount = await prisma.event.count({
        where: { licenseId: id },
      });

      if (eventsCount > 0) {
        const error = new Error(
          "Impossible de supprimer une licence utilisée par des événements"
        ) as ApiError;
        error.statusCode = 400;
        throw error;
      }

      // Supprimer les journaux d'utilisation
      await prisma.usageLog.deleteMany({
        where: { licenseId: id },
      });

      // Supprimer les abonnements liés
      await prisma.subscription.deleteMany({
        where: { licenseId: id },
      });

      // Supprimer la licence
      await prisma.license.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      if (!(error as ApiError).statusCode) {
        const apiError = new Error(
          "Erreur lors de la suppression de la licence"
        ) as ApiError;
        apiError.statusCode = 400;
        throw apiError;
      }
      throw error;
    }
  }

  /**
   * Vérifier une licence
   */
  static async verifyLicense(
    data: VerifyLicenseDto
  ): Promise<LicenseVerificationResult> {
    try {
      // Rechercher la licence par sa clé
      const license = await prisma.license.findUnique({
        where: { key: data.key },
      });

      if (!license) {
        return {
          valid: false,
          message: "Licence invalide ou inexistante",
        };
      }

      const now = new Date();

      // Vérifier si la licence est expirée
      if (license.expiresAt && license.expiresAt < now) {
        return {
          valid: false,
          message: "Licence expirée",
          license: {
            type: license.type,
            status: license.status,
            expiresAt: license.expiresAt,
            maxEvents: license.maxEvents,
            maxParticipants: license.maxParticipants,
            maxUsers: license.maxUsers,
            features: license.features as Record<string, any>,
          },
        };
      }

      // Vérifier si la licence est suspendue ou annulée
      if (
        license.status === LicenseStatus.SUSPENDED ||
        license.status === LicenseStatus.CANCELLED
      ) {
        return {
          valid: false,
          message: `Licence ${
            license.status === LicenseStatus.SUSPENDED ? "suspendue" : "annulée"
          }`,
          license: {
            type: license.type,
            status: license.status,
            expiresAt: license.expiresAt,
            maxEvents: license.maxEvents,
            maxParticipants: license.maxParticipants,
            maxUsers: license.maxUsers,
            features: license.features as Record<string, any>,
          },
        };
      }

      // Vérification de la machine (pour les licences déjà activées)
      if (license.activatedAt) {
        if (license.machineId !== data.machineId) {
          return {
            valid: false,
            message: "Cette licence est déjà activée sur une autre machine",
            license: {
              type: license.type,
              status: license.status,
              expiresAt: license.expiresAt,
              maxEvents: license.maxEvents,
              maxParticipants: license.maxParticipants,
              maxUsers: license.maxUsers,
              features: license.features as Record<string, any>,
            },
          };
        }
      } else {
        // Première activation de la licence
        await prisma.license.update({
          where: { id: license.id },
          data: {
            activatedAt: now,
            machineId: data.machineId,
          },
        });
      }

      // Mettre à jour la date de dernière vérification
      await prisma.license.update({
        where: { id: license.id },
        data: {
          lastVerifiedAt: now,
        },
      });

      // Créer une entrée dans le journal d'utilisation
      await prisma.usageLog.create({
        data: {
          licenseId: license.id,
          action: "LICENSE_VERIFIED",
          details: {
            machineId: data.machineId,
            timestamp: now,
          },
        },
      });

      return {
        valid: true,
        license: {
          type: license.type,
          status: license.status,
          expiresAt: license.expiresAt,
          maxEvents: license.maxEvents,
          maxParticipants: license.maxParticipants,
          maxUsers: license.maxUsers,
          features: license.features as Record<string, any>,
        },
      };
    } catch (error) {
      console.error("Erreur lors de la vérification de la licence:", error);
      return {
        valid: false,
        message: "Erreur interne lors de la vérification de la licence",
      };
    }
  }

  /**
   * Obtenir les statistiques d'utilisation d'une licence
   */
  static async getLicenseUsage(id: string): Promise<UsageStatsDto> {
    try {
      // Vérifier si la licence existe
      const license = await prisma.license.findUnique({
        where: { id },
        include: {
          organization: true,
        },
      });

      if (!license) {
        const error = new Error("Licence non trouvée") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Calculer l'utilisation des événements
      const eventsCount = await prisma.event.count({
        where: { licenseId: id },
      });

      // Calculer l'utilisation des participants
      const participantsCount = await prisma.participant.count({
        where: { organizationId: license.organizationId },
      });

      // Calculer l'utilisation des utilisateurs
      const usersCount = await prisma.user.count({
        where: { organizationId: license.organizationId },
      });

      // Récupérer l'historique d'activité (les 30 derniers jours)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const usageLogs = await prisma.usageLog.findMany({
        where: {
          licenseId: id,
          createdAt: { gte: thirtyDaysAgo },
        },
        orderBy: { createdAt: "asc" },
      });

      // Regrouper les logs par jour
      const activityByDay = new Map<string, number>();

      usageLogs.forEach((log) => {
        const dateStr = log.createdAt.toISOString().split("T")[0];
        activityByDay.set(dateStr, (activityByDay.get(dateStr) || 0) + 1);
      });

      // Construire le tableau d'activité
      const activity = Array.from(activityByDay.entries()).map(
        ([date, actions]) => ({
          date,
          actions,
        })
      );

      return {
        events: {
          used: eventsCount,
          max: license.maxEvents,
          percentage: Math.round((eventsCount / license.maxEvents) * 100),
        },
        participants: {
          used: participantsCount,
          max: license.maxParticipants,
          percentage: Math.round(
            (participantsCount / license.maxParticipants) * 100
          ),
        },
        users: {
          used: usersCount,
          max: license.maxUsers,
          percentage: Math.round((usersCount / license.maxUsers) * 100),
        },
        activity,
      };
    } catch (error) {
      if (!(error as ApiError).statusCode) {
        const apiError = new Error(
          "Erreur lors de la récupération des statistiques d'utilisation"
        ) as ApiError;
        apiError.statusCode = 400;
        throw apiError;
      }
      throw error;
    }
  }
}
