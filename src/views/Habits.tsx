import { useState } from "react";
import { useApp } from "../store";
import {
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  Modal,
  SectionTitle,
  Select,
} from "../ui";
import { FlameIcon, HabitsIcon, PlusIcon, TrashIcon } from "../icons";
import { colors, COLOR_KEYS } from "../lib/colors";
import { cx, currentWeekDays, todayISO } from "../lib/utils";

const WEEKDAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];
const ICON_CHOICES = ["💧", "🏃", "📚", "🧘", "😴", "🍳", "🧹", "🎯", "🧠", "👟", "🌙", "📝"];

function streak(log: Record<string, boolean>): number {
  let count = 0;
  const d = new Date();
  // If today not done, start counting from yesterday
  if (!log[todayISO()]) d.setDate(d.getDate() - 1);
  for (;;) {
    const iso = d.toISOString().slice(0, 10);
    if (log[iso]) {
      count++;
      d.setDate(d.getDate() - 1);
    } else break;
  }
  return count;
}

export default function Habits() {
  const { state, addHabit, toggleHabitDay, deleteHabit } = useApp();
  const [open, setOpen] = useState(false);
  const week = currentWeekDays();
  const today = todayISO();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🎯");
  const [color, setColor] = useState("indigo");
  const [target, setTarget] = useState(5);

  function submit() {
    if (!name.trim()) return;
    addHabit({ name: name.trim(), icon, color, target });
    setName("");
    setIcon("🎯");
    setColor("indigo");
    setTarget(5);
    setOpen(false);
  }

  return (
    <div>
      <SectionTitle
        title="Hábitos"
        subtitle="Marca cada día para construir tu racha"
        action={
          <Button onClick={() => setOpen(true)}>
            <PlusIcon width={16} height={16} /> Nuevo hábito
          </Button>
        }
      />

      {state.habits.length === 0 ? (
        <EmptyState
          icon={<HabitsIcon />}
          title="Aún no sigues ningún hábito"
          hint="Añade hábitos como beber agua, leer o entrenar y haz seguimiento diario."
        />
      ) : (
        <div className="space-y-3">
          {state.habits.map((h) => {
            const c = colors(h.color);
            const doneThisWeek = week.filter((d) => h.log[d]).length;
            const s = streak(h.log);
            return (
              <Card key={h.id} className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cx(
                        "flex h-10 w-10 items-center justify-center rounded-xl text-lg",
                        c.softBg
                      )}
                    >
                      {h.icon}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-100">
                        {h.name}
                      </p>
                      <p className="flex items-center gap-2 text-xs text-slate-400">
                        <span>
                          {doneThisWeek}/{h.target} esta semana
                        </span>
                        {s > 0 && (
                          <span className="inline-flex items-center gap-0.5 font-medium text-amber-500">
                            <FlameIcon width={12} height={12} /> {s} día{s === 1 ? "" : "s"}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteHabit(h.id)}
                    className="rounded-lg p-2 text-slate-300 hover:bg-rose-50 hover:text-rose-500 dark:text-slate-600 dark:hover:bg-rose-500/10"
                    aria-label="Eliminar"
                  >
                    <TrashIcon width={16} height={16} />
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-7 gap-1.5">
                  {week.map((d, i) => {
                    const active = !!h.log[d];
                    const isToday = d === today;
                    const isFuture = d > today;
                    return (
                      <button
                        key={d}
                        disabled={isFuture}
                        onClick={() => toggleHabitDay(h.id, d)}
                        className={cx(
                          "flex flex-col items-center gap-1 rounded-lg py-2 text-xs transition-colors",
                          isFuture && "cursor-not-allowed opacity-40",
                          active
                            ? cx(c.bg, "text-white")
                            : "bg-slate-100 text-slate-400 hover:bg-slate-200 dark:bg-slate-700/60 dark:hover:bg-slate-700"
                        )}
                      >
                        <span className="font-medium">{WEEKDAY_LABELS[i]}</span>
                        <span
                          className={cx(
                            "flex h-1.5 w-1.5 rounded-full",
                            active ? "bg-white" : "bg-transparent",
                            isToday && !active && "bg-indigo-400"
                          )}
                        />
                      </button>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Nuevo hábito">
        <div className="space-y-4">
          <Field label="Nombre del hábito">
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Beber 2L de agua"
            />
          </Field>

          <Field label="Icono">
            <div className="flex flex-wrap gap-1.5">
              {ICON_CHOICES.map((ic) => (
                <button
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className={cx(
                    "flex h-10 w-10 items-center justify-center rounded-xl text-lg transition-all",
                    icon === ic
                      ? "bg-indigo-100 ring-2 ring-indigo-500 dark:bg-indigo-500/20"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/60"
                  )}
                >
                  {ic}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Color">
            <div className="flex flex-wrap gap-2">
              {COLOR_KEYS.map((k) => (
                <button
                  key={k}
                  onClick={() => setColor(k)}
                  className={cx(
                    "h-8 w-8 rounded-full transition-transform",
                    colors(k).bg,
                    color === k
                      ? "ring-2 ring-slate-900 ring-offset-2 dark:ring-white dark:ring-offset-slate-800"
                      : "hover:scale-110"
                  )}
                  aria-label={k}
                />
              ))}
            </div>
          </Field>

          <Field label="Objetivo semanal">
            <Select value={target} onChange={(e) => setTarget(Number(e.target.value))}>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <option key={n} value={n}>
                  {n} día{n === 1 ? "" : "s"} / semana
                </option>
              ))}
            </Select>
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={submit}>Añadir</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
