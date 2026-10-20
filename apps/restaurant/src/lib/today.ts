/** "Hoy en Neblina": what the café's day looks like right now in Quito time. Pure: (now, site) in, moments out. */
export const TZ = 'America/Guayaquil';
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
export type Weekday = (typeof DAYS)[number];

type L10n = { es: string; en: string };
export type HoursEntry = { days: string[]; opens: string; closes: string };
export type Ritual = { id: string; at: string; label: L10n; note: L10n };
export type TodaySite = { hours: HoursEntry[]; rituals: Ritual[] };

export type Moment = {
  id: string;
  time: string;
  minutes: number;
  label: L10n;
  note: L10n;
  /** past, current (the latest one that started), next (first still to come), later */
  state: 'past' | 'current' | 'next' | 'later';
  /** relative width of the stretch until the following moment, for the day line */
  grow: number;
};

export type Focus =
  | { kind: 'now'; moment: Moment }
  | { kind: 'next'; moment: Moment; minutes: number; isOpening: boolean }
  | { kind: 'closed'; next: { daysAhead: number; day: Weekday; opens: string } | null };

export type Today = { day: Weekday; open: boolean; hours: HoursEntry | null; moments: Moment[]; focus: Focus };

const toMin = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));
export const toTime = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

/** Weekday and minutes since midnight in Quito, whatever the visitor's own time zone is. */
export function quitoClock(now: Date): { day: Weekday; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'long', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  return { day: get('weekday') as Weekday, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

const hoursFor = (site: TodaySite, day: string) => site.hours.find((h) => h.days.includes(day)) ?? null;

/** The rituals that fall inside one day's opening hours, in order, with their stretch widths. */
export function momentsFor(site: TodaySite, hours: HoursEntry): Omit<Moment, 'state'>[] {
  const opens = toMin(hours.opens);
  const closes = toMin(hours.closes);
  const list = site.rituals
    .map((r) => ({ r, m: r.at === 'opens' ? opens : r.at === 'closes' ? closes : toMin(r.at) }))
    .filter(({ r, m }) => r.at === 'opens' || r.at === 'closes' || (m > opens && m < closes))
    .sort((a, b) => a.m - b.m);
  return list.map(({ r, m }, i) => ({
    id: r.id,
    time: toTime(m),
    minutes: m,
    label: r.label,
    note: r.note,
    grow: i + 1 < list.length ? list[i + 1].m - m : 90,
  }));
}

export function today(now: Date, site: TodaySite): Today {
  const { day, minutes } = quitoClock(now);
  const hours = hoursFor(site, day);
  const base = hours ? momentsFor(site, hours) : [];
  const open = !!hours && minutes >= toMin(hours.opens) && minutes < toMin(hours.closes);
  const started = base.filter((m) => m.minutes <= minutes);
  const nextIdx = open || (hours && minutes < toMin(hours.opens)) ? base.findIndex((m) => m.minutes > minutes) : -1;
  const currentId = open ? started[started.length - 1]?.id : undefined;
  const moments: Moment[] = base.map((m, i) => ({
    ...m,
    state: !hours || (!open && minutes >= toMin(hours.closes)) ? 'past' : m.id === currentId ? 'current' : i === nextIdx ? 'next' : m.minutes < minutes ? 'past' : 'later',
  }));

  let focus: Focus;
  const exact = moments.find((m) => m.minutes === minutes);
  if (hours && exact && open) focus = { kind: 'now', moment: exact };
  else if (nextIdx >= 0) focus = { kind: 'next', moment: moments[nextIdx], minutes: moments[nextIdx].minutes - minutes, isOpening: nextIdx === 0 && !open };
  else {
    const i = DAYS.indexOf(day);
    let next: { daysAhead: number; day: Weekday; opens: string } | null = null;
    // Today still counts when it opens later; otherwise look 1 to 7 days ahead.
    for (let a = 1; a <= 7 && !next; a++) {
      const d = DAYS[(i + a) % 7];
      const h = hoursFor(site, d);
      if (h) next = { daysAhead: a, day: d, opens: h.opens };
    }
    focus = { kind: 'closed', next };
  }
  return { day, open, hours, moments, focus };
}

/** Month and day in Quito as "MM-DD", for date windows such as the seasonal item. */
export function quitoMonthDay(now: Date): string {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, month: '2-digit', day: '2-digit' }).format(now);
  return p; // en-CA gives MM-DD with month and day only
}

/** True when MM-DD falls inside [from, to]; the window may wrap over New Year. */
export const inWindow = (md: string, from: string, to: string) => (from <= to ? md >= from && md <= to : md >= from || md <= to);

export type OpenStatus =
  | { kind: 'open'; until: string }
  | { kind: 'before'; opens: string }
  | { kind: 'closed'; next: { daysAhead: number; day: Weekday; opens: string } | null };

/** One line for the first screen: open until when, opens later today, or closed with the next opening. */
export function openStatus(now: Date, site: TodaySite): OpenStatus {
  const t = today(now, site);
  if (t.open && t.hours) return { kind: 'open', until: t.hours.closes };
  if (t.hours && t.focus.kind === 'next') return { kind: 'before', opens: t.hours.opens };
  return { kind: 'closed', next: t.focus.kind === 'closed' ? t.focus.next : null };
}
