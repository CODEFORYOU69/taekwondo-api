// src/routes/events.routes.ts
import { Router } from "express";
import {
  createEvent,
  getEventById,
  getAllEvents,
  updateEvent,
  deleteEvent,
  getEventCompetitors,
  getEventMatches,
  getEventMedalWinners,
} from "../controllers/events.controller";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Récupérer tous les événements
 *     tags: [Événements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: competitionId
 *         schema:
 *           type: string
 *         description: Filtrer par compétition
 *       - in: query
 *         name: discipline
 *         schema:
 *           type: string
 *           enum: [TKW_K, TKW_P, TKW_F, TKW_T, PTKW_K, PTKW_P, TKW_B]
 *         description: Filtrer par discipline
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [MALE, FEMALE, MIXED]
 *         description: Filtrer par genre
 *     responses:
 *       200:
 *         description: Liste des événements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/", authMiddleware, getAllEvents);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Créer un nouvel événement
 *     tags: [Événements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               discipline:
 *                 type: string
 *                 enum: [TKW_K, TKW_P, TKW_F, TKW_T, PTKW_K, PTKW_P, TKW_B]
 *               division:
 *                 type: string
 *                 enum: [OLYMPIC, SENIORS, YOUTH_OLYMPIC, JUNIORS, CADETS, UNDER_21, KIDS, UNDER_30, UNDER_40, UNDER_50, UNDER_60, OVER_65, OVER_30, UNDER_17, OVER_17]
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, MIXED]
 *               name:
 *                 type: string
 *                 example: "Men -68kg"
 *               abbreviation:
 *                 type: string
 *                 example: "M -68kg"
 *               weightCategory:
 *                 type: string
 *                 example: "M -68kg"
 *               sportClass:
 *                 type: string
 *                 example: "K44"
 *               category:
 *                 type: string
 *                 example: "Individual"
 *               role:
 *                 type: string
 *                 example: "ATHLETE"
 *               competitionId:
 *                 type: string
 *               competitionType:
 *                 type: string
 *                 enum: [ELIMINATION, POOL, POOL_ELIMINATION]
 *                 default: ELIMINATION
 *             required:
 *               - discipline
 *               - division
 *               - gender
 *               - name
 *               - abbreviation
 *               - competitionId
 *     responses:
 *       201:
 *         description: Événement créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
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
  createEvent
);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Récupérer un événement par son ID
 *     tags: [Événements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'événement
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Détails de l'événement
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Événement non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/:id", authMiddleware, getEventById);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Mettre à jour un événement
 *     tags: [Événements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'événement
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
 *               abbreviation:
 *                 type: string
 *               weightCategory:
 *                 type: string
 *               sportClass:
 *                 type: string
 *               category:
 *                 type: string
 *               competitionType:
 *                 type: string
 *                 enum: [ELIMINATION, POOL, POOL_ELIMINATION]
 *     responses:
 *       200:
 *         description: Événement mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Événement non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["super_admin", "admin", "federation"]),
  updateEvent
);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Supprimer un événement
 *     tags: [Événements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'événement
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Événement supprimé
 *       404:
 *         description: Événement non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["super_admin", "admin"]),
  deleteEvent
);

/**
 * @swagger
 * /api/events/{id}/competitors:
 *   get:
 *     summary: Récupérer les compétiteurs d'un événement
 *     tags: [Événements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'événement
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des compétiteurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Competitor'
 *       404:
 *         description: Événement non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/:id/competitors", authMiddleware, getEventCompetitors);

/**
 * @swagger
 * /api/events/{id}/matches:
 *   get:
 *     summary: Récupérer les matchs d'un événement
 *     tags: [Événements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'événement
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des matchs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Match'
 *       404:
 *         description: Événement non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/:id/matches", authMiddleware, getEventMatches);

/**
 * @swagger
 * /api/events/{id}/medal-winners:
 *   get:
 *     summary: Récupérer les médaillés d'un événement
 *     tags: [Événements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'événement
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des médaillés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MedalWinner'
 *       404:
 *         description: Événement non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/:id/medal-winners", authMiddleware, getEventMedalWinners);

export const eventsRoutes = router;
