import { type Locale, type RouteId, otherLocale, pathFor, t } from '@smb/i18n';

/** Links to the paired page in the other language. */
export function LanguageSwitch({ locale, routeId, className }: { locale: Locale; routeId: RouteId; className?: string }) {
  const d = t(locale).languageSwitch;
  return (
    <nav aria-label={d.label} className={className}>
      <a href={pathFor(routeId, otherLocale(locale))} lang={d.switchToLang} hrefLang={d.switchToLang}>
        {d.switchTo}
      </a>
    </nav>
  );
}
