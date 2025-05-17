// src/routes/sessions.routes.ts
import { Router } from "express";
import {
  getAllSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  getSessionMatches,
} from "../controllers/sessions.controller";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/sessions:
 *   get:
 *     summary: Récupérer toutes les sessions
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: competitionId
 *         schema:
 *           type: string
 *         description: Filtrer par compétition
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [SCHEDULED, GETTING_READY, RUNNING, FINISHED, DELAYED, CANCELLED, POSTPONED, RESCHEDULED, INTERRUPTED]
 *         description: Filtrer par statut
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filtrer par date de début
 *     responses:
 *       200:
 *         description: Liste des sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                   endTime:
 *                     type: string
 *                     format: date-time
 *                   scheduleStatus:
 *                     type: string
 *                   competitionId:
 *                     type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/", authMiddleware, getAllSessions);

/**
 * @swagger
 * /api/sessions:
 *   post:
 *     summary: Créer une nouvelle session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Morning Session - Day 1"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               scheduleStatus:
 *                 type: string
 *                 enum: [SCHEDULED, GETTING_READY, RUNNING, FINISHED, DELAYED, CANCELLED, POSTPONED, RESCHEDULED, INTERRUPTED]
 *                 default: SCHEDULED
 *               competitionId:
 *                 type: string
 *             required:
 *               - name
 *               - startTime
 *               - endTime
 *               - competitionId
 *     responses:
 *       201:
 *         description: Session créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                 endTime:
 *                   type: string
 *                   format: date-time
 *                 scheduleStatus:
 *                   type: string
 *                 competitionId:
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
  roleMiddleware(["super_admin", "admin", "federation"]),
  createSession
);

/**
 * @swagger
 * /api/sessions/{id}:
 *   get:
 *     summary: Récupérer une session par son ID
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la session
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Détails de la session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                 endTime:
 *                   type: string
 *                   format: date-time
 *                 scheduleStatus:
 *                   type: string
 *                 competitionId:
 *                   type: string
 *       404:
 *         description: Session non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/:id", authMiddleware, getSessionById);

/**
 * @swagger
 * /api/sessions/{id}/matches:
 *   get:
 *     summary: Récupérer les matchs d'une session
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la session
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des matchs de la session
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Match'
 *       404:
 *         description: Session non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/:id/matches", authMiddleware, getSessionMatches);

/**
 * @swagger
 * /api/sessions/{id}:
 *   put:
 *     summary: Mettre à jour une session
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la session
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               scheduleStatus:
 *                 type: string
 *                 enum: [SCHEDULED, GETTING_READY, RUNNING, FINISHED, DELAYED, CANCELLED, POSTPONED, RESCHEDULED, INTERRUPTED]
 *     responses:
 *       200:
 *         description: Session mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                 endTime:
 *                   type: string
 *                   format: date-time
 *                 scheduleStatus:
 *                   type: string
 *                 competitionId:
 *                   type: string
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Session non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["super_admin", "admin", "federation"]),
  updateSession
);

/**
 * @swagger
 * /api/sessions/{id}:
 *   delete:
 *     summary: Supprimer une session
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la session
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Session supprimée
 *       404:
 *         description: Session non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["super_admin", "admin"]),
  deleteSession
);

export const sessionsRoutes = router;
