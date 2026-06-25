import { useMemo, useState } from "react";
import { useApp } from "../store";
import type { Priority } from "../types";
import {
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  Modal,
  Pill,
  SectionTitle,
  Select,
} from "../ui";
import { CheckIcon, PlusIcon, TasksIcon, TrashIcon } from "../icons";
import { cx, formatDate, todayISO } from "../lib/utils";

const PRIORITY_COLOR: Record<Priority, string> = {
  alta: "rose",
  media: "amber",
  baja: "sky",
};

type Filter = "todas" | "pendientes" | "hechas";

export default function Tasks() {
  const { state, addTask, toggleTask, deleteTask } = useApp();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("todas");

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("media");
  const [category, setCategory] = useState("General");
  const [due, setDue] = useState("");

  const filtered = useMemo(() => {
    const list = state.tasks;
    if (filter === "pendientes") return list.filter((t) => !t.done);
    if (filter === "hechas") return list.filter((t) => t.done);
    return list;
  }, [state.tasks, filter]);

  const pending = state.tasks.filter((t) => !t.done).length;

  function submit() {
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      priority,
      category: category.trim() || "General",
      due: due || undefined,
    });
    setTitle("");
    setDue("");
    setPriority("media");
    setOpen(false);
  }

  return (
    <div>
      <SectionTitle
        title="Tareas"
        subtitle={`${pending} pendiente${pending === 1 ? "" : "s"} de ${state.tasks.length}`}
        action={
          <Button onClick={() => setOpen(true)}>
            <PlusIcon width={16} height={16} /> Nueva tarea
          </Button>
        }
      />

      <div className="mb-4 flex gap-2">
        {(["todas", "pendientes", "hechas"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cx(
              "rounded-full px-3.5 py-1.5 text-sm font-medium capitalize transition-colors",
              filter === f
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700/60 dark:text-slate-300"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<TasksIcon />}
          title="Sin tareas por aquí"
          hint="Crea una tarea o aplica una plantilla para empezar con un plan listo."
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((t) => (
            <Card key={t.id} className="px-4 py-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTask(t.id)}
                  className={cx(
                    "flex h-6 w-6 flex-none items-center justify-center rounded-full border-2 transition-colors",
                    t.done
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-slate-300 text-transparent hover:border-indigo-400 dark:border-slate-600"
                  )}
                  aria-label="Completar"
                >
                  <CheckIcon width={14} height={14} />
                </button>

                <div className="min-w-0 flex-1">
                  <p
                    className={cx(
                      "truncate text-sm font-medium",
                      t.done
                        ? "text-slate-400 line-through dark:text-slate-500"
                        : "text-slate-800 dark:text-slate-100"
                    )}
                  >
                    {t.title}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Pill color={PRIORITY_COLOR[t.priority]}>{t.priority}</Pill>
                    <Pill color="violet">{t.category}</Pill>
                    {t.due && (
                      <span
                        className={cx(
                          "text-xs",
                          !t.done && t.due < todayISO()
                            ? "font-medium text-rose-500"
                            : "text-slate-400"
                        )}
                      >
                        {t.due < todayISO() && !t.done ? "Vencida · " : ""}
                        {formatDate(t.due)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => deleteTask(t.id)}
                  className="flex-none rounded-lg p-2 text-slate-300 hover:bg-rose-50 hover:text-rose-500 dark:text-slate-600 dark:hover:bg-rose-500/10"
                  aria-label="Eliminar"
                >
                  <TrashIcon width={16} height={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Nueva tarea">
        <div className="space-y-4">
          <Field label="¿Qué hay que hacer?">
            <Input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Ej. Preparar presentación"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prioridad">
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </Select>
            </Field>
            <Field label="Categoría">
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="General"
              />
            </Field>
          </div>
          <Field label="Fecha límite (opcional)">
            <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
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
