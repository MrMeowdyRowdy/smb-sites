import { defineConfig } from '@playwright/test';

// Tests run against the standalone build (run `npm run build` first) and need a Postgres at DATABASE_URL.
const url = process.env.DATABASE_URL ?? 'postgres://clinic:clinic@127.0.0.1:5433/clinic';
const env = { DATABASE_URL: url, ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? 'e2e-admin-password', SESSION_SECRET: process.env.SESSION_SECRET ?? 'e2e-session-secret-local', PORT: '4174', HOSTNAME: '127.0.0.1' };

// E2E_BASE_URL points the suite at an already running instance (compose, a cluster): no server start, no table reset.
const external = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: './e2e',
  outputDir: 'reports/test-results',
  globalSetup: external ? undefined : './e2e/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: { baseURL: external ?? 'http://127.0.0.1:4174' },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: external ? undefined : {
    command: 'node scripts/migrate.mjs && node scripts/start-standalone.mjs',
    url: 'http://127.0.0.1:4174/api/ready',
    env,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
