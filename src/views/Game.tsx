import { useEffect, useRef, useState } from "react";
import { Button, Card, SectionTitle } from "../ui";
import { GameIcon } from "../icons";

// Logical board size (the canvas scales responsively via CSS).
const W = 640;
const H = 380;
const PLAYER = 16;
const SPEED = 2.7;
const GOAL_X = W - 44; // left edge of the green goal zone

// If you want to use a real image for the "screamer", drop it in /public and
// set its path here (e.g. "/job-application.jpg"). If empty, a built-in
// meme-style graphic is shown instead (always works, no external links).
const MEME_URL = "/job-application.jpg";

type Phase = "idle" | "playing" | "screamer";

interface Enemy {
  x: number;
  y: number;
  r: number;
  vy: number;
  min: number;
  max: number;
}

function makeEnemies(): Enemy[] {
  const cols = [
    { x: 140, v: 2.2, two: true },
    { x: 225, v: -2.6, two: false },
    { x: 310, v: 2.8, two: true },
    { x: 395, v: -2.4, two: false },
    { x: 475, v: 3.0, two: true },
    { x: 545, v: -2.6, two: false },
  ];
  const min = 22;
  const max = H - 22;
  const enemies: Enemy[] = [];
  for (const c of cols) {
    enemies.push({ x: c.x, y: min, r: 11, vy: c.v, min, max });
    if (c.two) enemies.push({ x: c.x, y: max, r: 11, vy: -c.v, min, max });
  }
  return enemies;
}

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}

function circleRectHit(
  cx: number,
  cy: number,
  r: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number
) {
  const nx = clamp(cx, rx, rx + rw);
  const ny = clamp(cy, ry, ry + rh);
  const dx = cx - nx;
  const dy = cy - ny;
  return dx * dx + dy * dy < r * r;
}

export default function Game() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [deaths, setDeaths] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useRef<Set<string>>(new Set());
  const touchDir = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  function startGame() {
    setDeaths(0);
    setPhase("playing");
  }

  useEffect(() => {
    if (phase !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const player = { x: 10, y: H / 2 - PLAYER / 2 };
    const enemies = makeEnemies();
    let deathCount = 0;
    let active = true;
    let raf = 0;

    const reset = () => {
      player.x = 10;
      player.y = H / 2 - PLAYER / 2;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (
        k === "arrowup" ||
        k === "arrowdown" ||
        k === "arrowleft" ||
        k === "arrowright"
      ) {
        e.preventDefault();
      }
      keys.current.add(k);
    };
    const onKeyUp = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const loop = () => {
      if (!active) return;

      let dx = 0;
      let dy = 0;
      const ks = keys.current;
      if (ks.has("arrowleft") || ks.has("a")) dx -= 1;
      if (ks.has("arrowright") || ks.has("d")) dx += 1;
      if (ks.has("arrowup") || ks.has("w")) dy -= 1;
      if (ks.has("arrowdown") || ks.has("s")) dy += 1;
      dx += touchDir.current.x;
      dy += touchDir.current.y;
      if (dx !== 0 && dy !== 0) {
        const inv = 1 / Math.sqrt(2);
        dx *= inv;
        dy *= inv;
      }
      player.x = clamp(player.x + dx * SPEED, 0, W - PLAYER);
      player.y = clamp(player.y + dy * SPEED, 0, H - PLAYER);

      for (const en of enemies) {
        en.y += en.vy;
        if (en.y < en.min) {
          en.y = en.min;
          en.vy = Math.abs(en.vy);
        } else if (en.y > en.max) {
          en.y = en.max;
          en.vy = -Math.abs(en.vy);
        }
      }

      for (const en of enemies) {
        if (circleRectHit(en.x, en.y, en.r, player.x, player.y, PLAYER, PLAYER)) {
          reset();
          deathCount += 1;
          setDeaths(deathCount);
          break;
        }
      }

      if (player.x + PLAYER >= GOAL_X) {
        active = false;
        cancelAnimationFrame(raf);
        setPhase("screamer");
        return;
      }

      draw(ctx, player, enemies);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      keys.current.clear();
      touchDir.current = { x: 0, y: 0 };
    };
  }, [phase]);

  return (
    <div>
      <SectionTitle
        title="El juego (casi) más difícil del mundo"
        subtitle="Lleva el cuadrado azul hasta la meta verde sin tocar las bolas rojas"
      />

      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800/60">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-600 dark:text-slate-300">
              Muertes: <span className="text-rose-500">{deaths}</span>
            </span>
            <span className="hidden text-slate-400 sm:inline">
              Muévete con las flechas o WASD
            </span>
          </div>
        </div>

        <div className="relative bg-slate-100 p-3 dark:bg-slate-900/40">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="mx-auto block w-full max-w-[640px] touch-none rounded-xl border border-slate-300 bg-indigo-50 dark:border-slate-700"
          />

          {phase !== "playing" && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="rounded-2xl bg-white/95 p-6 text-center shadow-xl backdrop-blur dark:bg-slate-800/95">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                  <GameIcon width={28} height={28} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  ¿Te atreves?
                </h3>
                <p className="mx-auto mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">
                  Un punto, unos pasillos llenos de peligro y una sola regla: todo
                  lo que toques te mata. Llega a la meta para reclamar tu... premio.
                </p>
                <Button className="mt-4" onClick={startGame}>
                  {deaths > 0 ? "Reintentar" : "Empezar a jugar"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Controles táctiles (móvil) */}
        {phase === "playing" && (
          <div className="flex flex-col items-center gap-2 py-4 sm:hidden">
            <DPadButton dir={{ x: 0, y: -1 }} touchDir={touchDir} label="▲" />
            <div className="flex gap-2">
              <DPadButton dir={{ x: -1, y: 0 }} touchDir={touchDir} label="◀" />
              <DPadButton dir={{ x: 0, y: 1 }} touchDir={touchDir} label="▼" />
              <DPadButton dir={{ x: 1, y: 0 }} touchDir={touchDir} label="▶" />
            </div>
          </div>
        )}

        {phase === "playing" && (
          <div className="flex justify-center pb-4">
            <Button variant="ghost" onClick={() => setPhase("idle")}>
              Salir
            </Button>
          </div>
        )}
      </Card>

      {phase === "screamer" && <Screamer onClose={() => setPhase("idle")} />}
    </div>
  );
}

function draw(
  ctx: CanvasRenderingContext2D,
  player: { x: number; y: number },
  enemies: Enemy[]
) {
  ctx.clearRect(0, 0, W, H);

  // Board background
  ctx.fillStyle = "#eef2ff";
  ctx.fillRect(0, 0, W, H);

  // Start zone (left) and goal zone (right)
  ctx.fillStyle = "#bfdbfe";
  ctx.fillRect(0, 0, 28, H);
  ctx.fillStyle = "#bbf7d0";
  ctx.fillRect(GOAL_X, 0, W - GOAL_X, H);
  ctx.fillStyle = "#16a34a";
  ctx.font = "bold 13px sans-serif";
  ctx.save();
  ctx.translate(GOAL_X + (W - GOAL_X) / 2, H / 2);
  ctx.rotate(Math.PI / 2);
  ctx.textAlign = "center";
  ctx.fillText("META", 0, 4);
  ctx.restore();

  // Enemies
  for (const en of enemies) {
    ctx.beginPath();
    ctx.arc(en.x, en.y, en.r, 0, Math.PI * 2);
    ctx.fillStyle = "#ef4444";
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#991b1b";
    ctx.stroke();
  }

  // Player
  ctx.fillStyle = "#2563eb";
  ctx.strokeStyle = "#1e3a8a";
  ctx.lineWidth = 2.5;
  ctx.fillRect(player.x, player.y, PLAYER, PLAYER);
  ctx.strokeRect(player.x, player.y, PLAYER, PLAYER);
}

function DPadButton({
  dir,
  touchDir,
  label,
}: {
  dir: { x: number; y: number };
  touchDir: React.MutableRefObject<{ x: number; y: number }>;
  label: string;
}) {
  const press = () => (touchDir.current = dir);
  const release = () => (touchDir.current = { x: 0, y: 0 });
  return (
    <button
      onPointerDown={press}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      className="flex h-14 w-14 select-none items-center justify-center rounded-xl bg-slate-200 text-xl font-bold text-slate-700 active:bg-indigo-500 active:text-white dark:bg-slate-700 dark:text-slate-200"
    >
      {label}
    </button>
  );
}

function Screamer({ onClose }: { onClose: () => void }) {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    // Pitido breve y disonante (efecto "screamer"). Silencioso si el navegador lo bloquea.
    let ac: AudioContext | null = null;
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      ac = new Ctx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(900, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, ac.currentTime + 0.5);
      gain.gain.setValueAtTime(0.16, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.55);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start();
      osc.stop(ac.currentTime + 0.55);
    } catch {
      /* el audio no es esencial */
    }
    return () => {
      try {
        ac?.close();
      } catch {
        /* noop */
      }
    };
  }, []);

  const showImage = MEME_URL && !imgFailed;

  return (
    <div className="animate-flash fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      <div className="animate-shake flex flex-col items-center px-4 text-center">
        {showImage ? (
          <img
            src={MEME_URL}
            alt="¡Sorpresa!"
            onError={() => setImgFailed(true)}
            className="animate-zoom-burst max-h-[70vh] max-w-[90vw] rounded-lg shadow-2xl"
          />
        ) : (
          <div className="animate-zoom-burst select-none">
            <div className="text-[120px] leading-none drop-shadow-[0_4px_0_rgba(0,0,0,0.4)] sm:text-[180px]">
              😱
            </div>
            <p
              className="mt-2 text-5xl font-black uppercase italic tracking-tight text-white sm:text-7xl"
              style={{ textShadow: "3px 3px 0 #000, -2px -2px 0 #000" }}
            >
              Job Application
            </p>
            <p
              className="mt-3 text-xl font-bold text-yellow-300 sm:text-2xl"
              style={{ textShadow: "2px 2px 0 #000" }}
            >
              ¡TE ASUSTASTE! 😂
            </p>
          </div>
        )}
      </div>

      <button
        onClick={onClose}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-xl bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-2xl transition hover:bg-slate-100"
      >
        Cerrar (ufff, ya pasó)
      </button>
    </div>
  );
}
