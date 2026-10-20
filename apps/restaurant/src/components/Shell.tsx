import { type Locale, type RouteId, pathFor, t } from '@smb/i18n';
import { LanguageSwitch, WhatsAppButton } from '@smb/ui';
import { ui } from '../copy';
import { credits, site } from '../lib/content';
import { Fog } from './Fog';
import { Motion } from './Motion';

export function Shell({ locale, routeId, children }: { locale: Locale; routeId: RouteId; children: React.ReactNode }) {
  const u = ui[locale];
  const home = pathFor('home', locale);
  const isHome = routeId === 'home';
  return (
    <>
      <a href="#main" className="skip-link">
        {t(locale).skipLink}
      </a>
      <header className={`site-header no-print${isHome ? ' is-home' : ''}`}>
        <a href={home} className="brand">
          {site.name}
        </a>
        <nav aria-label={u.nav.label}>
          <a href={pathFor('menu', locale)}>{u.nav.menu}</a>
          <a href={`${home}#hoy`}>{u.nav.today}</a>
          <a href={`${home}#visita`}>{u.nav.visit}</a>
        </nav>
      </header>
      <main id="main" className={isHome ? undefined : 'page'}>
        {children}
      </main>
      <footer className="close no-print">
        <div className="close-top">
          <p className="close-invite">{u.close.invite}</p>
          <p className="close-action">
            <WhatsAppButton className="btn btn-wa" phone={site.whatsapp} text="" locale={locale} label={u.close.cta} />
          </p>
          <nav className="close-links" aria-label={u.close.links}>
            <a href={pathFor('menu', locale)}>{u.nav.menu}</a>
            <a href={pathFor('quality', locale)}>{u.nav.quality}</a>
          </nav>
          <LanguageSwitch locale={locale} routeId={routeId} className="close-lang" />
        </div>
        <div className="close-legal">
          <p>{u.footer}</p>
          {credits.length > 0 && (
            <div>
              <p className="credits-note">{u.illustrative}</p>
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
            </div>
          )}
        </div>
        <p className="close-name" aria-hidden="true">
          <span>{site.name}</span>
        </p>
        <Fog />
      </footer>
      <Motion />
    </>
  );
}
