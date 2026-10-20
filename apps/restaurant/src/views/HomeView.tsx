import type { Locale } from '@smb/i18n';
import { Hero } from '../components/home/Hero';
import { MenuBand } from '../components/home/MenuBand';
import { Origin } from '../components/home/Origin';
import { Today } from '../components/home/Today';
import { Visit } from '../components/home/Visit';
import { JsonLd } from '../components/JsonLd';
import { Shell } from '../components/Shell';
import { menu, site } from '../lib/content';
import { cafeJsonLd } from '../lib/jsonld';

export function HomeView({ locale }: { locale: Locale }) {
  return (
    <Shell locale={locale} routeId="home">
      <JsonLd data={cafeJsonLd(locale)} />
      <Hero locale={locale} />
      <Origin locale={locale} />
      <MenuBand locale={locale} />
      <Today locale={locale} hours={site.hours} rituals={site.rituals} seasonal={menu.seasonal} />
      <Visit locale={locale} />
    </Shell>
  );
}
