import type { Locale } from '@smb/i18n';
import { ui } from '../../copy';
import { pick, site } from '../../lib/content';

export function Visit({ locale }: { locale: Locale }) {
  const u = ui[locale].visit;
  const { latitude: lat, longitude: lng } = site.geo;
  const a = site.address;
  return (
    <section aria-labelledby="visit-title">
      <h2 id="visit-title">{u.title}</h2>
      <h3>{u.address}</h3>
      <address>
        {a.street}, {a.neighborhood}, {a.city}
      </address>
      <h3>{u.hours}</h3>
      <ul>
        {site.hours.map((h) => (
          <li key={h.label.es}>
            {pick(h.label, locale)}: {h.opens} - {h.closes}
          </li>
        ))}
      </ul>
      <h3>{u.map}</h3>
      <p>{u.mapNote}</p>
      <ul>
        <li>
          <a href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} target="_blank" rel="noopener noreferrer">
            {u.google}
          </a>
        </li>
        <li>
          <a href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`} target="_blank" rel="noopener noreferrer">
            {u.osm}
          </a>
        </li>
      </ul>
    </section>
  );
}
