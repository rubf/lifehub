import { useRef, useState } from "react";
import { useApp } from "../store";
import { Button, Card, Field, Input, SectionTitle, Select } from "../ui";
import { csvToState, downloadTextFile, stateToCSV } from "../lib/csv";
import { todayISO } from "../lib/utils";

const CURRENCIES = ["EUR", "USD", "MXN", "COP", "ARS", "CLP", "GBP", "BRL"];

type Notice = { kind: "ok" | "error"; text: string } | null;

export default function Settings() {
  const { state, setProfileName, setCurrency, resetAll, importData } = useApp();
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const csv = stateToCSV(state);
    downloadTextFile(`lifehub-${todayISO()}.csv`, csv);
    setNotice({ kind: "ok", text: "Archivo CSV descargado. Guárdalo en tu PC." });
  }

  function handleImportFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result ?? "");
        const { state: next, counts } = csvToState(text);
        importData(next);
        const parts = Object.entries(counts)
          .filter(([, n]) => n > 0)
          .map(([k, n]) => `${n} ${k}`);
        setNotice({
          kind: "ok",
          text:
            parts.length > 0
              ? `Datos cargados: ${parts.join(", ")}.`
              : "Archivo cargado correctamente.",
        });
      } catch (err) {
        setNotice({
          kind: "error",
          text: err instanceof Error ? err.message : "No se pudo leer el archivo.",
        });
      }
    };
    reader.onerror = () =>
      setNotice({ kind: "error", text: "No se pudo leer el archivo." });
    reader.readAsText(file);
  }

  return (
    <div className="max-w-2xl">
      <SectionTitle title="Ajustes" subtitle="Personaliza y respalda tu LifeHub" />

      <div className="space-y-4">
        <Card className="p-5">
          <h3 className="mb-4 font-semibold text-slate-800 dark:text-slate-100">
            Perfil
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Tu nombre">
              <Input
                value={state.profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="¿Cómo te llamas?"
              />
            </Field>
            <Field label="Moneda">
              <Select value={state.currency} onChange={(e) => setCurrency(e.target.value)}>
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </Card>

        {/* Backup / CSV */}
        <Card className="p-5">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">
            Copia de seguridad
          </h3>
          <p className="mt-1 mb-4 text-sm text-slate-500 dark:text-slate-400">
            Tus datos ya se guardan en este navegador, pero puedes exportarlos a un
            archivo CSV para guardarlos en tu PC, llevarlos a otro equipo o no
            perderlos si borras el navegador. Vuelve a importarlo cuando quieras para
            recuperar todo.
          </p>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleExport}>Exportar a CSV</Button>
            <Button variant="soft" onClick={() => fileRef.current?.click()}>
              Importar desde CSV
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleImportFile(f);
                e.target.value = ""; // allow re-importing the same file
              }}
            />
          </div>

          {notice && (
            <p
              className={
                "mt-3 rounded-xl px-3 py-2 text-sm " +
                (notice.kind === "ok"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300")
              }
            >
              {notice.text}
            </p>
          )}

          <p className="mt-3 text-xs text-slate-400">
            Nota: al importar un CSV se reemplazan los datos actuales por los del
            archivo.
          </p>
        </Card>

        <Card className="p-5">
          <h3 className="mb-1 font-semibold text-slate-800 dark:text-slate-100">
            Borrar datos
          </h3>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
            Elimina todo lo guardado en este navegador. Esta acción no se puede
            deshacer (exporta una copia antes si quieres conservarla).
          </p>
          {!confirming ? (
            <Button variant="danger" onClick={() => setConfirming(true)}>
              Borrar todos los datos
            </Button>
          ) : (
            <div className="flex flex-wrap items-center gap-2 rounded-xl bg-rose-50 p-3 dark:bg-rose-500/10">
              <span className="text-sm text-rose-700 dark:text-rose-300">
                ¿Seguro? Esto eliminará tareas, hábitos, finanzas, metas y diario.
              </span>
              <div className="ml-auto flex gap-2">
                <Button variant="ghost" onClick={() => setConfirming(false)}>
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    resetAll();
                    setConfirming(false);
                    setNotice(null);
                  }}
                >
                  Sí, borrar
                </Button>
              </div>
            </div>
          )}
        </Card>

        <p className="text-center text-xs text-slate-400">
          LifeHub · Organiza tu vida en un solo lugar
        </p>
      </div>
    </div>
  );
}
