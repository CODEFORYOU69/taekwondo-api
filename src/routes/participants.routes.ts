// src/routes/participants.routes.ts
import { Router } from "express";
import {
  createParticipant,
  deleteParticipant,
  getAllParticipants,
  getParticipantById,
  registerToEvent,
  updateParticipant,
} from "../controllers/participants.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  getParticipantWeighIns,
  addWeighIn,
} from "../controllers/weighins.controller";

const router = Router();

/**
 * @swagger
 * /api/participants:
 *   get:
 *     summary: Récupérer tous les participants
 *     tags: [Participants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [REGISTERED, WITHDRAWN, DISQUALIFIED, INJURED, NO_SHOW]
 *         description: Filtrer par statut
 *       - in: query
 *         name: organizationId
 *         schema:
 *           type: string
 *         description: Filtrer par organisation
 *     responses:
 *       200:
 *         description: Liste des participants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Participant'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/", authMiddleware, getAllParticipants);

/**
 * @swagger
 * /api/participants/{id}:
 *   get:
 *     summary: Récupérer un participant par son ID
 *     tags: [Participants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du participant
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Détails du participant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Participant'
 *       404:
 *         description: Participant non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/:id", authMiddleware, getParticipantById);

/**
 * @swagger
 * /api/participants:
 *   post:
 *     summary: Créer un nouveau participant
 *     tags: [Participants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateParticipantDto'
 *     responses:
 *       201:
 *         description: Participant créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Participant'
 *       400:
 *         description: Données invalides
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/", authMiddleware, createParticipant);

/**
 * @swagger
 * /api/participants/{id}:
 *   put:
 *     summary: Mettre à jour un participant
 *     tags: [Participants]
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
 *             $ref: '#/components/schemas/UpdateParticipantDto'
 *     responses:
 *       200:
 *         description: Participant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Participant'
 *       404:
 *         description: Participant non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.put("/:id", authMiddleware, updateParticipant);

/**
 * @swagger
 * /api/participants/{id}:
 *   delete:
 *     summary: Supprimer un participant
 *     tags: [Participants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du participant
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Participant supprimé
 *       404:
 *         description: Participant non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.delete("/:id", authMiddleware, deleteParticipant);

/**
 * @swagger
 * /api/participants/{id}/register-event:
 *   post:
 *     summary: Inscrire un participant à un événement
 *     tags: [Participants]
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
 *             type: object
 *             properties:
 *               eventId:
 *                 type: string
 *                 description: ID de l'événement
 *             required:
 *               - eventId
 *     responses:
 *       200:
 *         description: Participant inscrit à l'événement
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Competitor'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Participant ou événement non trouvé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/:id/register-event", authMiddleware, registerToEvent);

/**
 * @swagger
 * /api/participants/{id}/weigh-ins:
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
router.get("/:id/weighins", authMiddleware, getParticipantWeighIns);

/**
 * @swagger
 * /api/participants/{id}/weigh-ins:
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
 *             type: object
 *             properties:
 *               weight:
 *                 type: number
 *                 format: float
 *                 description: Poids en kg
 *               status:
 *                 type: string
 *                 enum: [NOT_ATTEMPTED, FIRST_FAILED, SECOND_FAILED, VALIDATED, SURCLASSED]
 *                 description: Statut de la pesée
 *               attemptDate:
 *                 type: string
 *                 format: date-time
 *                 description: Date et heure de la tentative de pesée
 *             required:
 *               - weight
 *               - status
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
router.post("/:id/weighins", authMiddleware, addWeighIn);

export const participantsRoutes = router;
