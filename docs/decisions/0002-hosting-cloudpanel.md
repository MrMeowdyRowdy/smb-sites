# 0002. Hosting: CloudPanel, one Linux user per site

Status: accepted, 2026-10-19

## Context
The demos must live on a domain a client can visit, cheaply, and the same server should later host a Node app.

## Decision
- Static apps are CloudPanel static sites. Each site has its own Linux user and its own `htdocs/<domain>/` folder.
- GitHub Actions builds the static export (`out/`), then `rsync -az --delete` over SSH into that folder. nginx serves it and Let's Encrypt gives TLS.
- Deploy secrets: `DEPLOY_KEY`, `DEPLOY_KNOWN_HOSTS` (pinned host key), `DEPLOY_HOST`. Variables: `DEPLOY_ENABLED`, `DEMO_DOMAIN`, one `<APP>_SITE_USER` per app. Nothing is deployed unless `DEPLOY_ENABLED` is `true`.
- A later Node app (clinic) uses a standalone build and `pm2 reload`; the matrix has a commented row for it.

## Why not Vercel
Static HTML needs no platform. Clients get a normal server they can keep paying for, with no per-seat or bandwidth surprises, and one machine can host the Node demo too. The trade-off is that we maintain the server.

## Note
The Open Graph image is exported without a file extension. Make sure nginx serves it as `image/png` (for example `default_type image/png` for that location) or social previews may fail.
