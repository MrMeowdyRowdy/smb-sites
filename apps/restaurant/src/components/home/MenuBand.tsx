import { type Locale, formatUsd, pathFor } from '@smb/i18n';
import { ui } from '../../copy';
import { homeRows, menu, pick, site } from '../../lib/content';
import { photoSrc } from '../../lib/photos';
import { Ct } from '../brand/Ct';
import { Seam } from '../brand/Seam';
import { Pic } from '../Pic';
import '../../styles/home/menu-band.css';

const ROWS = 8; // rows on tablet and desktop
const PHONE_ROWS = 6; // rows kept on the phone (the rest are hidden by the chapter's phone composition)
const TONES = ['surface', 'field', 'deep', 'surface'] as const;
const GROW = [5, 2, 3, 2];

/** Beat 3: four unequal panels of the featured dishes standing on their caption bars, then the statement over a table with the ghost name behind it. */
export function MenuBand({ locale }: { locale: Locale }) {
  const u = ui[locale].band;
  const featured = menu.featured.map((id) => menu.items.find((i) => i.id === id)!);
  const rows = homeRows(menu, ROWS);
  return (
    <section className="chap promise" aria-labelledby="promise-title" data-menu-band>
      <Seam from="field" to="paper" name="route" vb="100 300 700 140" />
      <div className="mband" data-band data-watch>
        {featured.map((i, n) => {
          const photo = i.photo ?? i.id;
          const cut = photoSrc(`${photo}-cut-520`);
          const alt = u.alt[i.id] ?? pick(i.name, locale);
          return (
            <figure key={i.id} className="bp" data-tone={TONES[n]} data-panel style={{ ['--g' as string]: GROW[n], ['--n' as string]: n }}>
              <div className="bp-o">
                {cut ? (
                  <Pic name={`${photo}-cut-520`} className="cutout" w={4} h={3} alt={alt} sizes="(max-width: 600px) 60vw, 45vw" />
                ) : (
                  <Pic name={photoSrc(`${photo}-band`) ? `${photo}-band` : photo} className="photo winn" w={3} h={5} alt={alt} sizes="(max-width: 600px) 40vw, (max-width: 1023px) 62vw, 24vw" />
                )}
              </div>
              <figcaption className="bp-b">
                <Ct name="nanegal" vb="300 330 500 200" className="light bp-ct" />
                <span className="bp-n">{pick(i.name, locale)}</span>
                <span className="bp-p num">{formatUsd(i.price, locale)}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
      <div className="mtable cm cmf" data-cv data-watch>
        <div className="ghost" aria-hidden="true">
          {site.name.toUpperCase()}
        </div>
        <h2 id="promise-title" className="mt-h">
          {u.title}
        </h2>
        <ul className="mt-l" aria-label={u.tableLabel}>
          {rows.map(({ item, category }, k) => (
            <li key={item.id} data-row className={k % 2 ? 'odd' : undefined} data-extra={k >= PHONE_ROWS ? '' : undefined} style={{ ['--n' as string]: k }}>
              <span className="mc">{pick(category.name, locale)}</span>
              <span className="mn">{pick(item.name, locale)}</span>
              <span className="mp num">{formatUsd(item.price, locale)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-a" style={{ ['--n' as string]: ROWS - 1 }}>
          <a className="text-link" href={pathFor('menu', locale)}>
            {u.all}
          </a>
        </p>
      </div>
    </section>
  );
}
