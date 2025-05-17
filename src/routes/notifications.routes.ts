// src/routes/notifications.routes.ts
import { Router } from "express";
import {
  createNotification,
  deleteNotification,
  getAllNotifications,
  getNotificationById,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../controllers/notifications.controller";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Récupérer les notifications de l'utilisateur connecté
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: seen
 *         schema:
 *           type: boolean
 *         description: Filtrer par notifications lues/non lues
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [FIGHT_SOON, FIGHT_RESULT, RANDOM_WEIGHTIN, INFO]
 *         description: Filtrer par type de notification
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
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/", authMiddleware, getAllNotifications);

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Créer une nouvelle notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [FIGHT_SOON, FIGHT_RESULT, RANDOM_WEIGHTIN, INFO]
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *             required:
 *               - userId
 *               - type
 *               - title
 *               - body
 *     responses:
 *       201:
 *         description: Notification créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 type:
 *                   type: string
 *                 title:
 *                   type: string
 *                 body:
 *                   type: string
 *                 seen:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
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
  roleMiddleware(["super_admin", "admin", "federation"]),
  createNotification
);

/**
 * @swagger
 * /api/notifications/mark-all-read:
 *   post:
 *     summary: Marquer toutes les notifications comme lues
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Toutes les notifications marquées comme lues
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/mark-all-read", authMiddleware, markAllNotificationsAsRead);

/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     summary: Récupérer une notification par son ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la notification
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Détails de la notification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 type:
 *                   type: string
 *                 title:
 *                   type: string
 *                 body:
 *                   type: string
 *                 seen:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Notification non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.get("/:id", authMiddleware, getNotificationById);

/**
 * @swagger
 * /api/notifications/{id}/mark-read:
 *   post:
 *     summary: Marquer une notification comme lue
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la notification
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification marquée comme lue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 type:
 *                   type: string
 *                 title:
 *                   type: string
 *                 body:
 *                   type: string
 *                 seen:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Notification non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/:id/mark-read", authMiddleware, markNotificationAsRead);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Supprimer une notification
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la notification
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Notification supprimée
 *       404:
 *         description: Notification non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.delete("/:id", authMiddleware, deleteNotification);

export const notificationsRoutes = router;
