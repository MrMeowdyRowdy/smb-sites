# Clinic

Booking app for **Dental Alameda**, a fictional dental clinic in Quito (not a real business). It exists to be deployed, monitored and tested: few features, each one solid. Part of the [smb-sites](../../README.md) monorepo; the infrastructure that runs it is a separate project.

- **Public booking** (Spanish at `/`, English at `/en`): pick a service, a date and a free 30-minute slot, leave a name and phone, get a confirmation page. Double booking is impossible: a partial unique index on `(day, slot) WHERE status = 'booked'` makes the database refuse the second insert (HTTP 409), whatever the application code does.
- **Admin** (`/admin`): one password (`ADMIN_PASSWORD`), httpOnly signed cookie, no accounts. Lists upcoming appointments by day and cancels one (which frees the slot).
- **Ops endpoints**: `GET /api/health` (process up), `GET /api/ready` (database reachable), `GET /api/metrics` (Prometheus: default process metrics plus `clinic_bookings_created_total` and `clinic_booking_conflicts_total`).

Stack: Next.js 16 (`output: 'standalone'`), React 19, Postgres 17 through `pg` (no ORM), SQL migrations in `migrations/`, prom-client, Vitest, Playwright with axe-core.

## Run it

```
cp .env.example .env            # optional; the defaults below work
docker compose up --build       # http://localhost:3000, admin at /admin (password: change-me-local)
```

Compose starts Postgres 17.6, runs `node scripts/migrate.mjs` once, then starts the app. Postgres is also published on `127.0.0.1:5433` for the tests. Stop with `docker compose down` (add `-v` to drop the data).

Without Docker for the app: run only the database with `docker compose up -d db`, then from the repo root:

```
export DATABASE_URL=postgres://clinic:clinic@127.0.0.1:5433/clinic ADMIN_PASSWORD=change-me-local SESSION_SECRET=local-session-secret-not-for-production
npm run migrate -w apps/clinic
npm run dev -w apps/clinic
```

## Environment

| Variable | Required | Meaning |
|---|---|---|
| `DATABASE_URL` | yes | Postgres connection string |
| `ADMIN_PASSWORD` | yes | Admin password. Unset means nobody can log in. |
| `SESSION_SECRET` | yes | HMAC key for the admin cookie, 16+ characters. Unset or shorter means admin login returns 500. |
| `COOKIE_SECURE` | no | `true` adds the `Secure` flag; set it behind TLS (the local stack is plain HTTP) |
| `PORT`, `HOSTNAME` | no | Server bind; the image uses `3000` and `0.0.0.0` |

Opening hours, the services and prices live in `content/clinic.json`. The clock is Quito time (`America/Guayaquil`).

## Test it

```
docker compose up -d db
export DATABASE_URL=postgres://clinic:clinic@127.0.0.1:5433/clinic
npm run test:unit -w apps/clinic     # slot logic, validation, admin session
npm run build -w apps/clinic
npm run test:e2e -w apps/clinic      # starts the standalone build, migrates, resets the table
npm run ci -w apps/clinic            # lint, typecheck, unit, build, e2e
```

The e2e run empties the `appointments` table of the database in `DATABASE_URL`. To run the same specs against an instance that is already up (compose, a cluster), set `E2E_BASE_URL=http://host:port` and `ADMIN_PASSWORD`; nothing is started or reset then. Behind the clinic-infra ingress also set `E2E_METRICS_BLOCKED=1`, since `/api/metrics` answers 403 there.

## Image

`docker build -f apps/clinic/Dockerfile -t clinic .` (context is the repo root, because the build uses the workspace packages). Multi-stage, runs as the non-root `node` user, and contains `scripts/migrate.mjs`, `migrations/` and `pg`, so a Kubernetes Job can run `node scripts/migrate.mjs` from the same image. CI pushes `ghcr.io/mrmeowdyrowdy/clinic:<git sha>` from the default branch.

## Limits

No login rate limiting, no reminders or payments, one chair (one booking per slot), admin text is Spanish only.
