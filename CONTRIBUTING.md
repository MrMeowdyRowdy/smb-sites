# Contributing

This is a portfolio monorepo of demo sites for small businesses. Issues and suggestions are welcome; for anything else, reach the maintainer on [LinkedIn](https://linkedin.com/in/dennisocana).

- Node 20 (`.nvmrc`), then `npm install`.
- Before opening a PR, run `npm run ci`. It runs the same steps as GitHub Actions: lint, typecheck, unit tests, build, Playwright and axe, Lighthouse CI, quality report.
- Pin exact dependency versions (no `^` or `~`) and prefer releases at least two weeks old.
- Shared code goes in `packages/` only when a second app needs it. Record structural decisions in `docs/decisions/`.
- Content (menu, hours, texts) lives in JSON under `apps/<app>/content/`; keep it valid, the build checks it.
