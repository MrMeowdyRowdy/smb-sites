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

/** The clock time that anchors the focus: the moment now or next, or the next opening when closed (null when it never opens). */
export function focusTime(f: Focus): string | null {
  return f.kind === 'closed' ? (f.next?.opens ?? null) : f.moment.time;
}

// ---------------------------------------------------------------------------------------------------------------------
// The hours line (ported from the brand book's band.js). Pure: (clock, site) in, a model out. The page formats the words.
// ---------------------------------------------------------------------------------------------------------------------

export type Clock = { day: Weekday; minutes: number };
export const hoursForDay = hoursFor;

/** ?t=HH:MM&d=Weekday on the URL overrides the Quito clock, for captures and the gate pack. Anything invalid is ignored. */
export function clockOverride(real: Clock, search: string): Clock {
  const q = new URLSearchParams(search);
  const t = q.get('t');
  const d = q.get('d')?.toLowerCase();
  const day = DAYS.find((x) => x.toLowerCase() === d) ?? real.day;
  const ok = t && /^([01]\d|2[0-3]):[0-5]\d$/.test(t);
  return { day, minutes: ok ? toMin(t) : real.minutes };
}

export type Tone = 'past' | 'now' | 'next';
export type Station = {
  id: string;
  time: string;
  minutes: number;
  label: L10n;
  note: L10n;
  tone: Tone;
  /** flex weight (minutes until the next station) on desktop and on the phone, once hidden stations are absorbed */
  fd: number;
  fp: number;
  hideD: boolean;
  hideP: boolean;
};
export type BandState = 'before' | 'open' | 'after';
export type Band = {
  state: BandState;
  /** the day the line and the monument speak about: today while open or before opening, the next open day after */
  day: Weekday;
  daysAhead: number;
  opens: string;
  closes: string;
  /** the monument: the Quito time while open; while closed the NEXT OPENING, never the time of day */
  clock: string;
  stations: Station[];
  end: { time: string; label: L10n | null };
  /** 0-100 along the stations (closing excluded) while open, else null */
  marker: number | null;
  /** minutes since midnight while open, else null */
  nowMin: number | null;
};

export const STATION_CAP = { desktop: 7, phone: 5 };

/** Which stations stay: the opening, the one running now, then the nearest to now; hidden ones hand their stretch to the station before. */
function cap(starts: number[], now: number | null, max: number): boolean[] {
  const keep = starts.map((_, i) => i === 0);
  if (starts.length <= max) return starts.map(() => true);
  const cur = now === null ? -1 : starts.reduce((a, s, i) => (s <= now ? i : a), -1);
  if (cur > 0) keep[cur] = true;
  const rest = starts.map((s, i) => ({ i, d: Math.abs(s - (now ?? starts[0])) })).filter((x) => !keep[x.i]).sort((a, b) => a.d - b.d || a.i - b.i);
  for (const { i } of rest) if (keep.filter(Boolean).length < max) keep[i] = true;
  return keep;
}

/** Flex weight per station when only the kept ones show: each hidden stretch joins the kept station before it. */
function weights(starts: number[], closes: number, keep: boolean[]): number[] {
  const w = starts.map(() => 0);
  let last = 0;
  starts.forEach((s, i) => {
    if (keep[i]) last = i;
    w[last] += (i + 1 < starts.length ? starts[i + 1] : closes) - s;
  });
  return w;
}

/** The band for this clock: state, the day it speaks about, the stations with tones and weights, the marker. Null when the café never opens. */
export function bandFor(clock: Clock, site: TodaySite): Band | null {
  const todayH = hoursFor(site, clock.day);
  const state: BandState = !todayH || clock.minutes >= toMin(todayH.closes) ? 'after' : clock.minutes < toMin(todayH.opens) ? 'before' : 'open';
  let daysAhead = 0;
  let day: Weekday = clock.day;
  let hours = todayH;
  if (state === 'after') {
    hours = null;
    for (let a = 1; a <= 7 && !hours; a++) {
      day = DAYS[(DAYS.indexOf(clock.day) + a) % 7];
      hours = hoursFor(site, day);
      daysAhead = a;
    }
  }
  if (!hours) return null;
  const opens = toMin(hours.opens);
  const closes = toMin(hours.closes);
  const all = momentsFor(site, hours);
  const closing = all.find((m) => m.minutes === closes && m.id === 'closes') ?? null;
  const ms = all.filter((m) => m !== closing);
  const starts = ms.map((m) => m.minutes);
  const now = state === 'open' ? clock.minutes : null;
  const kd = cap(starts, now, STATION_CAP.desktop);
  const kp = cap(starts, now, STATION_CAP.phone);
  const wd = weights(starts, closes, kd);
  const wp = weights(starts, closes, kp);
  const stations: Station[] = ms.map((m, i) => {
    const b = i + 1 < ms.length ? ms[i + 1].minutes : closes;
    return {
      id: m.id, time: m.time, minutes: m.minutes, label: m.label, note: m.note,
      tone: now === null ? 'next' : b <= now ? 'past' : m.minutes <= now ? 'now' : 'next',
      fd: wd[i], fp: wp[i], hideD: !kd[i], hideP: !kp[i],
    };
  });
  return {
    state, day, daysAhead, opens: hours.opens, closes: hours.closes,
    clock: state === 'open' ? toTime(clock.minutes) : hours.opens,
    stations,
    end: { time: hours.closes, label: closing?.label ?? null },
    marker: now === null ? null : ((now - opens) / (closes - opens)) * 100,
    nowMin: now,
  };
}

export type Status =
  | { kind: 'open'; label: L10n | null; next: string | null }
  | { kind: 'closed'; daysAhead: number; day: Weekday; opens: string };

/** The status line, as data: what runs now and what comes next, or when it opens again. */
export function statusFor(clock: Clock, site: TodaySite): Status | null {
  const b = bandFor(clock, site);
  if (!b) return null;
  if (b.state !== 'open') return { kind: 'closed', daysAhead: b.daysAhead, day: b.day, opens: b.opens };
  const cur = [...b.stations].reverse().find((s) => s.minutes <= clock.minutes);
  const nxt = b.stations.find((s) => s.minutes > clock.minutes);
  return { kind: 'open', label: cur?.label ?? null, next: nxt ? nxt.time : b.end.time };
}

type Windowed = { from: string; to: string };
/** The seasonal window that holds this MM-DD (the first one when several would): at most one is active per day. */
export const activeSeasonal = <T extends Windowed>(list: T[] | undefined, md: string): T | null => list?.find((w) => inWindow(md, w.from, w.to)) ?? null;

/** True when two MM-DD windows share a day (either may wrap New Year): an arc starts inside the other or they do not meet. */
export const windowsOverlap = (a: Windowed, b: Windowed) => inWindow(a.from, b.from, b.to) || inWindow(b.from, a.from, a.to);
