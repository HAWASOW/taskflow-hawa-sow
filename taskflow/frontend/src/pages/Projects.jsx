
import { useEffect, useState } from "react";

const API = "https://taskflow-hawa-sow.onrender.com/api/projects";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const token = () => localStorage.getItem("token");

  async function loadProjects() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API, {
        headers: {
          Authorization: `Bearer ${token()}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Impossible de charger les projets.");
      }

      setProjects(result.projects || result.data?.projects || []);
    } catch (err) {
      setError(err.message || "Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!name.trim()) {
      setError("Le nom du projet est obligatoire.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        editingId ? `${API}/${editingId}` : API,
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token()}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Impossible d'enregistrer le projet.");
      }

      setName("");
      setDescription("");
      setEditingId(null);
      setMessage(editingId ? "Projet modifié." : "Projet créé avec succès.");
      await loadProjects();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(project) {
    setEditingId(project._id);
    setName(project.name || "");
    setDescription(project.description || "");
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setName("");
    setDescription("");
    setError("");
  }

  async function deleteProject(project) {
    if (!window.confirm(`Supprimer le projet « ${project.name} » ?`)) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API}/${project._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token()}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Impossible de supprimer le projet.");
      }

      setMessage("Projet supprimé avec succès.");
      await loadProjects();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Mes projets</h2>
          <p className="mt-1 text-sm text-slate-500">
            Gérez vos projets et consultez les membres de votre équipe.
          </p>
        </div>

        <button
          onClick={loadProjects}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Actualiser
        </button>
      </div>

      {error && (
        <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold text-slate-800">
          {editingId ? "Modifier le projet" : "Créer un projet"}
        </h3>

        <div>
          <label htmlFor="project-name" className="mb-1 block text-sm font-medium">
            Nom du projet *
          </label>
          <input
            id="project-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={120}
            placeholder="Ex. Projet TaskFlow"
            className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label htmlFor="project-description" className="mb-1 block text-sm font-medium">
            Description
          </label>
          <textarea
            id="project-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Décrivez votre projet..."
            className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : editingId ? "Enregistrer les modifications" : "Créer le projet"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-slate-300 px-5 py-2 hover:bg-slate-50"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      <div>
        <h3 className="mb-3 text-lg font-bold text-slate-800">
          Projets accessibles ({projects.length})
        </h3>

        {loading ? (
          <p className="rounded-xl bg-white p-6 text-slate-500">
            Chargement des projets...
          </p>
        ) : projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="font-medium text-slate-700">Aucun projet trouvé.</p>
            <p className="mt-1 text-sm text-slate-500">
              Créez votre premier projet avec le formulaire ci-dessus.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => {
              const ownerId =
                typeof project.owner === "object"
                  ? project.owner?._id
                  : project.owner;

              const canEdit =
                ownerId && ownerId === localStorage.getItem("userId");

              return (
                <article
                  key={project._id}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-700">
                    ▰
                  </div>

                  <h4 className="break-words text-lg font-bold text-slate-800">
                    {project.name}
                  </h4>

                  <p className="mt-2 min-h-10 text-sm leading-6 text-slate-500">
                    {project.description || "Aucune description."}
                  </p>

                  <p className="mt-4 text-xs text-slate-500">
                    Membres : {project.members?.length ?? 0}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Créé le{" "}
                    {project.createdAt
                      ? new Date(project.createdAt).toLocaleDateString("fr-FR")
                      : "—"}
                  </p>

                  {canEdit && (
                    <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                      <button
                        onClick={() => startEdit(project)}
                        className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => deleteProject(project)}
                        className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
