// Small shared utilities

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function todayISO(): string {
  return toISO(new Date());
}

export function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-ES", opts ?? { day: "numeric", month: "short" });
}

export function formatMoney(amount: number, currency = "EUR"): string {
  try {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function monthKey(iso: string): string {
  return iso.slice(0, 7); // YYYY-MM
}

export function currentMonthKey(): string {
  return todayISO().slice(0, 7);
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Days (Mon..Sun) of the current week as ISO strings. */
export function currentWeekDays(): string[] {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = addDays(now, diffToMonday);
  return Array.from({ length: 7 }, (_, i) => toISO(addDays(monday, i)));
}


const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

/** Human label for a month, e.g. "Junio 2026". */
export function monthLabel(year: number, month: number): string {
  return `${MONTH_NAMES[month]} ${year}`;
}

/**
 * Returns a 6x7 matrix (weeks x days, Mon..Sun) of ISO date strings covering
 * the given month, padded with days from adjacent months.
 */
export function monthMatrix(year: number, month: number): string[][] {
  const first = new Date(year, month, 1);
  const startDay = first.getDay(); // 0=Sun
  const offset = startDay === 0 ? 6 : startDay - 1; // days before Monday
  const start = addDays(first, -offset);
  const weeks: string[][] = [];
  let cursor = start;
  for (let w = 0; w < 6; w++) {
    const week: string[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(toISO(cursor));
      cursor = addDays(cursor, 1);
    }
    weeks.push(week);
  }
  return weeks;
}
