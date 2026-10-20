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
          <Pic name="pour-over-wide" w={4} h={3} alt={u.pour} priority />
        </figure>
      </div>
      <MenuBrowser
        menu={menu}
        phone={site.whatsapp}
        locale={locale}
        art={{
          cafe: <Pic name="hero-cup-cut-520" w={766} h={651} alt="" sizes="14vw" />,
          desayunos: <Pic name="humitas-cut-520" w={896} h={689} alt="" sizes="20vw" />,
          panaderia: <Pic name="pan-de-yuca-cut-520" w={1200} h={651} alt="" sizes="24vw" />,
          almuerzo: <Pic name="empanada-de-viento-cut-520" w={1200} h={1277} alt="" sizes="18vw" />,
        }}
      />
    </Shell>
  );
}
