import type {
  AppState,
  BudgetCategory,
  Goal,
  Habit,
  JournalEntry,
  Task,
  ThemeMode,
  Transaction,
  TxType,
} from "../types";
import { uid } from "./utils";

// LifeHub stores several kinds of records (tasks, habits, transactions...).
// To keep everything in a single, spreadsheet-friendly CSV we use one wide
// table with a leading "seccion" column that says what each row represents.
// Import is order-independent because we look up columns by their header name.

const HEADER = [
  "seccion",
  "id",
  "titulo",
  "detalle",
  "categoria",
  "prioridad",
  "estado",
  "fecha",
  "icono",
  "color",
  "objetivo",
  "progreso",
  "unidad",
  "monto",
  "animo",
  "registro",
  "creado",
] as const;

type Row = Record<(typeof HEADER)[number], string | number | undefined>;

function emptyRow(): Row {
  return Object.fromEntries(HEADER.map((h) => [h, ""])) as Row;
}

// ---------- CSV primitives ----------

function escapeField(value: string | number | undefined): string {
  const v = value == null ? "" : String(value);
  if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

function rowsToCSV(rows: Row[]): string {
  const lines = [HEADER.join(",")];
  for (const r of rows) {
    lines.push(HEADER.map((h) => escapeField(r[h])).join(","));
  }
  return lines.join("\r\n");
}

/** Robust CSV parser supporting quotes, escaped quotes and newlines in fields. */
export function parseCSV(text: string): string[][] {
  const s = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
    } else {
      if (c === '"') {
        inQuotes = true;
        i++;
      } else if (c === ",") {
        row.push(field);
        field = "";
        i++;
      } else if (c === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
        i++;
      } else {
        field += c;
        i++;
      }
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

// ---------- Export ----------

export function stateToCSV(state: AppState): string {
  const rows: Row[] = [];

  // Settings / profile
  const settings = emptyRow();
  settings.seccion = "ajustes";
  settings.titulo = state.profileName;
  settings.categoria = state.currency;
  settings.estado = state.theme;
  rows.push(settings);

  for (const t of state.tasks) {
    const r = emptyRow();
    r.seccion = "tarea";
    r.id = t.id;
    r.titulo = t.title;
    r.categoria = t.category;
    r.prioridad = t.priority;
    r.estado = t.done ? "hecha" : "pendiente";
    r.fecha = t.due ?? "";
    r.creado = t.createdAt;
    rows.push(r);
  }

  for (const h of state.habits) {
    const r = emptyRow();
    r.seccion = "habito";
    r.id = h.id;
    r.titulo = h.name;
    r.icono = h.icon;
    r.color = h.color;
    r.objetivo = h.target;
    r.registro = Object.keys(h.log)
      .filter((d) => h.log[d])
      .sort()
      .join(";");
    r.creado = h.createdAt;
    rows.push(r);
  }

  for (const tx of state.transactions) {
    const r = emptyRow();
    r.seccion = "movimiento";
    r.id = tx.id;
    r.categoria = tx.category;
    r.detalle = tx.note ?? "";
    r.estado = tx.type; // ingreso / gasto
    r.fecha = tx.date;
    r.monto = tx.amount;
    r.creado = tx.createdAt;
    rows.push(r);
  }

  for (const b of state.budgets) {
    const r = emptyRow();
    r.seccion = "presupuesto";
    r.id = b.id;
    r.titulo = b.name;
    r.color = b.color;
    r.monto = b.limit;
    rows.push(r);
  }

  for (const g of state.goals) {
    const r = emptyRow();
    r.seccion = "meta";
    r.id = g.id;
    r.titulo = g.title;
    r.detalle = g.description ?? "";
    r.objetivo = g.target;
    r.progreso = g.current;
    r.unidad = g.unit;
    r.fecha = g.deadline ?? "";
    r.creado = g.createdAt;
    rows.push(r);
  }

  for (const e of state.journal) {
    const r = emptyRow();
    r.seccion = "diario";
    r.id = e.id;
    r.titulo = e.title;
    r.detalle = e.content;
    r.animo = e.mood;
    r.fecha = e.date;
    r.creado = e.createdAt;
    rows.push(r);
  }

  return rowsToCSV(rows);
}

// ---------- Import ----------

const num = (v: string | undefined, fallback = 0): number => {
  const n = parseFloat(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : fallback;
};
const ts = (v: string | undefined): number => {
  const n = parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) && n > 0 ? n : Date.now();
};

export interface ImportResult {
  state: AppState;
  counts: Record<string, number>;
}

/**
 * Parses a CSV previously produced by `stateToCSV` (or compatible) and rebuilds
 * the application state. Throws if the file does not look like a LifeHub export.
 */
export function csvToState(text: string): ImportResult {
  const matrix = parseCSV(text).filter((r) => r.some((c) => c.trim() !== ""));
  if (matrix.length === 0) throw new Error("El archivo está vacío.");

  const header = matrix[0].map((h) => h.trim().toLowerCase());
  if (!header.includes("seccion")) {
    throw new Error(
      "El CSV no tiene el formato de LifeHub (falta la columna 'seccion')."
    );
  }
  const col = (name: string) => header.indexOf(name);
  const get = (row: string[], name: string): string => {
    const i = col(name);
    return i >= 0 ? (row[i] ?? "").trim() : "";
  };

  const state: AppState = {
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
  const counts: Record<string, number> = {
    tareas: 0,
    habitos: 0,
    movimientos: 0,
    presupuestos: 0,
    metas: 0,
    diario: 0,
  };

  for (let i = 1; i < matrix.length; i++) {
    const row = matrix[i];
    const seccion = get(row, "seccion").toLowerCase();
    const id = get(row, "id") || uid();

    switch (seccion) {
      case "ajustes": {
        state.profileName = get(row, "titulo");
        const currency = get(row, "categoria");
        if (currency) state.currency = currency;
        const theme = get(row, "estado").toLowerCase();
        if (theme === "dark" || theme === "light") state.theme = theme as ThemeMode;
        break;
      }
      case "tarea": {
        const task: Task = {
          id,
          title: get(row, "titulo"),
          done: ["hecha", "true", "si", "sí", "1"].includes(
            get(row, "estado").toLowerCase()
          ),
          priority: (["alta", "media", "baja"].includes(get(row, "prioridad"))
            ? get(row, "prioridad")
            : "media") as Task["priority"],
          category: get(row, "categoria") || "General",
          due: get(row, "fecha") || undefined,
          createdAt: ts(get(row, "creado")),
        };
        if (task.title) {
          state.tasks.push(task);
          counts.tareas++;
        }
        break;
      }
      case "habito": {
        const log: Record<string, boolean> = {};
        const reg = get(row, "registro");
        if (reg) for (const d of reg.split(";")) if (d.trim()) log[d.trim()] = true;
        const habit: Habit = {
          id,
          name: get(row, "titulo"),
          icon: get(row, "icono") || "🎯",
          color: get(row, "color") || "indigo",
          target: Math.min(7, Math.max(1, num(get(row, "objetivo"), 5))),
          log,
          createdAt: ts(get(row, "creado")),
        };
        if (habit.name) {
          state.habits.push(habit);
          counts.habitos++;
        }
        break;
      }
      case "movimiento": {
        const type = (get(row, "estado").toLowerCase() === "ingreso"
          ? "ingreso"
          : "gasto") as TxType;
        const tx: Transaction = {
          id,
          type,
          amount: Math.abs(num(get(row, "monto"))),
          category: get(row, "categoria") || "General",
          note: get(row, "detalle") || undefined,
          date: get(row, "fecha") || new Date().toISOString().slice(0, 10),
          createdAt: ts(get(row, "creado")),
        };
        if (tx.amount > 0) {
          state.transactions.push(tx);
          counts.movimientos++;
        }
        break;
      }
      case "presupuesto": {
        const budget: BudgetCategory = {
          id,
          name: get(row, "titulo"),
          limit: num(get(row, "monto")),
          color: get(row, "color") || "indigo",
        };
        if (budget.name && budget.limit > 0) {
          state.budgets.push(budget);
          counts.presupuestos++;
        }
        break;
      }
      case "meta": {
        const goal: Goal = {
          id,
          title: get(row, "titulo"),
          description: get(row, "detalle") || undefined,
          target: num(get(row, "objetivo"), 1),
          current: num(get(row, "progreso")),
          unit: get(row, "unidad") || "u.",
          deadline: get(row, "fecha") || undefined,
          createdAt: ts(get(row, "creado")),
        };
        if (goal.title) {
          state.goals.push(goal);
          counts.metas++;
        }
        break;
      }
      case "diario": {
        const entry: JournalEntry = {
          id,
          date: get(row, "fecha") || new Date().toISOString().slice(0, 10),
          mood: Math.min(5, Math.max(1, num(get(row, "animo"), 3))),
          title: get(row, "titulo") || "Sin título",
          content: get(row, "detalle"),
          createdAt: ts(get(row, "creado")),
        };
        state.journal.push(entry);
        counts.diario++;
        break;
      }
    }
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total === 0 && !state.profileName) {
    throw new Error("No se encontraron datos válidos en el archivo.");
  }

  return { state, counts };
}

/** Triggers a browser download of the given text as a file. */
export function downloadTextFile(filename: string, content: string): void {
  // BOM so Excel opens UTF-8 (accents) correctly.
  const blob = new Blob(["\uFEFF" + content], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
