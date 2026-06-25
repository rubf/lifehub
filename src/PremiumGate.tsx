import { useEffect, useMemo, useRef, useState } from "react";
import { CheckIcon, CrownIcon, RocketIcon, SparkleIcon } from "./icons";
import { cx } from "./lib/utils";

const SHOW_AFTER_MS = 40_000; // aparece tras 40 s de uso
const SKIP_AFTER_S = 5; // el botón "Saltar" se habilita tras 5 s
const CLICKS_TO_SHOW = 7; // o tras 7 interacciones/clics, lo que ocurra antes
const SESSION_KEY = "lifehub:premiumShown";

type Phase = "hidden" | "premium" | "prank";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  badge?: string;
  highlight?: boolean;
}

const PLANS: Plan[] = [
  { id: "mensual", name: "Pro Mensual", price: "4,99 €", period: "/mes" },
  {
    id: "anual",
    name: "Pro Anual",
    price: "39,99 €",
    period: "/año",
    badge: "Ahorra 33%",
    highlight: true,
  },
];

const FEATURES = [
  "Sincronización en la nube entre dispositivos",
  "Plantillas premium exclusivas",
  "Temas y colores personalizados",
  "Estadísticas e informes avanzados",
  "Exportación ilimitada y sin marca de agua",
  "Soporte prioritario 24/7",
];

export default function PremiumGate() {
  const [phase, setPhase] = useState<Phase>("hidden");
  const [count, setCount] = useState(SKIP_AFTER_S);
  const [selected, setSelected] = useState("anual");
  const [processing, setProcessing] = useState(false);
  const timers = useRef<number[]>([]);

  // Aparece tras 40 s de uso O tras 7 interacciones (lo que ocurra antes),
  // y solo una vez por sesión.
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    let shown = false;
    let clicks = 0;
    let timer = 0;

    function cleanup() {
      clearTimeout(timer);
      window.removeEventListener("click", onClick);
    }
    function trigger() {
      if (shown) return;
      shown = true;
      sessionStorage.setItem(SESSION_KEY, "1");
      setPhase("premium");
      cleanup();
    }
    function onClick() {
      clicks += 1;
      if (clicks >= CLICKS_TO_SHOW) trigger();
    }

    timer = window.setTimeout(trigger, SHOW_AFTER_MS);
    window.addEventListener("click", onClick);
    return cleanup;
  }, []);

  // Cuenta atrás del botón "Saltar".
  useEffect(() => {
    if (phase !== "premium") return;
    setCount(SKIP_AFTER_S);
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(id);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  function reveal() {
    setProcessing(false);
    setPhase("prank");
  }

  function handleSubscribe() {
    // Falso procesamiento de pago... que nunca cobra nada.
    setProcessing(true);
    const t = window.setTimeout(reveal, 1700);
    timers.current.push(t);
  }

  if (phase === "hidden") return null;

  if (phase === "prank") return <PrankModal onClose={() => setPhase("hidden")} />;

  const canSkip = count === 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

      <div
        className="animate-pop-in relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-800"
        style={{ perspective: "1000px" }}
      >
        {/* Cabecera con gradiente animado */}
        <div className="animate-gradient sheen relative bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 px-6 pb-8 pt-7 text-center text-white">
          <div className="animate-float mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 shadow-glow-indigo backdrop-blur">
            <CrownIcon width={32} height={32} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">LifeHub Pro</h2>
          <p className="mt-1 text-sm text-white/90">
            Desbloquea todo el potencial de tu organización
          </p>
        </div>

        <div className="p-6">
          {/* Planes */}
          <div className="grid grid-cols-2 gap-3">
            {PLANS.map((plan) => {
              const active = selected === plan.id;
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelected(plan.id)}
                  className={cx(
                    "relative rounded-2xl border-2 p-4 text-left transition-all",
                    active
                      ? "border-indigo-500 bg-indigo-50 shadow-elevate dark:bg-indigo-500/10"
                      : "border-slate-200 hover:border-slate-300 dark:border-slate-600"
                  )}
                >
                  {plan.badge && (
                    <span className="absolute -top-2.5 right-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      {plan.badge}
                    </span>
                  )}
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {plan.name}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                    {plan.price}
                    <span className="text-sm font-normal text-slate-400">
                      {plan.period}
                    </span>
                  </p>
                </button>
              );
            })}
          </div>

          {/* Beneficios */}
          <ul className="mt-5 space-y-2.5">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm">
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15">
                  <CheckIcon width={13} height={13} />
                </span>
                <span className="text-slate-600 dark:text-slate-300">{f}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <button
            onClick={handleSubscribe}
            disabled={processing}
            className="sheen mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3.5 text-base font-semibold text-white shadow-glow-indigo transition hover:from-indigo-500 hover:to-violet-500 disabled:opacity-70"
          >
            {processing ? (
              <>
                <Spinner /> Procesando pago...
              </>
            ) : (
              <>
                <RocketIcon width={18} height={18} /> Suscribirme ahora
              </>
            )}
          </button>

          <p className="mt-2 text-center text-[11px] text-slate-400">
            Facturación segura. Cancela cuando quieras.
          </p>

          {/* Saltar (se habilita tras la cuenta atrás) */}
          <div className="mt-4">
            <button
              onClick={reveal}
              disabled={!canSkip}
              className={cx(
                "mx-auto flex w-full max-w-[14rem] items-center justify-center gap-1.5 rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all",
                canSkip
                  ? "border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-800 dark:border-slate-500 dark:text-slate-200 dark:hover:bg-slate-700/50"
                  : "cursor-not-allowed border-slate-200 text-slate-400 dark:border-slate-700 dark:text-slate-500"
              )}
            >
              {canSkip ? (
                "No, gracias · Saltar"
              ) : (
                <>
                  Saltar disponible en
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-200 px-1 text-xs font-bold text-slate-600 dark:bg-slate-600 dark:text-slate-100">
                    {count}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
  );
}

function PrankModal({ onClose }: { onClose: () => void }) {
  // Confeti decorativo.
  const confetti = useMemo(() => {
    const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#0ea5e9"];
    return Array.from({ length: 44 }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 2.4 + Math.random() * 1.8,
      size: 6 + Math.random() * 8,
      color: colors[i % colors.length],
      rounded: Math.random() > 0.5,
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Confeti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {confetti.map((c, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              top: "-5%",
              left: `${c.left}%`,
              width: c.size,
              height: c.size,
              background: c.color,
              borderRadius: c.rounded ? "9999px" : "2px",
              animation: `confetti-fall ${c.duration}s linear ${c.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="animate-pop-in relative z-10 w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl dark:bg-slate-800">
        <div className="animate-float mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-pink-500 text-4xl shadow-glow-indigo">
          😜
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          ¡Te la creíste!
        </h3>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Es <span className="font-semibold text-indigo-600 dark:text-indigo-400">gratis</span>, jajaja.
          LifeHub es y será 100% gratuito. No hay cobros, ni planes, ni letra pequeña.
        </p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400">
          <SparkleIcon width={15} height={15} /> Disfrútalo sin límites
        </p>
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 font-semibold text-white shadow-glow-indigo transition hover:from-indigo-500 hover:to-violet-500"
        >
          Jajaja, vale 😄
        </button>
      </div>
    </div>
  );
}
