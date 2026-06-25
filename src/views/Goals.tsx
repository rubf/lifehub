import { useState } from "react";
import { useApp } from "../store";
import {
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  Modal,
  ProgressBar,
  SectionTitle,
  Textarea,
} from "../ui";
import { GoalsIcon, PlusIcon, TrashIcon } from "../icons";
import { cx, formatDate } from "../lib/utils";

export default function Goals() {
  const { state, addGoal, updateGoalProgress, deleteGoal } = useApp();
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState("");
  const [unit, setUnit] = useState("");
  const [deadline, setDeadline] = useState("");

  function submit() {
    const t = parseFloat(target.replace(",", "."));
    if (!title.trim() || !t || t <= 0) return;
    addGoal({
      title: title.trim(),
      description: description.trim() || undefined,
      target: t,
      current: 0,
      unit: unit.trim() || "u.",
      deadline: deadline || undefined,
    });
    setTitle("");
    setDescription("");
    setTarget("");
    setUnit("");
    setDeadline("");
    setOpen(false);
  }

  const completed = state.goals.filter((g) => g.current >= g.target).length;

  return (
    <div>
      <SectionTitle
        title="Metas"
        subtitle={`${completed} de ${state.goals.length} completadas`}
        action={
          <Button onClick={() => setOpen(true)}>
            <PlusIcon width={16} height={16} /> Nueva meta
          </Button>
        }
      />

      {state.goals.length === 0 ? (
        <EmptyState
          icon={<GoalsIcon />}
          title="Sin metas definidas"
          hint="Define objetivos medibles y sigue tu progreso paso a paso."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {state.goals.map((g) => {
            const pct = Math.min(100, (g.current / g.target) * 100);
            const done = g.current >= g.target;
            const step = Math.max(1, Math.round(g.target / 20));
            return (
              <Card key={g.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                      {g.title}
                    </p>
                    {g.description && (
                      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                        {g.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteGoal(g.id)}
                    className="rounded-lg p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10"
                    aria-label="Eliminar"
                  >
                    <TrashIcon width={16} height={16} />
                  </button>
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <span
                    className={cx(
                      "text-2xl font-semibold",
                      done ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"
                    )}
                  >
                    {g.current}
                    <span className="text-base font-normal text-slate-400">
                      {" "}
                      / {g.target} {g.unit}
                    </span>
                  </span>
                  <span className="text-sm font-medium text-slate-500">
                    {Math.round(pct)}%
                  </span>
                </div>

                <ProgressBar
                  className="mt-2"
                  value={pct}
                  color={done ? "emerald" : "indigo"}
                />

                <div className="mt-4 flex items-center justify-between">
                  {g.deadline ? (
                    <span className="text-xs text-slate-400">
                      Fecha límite: {formatDate(g.deadline, { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  ) : (
                    <span />
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="soft"
                      onClick={() => updateGoalProgress(g.id, g.current - step)}
                      disabled={g.current <= 0}
                      className="px-3 py-1.5"
                    >
                      −{step}
                    </Button>
                    <Button
                      variant="soft"
                      onClick={() => updateGoalProgress(g.id, g.current + step)}
                      disabled={done}
                      className="px-3 py-1.5"
                    >
                      +{step}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Nueva meta">
        <div className="space-y-4">
          <Field label="Título">
            <Input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Ahorrar para vacaciones"
            />
          </Field>
          <Field label="Descripción (opcional)">
            <Textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Objetivo (número)">
              <Input
                inputMode="decimal"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="100"
              />
            </Field>
            <Field label="Unidad">
              <Input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="€, km, libros..."
              />
            </Field>
          </div>
          <Field label="Fecha límite (opcional)">
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={submit}>Crear</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
