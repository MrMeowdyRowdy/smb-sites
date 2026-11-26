import { type Locale, pathFor } from '@smb/i18n';
import { WhatsAppButton } from '@smb/ui';
import { ui } from '../../copy';
import { site, thousands } from '../../lib/content';
import { Ct } from '../brand/Ct';
import { Pic } from '../Pic';
import { CoverIntro } from './cover/CoverIntro';
import { HeroStatus } from './HeroStatus';
import '../../styles/home/cover.css';

/** Beat 1, the cover. Back to front: the La Floresta contour, the fog (raster mask, over the contours), the NEBLINA monument (the h1),
 *  the hollow ring pin and its label, the cup crossing the base of the name, then the words. Nothing readable is hidden until JS;
 *  the contour file loads after the load event (Motion), so it is not one of the requests Lighthouse charges to the LCP. */
export function Hero({ locale }: { locale: Locale }) {
  const u = ui[locale].hero;
  const alt = site.origin?.to.altitude;
  return (
    <section className="chap cv-chap" aria-labelledby="hero-title">
      <div className="cv" data-cover>
        <Ct name="floresta" className="cv-ct" />
        <span className="cv-fog" aria-hidden="true" data-cv-fog />
        <h1 id="hero-title" className="cv-name" data-monument>
          {site.name}
        </h1>
        <span className="cv-fogu" aria-hidden="true" />
        <svg className="ct cv-pins" viewBox="0 0 1168 818" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
          <circle className="pin-ring" cx="578" cy="412" r="9" />
          <text className="pin-label" x="598" y="419">
            <tspan data-count-to={alt}>{alt ? thousands(alt, locale) : ''}</tspan>
            <tspan> m</tspan>
            <tspan className="pl-x"> · {site.address.neighborhood}</tspan>
          </text>
        </svg>
        <div className="cv-cup" aria-hidden="true">
          <Pic name="hero-cup-cut-520" w={766} h={651} alt="" sizes="(max-width: 599px) 26vw, (max-width: 1023px) 16vw, 12vw" priority defer />
          <svg className="steam" viewBox="0 0 100 170" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path pathLength={1} d="M30 170 C 8 138, 52 114, 30 84 S 42 22, 28 0" />
            <path pathLength={1} d="M52 170 C 74 132, 30 104, 54 72 S 44 26, 60 2" />
            <path pathLength={1} d="M74 170 C 54 142, 90 110, 70 80 S 82 34, 68 8" />
          </svg>
        </div>
        <div className="cv-copy">
          <p className="cv-sentence">{u.sentence}</p>
          <HeroStatus locale={locale} hours={site.hours} rituals={site.rituals} />
          <p className="cv-actions">
            <WhatsAppButton className="btn btn-wa" phone={site.whatsapp} text="" locale={locale} label={u.cta} />
            <a className="text-link" href={pathFor('menu', locale)}>
              {u.menu}
            </a>
          </p>
        </div>
        <CoverIntro />
      </div>
    </section>
  );
}
