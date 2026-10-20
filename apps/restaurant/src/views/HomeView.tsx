import type { Locale } from '@smb/i18n';
import { Contact } from '../components/home/Contact';
import { Hero } from '../components/home/Hero';
import { MenuPreview } from '../components/home/MenuPreview';
import { Origin } from '../components/home/Origin';
import { Visit } from '../components/home/Visit';
import { JsonLd } from '../components/JsonLd';
import { Shell } from '../components/Shell';
import { cafeJsonLd } from '../lib/jsonld';

export function HomeView({ locale }: { locale: Locale }) {
  return (
    <Shell locale={locale} routeId="home">
      <JsonLd data={cafeJsonLd(locale)} />
      <Hero locale={locale} />
      <Origin locale={locale} />
      <MenuPreview locale={locale} />
      <Visit locale={locale} />
      <Contact locale={locale} />
    </Shell>
  );
}
