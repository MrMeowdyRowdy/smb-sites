import { describe, expect, it } from 'vitest';
import site from '../../content/site.json';
import { inWindow, quitoClock, quitoMonthDay, today } from './today';

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
