// Collects the results of this run's checks into content/quality.json.
// The Quality Report pages render only from that file.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const need = (p) => {
  if (!fs.existsSync(path.join(root, p))) throw new Error(`quality-report: ${p} is missing; run the checks first`);
};

need('reports/vitest.json');
need('reports/playwright.json');
need('reports/axe');
need('lhci/manifest.json');

const vitest = read('reports/vitest.json');
const pw = read('reports/playwright.json').stats;
const axeDir = path.join(root, 'reports/axe');
const axe = fs
  .readdirSync(axeDir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(fs.readFileSync(path.join(axeDir, f), 'utf8')))
  .map((r) => ({ route: r.route, violations: r.violations.reduce((n, v) => n + v.nodes, 0) }))
  .sort((a, b) => a.route.localeCompare(b.route));

const lighthouse = read('lhci/manifest.json')
  .filter((r) => r.isRepresentativeRun)
  .map((r) => {
    const lhr = JSON.parse(fs.readFileSync(r.jsonPath, 'utf8'));
    return {
      path: new URL(r.url).pathname,
      performance: r.summary.performance,
      accessibility: r.summary.accessibility,
      bestPractices: r.summary['best-practices'],
      seo: r.summary.seo,
      lcp: lhr.audits['largest-contentful-paint'].numericValue,
    };
  })
  .sort((a, b) => a.path.localeCompare(b.path));

const sh = (c) => execSync(c, { cwd: root, encoding: 'utf8' }).trim();
const report = {
  generated: new Date().toISOString(),
  commit: process.env.GITHUB_SHA?.slice(0, 7) ?? sh('git rev-parse --short HEAD'),
  node: process.version,
  next: read('../../node_modules/next/package.json').version,
  unit: { passed: vitest.numPassedTests, failed: vitest.numFailedTests, total: vitest.numTotalTests },
  e2e: { passed: pw.expected, failed: pw.unexpected + pw.flaky, skipped: pw.skipped, total: pw.expected + pw.unexpected + pw.flaky + pw.skipped },
  axe,
  lighthouse,
  // Set QUALITY_DEPLOY_URL when the site is live; until then the page says "pending first deploy".
  deploy: { url: process.env.QUALITY_DEPLOY_URL || null },
};

fs.writeFileSync(path.join(root, 'content/quality.json'), JSON.stringify(report, null, 2) + '\n');
console.log(`quality.json written: ${report.unit.passed}/${report.unit.total} unit, ${report.e2e.passed}/${report.e2e.total} e2e, ${axe.length} axe routes, ${lighthouse.length} lighthouse urls`);
