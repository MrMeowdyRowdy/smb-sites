import { describe, expect, it } from 'vitest';
import site from '../../content/site.json';
import { activeSeasonal, bandFor, clockOverride, focusTime, inWindow, openStatus, quitoClock, quitoMonthDay, statusFor, today, windowsOverlap, type Clock } from './today';

// Quito is UTC-5 all year. 2026-10-19 is a Monday (07:30-19:00), 2026-10-25 a Sunday (08:00-15:00).
const at = (iso: string, hhmm: string) => new Date(`${iso}T${hhmm}:00-05:00`);
const state = (t: ReturnType<typeof today>, id: string) => t.moments.find((m) => m.id === id)?.state;

describe('today in Quito time', () => {
  it('reads the clock in Quito whatever the machine zone is', () => {
    expect(quitoClock(new Date('2026-10-19T17:05:00Z'))).toEqual({ day: 'Monday', minutes: 12 * 60 + 5 });
    expect(quitoClock(new Date('2026-10-20T03:30:00Z'))).toEqual({ day: 'Monday', minutes: 22 * 60 + 30 });
  });

  it('open day: the latest started moment is current, the first to come is next with minutes left', () => {
    const t = today(at('2026-10-19', '14:20'), site);
    expect(t.open).toBe(true);
    expect(state(t, 'almuerzo')).toBe('current');
    expect(state(t, 'pan')).toBe('past');
    expect(state(t, 'neblina')).toBe('next');
    expect(t.focus).toMatchObject({ kind: 'next', minutes: 40, moment: { id: 'neblina' } });
  });

  it('before opening: everything is ahead and the opening is next', () => {
    const t = today(at('2026-10-19', '06:50'), site);
    expect(t.open).toBe(false);
    expect(t.moments.every((m) => m.state !== 'past' && m.state !== 'current')).toBe(true);
    expect(t.focus).toMatchObject({ kind: 'next', minutes: 40, isOpening: true, moment: { id: 'opens' } });
  });

  it('after closing: all past, and it says when it opens next', () => {
    const t = today(at('2026-10-19', '19:00'), site);
    expect(t.open).toBe(false);
    expect(t.moments.every((m) => m.state === 'past')).toBe(true);
    expect(t.focus).toEqual({ kind: 'closed', next: { daysAhead: 1, day: 'Tuesday', opens: '07:30' } });
  });

  it('a closed day looks ahead to the next open day', () => {
    const closedSunday = { ...site, hours: site.hours.filter((h) => !h.days.includes('Sunday')) };
    const t = today(at('2026-10-25', '10:00'), closedSunday);
    expect(t.hours).toBeNull();
    expect(t.moments).toEqual([]);
    expect(t.focus).toEqual({ kind: 'closed', next: { daysAhead: 1, day: 'Monday', opens: '07:30' } });
  });

  it('a ritual exactly now is "now"', () => {
    const t = today(at('2026-10-19', '15:00'), site);
    expect(t.focus).toMatchObject({ kind: 'now', moment: { id: 'neblina', state: 'current' } });
  });

  it('the fog hour does not exist on a day that closes at 15:00', () => {
    const t = today(at('2026-10-25', '09:00'), site);
    expect(t.moments.map((m) => m.id)).toEqual(['opens', 'pan', 'almuerzo', 'closes']);
  });

  it('seasonal window uses the Quito date and may wrap New Year', () => {
    expect(quitoMonthDay(new Date('2026-11-03T03:00:00Z'))).toBe('11-02');
    expect(inWindow('10-20', '10-20', '11-02')).toBe(true);
    expect(inWindow('11-03', '10-20', '11-02')).toBe(false);
    expect(inWindow('01-02', '12-20', '01-05')).toBe(true);
  });
});

describe('open status for the first screen', () => {
  it('open until the closing time', () => expect(openStatus(at('2026-10-19', '14:20'), site)).toEqual({ kind: 'open', until: '19:00' }));
  it('before opening it says when it opens today', () => expect(openStatus(at('2026-10-19', '06:50'), site)).toEqual({ kind: 'before', opens: '07:30' }));
  it('after closing it looks to the next day', () =>
    expect(openStatus(at('2026-10-19', '19:30'), site)).toEqual({ kind: 'closed', next: { daysAhead: 1, day: 'Tuesday', opens: '07:30' } }));
});

describe('focusTime', () => {
  it('is the next moment, the current one, or the next opening when closed', () => {
    expect(focusTime(today(at('2026-10-19', '14:20'), site).focus)).toBe('15:00');
    expect(focusTime(today(at('2026-10-19', '06:50'), site).focus)).toBe('07:30');
    expect(focusTime(today(at('2026-10-19', '21:00'), site).focus)).toBe('07:30');
  });
});

const c = (day: Clock['day'], hhmm: string): Clock => ({ day, minutes: Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3)) });

describe('the hours line', () => {
  it('open: tones past / now / next, the marker along the day, the clock is the Quito time', () => {
    const b = bandFor(c('Tuesday', '10:42'), site)!;
    expect(b.state).toBe('open');
    expect(b.stations.map((s) => s.tone)).toEqual(['past', 'now', 'next', 'next']);
    expect(b.clock).toBe('10:42');
    expect(b.marker).toBeCloseTo(((10 * 60 + 42 - 450) / (19 * 60 - 450)) * 100, 5);
    expect(b.end).toMatchObject({ time: '19:00', label: { es: 'Cerramos' } });
    expect(statusFor(c('Tuesday', '10:42'), site)).toMatchObject({ kind: 'open', label: { es: 'Pan de yuca del horno' }, next: '12:00' });
  });

  it('after closing on Saturday: the monument shows Sunday opening, every station is next, no marker', () => {
    const b = bandFor(c('Saturday', '21:10'), site)!;
    expect(b).toMatchObject({ state: 'after', day: 'Sunday', daysAhead: 1, clock: '08:00', marker: null });
    expect(b.stations.every((s) => s.tone === 'next')).toBe(true);
    expect(b.stations.map((s) => s.id)).toEqual(['opens', 'pan', 'almuerzo']);
    expect(b.end.time).toBe('15:00');
    expect(statusFor(c('Saturday', '21:10'), site)).toEqual({ kind: 'closed', daysAhead: 1, day: 'Sunday', opens: '08:00' });
  });

  it('before opening: today, the opening time on the monument, not the current time', () => {
    const b = bandFor(c('Saturday', '06:00'), site)!;
    expect(b).toMatchObject({ state: 'before', day: 'Saturday', daysAhead: 0, clock: '08:00', marker: null });
  });

  it('hours come from the weekday: Sunday closes at 15:00, so 16:00 on Sunday is already closed for Monday', () => {
    expect(bandFor(c('Sunday', '16:00'), site)).toMatchObject({ state: 'after', day: 'Monday', clock: '07:30' });
    expect(bandFor(c('Sunday', '09:00'), site)).toMatchObject({ state: 'open', closes: '15:00' });
  });

  it('a day without hours looks ahead; a café that never opens has no band', () => {
    const noSun = { ...site, hours: site.hours.filter((h) => !h.days.includes('Sunday')) };
    expect(bandFor(c('Sunday', '10:00'), noSun)).toMatchObject({ state: 'after', day: 'Monday', daysAhead: 1 });
    expect(bandFor(c('Monday', '10:00'), { ...site, hours: [] })).toBeNull();
  });

  it('growth caps keep the opening, the running one and the nearest, and hidden stretches join the station before', () => {
    const many = { ...site, rituals: [...site.rituals.slice(0, 4), ...['11:00', '11:30', '13:00', '14:00', '16:00', '17:00'].map((at, i) => ({ id: `x${i}`, at, label: { es: 'x', en: 'x' }, note: { es: 'x', en: 'x' } })), site.rituals[4]] };
    const b = bandFor(c('Monday', '12:10'), many)!;
    expect(b.stations.length).toBe(10);
    expect(b.stations.filter((s) => !s.hideD).length).toBe(7);
    expect(b.stations.filter((s) => !s.hideP).length).toBe(5);
    expect(b.stations[0].hideP).toBe(false);
    expect(b.stations.find((s) => s.tone === 'now')!.hideP).toBe(false);
    const total = (key: 'fd' | 'fp') => b.stations.reduce((n, s) => n + s[key], 0);
    expect(total('fd')).toBe(19 * 60 - 450);
    expect(total('fp')).toBe(19 * 60 - 450);
  });

  it('?t and ?d override the clock, anything invalid is ignored', () => {
    const real = c('Monday', '09:00');
    expect(clockOverride(real, '?t=21:10&d=saturday')).toEqual(c('Saturday', '21:10'));
    expect(clockOverride(real, '?t=25:99&d=Funday')).toEqual(real);
    expect(clockOverride(real, '')).toEqual(real);
  });
});

describe('seasonal windows', () => {
  const w = [
    { from: '10-20', to: '11-02', n: 'colada' },
    { from: '12-15', to: '01-06', n: 'navidad' },
  ];
  it('the first window that holds the day is the active one, none outside', () => {
    expect(activeSeasonal(w, '10-25')?.n).toBe('colada');
    expect(activeSeasonal(w, '01-03')?.n).toBe('navidad');
    expect(activeSeasonal(w, '07-01')).toBeNull();
    expect(activeSeasonal(undefined, '07-01')).toBeNull();
  });
  it('overlap is symmetric and handles New Year', () => {
    expect(windowsOverlap(w[0], w[1])).toBe(false);
    expect(windowsOverlap({ from: '12-30', to: '01-02' }, w[1])).toBe(true);
    expect(windowsOverlap(w[1], { from: '12-30', to: '01-02' })).toBe(true);
    expect(windowsOverlap({ from: '11-01', to: '11-10' }, w[0])).toBe(true);
  });
});
