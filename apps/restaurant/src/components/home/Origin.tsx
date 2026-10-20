import type { Locale } from '@smb/i18n';
import { ui } from '../../copy';
import { pick, site, thousands } from '../../lib/content';
import { Pic } from '../Pic';

/** Beat 2. Reads site.origin; the home page skips the whole chapter when it is absent. */
export function Origin({ locale }: { locale: Locale }) {
  const o = site.origin;
  if (!o) return null;
  const u = ui[locale].origin;
  const m = locale === 'es' ? 'm' : 'm';
  return (
    <section className="origin field" aria-labelledby="origin-title" data-origin>
      <div className="origin-stage">
        <div className="origin-head">
          <h2 id="origin-title">{u.title}</h2>
          <p>{u.lead}</p>
        </div>
        <p className="origin-num" aria-hidden="true" data-altitude={o.to.altitude} data-from={o.from.altitude}>
          <span data-count>{thousands(o.to.altitude, locale)}</span>
          <small>{m}</small>
        </p>
        <div className="route" aria-hidden="true">
          <svg viewBox="0 0 1200 600" preserveAspectRatio="none" focusable="false">
            <path className="route-line" pathLength={1} d="M 70 540 C 320 540, 250 300, 520 330 S 840 150, 1130 70" />
          </svg>
          <span className="route-dot route-dot-from" />
          <span className="route-dot route-dot-to" />
          <span className="route-label route-from">
            {o.from.name}, {thousands(o.from.altitude, locale)} {m}
          </span>
          <span className="route-label route-to">
            {o.to.name}, {thousands(o.to.altitude, locale)} {m}
          </span>
        </div>
        <figure className="frame frame-4" data-frame>
          <Pic name="cloud-forest" w={3} h={2} alt={u.photos.forest} />
        </figure>
        <figure className="frame frame-1" data-frame>
          <Pic name="coffee-cherries-tall" w={4} h={5} alt={u.photos.cherries} />
        </figure>
        <figure className="frame frame-2" data-frame>
          <Pic name="drying-beds" w={3} h={2} alt={u.photos.drying} />
        </figure>
        <figure className="frame frame-3" data-frame>
          <Pic name="roasting" w={2} h={3} alt={u.photos.roasting} />
        </figure>
      </div>
      <ol className="stairs" aria-label={u.stagesLabel}>
        {o.stages.map((s) => (
          <li key={s.id} data-stage>
            <h3>{pick(s.title, locale)}</h3>
            <p>{pick(s.text, locale)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
