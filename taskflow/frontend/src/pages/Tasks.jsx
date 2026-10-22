
import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    title: "",
    description: "",
    project: "",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "",
  };

  const [form, setForm] = useState(emptyForm);

  const headers = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [tasksResponse, projectsResponse] = await Promise.all([
        fetch(`${API}/tasks`, { headers: headers() }),
        fetch(`${API}/projects`, { headers: headers() }),
      ]);

      const tasksData = await tasksResponse.json();
      const projectsData = await projectsResponse.json();

      if (!tasksResponse.ok) {
        throw new Error(tasksData.message || "Impossible de charger les tâches.");
      }

      if (!projectsResponse.ok) {
        throw new Error(projectsData.message || "Impossible de charger les projets.");
      }

      setTasks(tasksData.tasks || tasksData.data?.tasks || []);
      setProjects(projectsData.projects || projectsData.data?.projects || []);
    } catch (err) {
      setError(err.message || "Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.project) {
      setError("Choisis un projet pour cette tâche.");
      return;
    }

    try {
      const url = editingId
        ? `${API}/tasks/${editingId}`
        : `${API}/tasks`;

      const response = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: headers(),
        body: JSON.stringify({
          ...form,
          dueDate: form.dueDate || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible d'enregistrer la tâche.");
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    }
  }

  function startEdit(task) {
    setEditingId(task._id);
    setForm({
      title: task.title || "",
      description: task.description || "",
      project: task.project?._id || task.project || "",
      status: task.status || "TODO",
      priority: task.priority || "MEDIUM",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteTask(id) {
    if (!window.confirm("Veux-tu vraiment supprimer cette tâche ?")) return;

    setError("");

    try {
      const response = await fetch(`${API}/tasks/${id}`, {
        method: "DELETE",
        headers: headers(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de supprimer la tâche.");
      }

      await loadData();
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  const statusLabel = {
    TODO: "À faire",
    IN_PROGRESS: "En cours",
    DONE: "Terminée",
  };

  const priorityLabel = {
    LOW: "Basse",
    MEDIUM: "Moyenne",
    HIGH: "Haute",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mes tâches</h1>
        <p className="mt-2 text-gray-500">
          Crée, organise et suis l'avancement de tes tâches.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold">
          {editingId ? "Modifier la tâche" : "Ajouter une tâche"}
        </h2>

        <div>
          <label className="mb-1 block text-sm font-medium">Titre *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Ex. Préparer le rapport"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            placeholder="Description de la tâche..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Projet *</label>
          <select
            name="project"
            value={form.project}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
          >
            <option value="">Choisir un projet</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
          {projects.length === 0 && !loading && (
            <p className="mt-1 text-sm text-orange-600">
              Crée d'abord un projet ou vérifie ton accès aux projets.
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Statut</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
            >
              <option value="TODO">À faire</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="DONE">Terminée</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Priorité</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
            >
              <option value="LOW">Basse</option>
              <option value="MEDIUM">Moyenne</option>
              <option value="HIGH">Haute</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Date limite</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            {editingId ? "Enregistrer les modifications" : "Créer la tâche"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-gray-300 px-5 py-2.5 hover:bg-gray-50"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Liste des tâches</h2>
          <button
            onClick={loadData}
            type="button"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
          >
            Actualiser
          </button>
        </div>

        {loading ? (
          <p className="py-6 text-gray-500">Chargement des tâches...</p>
        ) : tasks.length === 0 ? (
          <p className="py-6 text-gray-500">
            Aucune tâche pour le moment. Crée ta première tâche ci-dessus.
          </p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div className="min-w-0">
                    <h3 className="break-words text-lg font-semibold text-gray-900">
                      {task.title}
                    </h3>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
                      {task.description || "Aucune description"}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Projet :{" "}
                      {task.project?.name ||
                        projects.find(
                          (project) =>
                            project._id === (task.project?._id || task.project)
                        )?.name ||
                        "Projet"}
                    </p>
                    {task.dueDate && (
                      <p className="mt-1 text-sm text-gray-500">
                        Date limite :{" "}
                        {new Date(task.dueDate).toLocaleDateString("fr-FR")}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-wrap items-start gap-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                      {statusLabel[task.status] || task.status}
                    </span>
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
                      Priorité : {priorityLabel[task.priority] || task.priority}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-3 border-t border-gray-100 pt-3">
                  <button
                    type="button"
                    onClick={() => startEdit(task)}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTask(task._id)}
                    className="text-sm font-medium text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
