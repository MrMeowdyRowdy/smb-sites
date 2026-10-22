import { describe, expect, it } from 'vitest';
import { addDays, clinicNow, daySlots, isBookable, isDate, weekday } from './slots';

const hours = { '0': null, '1': ['09:00', '17:00'], '2': ['09:00', '17:00'], '3': ['09:00', '17:00'], '4': ['09:00', '17:00'], '5': ['09:00', '17:00'], '6': ['09:00', '13:00'] } as never;
const now = { date: '2026-10-21', time: '10:10' }; // a Wednesday

describe('daySlots', () => {
  it('lists 30-minute slots up to the last one that ends by close', () => {
    const s = daySlots('2026-10-21', hours);
    expect(s).toHaveLength(16);
    expect(s[0]).toBe('09:00');
    expect(s.at(-1)).toBe('16:30');
  });
  it('uses shorter Saturday hours and nothing on Sunday', () => {
    expect(daySlots('2026-10-24', hours)).toEqual(['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30']);
    expect(daySlots('2026-10-25', hours)).toEqual([]);
  });
});

describe('isBookable', () => {
  it('accepts a future slot in opening hours', () => expect(isBookable('2026-10-22', '09:30', hours, now, 60)).toBe(true));
  it('refuses a slot that already started today, accepts a later one', () => {
    expect(isBookable('2026-10-21', '10:00', hours, now, 60)).toBe(false);
    expect(isBookable('2026-10-21', '10:30', hours, now, 60)).toBe(true);
  });
  it('refuses past days, closed days, off-grid and out-of-hours times', () => {
    expect(isBookable('2026-10-20', '10:00', hours, now, 60)).toBe(false);
    expect(isBookable('2026-10-25', '10:00', hours, now, 60)).toBe(false);
    expect(isBookable('2026-10-22', '10:15', hours, now, 60)).toBe(false);
    expect(isBookable('2026-10-22', '17:00', hours, now, 60)).toBe(false);
  });
  it('enforces the booking horizon', () => {
    expect(isBookable('2026-12-18', '10:00', hours, now, 58)).toBe(true);
    expect(isBookable('2026-12-19', '10:00', hours, now, 58)).toBe(false);
  });
});

describe('dates', () => {
  it('rejects impossible dates', () => {
    expect(isDate('2026-02-30')).toBe(false);
    expect(isDate('2026-10-21')).toBe(true);
  });
  it('adds days across month ends and finds the weekday', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(weekday('2026-10-21')).toBe(3);
  });
  it('reads the clock in the clinic time zone', () => {
    expect(clinicNow('America/Guayaquil', new Date('2026-10-22T03:30:00Z'))).toEqual({ date: '2026-10-21', time: '22:30' });
  });
});
