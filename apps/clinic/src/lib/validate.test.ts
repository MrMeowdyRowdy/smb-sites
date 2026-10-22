import { describe, expect, it } from 'vitest';
import { validateBooking } from './validate';

const rules = {
  serviceIds: ['checkup', 'cleaning'],
  hours: { '0': null, '1': ['09:00', '17:00'], '2': ['09:00', '17:00'], '3': ['09:00', '17:00'], '4': ['09:00', '17:00'], '5': ['09:00', '17:00'], '6': null } as never,
  now: { date: '2026-10-21', time: '10:10' },
  horizonDays: 60,
};
const good = { service: 'checkup', date: '2026-10-22', time: '09:30', name: '  Ana Pérez ', phone: '+593 99 638 9675' };

describe('validateBooking', () => {
  it('accepts a valid booking and trims fields', () => {
    const r = validateBooking(good, rules);
    expect(r).toEqual({ ok: true, value: { ...good, name: 'Ana Pérez' } });
  });
  it('flags every missing field', () => {
    const r = validateBooking({}, rules);
    expect(r).toEqual({ ok: false, errors: { service: 'required', date: 'required', time: 'required', name: 'required', phone: 'required' } });
  });
  it('rejects unknown services, bad phones and unavailable slots', () => {
    const r = validateBooking({ ...good, service: 'x', phone: 'abc', time: '08:00' }, rules);
    expect(r).toEqual({ ok: false, errors: { service: 'invalid', phone: 'invalid', time: 'unavailable' } });
  });
  it('does not throw on non-object input or non-string fields', () => {
    expect(validateBooking(null, rules).ok).toBe(false);
    expect(validateBooking({ ...good, name: 42 }, rules)).toMatchObject({ ok: false, errors: { name: 'required' } });
  });
});
