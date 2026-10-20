import { defineConfig } from 'vitest/config';
import path from 'node:path';

// Runs the shared packages' tests and the app's, from the repo root.
export default defineConfig({
  test: {
    root: path.resolve(__dirname, '../..'),
    include: ['packages/**/*.test.ts', 'apps/restaurant/src/**/*.test.ts'],
    reporters: ['default', 'json'],
    outputFile: { json: path.resolve(__dirname, 'reports/vitest.json') },
  },
});
