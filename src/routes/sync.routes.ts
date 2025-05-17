// src/routes/sync.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/sync/push:
 *   post:
 *     summary: Envoyer des modifications depuis le client vers le serveur
 *     description: Permet de synchroniser des données locales vers le serveur (mode offline vers online)
 *     tags: [Synchronisation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               modelName:
 *                 type: string
 *                 description: Nom du modèle à synchroniser (ex. "Competition", "Participant", etc.)
 *                 example: "Competition"
 *               changes:
 *                 type: array
 *                 description: Liste des modifications à appliquer
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Identifiant de l'enregistrement
 *                     operation:
 *                       type: string
 *                       enum: [CREATE, UPDATE, DELETE]
 *                       description: Type d'opération
 *                     data:
 *                       type: object
 *                       description: Données à synchroniser
 *             required:
 *               - modelName
 *               - changes
 *     responses:
 *       200:
 *         description: Modifications synchronisées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [SUCCESS, ERROR, CONFLICT]
 *                       message:
 *                         type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       400:
 *         description: Données invalides ou erreur de synchronisation
 */
router.post("/push", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Synchronisation Push API - À implémenter" });
});

/**
 * @swagger
 * /api/sync/pull:
 *   get:
 *     summary: Récupérer les modifications depuis le serveur
 *     description: Permet de récupérer les données modifiées sur le serveur depuis la dernière synchronisation
 *     tags: [Synchronisation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: modelName
 *         schema:
 *           type: string
 *         description: Nom du modèle à synchroniser (ex. "Competition", "Participant", etc.)
 *       - in: query
 *         name: since
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Date de dernière synchronisation (ISO 8601)
 *     responses:
 *       200:
 *         description: Modifications récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 changes:
 *                   type: array
 *                   items:
 *                     type: object
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   description: Horodatage de la synchronisation
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/pull", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Synchronisation Pull API - À implémenter" });
});

/**
 * @swagger
 * /api/sync/config:
 *   post:
 *     summary: Configurer les paramètres de synchronisation
 *     description: Permet de configurer les règles et paramètres de synchronisation pour un modèle spécifique
 *     tags: [Synchronisation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               modelName:
 *                 type: string
 *                 description: Nom du modèle à configurer
 *                 example: "Competition"
 *               enabled:
 *                 type: boolean
 *                 description: Active ou désactive la synchronisation pour ce modèle
 *                 example: true
 *               direction:
 *                 type: string
 *                 enum: [LOCAL_TO_CLOUD, CLOUD_TO_LOCAL, BIDIRECTIONAL]
 *                 description: Direction de la synchronisation
 *                 example: "BIDIRECTIONAL"
 *               conflictStrategy:
 *                 type: string
 *                 enum: [LOCAL_WINS, CLOUD_WINS, NEWEST_WINS, MANUAL]
 *                 description: Stratégie à appliquer en cas de conflit
 *                 example: "NEWEST_WINS"
 *               syncInterval:
 *                 type: integer
 *                 description: Intervalle de synchronisation en minutes (0 = manuel uniquement)
 *                 example: 15
 *             required:
 *               - modelName
 *               - enabled
 *               - direction
 *               - conflictStrategy
 *     responses:
 *       200:
 *         description: Configuration mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 config:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     modelName:
 *                       type: string
 *                     enabled:
 *                       type: boolean
 *                     direction:
 *                       type: string
 *                     conflictStrategy:
 *                       type: string
 *                     syncInterval:
 *                       type: integer
 *                     lastSyncedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.post("/config", authMiddleware, (req, res) => {
  res
    .status(200)
    .json({ message: "Configuration de synchronisation - À implémenter" });
});

export const syncRoutes = router;
