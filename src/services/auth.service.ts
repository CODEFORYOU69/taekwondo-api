import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { config } from '../config/env';
import { CreateUserDto, LoginDto } from '../dto/user.dto';
import { ApiError } from '../interfaces/error.interface';

export class AuthService {
  /**
   * Créer un nouvel utilisateur
   */
  static async createUser(userData: CreateUserDto) {
    const existingUser = await prisma.user.findUnique({ 
      where: { email: userData.email } 
    });

    if (existingUser) {
      const error = new Error('Cet email est déjà utilisé') as ApiError;
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        role: userData.role || 'club',
        firstName: userData.firstName,
        lastName: userData.lastName,
        language: userData.language || 'fr',
        organizationId: userData.organizationId
      },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        language: true,
        organizationId: true
      }
    });
  }

  /**
   * Authentifier un utilisateur et générer un token JWT
   */
  static async login(loginData: LoginDto) {
    const user = await prisma.user.findUnique({
      where: { email: loginData.email }
    });

    if (!user || user.isDeleted) {
      const error = new Error('Email ou mot de passe incorrect') as ApiError;
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    
    if (!isPasswordValid) {
      const error = new Error('Email ou mot de passe incorrect') as ApiError;
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        language: user.language
      }
    };
  }

  /**
   * Récupérer les informations d'un utilisateur par son ID
   */
  static async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        language: true,
        organizationId: true,
        organization: {
          select: {
            id: true,
            name: true,
            country: true
          }
        }
      }
    });

    if (!user || user.isDeleted) {
      const error = new Error('Utilisateur non trouvé') as ApiError;
      error.statusCode = 404;
      throw error;
    }

    return user;
  }
}
