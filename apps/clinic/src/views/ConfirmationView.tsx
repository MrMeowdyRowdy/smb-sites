import { notFound } from 'next/navigation';
import { type Locale } from '@smb/i18n';
import { Shell } from '@/components/Shell';
import { bookingPath, copy } from '@/copy';
import { content } from '@/lib/content';
import { COLUMNS, type Appointment, pool } from '@/lib/db';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function ConfirmationView({ locale, id }: { locale: Locale; id: string }) {
  if (!UUID.test(id)) notFound();
  const a = (await pool().query<Appointment>(`SELECT ${COLUMNS} FROM appointments WHERE id = $1`, [id])).rows[0];
  if (!a) notFound();
  const c = copy(locale);
  const svc = content.services.find((s) => s.id === a.service);
  return (
    <Shell locale={locale} switchTo={locale === 'es' ? `/en/appointment/${id}` : `/cita/${id}`}>
      <h1>{c.confirmedTitle}</h1>
      {a.status === 'cancelled' ? <p role="status">{c.cancelled}</p> : <p>{c.confirmedIntro}</p>}
      <dl className="card">
        <dt>{c.labels.service}</dt><dd>{svc?.[locale] ?? a.service}</dd>
        <dt>{c.labels.day}</dt><dd>{a.day}</dd>
        <dt>{c.labels.time}</dt><dd>{a.slot}</dd>
        <dt>{c.labels.name}</dt><dd>{a.name}</dd>
        <dt>{c.labels.phone}</dt><dd>{a.phone}</dd>
        <dt>{c.labels.code}</dt><dd>{a.id.slice(0, 8)}</dd>
      </dl>
      <p><a href={bookingPath(locale)}>{c.another}</a></p>
    </Shell>
  );
}
