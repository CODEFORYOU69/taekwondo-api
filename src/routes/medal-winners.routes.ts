// src/routes/medal-winners.routes.ts
import { Router } from "express";
import {
  getAllMedalWinners,
  getMedalWinnerById,
  createMedalWinner,
  updateMedalWinner,
  deleteMedalWinner,
  getMedalStandingsByCompetition,
} from "../controllers/medal-winners.controller";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/medal-winners:
 *   get:
 *     summary: Récupérer tous les médaillés
 *     tags: [Médaillés]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: string
 *         description: Filtrer par événement
 *       - in: query
 *         name: medalType
 *         schema:
 *           type: string
 *           enum: [GOLD, SILVER, BRONZE]
 *         description: Filtrer par type de médaille
 *     responses:
 *       200:
 *         description: Liste des médaillés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   eventId:
 *                     type: string
 *                   competitorId:
 *                     type: string
 *                   medalType:
 *                     type: string
 *                     enum: [GOLD, SILVER, BRONZE]
 *                   position:
 *                     type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/", authMiddleware, getAllMedalWinners);

/**
 * @swagger
 * /api/medal-winners/standings/{competitionId}:
 *   get:
 *     summary: Récupérer le classement des médailles par compétition
 *     tags: [Médaillés]
 *     parameters:
 *       - in: path
 *         name: competitionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la compétition
 *     responses:
 *       200:
 *         description: Classement des médailles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   country:
 *                     type: string
 *                   gold:
 *                     type: integer
 *                   silver:
 *                     type: integer
 *                   bronze:
 *                     type: integer
 *                   total:
 *                     type: integer
 *       404:
 *         description: Compétition non trouvée
 */
router.get("/standings/:competitionId", getMedalStandingsByCompetition);

/**
 * @swagger
 * /api/medal-winners:
 *   post:
 *     summary: Créer un nouveau médaillé
 *     tags: [Médaillés]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: string
 *               competitorId:
 *                 type: string
 *               medalType:
 *                 type: string
 *                 enum: [GOLD, SILVER, BRONZE]
 *               position:
 *                 type: integer
 *             required:
 *               - eventId
 *               - competitorId
 *               - medalType
 *               - position
 *     responses:
 *       201:
 *         description: Médaillé créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 eventId:
 *                   type: string
 *                 competitorId:
 *                   type: string
 *                 medalType:
 *                   type: string
 *                 position:
 *                   type: integer
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
  createMedalWinner
);

/**
 * @swagger
 * /api/medal-winners/{id}:
 *   get:
 *     summary: Récupérer un médaillé par son ID
 *     tags: [Médaillés]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du médaillé
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Détails du médaillé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 eventId:
 *                   type: string
 *                 competitorId:
 *                   type: string
 *                 medalType:
 *                   type: string
 *                 position:
 *                   type: integer
 *       404:
 *         description: Médaillé non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/:id", authMiddleware, getMedalWinnerById);

/**
 * @swagger
 * /api/medal-winners/{id}:
 *   put:
 *     summary: Mettre à jour un médaillé
 *     tags: [Médaillés]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du médaillé
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               medalType:
 *                 type: string
 *                 enum: [GOLD, SILVER, BRONZE]
 *               position:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Médaillé mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 eventId:
 *                   type: string
 *                 competitorId:
 *                   type: string
 *                 medalType:
 *                   type: string
 *                 position:
 *                   type: integer
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Médaillé non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["super_admin", "admin", "federation"]),
  updateMedalWinner
);

/**
 * @swagger
 * /api/medal-winners/{id}:
 *   delete:
 *     summary: Supprimer un médaillé
 *     tags: [Médaillés]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du médaillé
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Médaillé supprimé
 *       404:
 *         description: Médaillé non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["super_admin", "admin", "federation"]),
  deleteMedalWinner
);

export const medalWinnersRoutes = router;
