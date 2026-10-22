import type { Locale } from '@smb/i18n';
import { ui } from '../../../copy';
import { pick, site, thousands } from '../../../lib/content';

/** The route sheet (brand book origin map): route terrain in three weights, the dashed route drawn on it through a mask, the finca pin (the chapter's one cherry dot), the ring at La Floresta, the label plates. */
const ROUTE = 'M176 175C300 400 560 330 520 620S690 960 744 1151';
const SEG1: number[][] = [[176, 175], [300, 400], [560, 330], [520, 620]];
const SEG2: number[][] = [[520, 620], [480, 910], [690, 960], [744, 1151]];
const bz = (p: number[][], t: number) => [0, 1].map((k) => Math.round((1 - t) ** 3 * p[0][k] + 3 * (1 - t) ** 2 * t * p[1][k] + 3 * (1 - t) * t ** 2 * p[2][k] + t ** 3 * p[3][k]));
const ST1 = bz(SEG1, 0.62);
const ST2 = bz(SEG2, 0.25);
/** plate width for a label in the map voice at 29 units (about 13.4 per character) */
const plate = (s: string) => Math.round(s.length * 13.4 + 26);

export function RouteMap({ locale }: { locale: Locale }) {
  const o = site.origin!;
  const u = ui[locale].origin;
  const fill = (t: string, name: string, alt: number) => t.replace('{name}', name).replace('{alt}', thousands(alt, locale));
  const farm = fill(u.farm, o.from.name, o.from.altitude);
  const peak = fill(u.peak, o.to.name, o.to.altitude);
  const s1 = pick(o.stages[1].title, locale), s2 = pick(o.stages[2].title, locale);
  const stations: [number[], string][] = [[ST1, s1], [ST2, s2]];
  return (
    <svg className="rt" viewBox="0 0 906 1284" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <g className="rt-ct">
        {(['minor', 'index', 'heavy'] as const).map((p, i) => (
          <use key={p} className={`u-${p}`} data-href={`/ct/route.svg#${p}`} style={{ ['--d' as string]: `${i * 60}ms` }} />
        ))}
      </g>
      <mask id="rtm" maskUnits="userSpaceOnUse" x="0" y="0" width="906" height="1284"><path className="rt-m" d={ROUTE} pathLength={1} fill="none" strokeWidth="24" /></mask>
      <path className="rt-l" d={ROUTE} fill="none" strokeWidth="5" strokeDasharray="14 12" mask="url(#rtm)" />
      <circle className="pin-bed" cx="176" cy="175" r="17" /><circle className="pin rt-start" cx="176" cy="175" r="11" />
      <circle className="rt-ring" cx="744" cy="1151" r="13" />
      {stations.map(([[x, y], t]) => (
        <g key={t}>
          <circle className="rt-st" cx={x} cy={y} r="8" />
          <rect className="rt-p" x={x + 16} y={y - 22} width={plate(t)} height="40" />
          <text className="rt-t" x={x + 26} y={y + 6}>{t}</text>
        </g>
      ))}
      <rect className="rt-p" x="198" y="140" width={plate(farm)} height="44" /><text className="rt-t" x="210" y="170">{farm}</text>
      <rect className="rt-p" x={732 - plate(peak)} y="1086" width={plate(peak)} height="44" /><text className="rt-t end" x="718" y="1116">{peak}</text>
    </svg>
  );
}
