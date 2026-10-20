'use client';

import type { Locale } from '@smb/i18n';
import { ui } from '../../copy';
import { useNow } from '../../lib/useNow';
import { type HoursEntry, quitoClock } from '../../lib/today';

type Hours = (HoursEntry & { label: { es: string; en: string } })[];

/** One display row: the server prints the first hours group; the browser says what applies today in Quito. */
export function VisitHours({ locale, hours }: { locale: Locale; hours: Hours }) {
  const u = ui[locale].visit;
  const now = useNow();
  const h = now && hours.find((x) => x.days.includes(quitoClock(now).day));
  const text = !now ? `${hours[0].label[locale]} ${hours[0].opens} - ${hours[0].closes}` : h ? `${u.today} ${h.opens} - ${h.closes}` : u.closedToday;
  return <span className="num">{text}</span>;
}
