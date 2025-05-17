// src/routes/users.routes.ts
import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserNotifications,
  createUser,
} from "../controllers/users.controller";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [super_admin, admin, federation, club, coach, spectator]
 *         description: Filtrer par rôle
 *       - in: query
 *         name: organizationId
 *         schema:
 *           type: string
 *         description: Filtrer par organisation
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["super_admin", "admin", "federation"]),
  getAllUsers
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Créer un nouvel utilisateur (administratif)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *                 enum: [super_admin, admin, federation, club, coach, spectator]
 *               language:
 *                 type: string
 *                 default: "fr"
 *               organizationId:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *               - role
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Données invalides
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["super_admin", "admin"]),
  createUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par son ID
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["super_admin", "admin", "federation"]),
  getUserById
);

/**
 * @swagger
 * /api/users/{id}/notifications:
 *   get:
 *     summary: Récupérer les notifications d'un utilisateur
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   type:
 *                     type: string
 *                     enum: [FIGHT_SOON, FIGHT_RESULT, RANDOM_WEIGHTIN, INFO]
 *                   title:
 *                     type: string
 *                   body:
 *                     type: string
 *                   seen:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Utilisateur non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.get("/:id/notifications", authMiddleware, getUserNotifications);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [super_admin, admin, federation, club, coach, spectator]
 *               language:
 *                 type: string
 *               organizationId:
 *                 type: string
 *               deviceToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Utilisateur non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["super_admin", "admin"]),
  updateUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["super_admin"]),
  deleteUser
);

export const usersRoutes = router;
