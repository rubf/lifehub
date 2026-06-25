import { useMemo, useState } from "react";
import { useApp } from "../store";
import { Card, EmptyState, Pill, SectionTitle } from "../ui";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "../icons";
import {
  cx,
  formatDate,
  formatMoney,
  monthMatrix,
  MONTHS,
  todayISO,
} from "../lib/utils";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTHS_SHORT = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

type View = "days" | "months" | "years";

interface DayItem {
  kind: "task" | "tx" | "journal" | "goal";
  color: string;
  label: string;
  detail?: string;
}

export default function Calendar() {
  const { state } = useApp();
  const today = todayISO();
  const now = new Date();

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState(today);
  const [view, setView] = useState<View>("days");
  // Primer año del bloque de 12 que se muestra en la vista de años.
  const [yearStart, setYearStart] = useState(now.getFullYear() - 5);

  // Build a map ISO date -> items for fast lookup.
  const byDate = useMemo(() => {
    const map: Record<string, DayItem[]> = {};
    const push = (date: string, item: DayItem) => {
      (map[date] ??= []).push(item);
    };
    for (const t of state.tasks) {
      if (t.due)
        push(t.due, {
          kind: "task",
          color: t.done ? "emerald" : "indigo",
          label: t.title,
          detail: t.done ? "Tarea completada" : `Tarea · ${t.priority}`,
        });
    }
    for (const tx of state.transactions) {
      push(tx.date, {
        kind: "tx",
        color: tx.type === "ingreso" ? "emerald" : "rose",
        label: tx.category,
        detail: `${tx.type === "ingreso" ? "+" : "−"}${formatMoney(tx.amount, state.currency)}`,
      });
    }
    for (const e of state.journal) {
      push(e.date, { kind: "journal", color: "violet", label: e.title, detail: "Diario" });
    }
    for (const g of state.goals) {
      if (g.deadline)
        push(g.deadline, {
          kind: "goal",
          color: "amber",
          label: g.title,
          detail: "Fecha límite de meta",
        });
    }
    return map;
  }, [state]);

  const weeks = useMemo(() => monthMatrix(year, month), [year, month]);
  const selectedItems = byDate[selected] ?? [];
  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;

  function shiftMonth(delta: number) {
    let m = month + delta;
    let y = year;
    if (m < 0) {
      m = 11;
      y--;
    } else if (m > 11) {
      m = 0;
      y++;
    }
    setMonth(m);
    setYear(y);
  }

  function goToday() {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setSelected(today);
    setView("days");
  }

  function openYears() {
    setYearStart(year - 5);
    setView("years");
  }

  function prev() {
    if (view === "days") shiftMonth(-1);
    else if (view === "months") setYear((y) => y - 1);
    else setYearStart((s) => s - 12);
  }
  function next() {
    if (view === "days") shiftMonth(1);
    else if (view === "months") setYear((y) => y + 1);
    else setYearStart((s) => s + 12);
  }

  const titleBtn =
    "rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700";
  const gridCell =
    "flex items-center justify-center rounded-xl py-4 text-sm font-medium transition-colors";

  return (
    <div>
      <SectionTitle
        title="Calendario"
        subtitle="Todo lo que tiene fecha: tareas, movimientos, diario y metas"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_20rem]">
        <Card className="p-4 sm:p-5">
          {/* Cabecera de navegación */}
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              {view === "days" && (
                <>
                  <button onClick={() => setView("months")} className={titleBtn}>
                    {MONTHS[month]}
                  </button>
                  <button onClick={openYears} className={titleBtn}>
                    {year}
                  </button>
                </>
              )}
              {view === "months" && (
                <button onClick={openYears} className={titleBtn}>
                  {year}
                </button>
              )}
              {view === "years" && (
                <span className="px-2.5 py-1.5 text-sm font-semibold text-slate-800 dark:text-white">
                  {yearStart} – {yearStart + 11}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={goToday}
                className="mr-1 rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10"
              >
                Hoy
              </button>
              <button
                onClick={prev}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label="Anterior"
              >
                <ChevronLeftIcon width={18} height={18} />
              </button>
              <button
                onClick={next}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label="Siguiente"
              >
                <ChevronRightIcon width={18} height={18} />
              </button>
            </div>
          </div>

          {/* Vista de días */}
          {view === "days" && (
            <>
              <div className="mb-1 grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-400">
                {WEEKDAYS.map((d) => (
                  <div key={d} className="py-1">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {weeks.flat().map((iso) => {
                  const inMonth = iso.startsWith(monthPrefix);
                  const isToday = iso === today;
                  const isSelected = iso === selected;
                  const items = byDate[iso] ?? [];
                  const dayNum = Number(iso.slice(8, 10));
                  return (
                    <button
                      key={iso}
                      onClick={() => setSelected(iso)}
                      className={cx(
                        "flex aspect-square flex-col items-center justify-start rounded-xl p-1 text-sm transition-colors",
                        !inMonth && "text-slate-300 dark:text-slate-600",
                        inMonth && "text-slate-700 dark:text-slate-200",
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "hover:bg-slate-100 dark:hover:bg-slate-700/60"
                      )}
                    >
                      <span
                        className={cx(
                          "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                          isToday &&
                            !isSelected &&
                            "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                        )}
                      >
                        {dayNum}
                      </span>
                      {items.length > 0 && (
                        <span className="mt-0.5 flex flex-wrap justify-center gap-0.5">
                          {items.slice(0, 3).map((it, i) => (
                            <span
                              key={i}
                              className={cx(
                                "h-1.5 w-1.5 rounded-full",
                                isSelected ? "bg-white/80" : dotColor(it.color)
                              )}
                            />
                          ))}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                <Legend color="bg-indigo-500" label="Tareas" />
                <Legend color="bg-emerald-500" label="Ingresos / hechas" />
                <Legend color="bg-rose-500" label="Gastos" />
                <Legend color="bg-violet-500" label="Diario" />
                <Legend color="bg-amber-500" label="Metas" />
              </div>
            </>
          )}

          {/* Vista de meses */}
          {view === "months" && (
            <div className="grid grid-cols-3 gap-2">
              {MONTHS_SHORT.map((name, i) => {
                const isCurrent = i === month;
                const isThisMonth =
                  i === now.getMonth() && year === now.getFullYear();
                return (
                  <button
                    key={name}
                    onClick={() => {
                      setMonth(i);
                      setView("days");
                    }}
                    className={cx(
                      gridCell,
                      isCurrent
                        ? "bg-indigo-600 text-white"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700/60",
                      isThisMonth && !isCurrent && "ring-2 ring-indigo-400"
                    )}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          )}

          {/* Vista de años (bloques de 12) */}
          {view === "years" && (
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 12 }, (_, idx) => yearStart + idx).map((y) => {
                const isCurrent = y === year;
                const isThisYear = y === now.getFullYear();
                return (
                  <button
                    key={y}
                    onClick={() => {
                      setYear(y);
                      setView("months");
                    }}
                    className={cx(
                      gridCell,
                      isCurrent
                        ? "bg-indigo-600 text-white"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700/60",
                      isThisYear && !isCurrent && "ring-2 ring-indigo-400"
                    )}
                  >
                    {y}
                  </button>
                );
              })}
            </div>
          )}
        </Card>

        {/* Selected day detail */}
        <Card className="p-5">
          <h3 className="font-semibold capitalize text-slate-900 dark:text-white">
            {formatDate(selected, { weekday: "long", day: "numeric", month: "long" })}
          </h3>
          <p className="mb-4 text-xs text-slate-400">
            {selectedItems.length} evento{selectedItems.length === 1 ? "" : "s"}
          </p>
          {selectedItems.length === 0 ? (
            <EmptyState
              icon={<CalendarIcon />}
              title="Sin eventos"
              hint="Las tareas con fecha, movimientos, entradas del diario y metas aparecerán aquí."
            />
          ) : (
            <div className="space-y-2">
              {selectedItems.map((it, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40"
                >
                  <span className={cx("mt-1.5 h-2 w-2 flex-none rounded-full", dotColor(it.color))} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                      {it.label}
                    </p>
                    {it.detail && <Pill color={it.color}>{it.detail}</Pill>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cx("h-2 w-2 rounded-full", color)} />
      {label}
    </span>
  );
}

function dotColor(key: string): string {
  const map: Record<string, string> = {
    indigo: "bg-indigo-500",
    violet: "bg-violet-500",
    sky: "bg-sky-500",
    emerald: "bg-emerald-500",
    teal: "bg-teal-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
  };
  return map[key] ?? "bg-indigo-500";
}
