import { useApp } from "../store";
import { TEMPLATES } from "../lib/templates";
import { Button, Card, Pill, SectionTitle, Tilt } from "../ui";
import { CheckIcon, SparkleIcon } from "../icons";
import { colors } from "../lib/colors";
import { cx } from "../lib/utils";

export default function Templates() {
  const { state, applyTemplate } = useApp();

  return (
    <div>
      <SectionTitle
        title="Plantillas"
        subtitle="Un punto de partida listo para usar"
      />

      <Card className="mb-6 p-5">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">
          ¿Qué es una plantilla y para qué sirve?
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Una plantilla es un conjunto de elementos de ejemplo pensados para un
          objetivo concreto (estudiar, controlar tus gastos, viajar...). Al pulsar
          <span className="font-medium text-slate-800 dark:text-slate-100"> «Aplicar plantilla»</span>,
          esos elementos se añaden automáticamente a las secciones correspondientes
          de la app, para que no tengas que crear todo desde cero.
        </p>
        <ul className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
          <li className="flex gap-2">
            <span className="text-indigo-500">•</span>
            Las tareas aparecen en <span className="font-medium">Tareas</span>, los
            hábitos en <span className="font-medium">Hábitos</span>, etc.
          </li>
          <li className="flex gap-2">
            <span className="text-indigo-500">•</span>
            No borra nada de lo que ya tengas: <span className="font-medium">suma</span> los
            nuevos elementos a los existentes.
          </li>
          <li className="flex gap-2">
            <span className="text-indigo-500">•</span>
            Todo es editable: puedes modificar o eliminar cualquier elemento después.
          </li>
        </ul>
        <p className="mt-3 text-xs text-slate-400">
          Los números de cada tarjeta (tareas, hábitos, presup., metas) indican
          cuántos elementos añade esa plantilla.
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TEMPLATES.map((tpl) => {
          const c = colors(tpl.accent);
          const applied = state.appliedTemplates.includes(tpl.id);
          return (
            <Tilt key={tpl.id} max={7} className="h-full">
              <Card className="flex h-full flex-col overflow-hidden hover:shadow-elevate">
                <div className={cx("sheen bg-gradient-to-br p-5 text-white", c.gradient)}>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl drop-shadow-sm">{tpl.emoji}</span>
                    {applied && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium backdrop-blur">
                        <CheckIcon width={13} height={13} /> Aplicada
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold">{tpl.name}</h3>
                  <p className="text-sm text-white/85">{tpl.tagline}</p>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {tpl.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {tpl.highlights.map((h) => (
                      <Pill key={h} color={tpl.accent}>
                        {h}
                      </Pill>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs text-slate-500 dark:text-slate-400">
                    <SeedStat n={tpl.seed.tasks?.length ?? 0} label="tareas" />
                    <SeedStat n={tpl.seed.habits?.length ?? 0} label="hábitos" />
                    <SeedStat n={tpl.seed.budgets?.length ?? 0} label="presup." />
                    <SeedStat n={tpl.seed.goals?.length ?? 0} label="metas" />
                  </div>

                  <div className="mt-5 flex-1" />
                  <Button
                    variant={applied ? "soft" : "primary"}
                    onClick={() => applyTemplate(tpl.id)}
                    className="w-full"
                  >
                    <SparkleIcon width={16} height={16} />
                    {applied ? "Aplicar de nuevo" : "Aplicar plantilla"}
                  </Button>
                </div>
              </Card>
            </Tilt>
          );
        })}
      </div>
    </div>
  );
}

function SeedStat({ n, label }: { n: number; label: string }) {
  return (
    <div className="rounded-lg bg-slate-50 py-2 dark:bg-slate-700/40">
      <p className="text-base font-semibold text-slate-700 dark:text-slate-200">{n}</p>
      <p>{label}</p>
    </div>
  );
}
