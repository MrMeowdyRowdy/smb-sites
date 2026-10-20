# 0001. One monorepo with npm workspaces

Status: accepted, 2026-10-19

## Context
Several small-business demo sites share the same needs: WhatsApp links, a contact form, ES/EN strings, lint and TypeScript settings, and one CI pipeline.

## Decision
- One repo, npm workspaces: `apps/*` (one folder per site) and `packages/*` (`config`, `i18n`, `ui`).
- Packages ship TypeScript source and are consumed through Next's `transpilePackages`. There is no package build step.
- Versions are pinned exactly. Dependencies are releases at least two weeks old.
- Header and footer stay in each app because they are design-specific. Extract them when demo 2 shows what is actually shared.
- A package is added only when an app uses it.

## Consequences
One `npm ci`, one lockfile, one workflow with a per-app matrix. A change in `packages/` re-checks every app.
