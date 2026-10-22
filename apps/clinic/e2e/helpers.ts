import type { APIRequestContext } from '@playwright/test';

/** A Monday-to-Friday date `minAhead` or more days from now (UTC-5 clock, like the clinic). */
export function weekdayAhead(minAhead = 2): string {
  const d = new Date(Date.now() - 5 * 3600_000);
  d.setUTCDate(d.getUTCDate() + minAhead);
  while ([0, 6].includes(d.getUTCDay())) d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

/** A random Ecuadorian mobile number, so tests never share a phone and trip the per-phone cap. */
export const randomPhone = () => `+593 99 ${String(Math.floor(Math.random() * 1e7)).padStart(7, '0')}`;

export const book = (request: APIRequestContext, date: string, time: string, name = 'Paciente API', phone = randomPhone()) =>
  request.post('/api/appointments', { data: { service: 'cleaning', date, time, name, phone } });

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'e2e-admin-password';
