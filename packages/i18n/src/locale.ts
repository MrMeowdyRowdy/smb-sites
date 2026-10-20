export type Locale = 'es' | 'en';
export const locales: readonly Locale[] = ['es', 'en'];
export const defaultLocale: Locale = 'es';
export const otherLocale = (l: Locale): Locale => (l === 'es' ? 'en' : 'es');

/** USD with a decimal comma in Spanish, a point in English. */
export function formatUsd(amount: number, locale: Locale): string {
  const s = amount.toFixed(2);
  return `$${locale === 'es' ? s.replace('.', ',') : s}`;
}
