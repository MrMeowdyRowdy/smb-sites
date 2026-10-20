import { defineConfig } from '@playwright/test';

// Tests run against the static build in out/ (run `npm run build` first).
export default defineConfig({
  testDir: './e2e',
  outputDir: 'reports/test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['json', { outputFile: 'reports/playwright.json' }], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: { baseURL: 'http://localhost:4173' },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: { command: 'npx serve out -l 4173 --no-clipboard', url: 'http://localhost:4173', reuseExistingServer: !process.env.CI, timeout: 30_000 },
});
