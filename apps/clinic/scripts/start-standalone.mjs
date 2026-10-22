// Runs the standalone build the way the Docker image does (static assets copied next to it).
// Needs `npm run build` first. Used by the Playwright web server.
import { cpSync } from 'node:fs';
import { spawn } from 'node:child_process';

cpSync('.next/static', '.next/standalone/apps/clinic/.next/static', { recursive: true });
spawn('node', ['.next/standalone/apps/clinic/server.js'], { stdio: 'inherit' }).on('exit', (c) => process.exit(c ?? 1));
