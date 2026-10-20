import type { Locale } from '@smb/i18n';
import { JsonLd } from '../components/JsonLd';
import { MenuBrowser } from '../components/MenuBrowser';
import { Pic } from '../components/Pic';
import { Shell } from '../components/Shell';
import { ui } from '../copy';
import { menu, site } from '../lib/content';
import { cafeJsonLd } from '../lib/jsonld';

export function MenuView({ locale }: { locale: Locale }) {
  const u = ui[locale].menuPage;
  return (
    <Shell locale={locale} routeId="menu">
      <JsonLd data={cafeJsonLd(locale)} />
      <div className="menu-head">
        <h1>{u.h1}</h1>
        <p>{u.intro}</p>
        <figure className="menu-hero-photo">
          <Pic name="pour-over" w={3} h={2} alt={u.pour} sizes="(max-width: 760px) 90vw, 40vw" />
        </figure>
      </div>
      <MenuBrowser
        menu={menu}
        phone={site.whatsapp}
        locale={locale}
        photos={
          <>
            <figure>
              <Pic name="coffee-cherries-tall" w={4} h={5} alt={ui[locale].origin.photos.cherries} sizes="28vw" />
            </figure>
            <figure>
              <Pic name="roasting" w={2} h={3} alt={ui[locale].origin.photos.roasting} sizes="22vw" />
            </figure>
            <figure>
              <Pic name="drying-beds" w={3} h={2} alt={ui[locale].origin.photos.drying} sizes="28vw" />
            </figure>
          </>
        }
      />
    </Shell>
  );
}
