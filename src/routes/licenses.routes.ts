// src/routes/licenses.routes.ts
import { Router } from "express";
import {
  createLicense,
  deleteLicense,
  getAllLicenses,
  getLicenseById,
  getLicenseUsage,
  updateLicense,
  verifyLicense,
} from "../controllers/licenses.controller";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/licenses:
 *   get:
 *     summary: Récupérer toutes les licences
 *     tags: [Licences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: organizationId
 *         schema:
 *           type: string
 *         description: Filtrer par organisation
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, EXPIRED, SUSPENDED, CANCELLED]
 *         description: Filtrer par statut
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [ENTERPRISE, PROFESSIONAL, CLUB, PARTNER]
 *         description: Filtrer par type
 *     responses:
 *       200:
 *         description: Liste des licences
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   key:
 *                     type: string
 *                   type:
 *                     type: string
 *                   status:
 *                     type: string
 *                   activatedAt:
 *                     type: string
 *                     format: date-time
 *                   expiresAt:
 *                     type: string
 *                     format: date-time
 *                   organizationId:
 *                     type: string
 *                   maxEvents:
 *                     type: integer
 *                   maxParticipants:
 *                     type: integer
 *                   maxUsers:
 *                     type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["super_admin", "admin"]),
  getAllLicenses
);

/**
 * @swagger
 * /api/licenses/verify:
 *   post:
 *     summary: Vérifier une licence
 *     tags: [Licences]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *               machineId:
 *                 type: string
 *             required:
 *               - key
 *               - machineId
 *     responses:
 *       200:
 *         description: Licence vérifiée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                 license:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                     status:
 *                       type: string
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                     maxEvents:
 *                       type: integer
 *                     maxParticipants:
 *                       type: integer
 *                     maxUsers:
 *                       type: integer
 *                     features:
 *                       type: object
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Licence non trouvée
 */
router.post("/verify", verifyLicense);

/**
 * @swagger
 * /api/licenses:
 *   post:
 *     summary: Créer une nouvelle licence
 *     tags: [Licences]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [ENTERPRISE, PROFESSIONAL, CLUB, PARTNER]
 *               organizationId:
 *                 type: string
 *               maxEvents:
 *                 type: integer
 *                 default: 1
 *               maxParticipants:
 *                 type: integer
 *                 default: 100
 *               maxUsers:
 *                 type: integer
 *                 default: 5
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *               features:
 *                 type: object
 *             required:
 *               - type
 *               - organizationId
 *               - expiresAt
 *     responses:
 *       201:
 *         description: Licence créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 key:
 *                   type: string
 *                 type:
 *                   type: string
 *                 status:
 *                   type: string
 *                 organizationId:
 *                   type: string
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
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
  roleMiddleware(["super_admin"]),
  createLicense
);

/**
 * @swagger
 * /api/licenses/{id}:
 *   get:
 *     summary: Récupérer une licence par son ID
 *     tags: [Licences]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la licence
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Détails de la licence
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 key:
 *                   type: string
 *                 type:
 *                   type: string
 *                 status:
 *                   type: string
 *                 activatedAt:
 *                   type: string
 *                   format: date-time
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 *                 organizationId:
 *                   type: string
 *                 maxEvents:
 *                   type: integer
 *                 maxParticipants:
 *                   type: integer
 *                 maxUsers:
 *                   type: integer
 *                 features:
 *                   type: object
 *       404:
 *         description: Licence non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["super_admin", "admin"]),
  getLicenseById
);

/**
 * @swagger
 * /api/licenses/{id}/usage:
 *   get:
 *     summary: Obtenir les statistiques d'utilisation d'une licence
 *     tags: [Licences]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la licence
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques d'utilisation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: object
 *                   properties:
 *                     used:
 *                       type: integer
 *                     max:
 *                       type: integer
 *                     percentage:
 *                       type: number
 *                 participants:
 *                   type: object
 *                   properties:
 *                     used:
 *                       type: integer
 *                     max:
 *                       type: integer
 *                     percentage:
 *                       type: number
 *                 users:
 *                   type: object
 *                   properties:
 *                     used:
 *                       type: integer
 *                     max:
 *                       type: integer
 *                     percentage:
 *                       type: number
 *                 activity:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       actions:
 *                         type: integer
 *       404:
 *         description: Licence non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.get(
  "/:id/usage",
  authMiddleware,
  roleMiddleware(["super_admin", "admin"]),
  getLicenseUsage
);

/**
 * @swagger
 * /api/licenses/{id}:
 *   put:
 *     summary: Mettre à jour une licence
 *     tags: [Licences]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la licence
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
 *                 enum: [ACTIVE, EXPIRED, SUSPENDED, CANCELLED]
 *               maxEvents:
 *                 type: integer
 *               maxParticipants:
 *                 type: integer
 *               maxUsers:
 *                 type: integer
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *               features:
 *                 type: object
 *     responses:
 *       200:
 *         description: Licence mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 key:
 *                   type: string
 *                 type:
 *                   type: string
 *                 status:
 *                   type: string
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Licence non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["super_admin"]),
  updateLicense
);

/**
 * @swagger
 * /api/licenses/{id}:
 *   delete:
 *     summary: Supprimer une licence
 *     tags: [Licences]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["super_admin"]),
  deleteLicense
);

export const licensesRoutes = router;
