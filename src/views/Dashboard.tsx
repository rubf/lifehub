import { useMemo } from "react";
import { useApp } from "../store";
import type { ViewId } from "../types";
import { Card, ProgressBar, Tilt } from "../ui";
import {
  CheckIcon,
  FinanceIcon,
  GoalsIcon,
  HabitsIcon,
  SparkleIcon,
  TasksIcon,
} from "../icons";
import { colors } from "../lib/colors";
import {
  cx,
  currentMonthKey,
  formatMoney,
  monthKey,
  todayISO,
} from "../lib/utils";

export default function Dashboard({ go }: { go: (v: ViewId) => void }) {
  const { state, toggleTask } = useApp();
  const today = todayISO();
  const month = currentMonthKey();

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 6) return "Buenas noches";
    if (h < 13) return "Buenos días";
    if (h < 20) return "Buenas tardes";
    return "Buenas noches";
  }, []);

  const pendingTasks = state.tasks.filter((t) => !t.done);
  const todayTasks = pendingTasks
    .filter((t) => !t.due || t.due <= today)
    .slice(0, 5);

  const habitsToday = state.habits.filter((h) => h.log[today]).length;

  const monthTx = state.transactions.filter((t) => monthKey(t.date) === month);
  const income = monthTx.filter((t) => t.type === "ingreso").reduce((a, t) => a + t.amount, 0);
  const expense = monthTx.filter((t) => t.type === "gasto").reduce((a, t) => a + t.amount, 0);
  const balance = income - expense;

  const activeGoals = state.goals.filter((g) => g.current < g.target).slice(0, 3);

  const isEmpty =
    !state.tasks.length &&
    !state.habits.length &&
    !state.transactions.length &&
    !state.goals.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {greeting}
          {state.profileName ? `, ${state.profileName}` : ""} 👋
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </div>

      {isEmpty && (
        <Card className="overflow-hidden">
          <div className="flex flex-col items-start gap-4 bg-gradient-to-br from-indigo-500 to-violet-600 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Empieza en segundos</h2>
              <p className="text-sm text-white/85">
                Elige una plantilla y la app se rellena al instante con tareas,
                hábitos, presupuestos y metas de ejemplo que luego puedes editar.
              </p>
            </div>
            <button
              onClick={() => go("templates")}
              className="inline-flex flex-none items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600"
            >
              <SparkleIcon width={16} height={16} /> Ver plantillas
            </button>
          </div>
        </Card>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={<TasksIcon />}
          color="indigo"
          label="Tareas pendientes"
          value={String(pendingTasks.length)}
          onClick={() => go("tasks")}
        />
        <StatCard
          icon={<HabitsIcon />}
          color="violet"
          label="Hábitos hoy"
          value={`${habitsToday}/${state.habits.length}`}
          onClick={() => go("habits")}
        />
        <StatCard
          icon={<FinanceIcon />}
          color={balance >= 0 ? "emerald" : "rose"}
          label="Balance del mes"
          value={formatMoney(balance, state.currency)}
          onClick={() => go("finance")}
        />
        <StatCard
          icon={<GoalsIcon />}
          color="amber"
          label="Metas activas"
          value={String(activeGoals.length)}
          onClick={() => go("goals")}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's tasks */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
              Para hoy
            </h3>
            <button
              onClick={() => go("tasks")}
              className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Ver todas
            </button>
          </div>
          {todayTasks.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">
              No tienes tareas pendientes para hoy. ¡Buen trabajo! 🎉
            </p>
          ) : (
            <div className="space-y-1.5">
              {todayTasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/40"
                >
                  <button
                    onClick={() => toggleTask(t.id)}
                    className="flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 border-slate-300 text-transparent hover:border-indigo-400 dark:border-slate-600"
                    aria-label="Completar"
                  >
                    <CheckIcon width={12} height={12} />
                  </button>
                  <span className="truncate text-sm text-slate-700 dark:text-slate-200">
                    {t.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Goals progress */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
              Progreso de metas
            </h3>
            <button
              onClick={() => go("goals")}
              className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Ver todas
            </button>
          </div>
          {activeGoals.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">
              Sin metas activas. Define una para empezar a avanzar.
            </p>
          ) : (
            <div className="space-y-4">
              {activeGoals.map((g) => {
                const pct = Math.min(100, (g.current / g.target) * 100);
                return (
                  <div key={g.id}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="truncate text-slate-700 dark:text-slate-200">
                        {g.title}
                      </span>
                      <span className="flex-none text-slate-400">
                        {g.current}/{g.target} {g.unit}
                      </span>
                    </div>
                    <ProgressBar value={pct} />
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  onClick: () => void;
}) {
  const c = colors(color);
  return (
    <Tilt max={10}>
      <button
        onClick={onClick}
        className="group w-full rounded-2xl border border-slate-200/70 bg-white p-4 text-left transition-all hover:shadow-elevate dark:border-slate-700/60 dark:bg-slate-800/60"
      >
        <div
          className={cx(
            "mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform group-hover:scale-110",
            c.gradient
          )}
        >
          {icon}
        </div>
        <p className="truncate text-xl font-semibold text-slate-900 dark:text-white">
          {value}
        </p>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{label}</p>
      </button>
    </Tilt>
  );
}
