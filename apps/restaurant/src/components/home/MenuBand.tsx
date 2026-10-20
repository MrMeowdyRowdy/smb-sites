import { type Locale, formatUsd, pathFor } from '@smb/i18n';
import { ui } from '../../copy';
import { homeRows, menu, pick } from '../../lib/content';
import { photoSrc } from '../../lib/photos';
import { Pic } from '../Pic';

/** Beat 3: a band of the featured dishes, then the statement and a table of up to 12 rows. */
export function MenuBand({ locale }: { locale: Locale }) {
  const u = ui[locale].band;
  const featured = menu.featured.map((id) => menu.items.find((i) => i.id === id)!);
  const grow = [5, 2, 3, 2];
  const cutWidth = ['112%', '150%', '120%', '100%'];
  const rows = homeRows(menu);
  return (
    <section className="promise" aria-labelledby="promise-title">
      <div className="band" data-band>
        {featured.map((i, n) => {
          const photo = i.photo ?? i.id;
          const cut = photoSrc(`${photo}-cut-1200`);
          return (
            <figure key={i.id} className="panel" data-tone={cut ? ['surface', 'teal', 'paper'][n % 3] : 'photo'} style={{ ['--g' as string]: grow[n], ['--cw' as string]: cutWidth[n] }} data-panel>
              {cut ? (
                <Pic name={`${photo}-cut-1200`} className="cut" w={4} h={3} alt={u.alt[i.id] ?? pick(i.name, locale)} sizes="(max-width: 760px) 80vw, 45vw" />
              ) : (
                <div className="panel-photo">
                  <Pic name={photo} w={3} h={5} alt={u.alt[i.id] ?? pick(i.name, locale)} sizes="(max-width: 760px) 64vw, 40vw" />
                </div>
              )}
              <figcaption>
                <span>{pick(i.name, locale)}</span>
                <span className="num">{formatUsd(i.price, locale)}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
      <div className="list">
        <h2 id="promise-title">{u.title}</h2>
        <figure className="list-photo">
          <Pic name="mindo-hills-tall" w={4} h={5} alt={u.photo} sizes="(max-width: 760px) 60vw, 22vw" />
        </figure>
        <p className="list-label">{u.tableLabel}</p>
        <ul className="rows">
          {rows.map(({ item, category }) => (
            <li key={item.id} data-row>
              <span className="row-cat">{pick(category.name, locale)}</span>
              <span className="row-name">
                {pick(item.name, locale)}
                <small>{pick(item.description, locale)}</small>
              </span>
              <span className="row-price num">{formatUsd(item.price, locale)}</span>
            </li>
          ))}
        </ul>
        <p className="list-all">
          <a className="text-link" href={pathFor('menu', locale)}>
            {u.all}
          </a>
        </p>
      </div>
    </section>
  );
}
