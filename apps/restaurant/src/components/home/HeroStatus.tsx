'use client';

import type { Locale } from '@smb/i18n';
import { ui } from '../../copy';
import { openStatus } from '../../lib/today';
import type { HoursEntry, Ritual } from '../../lib/today';
import { useNow } from '../../lib/useNow';

type Props = { locale: Locale; hours: (HoursEntry & { label: { es: string; en: string } })[]; rituals: Ritual[] };

/** Static at build (true on every day): the café opens every day, else all hour groups. In the browser: open now, or when it opens next, in Quito time. */
export function HeroStatus({ locale, hours, rituals }: Props) {
  const u = ui[locale];
  const now = useNow();
  const fill = (s: string, v: Record<string, string>) => s.replace(/\{(\w+)\}/g, (_, k) => v[k]);
  let text =
    new Set(hours.flatMap((h) => h.days)).size === 7
      ? u.hero.every
      : hours.map((h) => `${h.label[locale]} ${h.opens} - ${h.closes}`).join(' · ');
  if (now) {
    const st = openStatus(now, { hours, rituals });
    text =
      st.kind === 'open'
        ? fill(u.hero.open, { t: st.until })
        : st.kind === 'before'
          ? fill(u.hero.before, { t: st.opens })
          : !st.next
            ? u.today.closed
            : st.next.daysAhead === 1
              ? fill(u.hero.tomorrow, { t: st.next.opens })
              : fill(u.hero.on, { d: u.today.days[st.next.day], t: st.next.opens });
  }
  return (
    <p className="cv-status" aria-live="polite" data-status>
      {text}
    </p>
  );
}
