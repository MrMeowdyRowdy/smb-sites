import pg from 'pg';

// One pool per process; globalThis keeps it across dev-mode module reloads.
const g = globalThis as unknown as { __clinicPool?: pg.Pool };

export function pool(): pg.Pool {
  g.__clinicPool ??= new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 5, connectionTimeoutMillis: 3000 });
  return g.__clinicPool;
}

export type Appointment = { id: string; service: string; day: string; slot: string; name: string; phone: string; status: string };

// Dates and times are formatted in SQL so node-postgres never converts them through the server's time zone.
export const COLUMNS = "id, service, to_char(day, 'YYYY-MM-DD') AS day, to_char(slot, 'HH24:MI') AS slot, name, phone, status";
