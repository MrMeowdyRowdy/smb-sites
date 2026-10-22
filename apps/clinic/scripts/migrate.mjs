// Applies migrations/*.sql in name order, once each. Safe to run concurrently and repeatedly.
// Used by compose, CI and the Kubernetes migration Job: `node scripts/migrate.mjs`.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'migrations');
const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const client = new pg.Client({ connectionString: url });
await client.connect();
try {
  await client.query('SELECT pg_advisory_lock(727001)'); // one migrator at a time
  await client.query('CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())');
  const done = new Set((await client.query('SELECT name FROM schema_migrations')).rows.map((r) => r.name));
  for (const file of (await readdir(dir)).filter((f) => f.endsWith('.sql')).sort()) {
    if (done.has(file)) continue;
    await client.query('BEGIN');
    try {
      await client.query(await readFile(path.join(dir, file), 'utf8'));
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    }
    console.log(`applied ${file}`);
  }
  console.log('migrations up to date');
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  await client.end();
}
