# 0004. The Quality Report is written by CI

Status: accepted, 2026-10-19

## Context
A page that claims "fast, accessible, tested" is worthless if someone typed the numbers.

## Decision
`scripts/quality-report.mjs` reads the Vitest JSON, the Playwright JSON, the per-route axe results and the Lighthouse CI manifest, adds the commit, date, Node and Next versions, and writes `content/quality.json`. The `/calidad/` and `/en/quality/` pages render only from that file.

CI order: unit, build, e2e and axe, Lighthouse, quality report, rebuild. The final build therefore describes the commit's own checks. Uptime is a labelled placeholder until monitoring exists. Deploy status says "pending first deploy" until the deploy job sets the URL.

## Consequences
The committed `quality.json` comes from a local `npm run ci` run and is replaced by every CI run. A failing check fails the pipeline before a report is written.
