# smb-sites

Demo websites for small businesses in Ecuador, built as one monorepo: bilingual (Spanish default, English), static, WhatsApp-first, tested on every change.

The first app is `apps/restaurant`: **Neblina**, a fictional café in Quito. It is not a real business; every page says so.

## Stack

Next.js 16 (app router, static export), React 19, TypeScript, npm workspaces, Vitest, Playwright with axe-core, Lighthouse CI, GitHub Actions. Details and reasons are in [docs/decisions](docs/decisions).

```
apps/restaurant     the café site
apps/clinic         booking app for a fictional dental clinic (Next.js server, Postgres, Docker)
packages/config     tsconfig base and ESLint config
packages/i18n       ES/EN dictionaries and the paired route map
packages/ui         WhatsApp helpers and button, contact form, language switch, analytics slot
```

## Run it

Node 20 (`nvm use`), then:

```
npm install
npm run dev -w apps/restaurant          # http://localhost:3000
npm run build -w apps/restaurant        # static site in apps/restaurant/out/
npm run ci                              # everything CI runs, in order
```

`npm run ci` needs Chromium for Playwright (`npx playwright install chromium`) and Chrome at `/usr/bin/google-chrome` for Lighthouse (set `CHROME_PATH` to override).

Per app (`-w apps/restaurant`): `lint`, `typecheck`, `test:unit`, `build`, `test:e2e`, `lhci`, `report`. The CI workflow calls these same scripts. Copy `.env.example` to `.env.local` to set the site URL, WhatsApp number and optional analytics script.

## How a client edits content

Texts and data that change often are two JSON files in `apps/restaurant/content/`:

- `menu.json`: categories and items. Each item has an `id`, a `category`, a `name` and `description` in `es` and `en`, a `price` in USD (above 0), `tags` (`vegetarian`, `vegan`, `gluten-free`) and `available` (`false` shows "sold out").
- `site.json`: name, taglines, address, coordinates, opening hours, price range. The WhatsApp number comes from `NEXT_PUBLIC_WHATSAPP`.
- `credits.json`: photo credits (`file`, `author`, `source`, `licence`); shown in the footer when not empty.

Save, commit, push; CI checks the files (a broken edit fails the build) and deploys. A CMS with a form for non-technical staff can be quoted later.

## The Quality Report

`/calidad/` and `/en/quality/` show test counts, Lighthouse scores, axe results and deploy status. They read `content/quality.json`, which `scripts/quality-report.mjs` writes from the real test output. Nothing is typed by hand.

## Deploy

Off by default. GitHub Actions builds, then rsyncs `out/` over SSH to a CloudPanel static site (see [decision 0002](docs/decisions/0002-hosting-cloudpanel.md)). To enable it, create an environment named `demo` and set:

| Kind | Name | Meaning |
| --- | --- | --- |
| Secret | `DEPLOY_KEY` | private SSH key of the deploy user |
| Secret | `DEPLOY_KNOWN_HOSTS` | pinned host key line(s) of the server |
| Secret | `DEPLOY_HOST` | server host name |
| Variable | `DEPLOY_ENABLED` | `true` to allow deploys |
| Variable | `DEMO_DOMAIN` | base domain; the app lives at `restaurant.<domain>` (`staging.restaurant.<domain>` from the `staging` branch) |
| Variable | `RESTAURANT_SITE_USER` | Linux user of the site on the server |
| Variable | `RESTAURANT_WHATSAPP` | WhatsApp number, digits with country code |

Deploys run from the Actions tab (tick "deploy") or on a push to `staging`, after all checks pass.

## License

MIT, see [LICENSE](LICENSE). Contributing: [CONTRIBUTING.md](CONTRIBUTING.md).
