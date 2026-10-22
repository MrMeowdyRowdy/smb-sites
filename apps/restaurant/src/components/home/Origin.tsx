import type { Locale } from '@smb/i18n';
import { ui } from '../../copy';
import { site, thousands } from '../../lib/content';
import { numeralBase } from '../brand/BrandDefs';
import { CtBg } from '../brand/Ct';
import { Pic } from '../Pic';
import { Edge } from './origin/Edge';
import { RouteMap } from './origin/RouteMap';
import '../../styles/home/origin.css';

/** Beat 2. Reads site.origin; the home page skips the whole chapter when it is absent. The chapter opens on the tree-line edge (the cloud-forest photo rising behind the crown line), then the stage: heading, dot line, the altitude numeral, the route map, four windows. */
const WINDOWS = [
  { key: 'cherries', photo: 'coffee-cherries', w: 4, h: 3, op: '40% 45%' },
  { key: 'drying', photo: 'drying-beds', w: 3, h: 2, op: '72% 62%' },
  { key: 'roasting', photo: 'roasting', w: 2, h: 3, op: '50% 52%' },
  { key: 'pour', photo: 'pour-over', w: 2, h: 3, op: '50% 100%' }, // the brewer and the cup end; the menu band shows the kettle (pour-over-band)
] as const;

export function Origin({ locale }: { locale: Locale }) {
  const o = site.origin;
  if (!o) return null;
  const u = ui[locale].origin;
  const alt = (n: number) => thousands(n, locale);
  return (
    <section className="chap origin-ch field" aria-labelledby="origin-title" data-origin>
      <div className="fo" data-edge data-watch>
        <div className="fo-top" aria-hidden="true">
          <CtBg name="floresta" vb="640 90 520 200" color="var(--field-ink)" om={0.06} oi={0.1} oh={0.18} />
        </div>
        <div className="fo-photo" aria-hidden="true">
          <div className="fo-v w"><Edge id="w" box={[0, 470, 2400, 1030]} /></div>
          <div className="fo-v t"><Edge id="t" box={[1130, 470, 1270, 1060]} /></div>
          <div className="fo-v p"><Edge id="p" box={[1790, 470, 610, 940]} /></div>
        </div>
        <div className="fo-fog" aria-hidden="true" />
        <p className="fo-lab">{u.forest.replace('{name}', o.from.name)}</p>
      </div>
      <div className="origin" data-pin>
        <CtBg name="nanegal" vb="120 120 700 560" color="var(--field-ink)" om={0.08} oi={0.15} oh={0.26} wm={1} wi={1.6} wh={3} className="or-bg" draw />
        <h2 id="origin-title" className="or-h">{u.title}</h2>
        <p className="or-dot">{u.dot.replace('{alt}', alt(o.from.altitude))}</p>
        <div className="or-wins">
          {WINDOWS.map((w, i) => (
            <figure key={w.key} className={`ow o${i + 1}`} data-win>
              <div className="owi winn" style={{ ['--op' as string]: w.op }}>
                <Pic name={w.photo} w={w.w} h={w.h} alt={w.key === 'pour' ? u.captions.pourAlt : u.photos[w.key]} sizes="(max-width: 1023px) 40vw, 12vw" />
              </div>
              <figcaption className="owc">{u.captions[w.key]}</figcaption>
            </figure>
          ))}
        </div>
        <div className="or-num" aria-hidden="true">
          <span className="n num" data-count data-count-from={o.from.altitude} data-count-to={o.to.altitude}>{alt(o.to.altitude)}</span>
          <span className="u">m</span>
          <svg className="base" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false"><path d={numeralBase} vectorEffect="non-scaling-stroke" /></svg>
        </div>
        <div className="or-map"><RouteMap locale={locale} /></div>
      </div>
    </section>
  );
}
