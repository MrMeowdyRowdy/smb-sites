import { type Locale, formatUsd, pathFor } from '@smb/i18n';
import { ui } from '../../copy';
import { menu, pick } from '../../lib/content';

/** The first two items of the first three categories. */
export function MenuPreview({ locale }: { locale: Locale }) {
  const u = ui[locale].preview;
  return (
    <section aria-labelledby="preview-title">
      <h2 id="preview-title">{u.title}</h2>
      <ul>
        {menu.categories.slice(0, 3).flatMap((c) =>
          menu.items
            .filter((i) => i.category === c.id)
            .slice(0, 2)
            .map((i) => (
              <li key={i.id}>
                <strong>{pick(i.name, locale)}</strong> {formatUsd(i.price, locale)}
                <br />
                {pick(i.description, locale)}
              </li>
            )),
        )}
      </ul>
      <p>
        <a href={pathFor('menu', locale)}>{u.all}</a>
      </p>
    </section>
  );
}
