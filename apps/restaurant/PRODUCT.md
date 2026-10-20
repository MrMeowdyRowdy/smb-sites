# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primary: owners of small cafés and restaurants in Quito who are deciding whether to pay for a website like this one; the demo must feel like a site they would buy (confirmed 2026-10-20). Inside the demo, the visitors are café customers on their phones (locals and tourists, Spanish and English) who want to see the menu, check whether it is open, and order or ask by WhatsApp. Secondary: recruiters and hiring engineers, served by the Quality Report page linked from the footer.

## Product Purpose
Demo 1 of the `smb-sites` catalogue: a bilingual, WhatsApp-first site for a fictional Quito café, Neblina. Success: a café owner wants it for their place, and a reviewer can see it is tested, accessible, fast and deployed through CI.

## Positioning
Neblina is named for the fog: its coffee comes from the cloud forest of Nanegal (northwest Pichincha) and is served in La Floresta, Quito, where the fog arrives in the afternoon. "Café de altura" from bosque nublado, Ecuadorian bakery, home-style lunch.

## Operating Context
Orders and questions go to WhatsApp (wa.me messages composed by the site); no backend, no payments. The menu and business data are JSON files the client edits (`content/site.json`, `content/menu.json`); a CMS is quoted separately. Static export served by nginx on CloudPanel.

## Capabilities and Constraints
Menu with categories and a cart that builds a WhatsApp message; printable QR menu; hours; a map link; contact via WhatsApp; ES default, EN mirror; Quality Report fed by CI output. Static only (no server code). Analytics off by default.

## Brand Commitments
Name: Neblina. Fictional business: every page says so. Photos come from Unsplash and Creative Commons, credited, never presented as the café's own rooms, staff or dishes.

## Evidence on Hand
No real customers, reviews, press or statistics exist; none may be invented. Menu items and prices are sample content (`content/menu.json`).

## Product Principles
1. The menu, the hours and the WhatsApp action are never more than one tap away on a phone.
2. Everything a café owner would change lives in content files, not in components.
3. Honest by default: fictional business, credited photos, real CI numbers.

## Accessibility & Inclusion
WCAG 2.1 AA (axe in CI, zero violations), reduced motion respected, 44 px touch targets, Spanish and English.
