import { type Hours, isBookable } from './slots';

export type BookingInput = { service: string; date: string; time: string; name: string; phone: string };
export type BookingField = keyof BookingInput;
/** Field -> error code. The UI turns codes into Spanish or English text. */
export type BookingErrors = Partial<Record<BookingField, 'required' | 'invalid' | 'unavailable'>>;

type Rules = { serviceIds: string[]; hours: Hours; now: { date: string; time: string }; horizonDays: number };

export function validateBooking(raw: unknown, rules: Rules): { ok: true; value: BookingInput } | { ok: false; errors: BookingErrors } {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const s = (k: string) => (typeof r[k] === 'string' ? (r[k] as string).trim() : '');
  const value: BookingInput = { service: s('service'), date: s('date'), time: s('time'), name: s('name'), phone: s('phone') };
  const errors: BookingErrors = {};

  if (!value.service) errors.service = 'required';
  else if (!rules.serviceIds.includes(value.service)) errors.service = 'invalid';

  if (!value.date) errors.date = 'required';
  if (!value.time) errors.time = 'required';
  if (value.date && value.time && !isBookable(value.date, value.time, rules.hours, rules.now, rules.horizonDays)) errors.time = 'unavailable';

  if (!value.name) errors.name = 'required';
  else if (value.name.length < 2 || value.name.length > 80) errors.name = 'invalid';

  const digits = value.phone.replace(/\D/g, '');
  if (!value.phone) errors.phone = 'required';
  else if (!/^\+?[\d\s()-]+$/.test(value.phone) || digits.length < 7 || digits.length > 15) errors.phone = 'invalid';

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value };
}
