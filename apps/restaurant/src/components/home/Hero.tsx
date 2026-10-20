import { type Locale, pathFor } from '@smb/i18n';
import { WhatsAppButton } from '@smb/ui';
import { ui } from '../../copy';
import { site } from '../../lib/content';
import { Fog } from '../Fog';
import { Pic } from '../Pic';
import { HeroStatus } from './HeroStatus';

/** Beat 1. Layers, back to front: cloud photo, the name, fog sheets, the cup, steam, then the words. */
export function Hero({ locale }: { locale: Locale }) {
  const u = ui[locale].hero;
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-sky" aria-hidden="true" data-sky>
        <Pic name="cloud-forest-sky" w={3} h={2} alt="" priority defer />
      </div>
      <div className="hero-copy">
        <p className="hero-sentence">{u.sentence}</p>
        <HeroStatus locale={locale} hours={site.hours} rituals={site.rituals} />
        <p className="hero-actions">
          <WhatsAppButton className="btn btn-wa" phone={site.whatsapp} text="" locale={locale} label={u.cta} />
          <a className="text-link" href={pathFor('menu', locale)}>
            {u.menu}
          </a>
        </p>
      </div>
      <h1 id="hero-title" className="monument" data-monument>
        {site.name}
      </h1>
      <Fog />
      <div className="hero-cup">
        <Pic name="hero-cup-cut-520" w={766} h={651} alt="" sizes="(max-width: 760px) 30vw, 13vw" priority defer />
        <svg className="steam" viewBox="0 0 100 170" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path pathLength={1} d="M30 170 C 8 138, 52 114, 30 84 S 42 22, 28 0" />
          <path pathLength={1} d="M52 170 C 74 132, 30 104, 54 72 S 44 26, 60 2" />
          <path pathLength={1} d="M74 170 C 54 142, 90 110, 70 80 S 82 34, 68 8" />
        </svg>
      </div>
    </section>
  );
}
