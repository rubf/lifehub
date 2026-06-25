import { useState } from "react";
import { AppProvider, useApp } from "./store";
import type { ViewId } from "./types";
import { cx } from "./lib/utils";
import {
  DashboardIcon,
  FinanceIcon,
  GoalsIcon,
  HabitsIcon,
  JournalIcon,
  CalendarIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  TasksIcon,
  TemplatesIcon,
  HeartIcon,
  GameIcon,
} from "./icons";

import Dashboard from "./views/Dashboard";
import Tasks from "./views/Tasks";
import Habits from "./views/Habits";
import Finance from "./views/Finance";
import Goals from "./views/Goals";
import Journal from "./views/Journal";
import Calendar from "./views/Calendar";
import Game from "./views/Game";
import Templates from "./views/Templates";
import Settings from "./views/Settings";
import PremiumGate from "./PremiumGate";

interface NavItem {
  id: ViewId;
  label: string;
  icon: (p: { width?: number; height?: number }) => React.ReactNode;
}

const NAV: NavItem[] = [
  { id: "dashboard", label: "Inicio", icon: DashboardIcon },
  { id: "tasks", label: "Tareas", icon: TasksIcon },
  { id: "habits", label: "Hábitos", icon: HabitsIcon },
  { id: "finance", label: "Finanzas", icon: FinanceIcon },
  { id: "goals", label: "Metas", icon: GoalsIcon },
  { id: "journal", label: "Diario", icon: JournalIcon },
  { id: "calendar", label: "Calendario", icon: CalendarIcon },
  { id: "game", label: "Juego", icon: GameIcon },
  { id: "templates", label: "Plantillas", icon: TemplatesIcon },
  { id: "settings", label: "Ajustes", icon: SettingsIcon },
];

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
        <span className="text-lg">✦</span>
      </div>
      <div className="leading-tight">
        <p className="font-bold text-slate-900 dark:text-white">LifeHub</p>
        <p className="text-[11px] text-slate-400">Organiza tu vida</p>
      </div>
    </div>
  );
}

function Shell() {
  const { state, toggleTheme } = useApp();
  const [view, setView] = useState<ViewId>("dashboard");

  function render() {
    switch (view) {
      case "dashboard":
        return <Dashboard go={setView} />;
      case "tasks":
        return <Tasks />;
      case "habits":
        return <Habits />;
      case "finance":
        return <Finance />;
      case "goals":
        return <Goals />;
      case "journal":
        return <Journal />;
      case "calendar":
        return <Calendar />;
      case "game":
        return <Game />;
      case "templates":
        return <Templates />;
      case "settings":
        return <Settings />;
    }
  }

  return (
    <div className="min-h-full bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-white px-4 py-6 lg:flex dark:border-slate-800 dark:bg-slate-900">
        <div className="px-2">
          <Logo />
        </div>
        <nav className="mt-8 flex-1 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={cx(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                )}
              >
                <Icon width={19} height={19} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          {state.theme === "dark" ? (
            <SunIcon width={19} height={19} />
          ) : (
            <MoonIcon width={19} height={19} />
          )}
          {state.theme === "dark" ? "Modo claro" : "Modo oscuro"}
        </button>

        <p className="mt-3 flex items-center justify-center gap-1.5 px-3 text-xs text-slate-400">
          Hecho con amor
          <HeartIcon width={13} height={13} className="text-rose-500" />
          por Rubén
        </p>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-slate-900/80">
        <Logo />
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Cambiar tema"
        >
          {state.theme === "dark" ? (
            <SunIcon width={20} height={20} />
          ) : (
            <MoonIcon width={20} height={20} />
          )}
        </button>
      </header>

      {/* Main content */}
      <main className="px-4 pb-28 pt-6 lg:ml-64 lg:px-10 lg:pb-10">
        <div className="mx-auto max-w-5xl animate-fade-in" key={view}>
          {render()}
        </div>
        <p className="mx-auto mt-10 flex max-w-5xl items-center justify-center gap-1.5 text-xs text-slate-400 lg:hidden">
          Hecho con amor
          <HeartIcon width={13} height={13} className="text-rose-500" />
          por Rubén
        </p>
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-between overflow-x-auto border-t border-slate-200 bg-white/90 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-slate-900/90">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cx(
                "flex min-w-[4rem] flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors",
                active
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-400"
              )}
            >
              <Icon width={20} height={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <PremiumGate />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
