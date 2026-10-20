import { type Locale, pathFor } from '@smb/i18n';
import { WhatsAppButton } from '@smb/ui';
import { ui } from '../../copy';
import { pick, site } from '../../lib/content';

export function Hero({ locale }: { locale: Locale }) {
  const u = ui[locale];
  return (
    <section className="hero" aria-labelledby="hero-title">
      <h1 id="hero-title">{site.name}</h1>
      <p>{pick(site.tagline, locale)}</p>
      <p>{u.hero.lead}</p>
      <p>
        <a href={pathFor('menu', locale)}>{u.hero.cta}</a> <WhatsAppButton phone={site.whatsapp} text="" locale={locale} />
      </p>
    </section>
  );
}
