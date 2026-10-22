import type { Locale } from '@smb/i18n';
import { t } from '@smb/i18n';
import { waLink } from '@smb/ui/whatsapp';
import { ui } from '../../copy';
import { site } from '../../lib/content';
import { Seam } from '../brand/Seam';
import { VisitHours } from './VisitHours';
import { VisitMap } from './VisitMap';
import '../../styles/home/visit.css';

/** Beat 5: the address as display rows on alternating teal, the plan of La Floresta beside them, the one greeting with the round arrow. */
export function Visit({ locale }: { locale: Locale }) {
  const u = ui[locale].visit;
  const a = site.address;
  const wa = t(locale).whatsapp;
  const osm = `https://www.openstreetmap.org/?mlat=${site.geo.latitude}&mlon=${site.geo.longitude}#map=17/${site.geo.latitude}/${site.geo.longitude}`;
  return (
    <section id="visita" className="chap visit field" aria-labelledby="visit-title" data-visit data-cv>
      <Seam from="surface" to="field" name="floresta" vb="400 200 700 150" />
      <h2 id="visit-title" className="visually-hidden">
        {u.title}
      </h2>
      <div className="vi" data-watch>
        <address className="vi-rows">
          <p className="vr" data-row style={{ ['--n' as string]: 0 }}>
            {site.name}
          </p>
          <p className="vr" data-row style={{ ['--n' as string]: 1 }}>
            <a href={osm} target="_blank" rel="noopener noreferrer">
              {a.street.split(/(\S+-\S+)/).map((part, i) => (i % 2 ? <span key={i} className="nb">{part}</span> : part))}
            </a>
          </p>
          <p className="vr" data-row style={{ ['--n' as string]: 2 }}>
            {a.neighborhood}, {a.city}
          </p>
          <VisitHours locale={locale} hours={site.hours} />
          <p className="vr wa-r" data-row style={{ ['--n' as string]: 6 }}>
            <span>{u.write}</span>
            <a className="arrow-btn" href={waLink(site.whatsapp, '')} target="_blank" rel="noopener noreferrer" data-testid="write-link">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M7 17L17 7M8.5 7H17v8.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
              </svg>
              <span className="visually-hidden">
                {wa.cta} ({wa.opensIn})
              </span>
            </a>
          </p>
        </address>
        <VisitMap locale={locale} />
      </div>
    </section>
  );
}
