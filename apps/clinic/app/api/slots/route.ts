import { content } from '@/lib/content';
import { pool } from '@/lib/db';
import { addDays, clinicNow, daySlots, isDate } from '@/lib/slots';

export const dynamic = 'force-dynamic';

/** GET /api/slots?date=YYYY-MM-DD -> the day's bookable slots, each marked free or taken. */
export async function GET(req: Request) {
  const date = new URL(req.url).searchParams.get('date') ?? '';
  const now = clinicNow(content.timezone);
  if (!isDate(date) || date < now.date || date > addDays(now.date, content.horizonDays)) {
    return Response.json({ error: 'invalid date' }, { status: 400 });
  }
  const taken = new Set(
    (await pool().query("SELECT to_char(slot, 'HH24:MI') AS t FROM appointments WHERE day = $1 AND status = 'booked'", [date])).rows.map((r) => r.t),
  );
  const slots = daySlots(date, content.hours, content.slotMinutes)
    .filter((t) => date > now.date || t > now.time)
    .map((time) => ({ time, free: !taken.has(time) }));
  return Response.json({ date, slots });
}
