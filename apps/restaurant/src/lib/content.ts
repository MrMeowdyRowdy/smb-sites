import siteJson from '../../content/site.json';
import menuJson from '../../content/menu.json';
import creditsJson from '../../content/credits.json';
import type { Locale } from '@smb/i18n';
import { validateCredits, validateMenu, validateSite } from './validate';

export type L10n = { es: string; en: string };
export type Menu = {
  categories: { id: string; name: L10n }[];
  items: { id: string; category: string; name: L10n; description: L10n; price: number; tags: string[]; available: boolean }[];
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
