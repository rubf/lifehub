import { useState } from "react";
import { useApp } from "../store";
import { Button, Card, Field, Input, SectionTitle, Select } from "../ui";

const CURRENCIES = ["EUR", "USD", "MXN", "COP", "ARS", "CLP", "GBP", "BRL"];

export default function Settings() {
  const { state, setProfileName, setCurrency, resetAll } = useApp();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="max-w-2xl">
      <SectionTitle title="Ajustes" subtitle="Personaliza tu LifeHub" />

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

        <Card className="p-5">
          <h3 className="mb-1 font-semibold text-slate-800 dark:text-slate-100">
            Datos
          </h3>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
            Toda tu información se guarda únicamente en este navegador (localStorage).
            No se envía a ningún servidor.
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
