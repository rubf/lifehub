import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  AppState,
  BudgetCategory,
  Goal,
  Habit,
  JournalEntry,
  Task,
  ThemeMode,
  Transaction,
} from "./types";
import { getTemplate } from "./lib/templates";
import { addDays, toISO, uid } from "./lib/utils";

const STORAGE_KEY = "lifehub:v1";

const EMPTY_STATE: AppState = {
  profileName: "",
  currency: "EUR",
  theme: "light",
  tasks: [],
  habits: [],
  transactions: [],
  budgets: [],
  goals: [],
  journal: [],
  appliedTemplates: [],
};

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return { ...EMPTY_STATE, ...parsed };
  } catch {
    return EMPTY_STATE;
  }
}

interface Store {
  state: AppState;
  // profile / settings
  setProfileName: (name: string) => void;
  setCurrency: (c: string) => void;
  toggleTheme: () => void;
  resetAll: () => void;
  // tasks
  addTask: (t: Omit<Task, "id" | "createdAt" | "done">) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  // habits
  addHabit: (h: Omit<Habit, "id" | "createdAt" | "log">) => void;
  toggleHabitDay: (id: string, dateISO: string) => void;
  deleteHabit: (id: string) => void;
  // finance
  addTransaction: (t: Omit<Transaction, "id" | "createdAt">) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (b: Omit<BudgetCategory, "id">) => void;
  deleteBudget: (id: string) => void;
  // goals
  addGoal: (g: Omit<Goal, "id" | "createdAt">) => void;
  updateGoalProgress: (id: string, current: number) => void;
  deleteGoal: (id: string) => void;
  // journal
  addJournal: (e: Omit<JournalEntry, "id" | "createdAt">) => void;
  deleteJournal: (id: string) => void;
  // templates
  applyTemplate: (templateId: string) => void;
  // data import (e.g. from a CSV backup)
  importData: (next: AppState) => void;
}

const StoreContext = createContext<Store | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());
  const firstRender = useRef(true);

  // Persist to localStorage on change
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable */
    }
  }, [state]);

  // Reflect theme on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [state.theme]);

  const setProfileName = useCallback(
    (name: string) => setState((s) => ({ ...s, profileName: name })),
    []
  );
  const setCurrency = useCallback(
    (c: string) => setState((s) => ({ ...s, currency: c })),
    []
  );
  const toggleTheme = useCallback(
    () =>
      setState((s) => ({
        ...s,
        theme: (s.theme === "light" ? "dark" : "light") as ThemeMode,
      })),
    []
  );
  const resetAll = useCallback(() => {
    setState((s) => ({ ...EMPTY_STATE, profileName: s.profileName, theme: s.theme }));
  }, []);

  // ---- tasks ----
  const addTask = useCallback<Store["addTask"]>((t) => {
    setState((s) => ({
      ...s,
      tasks: [
        { ...t, id: uid(), createdAt: Date.now(), done: false },
        ...s.tasks,
      ],
    }));
  }, []);
  const toggleTask = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }));
  }, []);
  const deleteTask = useCallback((id: string) => {
    setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
  }, []);

  // ---- habits ----
  const addHabit = useCallback<Store["addHabit"]>((h) => {
    setState((s) => ({
      ...s,
      habits: [...s.habits, { ...h, id: uid(), createdAt: Date.now(), log: {} }],
    }));
  }, []);
  const toggleHabitDay = useCallback((id: string, dateISO: string) => {
    setState((s) => ({
      ...s,
      habits: s.habits.map((h) => {
        if (h.id !== id) return h;
        const log = { ...h.log };
        if (log[dateISO]) delete log[dateISO];
        else log[dateISO] = true;
        return { ...h, log };
      }),
    }));
  }, []);
  const deleteHabit = useCallback((id: string) => {
    setState((s) => ({ ...s, habits: s.habits.filter((h) => h.id !== id) }));
  }, []);

  // ---- finance ----
  const addTransaction = useCallback<Store["addTransaction"]>((t) => {
    setState((s) => ({
      ...s,
      transactions: [{ ...t, id: uid(), createdAt: Date.now() }, ...s.transactions],
    }));
  }, []);
  const deleteTransaction = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      transactions: s.transactions.filter((t) => t.id !== id),
    }));
  }, []);
  const addBudget = useCallback<Store["addBudget"]>((b) => {
    setState((s) => ({ ...s, budgets: [...s.budgets, { ...b, id: uid() }] }));
  }, []);
  const deleteBudget = useCallback((id: string) => {
    setState((s) => ({ ...s, budgets: s.budgets.filter((b) => b.id !== id) }));
  }, []);

  // ---- goals ----
  const addGoal = useCallback<Store["addGoal"]>((g) => {
    setState((s) => ({
      ...s,
      goals: [...s.goals, { ...g, id: uid(), createdAt: Date.now() }],
    }));
  }, []);
  const updateGoalProgress = useCallback((id: string, current: number) => {
    setState((s) => ({
      ...s,
      goals: s.goals.map((g) =>
        g.id === id ? { ...g, current: Math.max(0, current) } : g
      ),
    }));
  }, []);
  const deleteGoal = useCallback((id: string) => {
    setState((s) => ({ ...s, goals: s.goals.filter((g) => g.id !== id) }));
  }, []);

  // ---- journal ----
  const addJournal = useCallback<Store["addJournal"]>((e) => {
    setState((s) => ({
      ...s,
      journal: [{ ...e, id: uid(), createdAt: Date.now() }, ...s.journal],
    }));
  }, []);
  const deleteJournal = useCallback((id: string) => {
    setState((s) => ({ ...s, journal: s.journal.filter((e) => e.id !== id) }));
  }, []);

  // ---- templates ----
  const applyTemplate = useCallback((templateId: string) => {
    const tpl = getTemplate(templateId);
    if (!tpl) return;
    const now = Date.now();
    const today = new Date();

    setState((s) => {
      const newTasks: Task[] = (tpl.seed.tasks ?? []).map((t, i) => ({
        id: uid(),
        title: t.title,
        priority: t.priority,
        category: t.category,
        done: false,
        due: t.dueInDays != null ? toISO(addDays(today, t.dueInDays)) : undefined,
        createdAt: now + i,
      }));
      const newHabits: Habit[] = (tpl.seed.habits ?? []).map((h, i) => ({
        id: uid(),
        name: h.name,
        icon: h.icon,
        color: h.color,
        target: h.target,
        log: {},
        createdAt: now + i,
      }));
      const newBudgets: BudgetCategory[] = (tpl.seed.budgets ?? []).map((b) => ({
        id: uid(),
        name: b.name,
        limit: b.limit,
        color: b.color,
      }));
      const newGoals: Goal[] = (tpl.seed.goals ?? []).map((g, i) => ({
        id: uid(),
        title: g.title,
        description: g.description,
        target: g.target,
        current: g.current,
        unit: g.unit,
        deadline:
          g.deadlineInDays != null ? toISO(addDays(today, g.deadlineInDays)) : undefined,
        createdAt: now + i,
      }));

      return {
        ...s,
        tasks: [...newTasks, ...s.tasks],
        habits: [...s.habits, ...newHabits],
        budgets: [...s.budgets, ...newBudgets],
        goals: [...s.goals, ...newGoals],
        appliedTemplates: s.appliedTemplates.includes(templateId)
          ? s.appliedTemplates
          : [...s.appliedTemplates, templateId],
      };
    });
  }, []);

  const importData = useCallback((next: AppState) => {
    setState(next);
  }, []);

  const value = useMemo<Store>(
    () => ({
      state,
      setProfileName,
      setCurrency,
      toggleTheme,
      resetAll,
      addTask,
      toggleTask,
      deleteTask,
      addHabit,
      toggleHabitDay,
      deleteHabit,
      addTransaction,
      deleteTransaction,
      addBudget,
      deleteBudget,
      addGoal,
      updateGoalProgress,
      deleteGoal,
      addJournal,
      deleteJournal,
      applyTemplate,
      importData,
    }),
    [
      state,
      setProfileName,
      setCurrency,
      toggleTheme,
      resetAll,
      addTask,
      toggleTask,
      deleteTask,
      addHabit,
      toggleHabitDay,
      deleteHabit,
      addTransaction,
      deleteTransaction,
      addBudget,
      deleteBudget,
      addGoal,
      updateGoalProgress,
      deleteGoal,
      addJournal,
      deleteJournal,
      applyTemplate,
      importData,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useApp(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
