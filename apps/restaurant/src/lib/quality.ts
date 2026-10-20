import qualityJson from '../../content/quality.json';

export type Quality = {
  generated: string;
  commit: string;
  node: string;
  next: string;
  unit: { passed: number; failed: number; total: number };
  e2e: { passed: number; failed: number; skipped: number; total: number };
  axe: { route: string; violations: number }[];
  lighthouse: { path: string; performance: number; accessibility: number; bestPractices: number; seo: number; lcp: number }[];
  deploy: { url: string | null };
};

/** content/quality.json is written by scripts/quality-report.mjs; before the first run it holds only {"generated": null}. */
export const quality = (qualityJson as { generated: string | null }).generated ? (qualityJson as unknown as Quality) : null;
