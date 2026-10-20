import siteJson from '../../content/site.json';
import menuJson from '../../content/menu.json';
import creditsJson from '../../content/credits.json';
import type { Locale } from '@smb/i18n';
import { validateCredits, validateMenu, validateSite } from './validate';

export type L10n = { es: string; en: string };
export type Menu = {
  categories: { id: string; name: L10n }[];
  items: { id: string; category: string; name: L10n; description: L10n; price: number; tags: string[]; available: boolean; /** file name in public/photos when it differs from the id */ photo?: string }[];
  /** Exactly 4 ids for the band on the home page. */
  featured: string[];
  /** Optional date window (MM-DD, Quito) with one seasonal line. */
  seasonal?: { from: string; to: string; name: L10n; note: L10n };
};
export type Credit = { file: string; author: string; source: string; licence: string };

// The phone comes from the environment so the real number never lives in the repo.
const site = { ...siteJson, whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || siteJson.whatsapp };
const menu = menuJson as Menu;
const credits = creditsJson as Credit[];

// A broken edit fails the build instead of shipping a broken page.
const errors = [...validateSite(site), ...validateMenu(menu), ...validateCredits(credits)];
if (errors.length) throw new Error(`Invalid content:\n- ${errors.join('\n- ')}`);

export { site, menu, credits };
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
export const abs = (path: string) => siteUrl + path;
export const pick = (v: L10n, locale: Locale) => v[locale];

/** Thousands separator by language; Intl skips it for 4-digit Spanish numbers. */
export const thousands = (n: number, locale: Locale) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, locale === 'es' ? '.' : ',');

/** The rows of the home table: round-robin over the categories, featured dishes excluded, at most 12. */
export function homeRows(m: Menu, max = 12) {
  const pools = m.categories.map((c) => m.items.filter((i) => i.category === c.id && i.available && !m.featured.includes(i.id)));
  const rows: { item: Menu['items'][number]; category: Menu['categories'][number] }[] = [];
  for (let n = 0; rows.length < max && pools.some((p) => p[n]); n++)
    pools.forEach((p, ci) => p[n] && rows.length < max && rows.push({ item: p[n], category: m.categories[ci] }));
  return rows;
}
