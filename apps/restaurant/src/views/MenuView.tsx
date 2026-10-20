import type { Locale } from '@smb/i18n';
import { JsonLd } from '../components/JsonLd';
import { MenuBrowser } from '../components/MenuBrowser';
import { Shell } from '../components/Shell';
import { ui } from '../copy';
import { menu, site } from '../lib/content';
import { cafeJsonLd } from '../lib/jsonld';

export function MenuView({ locale }: { locale: Locale }) {
  const u = ui[locale].menuPage;
  return (
    <Shell locale={locale} routeId="menu">
      <JsonLd data={cafeJsonLd(locale)} />
      <h1>{u.h1}</h1>
      <p>{u.intro}</p>
      <MenuBrowser menu={menu} phone={site.whatsapp} locale={locale} />
    </Shell>
  );
}
