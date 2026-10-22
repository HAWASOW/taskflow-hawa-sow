
const Project = require("../models/Project");
const User = require("../models/User");

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Nom du projet requis" });
    }

    const project = await Project.create({
      name: name.trim(),
      description: description || "",
      owner: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json({ message: "Projet créé", project });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    }).populate("owner", "name email").populate("members", "name email");

    res.json({ count: projects.length, projects });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    }).populate("owner", "name email").populate("members", "name email");

    if (!project) {
      return res.status(404).json({ message: "Projet introuvable ou accès refusé" });
    }

    res.json({ project });
  } catch (error) {
    res.status(400).json({ message: "Identifiant de projet invalide" });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const updates = {};
    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ message: "Nom invalide" });
      }
      updates.name = name.trim();
    }
    if (description !== undefined) updates.description = description;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Projet introuvable ou non autorisé" });
    }

    res.json({ message: "Projet modifié", project });
  } catch (error) {
    res.status(400).json({ message: "Données ou identifiant invalides" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Projet introuvable ou non autorisé" });
    }

    res.json({ message: "Projet supprimé" });
  } catch (error) {
    res.status(400).json({ message: "Identifiant invalide" });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId requis" });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Projet introuvable ou non autorisé" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    if (!project.members.some((id) => id.toString() === userId)) {
      project.members.push(user._id);
      await project.save();
    }

    res.status(200).json({ message: "Membre ajouté", project });
  } catch (error) {
    res.status(400).json({ message: "Identifiant invalide" });
  }
};

exports.getMembers = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    }).populate("members", "name email role");

    if (!project) {
      return res.status(404).json({ message: "Projet introuvable ou accès refusé" });
    }

    res.json({ members: project.members });
  } catch (error) {
    res.status(400).json({ message: "Identifiant invalide" });
  }
};
