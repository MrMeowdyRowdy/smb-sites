'use client';

import type { Locale } from '@smb/i18n';
import { ui } from '../../copy';
import { useNow } from '../../lib/useNow';
import { type HoursEntry, quitoClock } from '../../lib/today';

type Hours = (HoursEntry & { label: { es: string; en: string } })[];

/** The hours rows, every group listed. The static render lists them all; in the browser the group that covers today in Quito is marked. */
export function VisitHours({ locale, hours }: { locale: Locale; hours: Hours }) {
  const u = ui[locale].visit;
  const now = useNow();
  const day = now ? quitoClock(now).day : null;
  return (
    <>
      {hours.map((h, i) => (
        <p key={h.label.es} className="vr hr" data-row style={{ ['--n' as string]: 3 + i }} aria-current={day && h.days.includes(day) ? 'date' : undefined}>
          <span>{h.label[locale]}</span>
          <span className="num">
            {h.opens} {u.to} {h.closes}
          </span>
        </p>
      ))}
    </>
  );
}
