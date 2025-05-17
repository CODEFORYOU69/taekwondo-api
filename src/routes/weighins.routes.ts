// src/routes/weighins.routes.ts
import { Router } from "express";
import {
  addWeighIn,
  deleteWeighIn,
  getAllWeighIns,
  getParticipantWeighIns,
  getWeighInById,
  updateWeighIn,
} from "../controllers/weighins.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/weighins:
 *   get:
 *     summary: Récupérer toutes les pesées
 *     tags: [WeighIns]
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
 *           enum: [NOT_ATTEMPTED, FIRST_FAILED, SECOND_FAILED, VALIDATED, SURCLASSED]
 *         description: Filtrer par statut
 *     responses:
 *       200:
 *         description: Liste des pesées
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WeighIn'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/", authMiddleware, getAllWeighIns);

/**
 * @swagger
 * /api/weighins/{id}:
 *   get:
 *     summary: Récupérer une pesée par son ID
 *     tags: [WeighIns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la pesée
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Détails de la pesée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WeighIn'
 *       404:
 *         description: Pesée non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/:id", authMiddleware, getWeighInById);

/**
 * @swagger
 * /api/weighins/{id}:
 *   put:
 *     summary: Mettre à jour une pesée
 *     tags: [WeighIns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la pesée
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateWeighInDto'
 *     responses:
 *       200:
 *         description: Pesée mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WeighIn'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Pesée non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.put("/:id", authMiddleware, updateWeighIn);

/**
 * @swagger
 * /api/weighins/{id}:
 *   delete:
 *     summary: Supprimer une pesée
 *     tags: [WeighIns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la pesée
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Pesée supprimée
 *       404:
 *         description: Pesée non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.delete("/:id", authMiddleware, deleteWeighIn);

/**
 * @swagger
 * /api/participants/{id}/weighins:
 *   get:
 *     summary: Récupérer les pesées d'un participant
 *     tags: [Participants, WeighIns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du participant
 *       - in: query
 *         name: competitionId
 *         schema:
 *           type: string
 *         description: Filtrer par compétition
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des pesées du participant
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WeighIn'
 *       404:
 *         description: Participant non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/participant/:id", authMiddleware, getParticipantWeighIns);

/**
 * @swagger
 * /api/participants/{id}/weighins:
 *   post:
 *     summary: Ajouter une pesée pour un participant
 *     tags: [Participants, WeighIns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du participant
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWeighInDto'
 *     responses:
 *       201:
 *         description: Pesée ajoutée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WeighIn'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Participant non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/participant/:id", authMiddleware, addWeighIn);

export const weighInsRoutes = router;
