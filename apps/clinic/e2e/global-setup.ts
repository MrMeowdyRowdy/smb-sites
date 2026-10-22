import pg from 'pg';

// Playwright starts the web server (which migrates) before global setup; start each run with an empty table.
export default async function globalSetup() {
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL ?? 'postgres://clinic:clinic@127.0.0.1:5433/clinic' });
  await c.connect();
  await c.query('TRUNCATE appointments');
  await c.end();
}
