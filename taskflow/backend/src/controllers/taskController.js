
const Task = require("../models/Task");
const Project = require("../models/Project");

// Créer une tâche
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo, project } = req.body;

    if (!title || !project) {
      return res.status(400).json({
        message: "Le titre et le projet sont obligatoires",
      });
    }

    const existingProject = await Project.findById(project);

    if (!existingProject) {
      return res.status(404).json({ message: "Projet introuvable" });
    }

    const isMember =
      existingProject.owner.toString() === req.user._id.toString() ||
      existingProject.members.some(
        (member) => member.toString() === req.user._id.toString()
      );

    if (!isMember) {
      return res.status(403).json({
        message: "Vous n'êtes pas membre de ce projet",
      });
    }

    if (assignedTo) {
      const isAssigneeMember =
        existingProject.owner.toString() === assignedTo ||
        existingProject.members.some(
          (member) => member.toString() === assignedTo
        );

      if (!isAssigneeMember) {
        return res.status(400).json({
          message: "Le responsable doit être membre du projet",
        });
      }
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      project,
    });

    return res.status(201).json({
      message: "Tâche créée avec succès",
      task,
    });
  } catch (error) {
    console.error("Erreur createTask :", error);
    return res.status(500).json({ message: "Erreur lors de la création de la tâche" });
  }
};

// Afficher les tâches accessibles à l'utilisateur
exports.getTasks = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    }).select("_id");

    const projectIds = projects.map((project) => project._id);

    const tasks = await Task.find({ project: { $in: projectIds } })
      .populate("assignedTo", "name email")
      .populate("project", "name description")
      .sort({ createdAt: -1 });

    return res.status(200).json({ count: tasks.length, tasks });
  } catch (error) {
    console.error("Erreur getTasks :", error);
    return res.status(500).json({ message: "Erreur lors de la récupération des tâches" });
  }
};

// Afficher une tâche précise
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("project", "name description");

    if (!task) {
      return res.status(404).json({ message: "Tâche introuvable" });
    }

    const project = await Project.findById(task.project._id);

    const isMember =
      project.owner.toString() === req.user._id.toString() ||
      project.members.some(
        (member) => member.toString() === req.user._id.toString()
      );

    if (!isMember) {
      return res.status(403).json({ message: "Accès interdit à cette tâche" });
    }

    return res.status(200).json({ task });
  } catch (error) {
    console.error("Erreur getTaskById :", error);
    return res.status(500).json({ message: "Erreur lors de la récupération de la tâche" });
  }
};

// Modifier une tâche
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Tâche introuvable" });
    }

    const project = await Project.findById(task.project);

    const isMember =
      project.owner.toString() === req.user._id.toString() ||
      project.members.some(
        (member) => member.toString() === req.user._id.toString()
      );

    if (!isMember) {
      return res.status(403).json({ message: "Accès interdit à cette tâche" });
    }

    if (req.body.project && req.body.project !== task.project.toString()) {
      return res.status(400).json({
        message: "Le déplacement d'une tâche vers un autre projet n'est pas autorisé",
      });
    }

    if (req.body.assignedTo) {
      const isAssigneeMember =
        project.owner.toString() === req.body.assignedTo ||
        project.members.some(
          (member) => member.toString() === req.body.assignedTo
        );

      if (!isAssigneeMember) {
        return res.status(400).json({
          message: "Le responsable doit être membre du projet",
        });
      }
    }

    const allowedFields = [
      "title",
      "description",
      "status",
      "priority",
      "dueDate",
      "assignedTo",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    await task.save();

    return res.status(200).json({
      message: "Tâche modifiée avec succès",
      task,
    });
  } catch (error) {
    console.error("Erreur updateTask :", error);
    return res.status(500).json({ message: "Erreur lors de la modification de la tâche" });
  }
};

// Supprimer une tâche
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Tâche introuvable" });
    }

    const project = await Project.findById(task.project);

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Seul le propriétaire du projet peut supprimer cette tâche",
      });
    }

    await task.deleteOne();

    return res.status(200).json({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    console.error("Erreur deleteTask :", error);
    return res.status(500).json({ message: "Erreur lors de la suppression de la tâche" });
  }
};
