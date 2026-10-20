import { type Locale, pathFor } from '@smb/i18n';
import { WhatsAppButton } from '@smb/ui';
import { ui } from '../../copy';
import { site } from '../../lib/content';
import { Fog } from '../Fog';
import { Pic } from '../Pic';

export function Hero({ locale }: { locale: Locale }) {
  const u = ui[locale].hero;
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="hero-sentence">{u.sentence}</p>
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
        <Pic name="hero-cup-cut-1200" w={766} h={651} alt="" priority />
        <span className="steam" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
        <filter id="steam-warp" x="-30%" y="-10%" width="160%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="46" />
        </filter>
      </svg>
    </section>
  );
}
