// src/routes/competitions.routes.ts
import { Router } from "express";
import {
  createCompetition,
  deleteCompetition,
  getAllCompetitions,
  getCompetitionById,
  updateCompetition,
} from "../controllers/competition.controller";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/competitions:
 *   get:
 *     summary: Récupérer toutes les compétitions
 *     tags: [Compétitions]
 *     parameters:
 *       - in: query
 *         name: isPublic
 *         schema:
 *           type: boolean
 *         description: Filtrer par visibilité publique
 *       - in: query
 *         name: organizerId
 *         schema:
 *           type: string
 *         description: Filtrer par organisateur
 *       - in: query
 *         name: discipline
 *         schema:
 *           type: string
 *         description: Filtrer par discipline
 *     responses:
 *       200:
 *         description: Liste des compétitions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Competition'
 */
router.get("/", getAllCompetitions);

/**
 * @swagger
 * /api/competitions/{id}:
 *   get:
 *     summary: Récupérer une compétition par son ID
 *     tags: [Compétitions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la compétition
 *     responses:
 *       200:
 *         description: Détails de la compétition
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Competition'
 *       404:
 *         description: Compétition non trouvée
 */
router.get("/:id", getCompetitionById);

/**
 * @swagger
 * /api/competitions:
 *   post:
 *     summary: Créer une nouvelle compétition
 *     tags: [Compétitions]
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
 *                 example: "Championnat de France 2024"
 *               hostCity:
 *                 type: string
 *                 example: "Paris"
 *               hostCountry:
 *                 type: string
 *                 enum: [FRA, KOR, USA, ESP, GER, ITA, GBR, TUR, BRA, CAN, MEX, JPN, CHN, IND, NED, SWE, POL, BEL, ARG, AUS]
 *                 example: "FRA"
 *               location:
 *                 type: string
 *                 example: "AccorHotels Arena"
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-07-10T09:00:00Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-07-12T18:00:00Z"
 *               dateFormat:
 *                 type: string
 *                 example: "EEE dd MMM yyyy"
 *               discipline:
 *                 type: string
 *                 example: "Taekwondo Kyorugi"
 *               grade:
 *                 type: string
 *                 example: "G1"
 *               isWT:
 *                 type: boolean
 *                 example: false
 *               isPublic:
 *                 type: boolean
 *                 example: true
 *               organizerId:
 *                 type: string
 *                 example: "clg7h9bk40002apcgf4jkld5n"
 *             required:
 *               - name
 *               - hostCity
 *               - hostCountry
 *               - location
 *               - startDate
 *               - endDate
 *               - organizerId
 *     responses:
 *       201:
 *         description: Compétition créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Competition'
 *       400:
 *         description: Données invalides
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/", authMiddleware, createCompetition);

/**
 * @swagger
 * /api/competitions/{id}:
 *   put:
 *     summary: Mettre à jour une compétition
 *     tags: [Compétitions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la compétition
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
 *               hostCity:
 *                 type: string
 *               hostCountry:
 *                 type: string
 *                 enum: [FRA, KOR, USA, ESP, GER, ITA, GBR, TUR, BRA, CAN, MEX, JPN, CHN, IND, NED, SWE, POL, BEL, ARG, AUS]
 *               location:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               dateFormat:
 *                 type: string
 *               discipline:
 *                 type: string
 *               grade:
 *                 type: string
 *               isWT:
 *                 type: boolean
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Compétition mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Competition'
 *       400:
 *         description: Données invalides
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Compétition non trouvée
 */
router.put("/:id", authMiddleware, updateCompetition);

/**
 * @swagger
 * /api/competitions/{id}:
 *   delete:
 *     summary: Supprimer une compétition
 *     tags: [Compétitions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la compétition
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Compétition supprimée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 *       404:
 *         description: Compétition non trouvée
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["super_admin", "admin"]),
  deleteCompetition
);

export const competitionRoutes = router;
