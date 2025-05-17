// src/services/users.service.ts
import bcrypt from "bcrypt";
import prisma from "../config/database";
import { ChangePasswordDto, CreateUserDto, UpdateUserDto } from "../dto/users";
import { TokenPayload } from "../interfaces/auth.interface";
import { ApiError } from "../interfaces/error.interface";
import { generateToken } from "../utils/jwt.utils";

export class UsersService {
  /**
   * Récupérer tous les utilisateurs avec filtres optionnels
   */
  static async getAllUsers(filters: any = {}) {
    const { role, organizationId } = filters;

    const whereClause: any = {
      isDeleted: false,
    };

    if (role) {
      whereClause.role = role;
    }

    if (organizationId) {
      whereClause.organizationId = organizationId;
    }

    return prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        role: true,
        language: true,
        organizationId: true,
        organization: {
          select: {
            id: true,
            name: true,
            country: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        email: "asc",
      },
    });
  }

  /**
   * Récupérer un utilisateur par son ID
   */
  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
        isDeleted: false,
      },
      select: {
        id: true,
        email: true,
        role: true,
        language: true,
        organizationId: true,
        organization: {
          select: {
            id: true,
            name: true,
            country: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      const error = new Error("Utilisateur non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  /**
   * Créer un nouvel utilisateur
   */
  static async createUser(data: CreateUserDto) {
    // Vérifier si l'email est déjà utilisé
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      const error = new Error("Cet email est déjà utilisé") as ApiError;
      error.statusCode = 400;
      throw error;
    }

    // Vérifier que l'organisation existe si elle est spécifiée
    if (data.organizationId) {
      const organization = await prisma.organization.findUnique({
        where: { id: data.organizationId },
      });

      if (!organization) {
        const error = new Error("Organisation non trouvée") as ApiError;
        error.statusCode = 404;
        throw error;
      }
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.role,
        language: data.language,
        organizationId: data.organizationId,
        deviceToken: data.deviceToken,
      },
      select: {
        id: true,
        email: true,
        role: true,
        language: true,
        organizationId: true,
        createdAt: true,
      },
    });

    return user;
  }

  /**
   * Mettre à jour un utilisateur
   */
  static async updateUser(id: string, data: UpdateUserDto) {
    // Vérifier si l'utilisateur existe
    await this.getUserById(id);

    // Vérifier si l'email est déjà utilisé (si on change l'email)
    if (data.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          id: { not: id },
          isDeleted: false,
        },
      });

      if (existingUser) {
        const error = new Error("Cet email est déjà utilisé") as ApiError;
        error.statusCode = 400;
        throw error;
      }
    }

    // Vérifier que l'organisation existe si elle est spécifiée
    if (data.organizationId) {
      const organization = await prisma.organization.findUnique({
        where: { id: data.organizationId },
      });

      if (!organization) {
        const error = new Error("Organisation non trouvée") as ApiError;
        error.statusCode = 404;
        throw error;
      }
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        role: true,
        language: true,
        organizationId: true,
        organization: {
          select: {
            id: true,
            name: true,
            country: true,
          },
        },
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  /**
   * Supprimer un utilisateur (softdelete)
   */
  static async deleteUser(id: string) {
    // Vérifier si l'utilisateur existe
    await this.getUserById(id);

    // Soft delete - marquer comme supprimé plutôt que de supprimer réellement
    await prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
        archivedAt: new Date(),
      },
    });

    return { success: true };
  }

  /**
   * Changer le mot de passe d'un utilisateur
   */
  static async changePassword(id: string, data: ChangePasswordDto) {
    // Récupérer l'utilisateur avec son mot de passe
    const user = await prisma.user.findUnique({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!user) {
      const error = new Error("Utilisateur non trouvé") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    // Vérifier le mot de passe actuel
    const isPasswordValid = await bcrypt.compare(
      data.currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      const error = new Error("Mot de passe actuel incorrect") as ApiError;
      error.statusCode = 400;
      throw error;
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });

    return { success: true };
  }

  /**
   * Récupérer les notifications d'un utilisateur
   */
  static async getUserNotifications(id: string, seen?: boolean) {
    // Vérifier si l'utilisateur existe
    await this.getUserById(id);

    const whereClause: any = {
      userId: id,
    };

    if (seen !== undefined) {
      whereClause.seen = seen;
    }

    return prisma.notification.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Login de l'utilisateur
   */
  static async login(email: string, password: string) {
    // Récupérer l'utilisateur par son email
    const user = await prisma.user.findFirst({
      where: {
        email,
        isDeleted: false,
      },
    });

    if (!user) {
      const error = new Error("Email ou mot de passe incorrect") as ApiError;
      error.statusCode = 401;
      throw error;
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Email ou mot de passe incorrect") as ApiError;
      error.statusCode = 401;
      throw error;
    }

    // Générer un token JWT
    const payload: TokenPayload = {
      userId: user.id,
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId || undefined,
    };

    const token = generateToken(payload);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        language: user.language,
        organizationId: user.organizationId,
      },
    };
  }
}
