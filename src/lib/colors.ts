// Tailwind purges classes it cannot see as literal strings, so we map color
// keys to full, statically-analyzable class strings here.

export interface ColorClasses {
  text: string;
  bg: string; // solid background
  softBg: string; // light tinted background
  softText: string; // tinted text on soft bg
  ring: string;
  gradient: string; // for accent gradients
  fill: string; // for svg / progress
}

const MAP: Record<string, ColorClasses> = {
  indigo: {
    text: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500",
    softBg: "bg-indigo-50 dark:bg-indigo-500/10",
    softText: "text-indigo-700 dark:text-indigo-300",
    ring: "ring-indigo-500",
    gradient: "from-indigo-500 to-indigo-600",
    fill: "bg-indigo-500",
  },
  violet: {
    text: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500",
    softBg: "bg-violet-50 dark:bg-violet-500/10",
    softText: "text-violet-700 dark:text-violet-300",
    ring: "ring-violet-500",
    gradient: "from-violet-500 to-violet-600",
    fill: "bg-violet-500",
  },
  sky: {
    text: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-500",
    softBg: "bg-sky-50 dark:bg-sky-500/10",
    softText: "text-sky-700 dark:text-sky-300",
    ring: "ring-sky-500",
    gradient: "from-sky-500 to-sky-600",
    fill: "bg-sky-500",
  },
  emerald: {
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500",
    softBg: "bg-emerald-50 dark:bg-emerald-500/10",
    softText: "text-emerald-700 dark:text-emerald-300",
    ring: "ring-emerald-500",
    gradient: "from-emerald-500 to-emerald-600",
    fill: "bg-emerald-500",
  },
  teal: {
    text: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-500",
    softBg: "bg-teal-50 dark:bg-teal-500/10",
    softText: "text-teal-700 dark:text-teal-300",
    ring: "ring-teal-500",
    gradient: "from-teal-500 to-teal-600",
    fill: "bg-teal-500",
  },
  amber: {
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500",
    softBg: "bg-amber-50 dark:bg-amber-500/10",
    softText: "text-amber-700 dark:text-amber-300",
    ring: "ring-amber-500",
    gradient: "from-amber-500 to-amber-600",
    fill: "bg-amber-500",
  },
  rose: {
    text: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500",
    softBg: "bg-rose-50 dark:bg-rose-500/10",
    softText: "text-rose-700 dark:text-rose-300",
    ring: "ring-rose-500",
    gradient: "from-rose-500 to-rose-600",
    fill: "bg-rose-500",
  },
};

export function colors(key: string): ColorClasses {
  return MAP[key] ?? MAP.indigo;
}

export const COLOR_KEYS = Object.keys(MAP);
