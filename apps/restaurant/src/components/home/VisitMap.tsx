import type { Locale } from '@smb/i18n';
import { ui } from '../../copy';
import { site } from '../../lib/content';
import { Ct } from '../brand/Ct';

/* Illustrative streets drawn by hand over the real La Floresta contour crop (floresta 170 120 820 590). Each street is ONE subpath
   (pathLength 1) so it draws on from its start; the names are set along the streets, not on plates. */
const STREETS = [
  { id: 'toledo', d: 'M190 505L420 462L583 408L800 330L985 262', name: 'Calle Toledo', at: '55%' },
  { id: 'galavis', d: 'M468 130L520 300L583 408L640 560L690 700', name: 'Galavis', at: '9%' },
  { id: 'calle3', d: 'M330 150L395 330L430 470L470 620' },
  { id: 'doce', d: 'M200 340L420 300L640 270L900 210', name: 'Av. 12 de Octubre', at: '36%' },
  { id: 'isabel', d: 'M300 640L520 590L760 520L980 470', name: 'Isabel la Católica', at: '34%' },
];
const PIN = [583, 408];

/** The plan of La Floresta. No tiles, no third-party script; the whole plan links out to OpenStreetMap. */
export function VisitMap({ locale }: { locale: Locale }) {
  const u = ui[locale].visit;
  const { latitude: lat, longitude: lng } = site.geo;
  const osm = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;
  return (
    <div className="vi-map">
      <a href={osm} target="_blank" rel="noopener noreferrer" aria-label={u.mapLabel} className="map-link">
        <Ct name="floresta" vb="170 120 820 590" className="light vi-ct" draw />
        <svg className="streets" viewBox="170 120 820 590" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
          {STREETS.map((s, k) => (
            <path key={s.id} id={`st-${s.id}`} className="s" style={{ ['--k' as string]: k }} pathLength={1} d={s.d} />
          ))}
          {/* each name twice: a halo in the ground colour under, the letters over (a halo, not a plate) */}
          {STREETS.filter((s) => s.name).flatMap((s) =>
            ['st-h', 'st-l'].map((c) => (
              <text key={`${s.id}-${c}`} className={c} dy="-9" aria-hidden="true">
                <textPath href={`#st-${s.id}`} startOffset={s.at}>
                  {s.name}
                </textPath>
              </text>
            )),
          )}
          <circle className="pin-ring-v" cx={PIN[0]} cy={PIN[1]} r="14" />
        </svg>
      </a>
      <div className="vi-note">
        <p className="cap">{u.mapNote}</p>
        <p className="vi-links">
          <a className="text-link" href={osm} target="_blank" rel="noopener noreferrer">
            {u.mapOpen}
          </a>
          <a className="text-link" href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} target="_blank" rel="noopener noreferrer">
            {u.google}
          </a>
        </p>
      </div>
    </div>
  );
}
