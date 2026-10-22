import { type Locale, type RouteId, pathFor, t } from '@smb/i18n';
import { ui } from '../copy';
import { site } from '../lib/content';
import { Lockup } from './brand/Lockup';
import { Close } from './Close';
import { Motion } from './Motion';
import { Veil } from './Veil';

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
        <a href={home} className="brand" aria-label={site.name}>
          <Lockup locale={locale} />
        </a>
        <nav aria-label={u.nav.label}>
          <a href={pathFor('menu', locale)}>{u.nav.menu}</a>
          <a href={`${home}#hoy`}>{u.nav.today}</a>
          <a href={`${home}#visita`}>{u.nav.visit}</a>
        </nav>
        <Veil paths={[home, pathFor('menu', locale)]} />
      </header>
      <main id="main" className={isHome ? undefined : 'page'}>
        {children}
      </main>
      <Close locale={locale} routeId={routeId} />
      <Motion />
    </>
  );
}
