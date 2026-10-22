
import { useEffect, useState } from "react";

const API = "https://taskflow-hawa-sow.onrender.com/api";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch(`${API}/users/me`, {
          headers,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Impossible de charger le profil."
          );
        }

        const user = data.user || data.data?.user || data.data || data;

        setProfile({
          name: user.name || "",
          email: user.email || "",
        });
      } catch (err) {
        setError(err.message || "Erreur de connexion au serveur.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function handleChange(event) {
    setProfile({
      ...profile,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    const payload = {
      name: profile.name,
      email: profile.email,
    };

    if (password.trim()) {
      payload.password = password;
    }

    try {
      const response = await fetch(`${API}/users/me`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Impossible de modifier le profil."
        );
      }

      const user = data.user || data.data?.user || data.data || data;

      setProfile({
        name: user.name || profile.name,
        email: user.email || profile.email,
      });

      setPassword("");
      setMessage("Ton profil a été mis à jour.");
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-sm">
        Chargement du profil...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Mon profil
        </h1>
        <p className="mt-2 text-slate-500">
          Consulte et modifie les informations de ton compte.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          {message}
        </div>
      )}

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
            {(profile.name || profile.email || "U")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {profile.name || "Utilisateur"}
            </h2>
            <p className="text-sm text-slate-500">
              {profile.email}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Nom complet
            </label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Ton nom complet"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Adresse e-mail
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="exemple@email.com"
            />
          </div>

          <div className="border-t border-slate-100 pt-5">
            <h3 className="font-semibold text-slate-900">
              Modifier le mot de passe
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Laisse ce champ vide si tu souhaites conserver ton mot de passe actuel.
            </p>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              autoComplete="new-password"
              className="mt-3 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Nouveau mot de passe (8 caractères minimum)"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </form>
      </div>
    </div>
  );
}
