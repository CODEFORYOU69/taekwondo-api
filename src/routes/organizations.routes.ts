// src/routes/organizations.routes.ts
import { Router } from "express";
import {
  createOrganization,
  deleteOrganization,
  getAllOrganizations,
  getOrganizationById,
  getOrganizationParticipants,
  getOrganizationUsers,
  updateOrganization,
} from "../controllers/organizations.controller";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/organizations:
 *   get:
 *     summary: Récupérer toutes les organisations
 *     tags: [Organisations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *           enum: [FRA, KOR, USA, ESP, GER, ITA, GBR, TUR, BRA, CAN, MEX, JPN, CHN, IND, NED, SWE, POL, BEL, ARG, AUS]
 *         description: Filtrer par pays
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Rechercher par nom
 *     responses:
 *       200:
 *         description: Liste des organisations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   country:
 *                     type: string
 *                   billingEmail:
 *                     type: string
 *                   billingAddress:
 *                     type: string
 *                   vatNumber:
 *                     type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/", authMiddleware, getAllOrganizations);

/**
 * @swagger
 * /api/organizations:
 *   post:
 *     summary: Créer une nouvelle organisation
 *     tags: [Organisations]
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
 *                 example: "French Taekwondo Federation"
 *               country:
 *                 type: string
 *                 enum: [FRA, KOR, USA, ESP, GER, ITA, GBR, TUR, BRA, CAN, MEX, JPN, CHN, IND, NED, SWE, POL, BEL, ARG, AUS]
 *               billingEmail:
 *                 type: string
 *                 format: email
 *               billingAddress:
 *                 type: string
 *               vatNumber:
 *                 type: string
 *             required:
 *               - name
 *               - country
 *     responses:
 *       201:
 *         description: Organisation créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 country:
 *                   type: string
 *                 billingEmail:
 *                   type: string
 *                 billingAddress:
 *                   type: string
 *                 vatNumber:
 *                   type: string
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
  createOrganization
);

/**
 * @swagger
 * /api/organizations/{id}:
 *   get:
 *     summary: Récupérer une organisation par son ID
 *     tags: [Organisations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'organisation
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Détails de l'organisation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 country:
 *                   type: string
 *                 billingEmail:
 *                   type: string
 *                 billingAddress:
 *                   type: string
 *                 vatNumber:
 *                   type: string
 *       404:
 *         description: Organisation non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/:id", authMiddleware, getOrganizationById);

/**
 * @swagger
 * /api/organizations/{id}/participants:
 *   get:
 *     summary: Récupérer les participants d'une organisation
 *     tags: [Organisations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'organisation
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des participants de l'organisation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Participant'
 *       404:
 *         description: Organisation non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/:id/participants", authMiddleware, getOrganizationParticipants);

/**
 * @swagger
 * /api/organizations/{id}/users:
 *   get:
 *     summary: Récupérer les utilisateurs d'une organisation
 *     tags: [Organisations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'organisation
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs de l'organisation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: Organisation non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.get(
  "/:id/users",
  authMiddleware,
  roleMiddleware(["super_admin", "admin", "federation"]),
  getOrganizationUsers
);

/**
 * @swagger
 * /api/organizations/{id}:
 *   put:
 *     summary: Mettre à jour une organisation
 *     tags: [Organisations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'organisation
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
 *               country:
 *                 type: string
 *                 enum: [FRA, KOR, USA, ESP, GER, ITA, GBR, TUR, BRA, CAN, MEX, JPN, CHN, IND, NED, SWE, POL, BEL, ARG, AUS]
 *               billingEmail:
 *                 type: string
 *                 format: email
 *               billingAddress:
 *                 type: string
 *               vatNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Organisation mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 country:
 *                   type: string
 *                 billingEmail:
 *                   type: string
 *                 billingAddress:
 *                   type: string
 *                 vatNumber:
 *                   type: string
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Organisation non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["super_admin", "admin", "federation"]),
  updateOrganization
);

/**
 * @swagger
 * /api/organizations/{id}:
 *   delete:
 *     summary: Supprimer une organisation
 *     tags: [Organisations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'organisation
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Organisation supprimée
 *       404:
 *         description: Organisation non trouvée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Accès non autorisé
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["super_admin", "admin"]),
  deleteOrganization
);

export const organizationsRoutes = router;
