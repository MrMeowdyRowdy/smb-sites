import type { Locale } from '@smb/i18n';
import { ui } from '../../copy';
import { site } from '../../lib/content';

/** A stylised, approximate plan of La Floresta drawn in code. No tiles, no third-party image; it links out to OpenStreetMap. */
export function VisitMap({ locale }: { locale: Locale }) {
  const u = ui[locale].visit;
  const { latitude: lat, longitude: lng } = site.geo;
  const osm = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;
  return (
    <div className="map">
      <a href={osm} target="_blank" rel="noopener noreferrer" aria-label={u.mapLabel} className="map-link">
        <svg viewBox="0 0 600 520" preserveAspectRatio="xMidYMid slice" role="presentation" focusable="false">
          <rect width="600" height="520" className="map-ground" />
          {/* blocks of the grid, turned about 20 degrees like the real streets */}
          <g transform="rotate(-20 300 260)" className="map-streets">
            {[60, 150, 240, 330, 420].map((y) => (
              <rect key={y} x="-80" y={y} width="760" height="14" />
            ))}
            {[40, 130, 220, 310, 400, 490].map((x) => (
              <rect key={x} x={x} y="-60" width="14" height="640" />
            ))}
            <rect x="-80" y="236" width="760" height="26" className="map-main" />
            <rect x="180" y="-60" width="26" height="640" className="map-main" />
          </g>
          <path className="map-park" d="M70 360 l84 -22 l36 62 l-70 46 z" />
          <text x="40" y="70" className="map-text">Av. 12 de Octubre</text>
          <text x="338" y="486" className="map-text">Isabel la Católica</text>
          <text x="392" y="140" className="map-text">Galavis</text>
          <text x="70" y="292" className="map-text">Toledo</text>
          <g transform="translate(300 252)">
            <circle r="34" className="map-pulse" />
            <circle r="15" className="map-pin" />
          </g>
        </svg>
      </a>
      <p className="map-note">
        {u.mapNote}{' '}
        <a className="text-link" href={osm} target="_blank" rel="noopener noreferrer">
          {u.mapOpen}
        </a>{' '}
        <a className="text-link" href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} target="_blank" rel="noopener noreferrer">
          {u.google}
        </a>
      </p>
    </div>
  );
}
