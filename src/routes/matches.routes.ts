// src/routes/matches.routes.ts
import { Router } from "express";
import {
  addMatchAction,
  addMatchResult,
  assignEquipment,
  assignReferees,
  createMatch,
  deleteMatch,
  generateMatchesForEvent,
  getAllMatches,
  getMatchActions,
  getMatchById,
  getMatchResults,
  getMatchWithConfiguration,
  updateMatch,
} from "../controllers/matches.controller";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/matches:
 *   get:
 *     summary: Récupérer tous les matchs
 *     tags: [Matchs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: string
 *         description: Filtrer par événement
 *       - in: query
 *         name: mat
 *         schema:
 *           type: integer
 *         description: Filtrer par tapis
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [SCHEDULED, GETTING_READY, RUNNING, FINISHED, DELAYED, CANCELLED, POSTPONED, RESCHEDULED, INTERRUPTED]
 *         description: Filtrer par statut
 *       - in: query
 *         name: phase
 *         schema:
 *           type: string
 *           enum: [F, SF, QF, R16, R32, R64, R128, BMC, GMC, RP]
 *         description: Filtrer par phase
 *       - in: query
 *         name: competitorId
 *         schema:
 *           type: string
 *         description: Filtrer par ID de compétiteur
 *     responses:
 *       200:
 *         description: Liste des matchs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Match'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/", authMiddleware, getAllMatches);

/**
 * @swagger
 * /api/matches:
 *   post:
 *     summary: Créer un nouveau match
 *     tags: [Matchs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mat:
 *                 type: integer
 *                 example: 1
 *               number:
 *                 type: string
 *                 example: "101"
 *               phase:
 *                 type: string
 *                 enum: [F, SF, QF, R16, R32, R64, R128, BMC, GMC, RP]
 *               positionReference:
 *                 type: string
 *                 example: "R32-1"
 *               scheduleStatus:
 *                 type: string
 *                 enum: [SCHEDULED, GETTING_READY, RUNNING, FINISHED, DELAYED, CANCELLED, POSTPONED, RESCHEDULED, INTERRUPTED]
 *                 default: SCHEDULED
 *               scheduledStart:
 *                 type: string
 *                 format: date-time
 *               eventId:
 *                 type: string
 *               sessionId:
 *                 type: string
 *               homeCompetitorId:
 *                 type: string
 *               awayCompetitorId:
 *                 type: string
 *             required:
 *               - mat
 *               - number
 *               - phase
 *               - eventId
 *               - sessionId
 *               - homeCompetitorId
 *               - awayCompetitorId
 *     responses:
 *       201:
 *         description: Match créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
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
  createMatch
);

/**
 * @swagger
 * /api/matches/generate:
 *   post:
 *     summary: Générer les matchs pour un événement
 *     tags: [Matchs]
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
 *                 description: ID de l'événement
 *               sessionId:
 *                 type: string
 *                 description: ID de la session
 *               mat:
 *                 type: integer
 *                 description: Numéro du tapis
 *                 default: 1
 *             required:
 *               - eventId
 *               - sessionId
 *     responses:
 *       201:
 *         description: Matchs générés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 matches:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Match'
 *       400:
 *         description: Données invalides
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.post(
  "/generate",
  authMiddleware,
  roleMiddleware(["super_admin", "admin", "federation"]),
  generateMatchesForEvent
);

/**
 * @swagger
 * /api/matches/{id}:
 *   get:
 *     summary: Récupérer un match par son ID
 *     tags: [Matchs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du match
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Détails du match
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 *       404:
 *         description: Match non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/:id", authMiddleware, getMatchById);

/**
 * @swagger
 * /api/matches/{id}:
 *   put:
 *     summary: Mettre à jour un match
 *     tags: [Matchs]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               mat:
 *                 type: integer
 *               number:
 *                 type: string
 *               scheduleStatus:
 *                 type: string
 *                 enum: [SCHEDULED, GETTING_READY, RUNNING, FINISHED, DELAYED, CANCELLED, POSTPONED, RESCHEDULED, INTERRUPTED]
 *               scheduledStart:
 *                 type: string
 *                 format: date-time
 *               sessionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Match mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Match non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["super_admin", "admin", "federation"]),
  updateMatch
);

/**
 * @swagger
 * /api/matches/{id}:
 *   delete:
 *     summary: Supprimer un match
 *     tags: [Matchs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du match
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Match supprimé
 *       404:
 *         description: Match non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["super_admin", "admin"]),
  deleteMatch
);

/**
 * @swagger
 * /api/matches/{id}/actions:
 *   get:
 *     summary: Récupérer les actions d'un match
 *     tags: [Matchs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du match
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des actions du match
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MatchAction'
 *       404:
 *         description: Match non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/:id/actions", authMiddleware, getMatchActions);

/**
 * @swagger
 * /api/matches/{id}/actions:
 *   post:
 *     summary: Ajouter une action à un match
 *     tags: [Matchs]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               action:
 *                 type: string
 *                 enum: [MATCH_LOADED, MATCH_START, ROUND_START, MATCH_TIME, MATCH_TIMEOUT, MATCH_RESUME, ROUND_END, MATCH_END, SCORE_HOME_PUNCH, SCORE_HOME_KICK, SCORE_HOME_TKICK, SCORE_HOME_SKICK, SCORE_HOME_HEAD, SCORE_HOME_THEAD, PENALTY_HOME, SCORE_AWAY_PUNCH, SCORE_AWAY_KICK, SCORE_AWAY_TKICK, SCORE_AWAY_SKICK, SCORE_AWAY_HEAD, SCORE_AWAY_THEAD, PENALTY_AWAY, INVALIDATE_SCORE, INVALIDATE_SCORE_HOME_PUNCH, INVALIDATE_SCORE_HOME_KICK, INVALIDATE_SCORE_HOME_TKICK, INVALIDATE_SCORE_HOME_SKICK, INVALIDATE_SCORE_HOME_HEAD, INVALIDATE_SCORE_HOME_THEAD, INVALIDATE_PENALTY_HOME, INVALIDATE_SCORE_AWAY_PUNCH, INVALIDATE_SCORE_AWAY_KICK, INVALIDATE_SCORE_AWAY_TKICK, INVALIDATE_SCORE_AWAY_SKICK, INVALIDATE_SCORE_AWAY_HEAD, INVALIDATE_SCORE_AWAY_THEAD, INVALIDATE_PENALTY_AWAY, ADJUST_SCORE, ADJUST_PENALTY, VR_HOME_REQUEST, VR_HOME_ACCEPTED, VR_HOME_REJECTED, VR_AWAY_REQUEST, VR_AWAY_ACCEPTED, VR_AWAY_REJECTED]
 *               hitlevel:
 *                 type: integer
 *               round:
 *                 type: integer
 *               roundTime:
 *                 type: string
 *                 example: "01:45"
 *               position:
 *                 type: integer
 *               homeScore:
 *                 type: integer
 *               awayScore:
 *                 type: integer
 *               homePenalties:
 *                 type: integer
 *               awayPenalties:
 *                 type: integer
 *               description:
 *                 type: string
 *               source:
 *                 type: string
 *                 enum: [HOME, AWAY, CR]
 *             required:
 *               - action
 *               - round
 *     responses:
 *       201:
 *         description: Action ajoutée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MatchAction'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Match non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/:id/actions", authMiddleware, addMatchAction);

/**
 * @swagger
 * /api/matches/{id}/results:
 *   get:
 *     summary: Récupérer les résultats d'un match
 *     tags: [Matchs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du match
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des résultats du match
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MatchResult'
 *       404:
 *         description: Match non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/:id/results", authMiddleware, getMatchResults);

/**
 * @swagger
 * /api/matches/{id}/results:
 *   post:
 *     summary: Ajouter un résultat à un match
 *     tags: [Matchs]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               status:
 *                 type: string
 *                 enum: [INTERMEDIATE, UNCONFIRMED, UNOFFICIAL, OFFICIAL, PROTESTED]
 *               round:
 *                 type: integer
 *               position:
 *                 type: integer
 *               decision:
 *                 type: string
 *                 enum: [PTF, PTG, GDP, RSC, SUP, WDR, DSQ, PUN, DQB]
 *               homeType:
 *                 type: string
 *                 enum: [WIN, LOSS, TIE]
 *               awayType:
 *                 type: string
 *                 enum: [WIN, LOSS, TIE]
 *               homeScore:
 *                 type: integer
 *               awayScore:
 *                 type: integer
 *               homePenalties:
 *                 type: integer
 *               awayPenalties:
 *                 type: integer
 *               description:
 *                 type: string
 *             required:
 *               - status
 *               - position
 *               - homeScore
 *               - awayScore
 *               - homePenalties
 *               - awayPenalties
 *     responses:
 *       201:
 *         description: Résultat ajouté
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MatchResult'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Match non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/:id/results", authMiddleware, addMatchResult);

/**
 * @swagger
 * /api/matches/{id}/assign-referees:
 *   post:
 *     summary: Assigner des arbitres à un match
 *     tags: [Matchs]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               refJ1Id:
 *                 type: string
 *               refJ2Id:
 *                 type: string
 *               refJ3Id:
 *                 type: string
 *               refCRId:
 *                 type: string
 *               refRJId:
 *                 type: string
 *               refTAId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Arbitres assignés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MatchRefereeAssignment'
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
  "/:id/assign-referees",
  authMiddleware,
  roleMiddleware(["super_admin", "admin", "federation"]),
  assignReferees
);

/**
 * @swagger
 * /api/matches/{id}/assign-equipment:
 *   post:
 *     summary: Assigner des équipements à un match
 *     tags: [Matchs]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               competitorId:
 *                 type: string
 *               chestSensorId:
 *                 type: string
 *               headSensorId:
 *                 type: string
 *               deviceType:
 *                 type: string
 *                 enum: [KPNP, DAEDO]
 *             required:
 *               - competitorId
 *               - chestSensorId
 *               - headSensorId
 *     responses:
 *       201:
 *         description: Équipement assigné avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 matchId:
 *                   type: string
 *                 competitorId:
 *                   type: string
 *                 chestSensorId:
 *                   type: string
 *                 headSensorId:
 *                   type: string
 *                 deviceType:
 *                   type: string
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Match ou compétiteur non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post(
  "/:id/assign-equipment",
  authMiddleware,
  roleMiddleware(["super_admin", "admin", "federation", "coach"]),
  assignEquipment
);

/**
 * @swagger
 * /api/matches/{id}/with-configuration:
 *   get:
 *     summary: Récupérer un match avec sa configuration complète
 *     tags: [Matchs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du match
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Détails du match avec sa configuration
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Match'
 *                 - type: object
 *                   properties:
 *                     matchConfiguration:
 *                       $ref: '#/components/schemas/MatchConfiguration'
 *       404:
 *         description: Match non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  "/:id/with-configuration",
  authMiddleware,
  getMatchWithConfiguration
);

export const matchesRoutes = router;
