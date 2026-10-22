
const express = require("express");
const router = express.Router();

const {
  getMe,
  updateMe,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Gestion du profil utilisateur
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil récupéré avec succès
 *       401:
 *         description: Token absent ou invalide
 *       404:
 *         description: Utilisateur introuvable
 */
router.get("/me", protect, getMe);

/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     summary: Modifier le profil de l'utilisateur connecté
 *     tags: [Utilisateurs]
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
 *                 example: Hawa Sow
 *               email:
 *                 type: string
 *                 example: hawa@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: Nouveau123
 *     responses:
 *       200:
 *         description: Profil modifié avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Token absent ou invalide
 *       409:
 *         description: Adresse e-mail déjà utilisée
 */
router.patch("/me", protect, updateMe);

module.exports = router;
