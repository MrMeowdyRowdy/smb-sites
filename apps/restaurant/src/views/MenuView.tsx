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
  const [lead, ...rest] = u.intro.split(/(?<=\.)\s+/);
  const note = rest.join(' ');
  return (
    <Shell locale={locale} routeId="menu">
      <JsonLd data={cafeJsonLd(locale)} />
      <div className="menu-head">
        <p className="menu-lead">{lead}</p>
        <div className="menu-name">
          <h1>{u.h1}</h1>
          <div className="menu-cup" aria-hidden="true">
            <Pic name="hero-cup-cut-520" w={766} h={651} alt="" sizes="(max-width: 760px) 34vw, 22vw" priority />
          </div>
        </div>
        <p className="menu-note">{note}</p>
      </div>
      <MenuBrowser
        menu={menu}
        phone={site.whatsapp}
        locale={locale}
        art={{
          cafe: <Pic name="hero-cup-cut-520" w={766} h={651} alt="" sizes="(min-width: 1000px) 34vw, 1px" />,
          desayunos: <Pic name="humitas-cut-520" w={896} h={689} alt="" sizes="(min-width: 1000px) 34vw, 1px" />,
          panaderia: <Pic name="pan-de-yuca-cut-520" w={1200} h={651} alt="" sizes="(min-width: 1000px) 34vw, 1px" />,
          almuerzo: <Pic name="empanada-de-viento-cut-520" w={1200} h={1277} alt="" sizes="(min-width: 1000px) 34vw, 1px" />,
        }}
      />
    </Shell>
  );
}
