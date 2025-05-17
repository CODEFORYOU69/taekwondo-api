// src/routes/match-configuration.routes.ts
import { Router } from "express";
import {
  createOrUpdateMatchConfiguration,
  deleteMatchConfiguration,
  getDefaultMatchConfiguration,
  getMatchConfiguration,
} from "../controllers/match-configuration.controller";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/match-configuration/default:
 *   get:
 *     summary: Récupérer une configuration de match par défaut
 *     tags: [MatchConfiguration]
 *     parameters:
 *       - in: query
 *         name: rules
 *         required: true
 *         schema:
 *           type: string
 *           enum: [CONVENTIONAL, BESTOF3]
 *         description: Type de règles
 *       - in: query
 *         name: division
 *         schema:
 *           type: string
 *           enum: [OLYMPIC, SENIORS, YOUTH_OLYMPIC, JUNIORS, CADETS, UNDER_21, KIDS]
 *         description: Division d'âge (optionnel)
 *     responses:
 *       200:
 *         description: Configuration par défaut
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MatchConfiguration'
 *       400:
 *         description: Paramètre manquant ou invalide
 */
router.get("/default", getDefaultMatchConfiguration);

/**
 * @swagger
 * /api/match-configuration/{matchId}:
 *   get:
 *     summary: Récupérer la configuration d'un match
 *     tags: [MatchConfiguration]
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du match
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configuration du match
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MatchConfiguration'
 *       404:
 *         description: Match ou configuration non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/:matchId", authMiddleware, getMatchConfiguration);

/**
 * @swagger
 * /api/match-configuration/{matchId}:
 *   post:
 *     summary: Créer ou mettre à jour la configuration d'un match
 *     tags: [MatchConfiguration]
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du match
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rules:
 *                 type: string
 *                 enum: [CONVENTIONAL, BESTOF3]
 *               rounds:
 *                 type: integer
 *                 minimum: 1
 *               roundTime:
 *                 type: string
 *                 example: "02:00"
 *                 pattern: ^\\d{1,2}:\\d{2}$
 *               restTime:
 *                 type: string
 *                 example: "01:00"
 *                 pattern: ^\\d{1,2}:\\d{2}$
 *               injuryTime:
 *                 type: string
 *                 example: "01:00"
 *                 pattern: ^\\d{1,2}:\\d{2}$
 *               bodyThreshold:
 *                 type: integer
 *                 minimum: 1
 *               headThreshold:
 *                 type: integer
 *                 minimum: 1
 *               homeVideoReplayQuota:
 *                 type: integer
 *                 minimum: 0
 *               awayVideoReplayQuota:
 *                 type: integer
 *                 minimum: 0
 *               goldenPointEnabled:
 *                 type: boolean
 *               goldenPointTime:
 *                 type: string
 *                 example: "01:00"
 *                 pattern: ^\\d{1,2}:\\d{2}$
 *               maxDifference:
 *                 type: integer
 *                 minimum: 1
 *               maxPenalties:
 *                 type: integer
 *                 minimum: 1
 *             required:
 *               - rules
 *               - rounds
 *               - roundTime
 *               - restTime
 *               - injuryTime
 *               - bodyThreshold
 *               - headThreshold
 *               - homeVideoReplayQuota
 *               - awayVideoReplayQuota
 *               - goldenPointEnabled
 *               - goldenPointTime
 *               - maxDifference
 *               - maxPenalties
 *     responses:
 *       200:
 *         description: Configuration créée ou mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MatchConfiguration'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Match non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.post(
  "/:matchId",
  authMiddleware,
  roleMiddleware(["super_admin", "admin", "federation"]),
  createOrUpdateMatchConfiguration
);

/**
 * @swagger
 * /api/match-configuration/{matchId}:
 *   delete:
 *     summary: Supprimer la configuration d'un match
 *     tags: [MatchConfiguration]
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du match
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Configuration supprimée
 *       404:
 *         description: Configuration non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.delete(
  "/:matchId",
  authMiddleware,
  roleMiddleware(["super_admin", "admin"]),
  deleteMatchConfiguration
);

export const matchConfigurationRoutes = router;
