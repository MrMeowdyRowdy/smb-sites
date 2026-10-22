import path from 'node:path';
import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'standalone',
  // Trace from the monorepo root so the standalone build includes the workspace packages.
  outputFileTracingRoot: path.join(__dirname, '../..'),
  transpilePackages: ['@smb/i18n'],
};

export default config;
