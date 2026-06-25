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
  Textarea,
} from "../ui";
import { JournalIcon, PlusIcon, TrashIcon } from "../icons";
import { cx, formatDate, todayISO } from "../lib/utils";

const MOODS = [
  { value: 1, emoji: "😞", label: "Mal" },
  { value: 2, emoji: "😕", label: "Regular" },
  { value: 3, emoji: "😐", label: "Normal" },
  { value: 4, emoji: "🙂", label: "Bien" },
  { value: 5, emoji: "😄", label: "Genial" },
];

export default function Journal() {
  const { state, addJournal, deleteJournal } = useApp();
  const [open, setOpen] = useState(false);

  const [date, setDate] = useState(todayISO());
  const [mood, setMood] = useState(4);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function submit() {
    if (!content.trim() && !title.trim()) return;
    addJournal({
      date,
      mood,
      title: title.trim() || "Sin título",
      content: content.trim(),
    });
    setTitle("");
    setContent("");
    setMood(4);
    setDate(todayISO());
    setOpen(false);
  }

  return (
    <div>
      <SectionTitle
        title="Diario"
        subtitle="Registra cómo te sientes y lo que ocurre cada día"
        action={
          <Button onClick={() => setOpen(true)}>
            <PlusIcon width={16} height={16} /> Nueva entrada
          </Button>
        }
      />

      {state.journal.length === 0 ? (
        <EmptyState
          icon={<JournalIcon />}
          title="Tu diario está vacío"
          hint="Escribe tu primera entrada para llevar un registro de tu bienestar."
        />
      ) : (
        <div className="space-y-3">
          {state.journal.map((e) => {
            const m = MOODS.find((x) => x.value === e.mood) ?? MOODS[2];
            return (
              <Card key={e.id} className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-slate-100 text-2xl dark:bg-slate-700/60"
                    title={m.label}
                  >
                    {m.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-slate-800 dark:text-slate-100">
                        {e.title}
                      </p>
                      <button
                        onClick={() => deleteJournal(e.id)}
                        className="rounded-lg p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10"
                        aria-label="Eliminar"
                      >
                        <TrashIcon width={16} height={16} />
                      </button>
                    </div>
                    <p className="text-xs text-slate-400">
                      {formatDate(e.date, { weekday: "long", day: "numeric", month: "long" })}
                    </p>
                    {e.content && (
                      <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">
                        {e.content}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Nueva entrada">
        <div className="space-y-4">
          <Field label="¿Cómo te sientes hoy?">
            <div className="flex justify-between gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMood(m.value)}
                  className={cx(
                    "flex flex-1 flex-col items-center gap-1 rounded-xl py-2 transition-all",
                    mood === m.value
                      ? "bg-indigo-50 ring-2 ring-indigo-500 dark:bg-indigo-500/20"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/60"
                  )}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Título">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Un día productivo"
              />
            </Field>
            <Field label="Fecha">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
          </div>
          <Field label="¿Qué quieres recordar?">
            <Textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe lo que pasó, cómo te sentiste, qué aprendiste..."
            />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={submit}>Guardar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
