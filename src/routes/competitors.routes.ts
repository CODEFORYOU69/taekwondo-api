// src/routes/competitors.routes.ts
import { Router } from "express";
import {
  getAllCompetitors,
  getCompetitorById,
  updateCompetitor,
  deleteCompetitor,
  getCompetitorMatches,
  getCompetitorParticipants,
} from "../controllers/competitors.controller";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/competitors:
 *   get:
 *     summary: Récupérer tous les compétiteurs
 *     tags: [Compétiteurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: string
 *         description: Filtrer par événement
 *       - in: query
 *         name: organizationId
 *         schema:
 *           type: string
 *         description: Filtrer par organisation
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *           enum: [FRA, KOR, USA, ESP, GER, ITA, GBR, TUR, BRA, CAN, MEX, JPN, CHN, IND, NED, SWE, POL, BEL, ARG, AUS]
 *         description: Filtrer par pays
 *     responses:
 *       200:
 *         description: Liste des compétiteurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Competitor'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/", authMiddleware, getAllCompetitors);

/**
 * @swagger
 * /api/competitors/{id}:
 *   get:
 *     summary: Récupérer un compétiteur par son ID
 *     tags: [Compétiteurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du compétiteur
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Détails du compétiteur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Competitor'
 *       404:
 *         description: Compétiteur non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/:id", authMiddleware, getCompetitorById);

/**
 * @swagger
 * /api/competitors/{id}/matches:
 *   get:
 *     summary: Récupérer les matchs d'un compétiteur
 *     tags: [Compétiteurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du compétiteur
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des matchs du compétiteur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Match'
 *       404:
 *         description: Compétiteur non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/:id/matches", authMiddleware, getCompetitorMatches);

/**
 * @swagger
 * /api/competitors/{id}/participants:
 *   get:
 *     summary: Récupérer les participants d'un compétiteur (pour les équipes)
 *     tags: [Compétiteurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du compétiteur
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des participants du compétiteur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Participant'
 *       404:
 *         description: Compétiteur non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/:id/participants", authMiddleware, getCompetitorParticipants);

/**
 * @swagger
 * /api/competitors/{id}:
 *   put:
 *     summary: Mettre à jour un compétiteur
 *     tags: [Compétiteurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du compétiteur
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               printName:
 *                 type: string
 *               printInitialName:
 *                 type: string
 *               tvName:
 *                 type: string
 *               tvInitialName:
 *                 type: string
 *               scoreboardName:
 *                 type: string
 *               rank:
 *                 type: integer
 *               seed:
 *                 type: integer
 *               country:
 *                 type: string
 *                 enum: [FRA, KOR, USA, ESP, GER, ITA, GBR, TUR, BRA, CAN, MEX, JPN, CHN, IND, NED, SWE, POL, BEL, ARG, AUS]
 *     responses:
 *       200:
 *         description: Compétiteur mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Competitor'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Compétiteur non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["super_admin", "admin", "federation"]),
  updateCompetitor
);

/**
 * @swagger
 * /api/competitors/{id}:
 *   delete:
 *     summary: Supprimer un compétiteur
 *     tags: [Compétiteurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du compétiteur
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Compétiteur supprimé
 *       404:
 *         description: Compétiteur non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["super_admin", "admin", "federation"]),
  deleteCompetitor
);

export const competitorsRoutes = router;
