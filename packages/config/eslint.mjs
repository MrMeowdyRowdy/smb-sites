import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  { rules: { '@next/next/no-html-link-for-pages': 'off' } }, // app router; plain links also cross the two root layouts
  globalIgnores(['**/.next/**', '**/out/**', '**/lhci/**', '**/reports/**', '**/playwright-report/**', '**/test-results/**', '**/next-env.d.ts']),
]);
