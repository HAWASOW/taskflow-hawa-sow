
import { useEffect, useState } from "react";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";

const navigation = [
  { label: "Tableau de bord", icon: "▦" },
  { label: "Projets", icon: "▰" },
  { label: "Tâches", icon: "✓" },
  { label: "Mon profil", icon: "◎" },
];

const colorMap = {
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
  green: "bg-emerald-100 text-emerald-600",
  orange: "bg-orange-100 text-orange-600",
  red: "bg-red-100 text-red-600",
};

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
         "https://taskflow-hawa-sow.onrender.com/api/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Impossible de charger les statistiques."
          );
        }

        setDashboardData(result.data);
      } catch (err) {
        setError(err.message || "Erreur de connexion au serveur.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  const stats = [
    {
      label: "Projets accessibles",
      value: dashboardData?.totalProjects ?? 0,
      icon: "▰",
      color: "blue",
    },
    {
      label: "Total des tâches",
      value: dashboardData?.totalTasks ?? 0,
      icon: "✓",
      color: "purple",
    },
    {
      label: "Tâches terminées",
      value: dashboardData?.completedTasks ?? 0,
      icon: "✓",
      color: "green",
    },
    {
      label: "Tâches en cours",
      value: dashboardData?.inProgressTasks ?? 0,
      icon: "◷",
      color: "orange",
    },
    {
      label: "Tâches en retard",
      value: dashboardData?.overdueTasks ?? 0,
      icon: "!",
      color: "red",
    },
  ];

  const tasksByStatus = dashboardData?.tasksByStatus ?? {
    TODO: 0,
    IN_PROGRESS: 0,
    DONE: 0,
  };

  const totalStatusTasks =
    tasksByStatus.TODO +
    tasksByStatus.IN_PROGRESS +
    tasksByStatus.DONE;

  const statusItems = [
    {
      label: "À faire",
      value: tasksByStatus.TODO,
      color: "bg-blue-500",
    },
    {
      label: "En cours",
      value: tasksByStatus.IN_PROGRESS,
      color: "bg-orange-500",
    },
    {
      label: "Terminées",
      value: tasksByStatus.DONE,
      color: "bg-emerald-500",
    },
  ];

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-sm">
        Chargement des statistiques...
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700"
      >
        <p className="font-semibold">
          Impossible de charger le tableau de bord.
        </p>
        <p className="mt-2 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Tableau de bord
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Statistiques réelles de vos projets et de vos tâches
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                {stat.label}
              </p>
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${colorMap[stat.color]}`}
              >
                {stat.icon}
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold text-slate-800">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800">
          Répartition des tâches
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Nombre de tâches par statut
        </p>

        <div className="mt-6 space-y-5">
          {statusItems.map((item) => {
            const percentage =
              totalStatusTasks > 0
                ? (item.value / totalStatusTasks) * 100
                : 0;

            return (
              <div key={item.label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    {item.label}
                  </span>
                  <span className="text-slate-500">
                    {item.value} ({Math.round(percentage)} %)
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Placeholder({ title, description }) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm md:p-9">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
        {description}
      </p>
      <div className="mt-7 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        Cette section sera reliée au backend pour utiliser les données réelles
        de MongoDB.
      </div>
    </section>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState("Tableau de bord");
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

  const pageDescriptions = {
    "Mon profil":
      "Consultez et modifiez vos informations personnelles en toute sécurité.",
  };

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-[#f5f7fc] text-slate-800">
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col overflow-y-auto bg-[#101d38] p-5 text-white">
        <div className="mb-9 flex items-center gap-3 px-1">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-2xl font-bold shadow-lg shadow-blue-950/30">
            ✓
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">TaskFlow</h1>
            <p className="text-xs text-slate-400">Gestion de projets</p>
          </div>
        </div>

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Menu principal
        </p>

        <nav className="flex flex-col gap-2">
          {navigation.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setActivePage(item.label);
                setShowLogoutMessage(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                activePage === item.label
                  ? "bg-blue-600 font-semibold text-white shadow-lg shadow-blue-950/20"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="w-5 text-center text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="font-semibold">Travaillez efficacement</p>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            Retrouvez vos projets et vos tâches au même endroit.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <span className="w-5 text-center text-lg">↪</span>
          Déconnexion
        </button>
      </aside>

      <main className="ml-64 min-h-screen">
        <header className="fixed left-64 right-0 top-0 z-20 flex h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 shadow-sm md:px-8">
          <div>
            <p className="text-xs text-slate-400">
              TASKFLOW / ESPACE DE TRAVAIL
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900 md:text-2xl">
              {activePage}
            </h2>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-2 pr-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
              U
            </div>
            <div>
              <p className="text-sm font-semibold">Utilisateur</p>
              <p className="text-xs text-slate-500">Espace personnel</p>
            </div>
          </div>
        </header>

        <div className="h-screen overflow-y-auto px-5 pb-8 pt-24 md:px-8">
          {showLogoutMessage ? (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h2 className="font-bold text-amber-900">
                Session locale fermée
              </h2>
              <p className="mt-2 text-sm text-amber-800">
                Le token enregistré dans ce navigateur a été supprimé.
              </p>
            </section>
          ) : activePage === "Tableau de bord" ? (
            <Dashboard />
          ) : activePage === "Projets" ? (
            <Projects />
          ) : activePage === "Tâches" ? (
            <Tasks />
            ) : activePage === "Mon profil" ? (
  <Profile />
          ) : (
            <Placeholder
              title={activePage}
              description={pageDescriptions[activePage]}
            />
          )}

          <footer className="py-8 text-center text-xs text-slate-400">
            © 2026 TaskFlow — Gestion des projets et des tâches
          </footer>
        </div>
      </main>
    </div>
  );
}
