// ---- Core domain types for LifeHub ----

export type Priority = "baja" | "media" | "alta";

export interface Task {
  id: string;
  title: string;
  done: boolean;
  priority: Priority;
  due?: string; // ISO date (YYYY-MM-DD)
  category: string;
  createdAt: number;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string; // tailwind color key e.g. "indigo"
  target: number; // target days per week (1-7)
  log: Record<string, boolean>; // { "2026-06-25": true }
  createdAt: number;
}

export type TxType = "ingreso" | "gasto";

export interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  category: string;
  note?: string;
  date: string; // ISO date
  createdAt: number;
}

export interface BudgetCategory {
  id: string;
  name: string;
  limit: number; // monthly limit
  color: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  target: number;
  current: number;
  unit: string;
  deadline?: string;
  createdAt: number;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO date
  mood: number; // 1-5
  title: string;
  content: string;
  createdAt: number;
}

export type ThemeMode = "light" | "dark";

export interface AppState {
  profileName: string;
  currency: string;
  theme: ThemeMode;
  tasks: Task[];
  habits: Habit[];
  transactions: Transaction[];
  budgets: BudgetCategory[];
  goals: Goal[];
  journal: JournalEntry[];
  appliedTemplates: string[];
}

// ---- Template seed types (no ids / timestamps yet) ----

export type ViewId =
  | "dashboard"
  | "tasks"
  | "habits"
  | "finance"
  | "goals"
  | "journal"
  | "calendar"
  | "templates"
  | "settings";

export interface TemplateSeed {
  tasks?: Array<Pick<Task, "title" | "priority" | "category"> & { dueInDays?: number }>;
  habits?: Array<Pick<Habit, "name" | "icon" | "color" | "target">>;
  budgets?: Array<Pick<BudgetCategory, "name" | "limit" | "color">>;
  goals?: Array<
    Pick<Goal, "title" | "target" | "current" | "unit"> & {
      description?: string;
      deadlineInDays?: number;
    }
  >;
}

export interface LifeTemplate {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  accent: string; // tailwind color key
  highlights: string[];
  seed: TemplateSeed;
}
