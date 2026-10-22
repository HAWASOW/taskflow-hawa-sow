
const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  getMembers,
} = require("../controllers/projectController");

/**
 * @swagger
 * tags:
 *   name: Projets
 *   description: Gestion des projets et de leurs membres
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectInput:
 *       type: object
 *       required: [name]
 *       properties:
 *         name:
 *           type: string
 *           example: Projet TaskFlow
 *         description:
 *           type: string
 *           example: Gestion des tâches de l'équipe
 *     AddMemberInput:
 *       type: object
 *       required: [userId]
 *       properties:
 *         userId:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 */

/**
 * @swagger
 * /api/projects:
 *   post:
 *     tags: [Projets]
 *     summary: Créer un projet
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       201:
 *         description: Projet créé
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Authentification requise
 */
router.post("/", protect, createProject);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     tags: [Projets]
 *     summary: Lister les projets accessibles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des projets
 *       401:
 *         description: Authentification requise
 */
router.get("/", protect, getProjects);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     tags: [Projets]
 *     summary: Consulter un projet
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
 *         description: Projet récupéré
 *       404:
 *         description: Projet introuvable ou accès refusé
 */
router.get("/:id", protect, getProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   patch:
 *     tags: [Projets]
 *     summary: Modifier un projet dont je suis responsable
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
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       200:
 *         description: Projet modifié
 *       404:
 *         description: Projet introuvable ou non autorisé
 */
router.patch("/:id", protect, updateProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     tags: [Projets]
 *     summary: Supprimer un projet dont je suis responsable
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
 *         description: Projet supprimé
 *       404:
 *         description: Projet introuvable ou non autorisé
 */
router.delete("/:id", protect, deleteProject);

/**
 * @swagger
 * /api/projects/{id}/members:
 *   post:
 *     tags: [Projets]
 *     summary: Ajouter un membre au projet
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
 *             $ref: '#/components/schemas/AddMemberInput'
 *     responses:
 *       200:
 *         description: Membre ajouté
 *       404:
 *         description: Projet ou utilisateur introuvable
 */
router.post("/:id/members", protect, addMember);

/**
 * @swagger
 * /api/projects/{id}/members:
 *   get:
 *     tags: [Projets]
 *     summary: Lister les membres d'un projet
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
 *         description: Membres du projet
 *       404:
 *         description: Projet introuvable ou accès refusé
 */
router.get("/:id/members", protect, getMembers);

module.exports = router;
