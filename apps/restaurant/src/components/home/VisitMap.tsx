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
        <svg viewBox="0 0 420 760" preserveAspectRatio="xMidYMid slice" role="presentation" focusable="false">
          <rect width="420" height="760" className="map-ground" />
          {/* blocks of the grid, turned about 20 degrees like the real streets */}
          <g transform="rotate(-20 210 380)" className="map-streets">
            {[-60, 40, 140, 240, 340, 440, 540, 640, 740, 840].map((y) => (
              <rect key={y} x="-300" y={y} width="1020" height="14" />
            ))}
            {[-100, -10, 80, 170, 260, 350, 440, 530].map((x) => (
              <rect key={x} x={x} y="-200" width="14" height="1160" />
            ))}
            <rect x="-300" y="373" width="1020" height="26" className="map-main" />
            <rect x="163" y="-200" width="26" height="1160" className="map-main" />
          </g>
          <path className="map-park" d="M40 520 l92 -26 l40 70 l-78 52 z" />
          <text x="26" y="170" className="map-text">Av. 12 de Octubre</text>
          <text x="214" y="640" className="map-text">Isabel la Católica</text>
          <text x="250" y="262" className="map-text">Galavis</text>
          <text x="44" y="420" className="map-text">Toledo</text>
          <g transform="translate(210 380)">
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
