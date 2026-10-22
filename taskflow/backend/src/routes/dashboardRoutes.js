
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { getDashboard } = require("../controllers/dashboardController");

/**
 * @swagger
 * tags:
 *   name: Tableau de bord
 *   description: Statistiques des projets et des tâches
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Obtenir les statistiques de l'utilisateur connecté
 *     tags: [Tableau de bord]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 *       401:
 *         description: Authentification requise
 */
router.get("/", protect, getDashboard);

module.exports = router;
