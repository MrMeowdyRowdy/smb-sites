import type { Locale } from '@smb/i18n';
import { ui } from '../../copy';

export function Origin({ locale }: { locale: Locale }) {
  const o = ui[locale].origin;
  return (
    <section aria-labelledby="origin-title">
      <h2 id="origin-title">{o.title}</h2>
      {o.body.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </section>
  );
}
