import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/database";
import { config } from "../config/env";
import { CreateUserDto, LoginDto } from "../dto/user.dto";
import { TokenPayload } from "../interfaces/auth.interface";

// Inscription d'un nouvel utilisateur
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userData: CreateUserDto = req.body;

    // Vérifier si l'email est déjà utilisé
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      res.status(400).json({ message: "Cet email est déjà utilisé" });
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        role: userData.role || "club",
        language: userData.language || "fr",
        organizationId: userData.organizationId,
      },
    });

    // Générer le token JWT
    // @ts-ignore - Ignorer l'erreur de typage pour jwt.sign
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    // Retourner les informations de l'utilisateur (sans le mot de passe) et le token
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Connexion d'un utilisateur
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const loginData: LoginDto = req.body;

    // Rechercher l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email: loginData.email },
    });

    // @ts-ignore - Ignorer l'erreur isDeleted si la propriété n'existe pas encore dans le modèle
    if (!user || user.isDeleted) {
      res.status(401).json({ message: "Email ou mot de passe incorrect" });
      return;
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password
    );

    if (!isPasswordValid) {
      res.status(401).json({ message: "Email ou mot de passe incorrect" });
      return;
    }

    // Générer le token JWT
    // @ts-ignore - Ignorer l'erreur de typage pour jwt.sign
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    // Retourner les informations de l'utilisateur (sans le mot de passe) et le token
    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Récupérer les informations de l'utilisateur connecté
export const me = async (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Non authentifié" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
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
      },
    });

    // @ts-ignore - Ignorer l'erreur isDeleted si la propriété n'existe pas encore dans le modèle
    if (!user || user.isDeleted) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
