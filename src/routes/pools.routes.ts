// src/routes/pools.routes.ts
import { Router } from "express";
import {
  getAllPools,
  getPoolById,
  createPool,
  updatePool,
  deletePool,
  getPoolCompetitors,
  getPoolMatches,
  getPoolStandings,
  addCompetitorToPool,
  removeCompetitorFromPool,
  generatePoolMatches,
  updatePoolStandings,
} from "../controllers/pools.controller";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/pools:
 *   get:
 *     summary: Récupérer toutes les poules
 *     tags: [Poules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: string
 *         description: Filtrer par événement
 *     responses:
 *       200:
 *         description: Liste des poules
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
 *                   name:
 *                     type: string
 *                   maxAthletes:
 *                     type: integer
 *                   matchesPerAthlete:
 *                     type: integer
 *                   pointsForWin:
 *                     type: integer
 *                   pointsForDraw:
 *                     type: integer
 *                   pointsForLoss:
 *                     type: integer
 *                   qualifyingPlaces:
 *                     type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/", authMiddleware, getAllPools);

/**
 * @swagger
 * /api/pools:
 *   post:
 *     summary: Créer une nouvelle poule
 *     tags: [Poules]
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
 *               name:
 *                 type: string
 *                 example: "Pool A"
 *               maxAthletes:
 *                 type: integer
 *                 example: 5
 *               matchesPerAthlete:
 *                 type: integer
 *                 example: 4
 *               pointsForWin:
 *                 type: integer
 *                 default: 3
 *               pointsForDraw:
 *                 type: integer
 *                 default: 1
 *               pointsForLoss:
 *                 type: integer
 *                 default: 0
 *               qualifyingPlaces:
 *                 type: integer
 *                 default: 2
 *             required:
 *               - eventId
 *               - name
 *               - maxAthletes
 *     responses:
 *       201:
 *         description: Poule créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 eventId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 maxAthletes:
 *                   type: integer
 *                 matchesPerAthlete:
 *                   type: integer
 *                 pointsForWin:
 *                   type: integer
 *                 pointsForDraw:
 *                   type: integer
 *                 pointsForLoss:
 *                   type: integer
 *                 qualifyingPlaces:
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
  createPool
);

/**
 * @swagger
 * /api/pools/{id}:
 *   get:
 *     summary: Récupérer une poule par son ID
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la poule
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Détails de la poule
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 eventId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 maxAthletes:
 *                   type: integer
 *                 matchesPerAthlete:
 *                   type: integer
 *                 pointsForWin:
 *                   type: integer
 *                 pointsForDraw:
 *                   type: integer
 *                 pointsForLoss:
 *                   type: integer
 *                 qualifyingPlaces:
 *                   type: integer
 *       404:
 *         description: Poule non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/:id", authMiddleware, getPoolById);

/**
 * @swagger
 * /api/pools/{id}/competitors:
 *   get:
 *     summary: Récupérer les compétiteurs d'une poule
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la poule
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des compétiteurs de la poule
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Competitor'
 *       404:
 *         description: Poule non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/:id/competitors", authMiddleware, getPoolCompetitors);

/**
 * @swagger
 * /api/pools/{id}/competitors:
 *   post:
 *     summary: Ajouter un compétiteur à une poule
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la poule
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
 *             required:
 *               - competitorId
 *     responses:
 *       201:
 *         description: Compétiteur ajouté à la poule
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 poolId:
 *                   type: string
 *                 competitorId:
 *                   type: string
 *       400:
 *         description: Données invalides ou poule complète
 *       404:
 *         description: Poule ou compétiteur non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.post(
  "/:id/competitors",
  authMiddleware,
  roleMiddleware(["super_admin", "admin", "federation"]),
  addCompetitorToPool
);

/**
 * @swagger
 * /api/pools/{id}/competitors/{competitorId}:
 *   delete:
 *     summary: Retirer un compétiteur d'une poule
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la poule
 *       - in: path
 *         name: competitorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du compétiteur
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Compétiteur retiré de la poule
 *       404:
 *         description: Poule ou compétiteur non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.delete(
  "/:id/competitors/:competitorId",
  authMiddleware,
  roleMiddleware(["super_admin", "admin", "federation"]),
  removeCompetitorFromPool
);

/**
 * @swagger
 * /api/pools/{id}/matches:
 *   get:
 *     summary: Récupérer les matchs d'une poule
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la poule
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des matchs de la poule
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Match'
 *       404:
 *         description: Poule non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/:id/matches", authMiddleware, getPoolMatches);

/**
 * @swagger
 * /api/pools/{id}/generate-matches:
 *   post:
 *     summary: Générer automatiquement les matchs d'une poule
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la poule
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *               mat:
 *                 type: integer
 *                 default: 1
 *             required:
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
 *         description: Données invalides ou nombre insuffisant de compétiteurs
 *       404:
 *         description: Poule non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.post(
  "/:id/generate-matches",
  authMiddleware,
  roleMiddleware(["super_admin", "admin", "federation"]),
  generatePoolMatches
);

/**
 * @swagger
 * /api/pools/{id}/standings:
 *   get:
 *     summary: Récupérer le classement d'une poule
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la poule
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Classement de la poule
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   poolId:
 *                     type: string
 *                   competitorId:
 *                     type: string
 *                   matchesPlayed:
 *                     type: integer
 *                   wins:
 *                     type: integer
 *                   draws:
 *                     type: integer
 *                   losses:
 *                     type: integer
 *                   pointsFor:
 *                     type: integer
 *                   pointsAgainst:
 *                     type: integer
 *                   pointsDifference:
 *                     type: integer
 *                   totalPoints:
 *                     type: integer
 *                   rank:
 *                     type: integer
 *                   qualified:
 *                     type: boolean
 *                   competitor:
 *                     $ref: '#/components/schemas/Competitor'
 *       404:
 *         description: Poule non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/:id/standings", authMiddleware, getPoolStandings);

/**
 * @swagger
 * /api/pools/{id}/update-standings:
 *   post:
 *     summary: Mettre à jour le classement d'une poule
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la poule
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Classement mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   poolId:
 *                     type: string
 *                   competitorId:
 *                     type: string
 *                   matchesPlayed:
 *                     type: integer
 *                   wins:
 *                     type: integer
 *                   draws:
 *                     type: integer
 *                   losses:
 *                     type: integer
 *                   pointsFor:
 *                     type: integer
 *                   pointsAgainst:
 *                     type: integer
 *                   pointsDifference:
 *                     type: integer
 *                   totalPoints:
 *                     type: integer
 *                   rank:
 *                     type: integer
 *                   qualified:
 *                     type: boolean
 *       404:
 *         description: Poule non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.post(
  "/:id/update-standings",
  authMiddleware,
  roleMiddleware(["super_admin", "admin", "federation"]),
  updatePoolStandings
);

/**
 * @swagger
 * /api/pools/{id}:
 *   put:
 *     summary: Mettre à jour une poule
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la poule
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
 *               maxAthletes:
 *                 type: integer
 *               matchesPerAthlete:
 *                 type: integer
 *               pointsForWin:
 *                 type: integer
 *               pointsForDraw:
 *                 type: integer
 *               pointsForLoss:
 *                 type: integer
 *               qualifyingPlaces:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Poule mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 eventId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 maxAthletes:
 *                   type: integer
 *                 matchesPerAthlete:
 *                   type: integer
 *                 pointsForWin:
 *                   type: integer
 *                 pointsForDraw:
 *                   type: integer
 *                 pointsForLoss:
 *                   type: integer
 *                 qualifyingPlaces:
 *                   type: integer
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Poule non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["super_admin", "admin", "federation"]),
  updatePool
);

/**
 * @swagger
 * /api/pools/{id}:
 *   delete:
 *     summary: Supprimer une poule
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la poule
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Poule supprimée
 *       404:
 *         description: Poule non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["super_admin", "admin"]),
  deletePool
);

export const poolsRoutes = router;
