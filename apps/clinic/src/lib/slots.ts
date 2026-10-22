/** Opening hours by weekday (0 = Sunday): [open, close) as HH:MM, or null when closed. */
export type Hours = Record<string, [string, string] | null>;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export const isDate = (s: string): boolean => DATE_RE.test(s) && new Date(`${s}T00:00:00Z`).toISOString().startsWith(s);
export const isTime = (s: string): boolean => TIME_RE.test(s);

export const weekday = (date: string): number => new Date(`${date}T00:00:00Z`).getUTCDay();

export function addDays(date: string, n: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

const toMin = (t: string): number => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
const toTime = (m: number): string => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

/** Slot start times for a date: every `step` minutes from open until the last slot that ends by close. */
export function daySlots(date: string, hours: Hours, step = 30): string[] {
  const h = hours[String(weekday(date))];
  if (!h) return [];
  const out: string[] = [];
  for (let m = toMin(h[0]); m + step <= toMin(h[1]); m += step) out.push(toTime(m));
  return out;
}

/** Current date and time in the clinic's time zone (Ecuador has no DST). */
export function clinicNow(timeZone: string, now = new Date()): { date: string; time: string } {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', { timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
      .formatToParts(now)
      .map((x) => [x.type, x.value]),
  );
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
}

/** True when the slot exists in the opening hours, is still in the future and is within the booking horizon. */
export function isBookable(date: string, time: string, hours: Hours, now: { date: string; time: string }, horizonDays: number, step = 30): boolean {
  if (!isDate(date) || !isTime(time)) return false;
  if (date < now.date || date > addDays(now.date, horizonDays)) return false;
  if (date === now.date && time <= now.time) return false;
  return daySlots(date, hours, step).includes(time);
}
