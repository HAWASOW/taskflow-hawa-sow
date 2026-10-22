
const Project = require("../models/Project");
const Task = require("../models/Task");

exports.getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Récupérer les projets accessibles à l'utilisateur
    const projects = await Project.find({
      $or: [
        { owner: userId },
        { members: userId }
      ]
    }).select("_id");

    const projectIds = projects.map((project) => project._id);

    // 2. Calculer les statistiques des tâches de ces projets
    const [totalTasks, completedTasks, inProgressTasks, overdueTasks, statusCounts] =
      await Promise.all([
        Task.countDocuments({ project: { $in: projectIds } }),

        Task.countDocuments({
          project: { $in: projectIds },
          status: "DONE"
        }),

        Task.countDocuments({
          project: { $in: projectIds },
          status: "IN_PROGRESS"
        }),

        Task.countDocuments({
          project: { $in: projectIds },
          dueDate: { $lt: new Date(), $ne: null },
          status: { $ne: "DONE" }
        }),

        Task.aggregate([
          { $match: { project: { $in: projectIds } } },
          {
            $group: {
              _id: "$status",
              total: { $sum: 1 }
            }
          }
        ])
      ]);

    // 3. Préparer la répartition par statut
    const tasksByStatus = {
      TODO: 0,
      IN_PROGRESS: 0,
      DONE: 0
    };

    statusCounts.forEach((item) => {
      tasksByStatus[item._id] = item.total;
    });

    // 4. Retourner les statistiques réelles
    res.status(200).json({
      success: true,
      data: {
        totalProjects: projects.length,
        totalTasks,
        completedTasks,
        inProgressTasks,
        overdueTasks,
        tasksByStatus
      }
    });
  } catch (error) {
    next(error);
  }
};
