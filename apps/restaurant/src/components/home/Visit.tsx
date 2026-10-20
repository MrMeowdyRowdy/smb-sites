import { type Locale, t } from '@smb/i18n';
import { waLink } from '@smb/ui/whatsapp';
import { ui } from '../../copy';
import { pick, site } from '../../lib/content';
import { VisitHours } from './VisitHours';
import { VisitMap } from './VisitMap';

const phoneText = (d: string) => `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8)}`;

/** Beat 5: the address as display rows, the one greeting with the round arrow, and the plan. */
export function Visit({ locale }: { locale: Locale }) {
  const u = ui[locale].visit;
  const a = site.address;
  const wa = t(locale).whatsapp;
  const osm = `https://www.openstreetmap.org/?mlat=${site.geo.latitude}&mlon=${site.geo.longitude}#map=17/${site.geo.latitude}/${site.geo.longitude}`;
  return (
    <section id="visita" className="visit field" aria-labelledby="visit-title" data-visit>
      <h2 id="visit-title" className="visually-hidden">
        {u.title}
      </h2>
      <div className="visit-grid">
        <address className="rows-display">
          <p data-row>{site.name}</p>
          <p data-row>
            <a href={osm} target="_blank" rel="noopener noreferrer">
              {a.street}
            </a>
          </p>
          <p data-row>
            {a.neighborhood}, {a.city}
          </p>
          <p data-row>
            <VisitHours locale={locale} hours={site.hours} />
          </p>
          <p data-row>
            <a href={waLink(site.whatsapp, '')} target="_blank" rel="noopener noreferrer">
              <span className="num">{phoneText(site.whatsapp.replace(/\D/g, ''))}</span>
              <span className="visually-hidden"> ({wa.opensIn})</span>
            </a>
          </p>
          <p data-row className="greeting">
            <span>{u.write}</span>
            <a className="arrow-btn" href={waLink(site.whatsapp, '')} target="_blank" rel="noopener noreferrer" data-testid="write-link">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
              </svg>
              <span className="visually-hidden">
                {wa.cta} ({wa.opensIn})
              </span>
            </a>
          </p>
        </address>
        <VisitMap locale={locale} />
      </div>
      <ul className="hours-all">
        {site.hours.map((h) => (
          <li key={h.label.es}>
            {pick(h.label, locale)}: <span className="num">{h.opens} - {h.closes}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
