import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { COOKIE, verifySession } from '@/lib/auth';
import { content } from '@/lib/content';
import { COLUMNS, type Appointment, pool } from '@/lib/db';
import { clinicNow } from '@/lib/slots';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Administración', robots: { index: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const authed = verifySession((await cookies()).get(COOKIE)?.value);
  if (!authed) {
    const failed = (await searchParams).error;
    return (
      <main>
        <h1>Administración</h1>
        <form method="post" action="/api/admin/login" className="card">
          <div>
            <label htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required />
            {failed && <p className="error" role="alert">Contraseña incorrecta.</p>}
          </div>
          <button type="submit">Entrar</button>
        </form>
      </main>
    );
  }

  const today = clinicNow(content.timezone);
  const rows = (
    await pool().query<Appointment>(
      `SELECT ${COLUMNS} FROM appointments WHERE status = 'booked' AND (day > $1 OR (day = $1 AND slot > $2)) ORDER BY day, slot`,
      [today.date, today.time],
    )
  ).rows;
  const days = new Map<string, Appointment[]>(); // Map.groupBy needs Node 21
  for (const r of rows) days.set(r.day, [...(days.get(r.day) ?? []), r]);
  const label = (id: string) => content.services.find((s) => s.id === id)?.es ?? id;

  return (
    <main>
      <h1>Citas próximas</h1>
      <form method="post" action="/api/admin/logout"><button type="submit">Salir</button></form>
      {rows.length === 0 && <p className="muted">No hay citas próximas.</p>}
      {[...days].map(([day, list]) => (
        <section key={day} aria-labelledby={`d-${day}`}>
          <h2 id={`d-${day}`}>{day}</h2>
          <table>
            <thead><tr><th>Hora</th><th>Paciente</th><th>Teléfono</th><th>Servicio</th><th><span className="sr">Acciones</span></th></tr></thead>
            <tbody>
              {list.map((a) => (
                <tr key={a.id}>
                  <td>{a.slot}</td>
                  <td>{a.name}</td>
                  <td>{a.phone}</td>
                  <td>{label(a.service)}</td>
                  <td>
                    <form method="post" action={`/api/admin/appointments/${a.id}/cancel`}>
                      <button type="submit" className="link" aria-label={`Cancelar cita de ${a.name} el ${a.day} a las ${a.slot}`}>Cancelar</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </main>
  );
}
