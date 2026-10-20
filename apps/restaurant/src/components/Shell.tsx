import { type Locale, type RouteId, pathFor, t } from '@smb/i18n';
import { LanguageSwitch } from '@smb/ui';
import { ui } from '../copy';
import { credits, site } from '../lib/content';

export function Shell({ locale, routeId, children }: { locale: Locale; routeId: RouteId; children: React.ReactNode }) {
  const u = ui[locale];
  return (
    <>
      <a href="#main" className="skip-link">
        {t(locale).skipLink}
      </a>
      <header className="site-header no-print">
        <a href={pathFor('home', locale)} className="brand">
          {site.name}
        </a>
        <nav aria-label={u.nav.label}>
          <a href={pathFor('menu', locale)}>{u.nav.menu}</a>
          <a href={pathFor('quality', locale)}>{u.nav.quality}</a>
        </nav>
        <LanguageSwitch locale={locale} routeId={routeId} />
      </header>
      <main id="main">{children}</main>
      <footer className="site-footer no-print">
        <p>{u.footer}</p>
        {credits.length > 0 && (
          <details>
            <summary>{u.credits}</summary>
            <ul>
              {credits.map((c) => (
                <li key={c.file}>
                  {c.file}: {c.author}, <a href={c.source}>{c.source}</a>, {c.licence}
                </li>
              ))}
            </ul>
          </details>
        )}
      </footer>
    </>
  );
}
