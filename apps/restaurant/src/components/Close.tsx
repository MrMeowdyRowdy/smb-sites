import { type Locale, type RouteId, pathFor } from '@smb/i18n';
import { LanguageSwitch, WhatsAppButton } from '@smb/ui';
import { ui } from '../copy';
import { credits, site, thousands } from '../lib/content';
import { AfterLoad } from './brand/AfterLoad';
import { Seam } from './brand/Seam';

const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k]));

/**
 * The close (the footer on every page): the fog seam in, deep teal, the invitation, the name at full width cropped by the bottom edge
 * with the farm contour inside the letters and the fog behind them, then the credits. Book part: applied.mjs "cierre".
 */
export function Close({ locale, routeId }: { locale: Locale; routeId: RouteId }) {
  const u = ui[locale];
  const home = pathFor('home', locale);
  const isHome = routeId === 'home';
  const origin = site.origin;
  return (
    <footer className="chap close no-print" data-close>
      {/* Seam and letter contour wait for the load event: on /menu/ their files must not compete with the cup (the LCP image). */}
      {isHome ? <Seam from="field" to="deep" name="route" vb="100 800 700 140" /> : <Seam from="paper" to="deep" name="floresta" vb="60 500 900 160" deferField />}
      <div className="cl-main">
        <h2 className="cl-h">{u.close.invite}</h2>
        <p className="cl-b">
          <WhatsAppButton className="btn btn-wa" phone={site.whatsapp} text="" locale={locale} label={u.close.cta} />
        </p>
        <div className="cl-side">
          <nav className="cl-n" aria-label={u.close.links}>
            <a href={pathFor('menu', locale)}>{u.nav.menu}</a>
            <a href={`${home}#hoy`}>{u.nav.today}</a>
            <a href={`${home}#visita`}>{u.nav.visit}</a>
            <a href={pathFor('quality', locale)}>{u.nav.quality}</a>
          </nav>
          <LanguageSwitch locale={locale} routeId={routeId} className="cl-lang" />
        </div>
        {origin && (
          <p className="cl-line num">
            {origin.to.name}, {thousands(origin.to.altitude, locale)} m
          </p>
        )}
        <div className="cl-fog" aria-hidden="true" data-close-fog />
        <svg className="cl-name" viewBox="0 0 1440 272" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false" data-close-name>
          <defs>
            <clipPath id="cl-letters">
              <text x="720" y="278" textAnchor="middle" fontSize="366" fontWeight="500" letterSpacing="-17" style={{ fontFamily: 'var(--font)' }}>
                {site.name.toUpperCase()}
              </text>
            </clipPath>
          </defs>
          <g clipPath="url(#cl-letters)">
            <rect className="cl-paper" width="1440" height="272" />
            <svg className="cl-ct" x="0" y="0" width="1440" height="272" viewBox="140 440 800 151" preserveAspectRatio="xMidYMid slice">
              <AfterLoad>
                {(['minor', 'index', 'heavy'] as const).map((p) => (
                  <use key={p} className={`u-${p}`} href={`/ct/nanegal.svg#${p}`} />
                ))}
              </AfterLoad>
            </svg>
          </g>
        </svg>
      </div>
      <div className="cl-cr" id="credito">
        <p className="cr-f">{u.footer}</p>
        {credits.length > 0 && <p className="cr-d">{u.close.disclosure}</p>}
        <p className="cr-t">{u.close.terrain}</p>
        {credits.length > 0 && (
          <>
            <ul className="cr-l" aria-label={u.credits}>
              {credits.map((c) => (
                <li key={c.file}>
                  <span>{c.file}</span> <a href={c.source}>{c.author}</a>, {c.licence.replace(/ \(.*$/, '')}
                </li>
              ))}
            </ul>
            <p className="cr-n">{fill(u.close.adapted, { n: thousands(origin?.from.altitude ?? 0, locale) })}</p>
          </>
        )}
      </div>
    </footer>
  );
}
