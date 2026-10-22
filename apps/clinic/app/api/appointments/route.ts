import { content } from '@/lib/content';
import { COLUMNS, pool } from '@/lib/db';
import { metrics } from '@/lib/metrics';
import { clinicNow } from '@/lib/slots';
import { validateBooking } from '@/lib/validate';

export const dynamic = 'force-dynamic';

// shortcut: checked before the insert, so two parallel requests can pass a full cap; enforce in SQL if that matters.
// Phones match on their last 9 digits, so 099 123 4567 and +593 99 123 4567 are one number (Ecuador).
const MAX_UPCOMING_PER_PHONE = 3;

/** POST /api/appointments {service,date,time,name,phone} -> 201 {id} | 400 {errors} | 409 slot taken | 429 phone has too many upcoming */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const now = clinicNow(content.timezone);
  const v = validateBooking(body, {
    serviceIds: content.services.map((s) => s.id),
    hours: content.hours,
    now,
    horizonDays: content.horizonDays,
  });
  if (!v.ok) return Response.json({ errors: v.errors }, { status: 400 });

  const { service, date, time, name, phone } = v.value;
  const upcoming = await pool().query(
    "SELECT count(*)::int AS n FROM appointments WHERE status = 'booked' AND right(regexp_replace(phone, '\\D', '', 'g'), 9) = right($1, 9) AND (day > $2 OR (day = $2 AND slot > $3))",
    [phone.replace(/\D/g, ''), now.date, now.time],
  );
  if (upcoming.rows[0].n >= MAX_UPCOMING_PER_PHONE) return Response.json({ errors: { phone: 'limit' } }, { status: 429 });

  try {
    const r = await pool().query(`INSERT INTO appointments (service, day, slot, name, phone) VALUES ($1, $2, $3, $4, $5) RETURNING ${COLUMNS}`, [service, date, time, name, phone]);
    metrics.created.inc();
    return Response.json({ id: r.rows[0].id }, { status: 201 });
  } catch (err) {
    // 23505 = the partial unique index on (day, slot): the database, not this code, decides who got the slot.
    if ((err as { code?: string }).code === '23505') {
      metrics.conflicts.inc();
      return Response.json({ errors: { time: 'unavailable' } }, { status: 409 });
    }
    throw err;
  }
}
