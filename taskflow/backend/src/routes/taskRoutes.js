
const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Tâches
 *   description: Gestion des tâches des projets
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Créer une tâche dans un projet
 *     tags: [Tâches]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - project
 *             properties:
 *               title:
 *                 type: string
 *                 example: Préparer le rapport
 *               description:
 *                 type: string
 *                 example: Terminer le rapport du projet
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, DONE]
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               assignedTo:
 *                 type: string
 *                 description: Identifiant MongoDB du responsable
 *               project:
 *                 type: string
 *                 description: Identifiant MongoDB du projet
 *     responses:
 *       201:
 *         description: Tâche créée
 *       401:
 *         description: Authentification requise
 */
router.post("/", protect, createTask);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Afficher les tâches des projets accessibles
 *     tags: [Tâches]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des tâches
 *       401:
 *         description: Authentification requise
 */
router.get("/", protect, getTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Afficher une tâche par son identifiant
 *     tags: [Tâches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tâche trouvée
 *       404:
 *         description: Tâche introuvable
 */
router.get("/:id", protect, getTaskById);

/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Modifier une tâche
 *     tags: [Tâches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, DONE]
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               assignedTo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tâche modifiée
 *       401:
 *         description: Authentification requise
 */
router.patch("/:id", protect, updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Supprimer une tâche (propriétaire du projet uniquement)
 *     tags: [Tâches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tâche supprimée
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Tâche introuvable
 */
router.delete("/:id", protect, deleteTask);

module.exports = router;
