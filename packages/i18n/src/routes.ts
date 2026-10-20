import { type Locale, otherLocale } from './locale';

/** Paired paths: one row per page, one path per locale. Used by hreflang and the language switch. */
export const routes = [
  { id: 'home', es: '/', en: '/en/' },
  { id: 'menu', es: '/menu/', en: '/en/menu/' },
  { id: 'qr', es: '/menu/qr/', en: '/en/menu/qr/' },
  { id: 'quality', es: '/calidad/', en: '/en/quality/' },
] as const;

export type RouteId = (typeof routes)[number]['id'];

export const pathFor = (id: RouteId, locale: Locale): string => routes.find((r) => r.id === id)![locale];

/** Find the route and locale a path belongs to, or undefined. */
export function matchPath(path: string): { id: RouteId; locale: Locale } | undefined {
  for (const r of routes) {
    if (r.es === path) return { id: r.id, locale: 'es' };
    if (r.en === path) return { id: r.id, locale: 'en' };
  }
}

/** The paired path in the other locale. */
export function switchPath(path: string): string | undefined {
  const m = matchPath(path);
  return m && pathFor(m.id, otherLocale(m.locale));
}
