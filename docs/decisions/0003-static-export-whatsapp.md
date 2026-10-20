# 0003. Static export, WhatsApp instead of a backend

Status: accepted, 2026-10-19

## Context
Small businesses in Ecuador take orders and questions on WhatsApp. A backend means a database, spam handling and hosting to keep alive.

## Decision
- Apps use `output: 'export'`: plain files, no server code at runtime.
- The cart and the contact form compose a message and open `wa.me/<number>?text=...`. Nothing is stored or sent by us. The cart lives in the visitor's `localStorage`.
- The menu and the site data are two JSON files in `content/`, checked at build time. A broken edit fails the build.
- Analytics is one optional script slot (`NEXT_PUBLIC_ANALYTICS_SRC`); nothing third-party loads by default.

## Consequences
Nothing to host or secure beyond static files. No order history and no payments; both need a backend or a CMS, which can be quoted separately.
