import type { Locale } from '@smb/i18n';
import { BrandDefs } from '../components/brand/BrandDefs';
import { Hero } from '../components/home/Hero';
import { MenuBand } from '../components/home/MenuBand';
import { Origin } from '../components/home/Origin';
import { Today } from '../components/home/Today';
import { Visit } from '../components/home/Visit';
import { JsonLd } from '../components/JsonLd';
import { Shell } from '../components/Shell';
import { Pic } from '../components/Pic';
import { alegreya } from '../fonts-map';
import { menu, pick, site } from '../lib/content';
import { cafeJsonLd } from '../lib/jsonld';

const HOY_SIZES = '(max-width: 599px) 100vw, 32vw';
/** The window of Hoy when no seasonal item is active: this dish, named only. */
const HOY_DISH = menu.items.find((i) => i.id === 'quimbolito') ?? menu.items[0];

/** The home, told as a climb: cover (0-1), origin (2), menu (3), Hoy (4), visit (5); the close (6) is the shared footer. */
export function HomeView({ locale }: { locale: Locale }) {
  return (
    <Shell locale={locale} routeId="home">
      <JsonLd data={cafeJsonLd(locale)} />
      <div className={`home ${alegreya.variable}`}>
        <BrandDefs />
        <Hero locale={locale} />
        <Origin locale={locale} />
        <MenuBand locale={locale} />
        <Today
          locale={locale} hours={site.hours} rituals={site.rituals} seasonal={menu.seasonal}
          seasonalArt={menu.seasonal?.map((w) => <Pic key={w.photo} name={w.photo} w={8} h={5} alt={pick(w.name, locale)} sizes={HOY_SIZES} />)}
          dish={{ name: pick(HOY_DISH.name, locale), focus: '50% 55%', art: <Pic name={HOY_DISH.photo ?? HOY_DISH.id} w={4} h={5} alt={pick(HOY_DISH.name, locale)} sizes={HOY_SIZES} /> }}
        />
        <Visit locale={locale} />
      </div>
    </Shell>
  );
}
