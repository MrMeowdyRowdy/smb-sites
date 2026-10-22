'use client';

import type { Locale } from '@smb/i18n';
import { type ReactNode, useSyncExternalStore } from 'react';
import { ui } from '../../copy';
import { type Band, type Clock, type HoursEntry, type Ritual, activeSeasonal, bandFor, clockOverride, quitoClock, quitoMonthDay, statusFor } from '../../lib/today';
import { useNow } from '../../lib/useNow';
import '../../styles/home/hoy.css';
import { CtBg } from '../brand/Ct';
import { Seam } from '../brand/Seam';
import { HoursBand } from './hoy/HoursBand';

type L10n = { es: string; en: string };
type Seasonal = { from: string; to: string; name: L10n; note: L10n; photo: string; focus?: string };
type Props = {
  locale: Locale;
  hours: (HoursEntry & { label: L10n })[];
  rituals: Ritual[];
  seasonal?: Seasonal[];
  /** one rendered photo per seasonal window, in the same order (the server owns the image files) */
  seasonalArt?: ReactNode[];
  /** the window when no seasonal item is active: a dish, captioned with its name only */
  dish: { name: string; art: ReactNode; focus?: string };
};

const noSubscribe = () => () => {};
const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k]));
const cap1 = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Beat 4, "Hoy en Neblina". The static render (and no JS) shows the first hours group truthfully: its opening time on the monument,
 * its day list, no "now". In the browser the clock is Quito time (or ?t=HH:MM&d=Weekday), and everything speaks about the right day.
 */
export function Today({ locale, hours, rituals, seasonal, seasonalArt, dish }: Props) {
  const u = ui[locale].today;
  const site = { hours, rituals };
  const now = useNow();
  // null in the static HTML and during hydration, then the URL's query (for ?t= / ?d= / ?md= overrides)
  const search = useSyncExternalStore(noSubscribe, () => window.location.search, () => null);

  const live = now !== null && search !== null;
  const clock: Clock | null = live ? clockOverride(quitoClock(now), search) : null;
  const first = hours[0];
  // Static: the first group's first day at minute 0 reads as "before opening", every station in the next tone, no marker.
  const band: Band | null = bandFor(clock ?? { day: first.days[0] as Clock['day'], minutes: 0 }, site);
  const status = clock ? statusFor(clock, site) : null;

  let text: string;
  if (!live || !band) text = fill(u.statusStatic, { d: first.label[locale], t: first.opens });
  else if (status?.kind === 'open') text = status.label ? fill(u.statusOpen, { label: status.label[locale], t: status.next ?? '' }) : fill(u.statusOpenBare, { t: status.next ?? '' });
  else if (status?.kind === 'closed') text = status.daysAhead === 0 ? fill(u.statusToday, { t: status.opens }) : status.daysAhead === 1 ? fill(u.statusTomorrow, { d: u.days[status.day], t: status.opens }) : fill(u.statusOn, { d: u.days[status.day], t: status.opens });
  else text = fill(u.statusStatic, { d: first.label[locale], t: first.opens });

  let dayLabel = first.label[locale];
  if (live && band && band.state !== 'open') dayLabel = band.daysAhead === 0 ? fill(u.dayToday, { d: u.days[band.day] }) : band.daysAhead === 1 ? fill(u.dayTomorrow, { d: u.days[band.day] }) : cap1(u.days[band.day]);
  if (live && band?.state === 'open') dayLabel = '';

  const md = (search && /^\?.*\bmd=(\d\d-\d\d)\b/.exec(search)?.[1]) || (now ? quitoMonthDay(now) : '');
  const season = live ? activeSeasonal(seasonal, md) : null;
  const seasonIdx = season && seasonal ? seasonal.indexOf(season) : -1;
  const art = season && seasonalArt?.[seasonIdx] ? { key: `s${seasonIdx}`, kind: 'season', node: seasonalArt[seasonIdx], caption: `${season.name[locale]}. ${season.note[locale]}`, focus: season.focus } : { key: 'dish', kind: 'dish', node: dish.art, caption: dish.name, focus: dish.focus };

  return (
    <section id="hoy" className="chap hoy" aria-labelledby="today-title" data-today data-state={band?.state ?? 'before'} data-cv>
      <CtBg name="nanegal" om={0.08} oi={0.11} oh={0.16} wm={0.8} wi={1.3} wh={2.2} className="hy-field" />
      <Seam from="paper" to="surface" name="nanegal" vb="120 200 800 160" />
      <div className="hy-in">
        <h2 id="today-title" className="hy-h rv">{u.title}</h2>
        <div className="hy-focus rv" data-focus>
          <p className="hy-clock num" data-clock>{band?.clock ?? first.opens}</p>
          <p className="hy-status" data-status aria-live="polite">{text}</p>
        </div>
        <figure className="hy-fig rv" data-kind={art.kind}>
          <div className="hy-ph win" key={art.key} style={{ ['--pos' as string]: art.focus ?? '50% 50%' }}>{art.node}</div>
          <figcaption className="cap">{art.caption}</figcaption>
        </figure>
        <ul className="hy-hours rv" aria-label={u.hoursLabel}>
          {hours.map((h) => {
            const today = !!clock && h.days.includes(clock.day);
            return (
              <li key={h.days.join()} className={`hh${today ? ' today' : ''}`} aria-current={today ? 'date' : undefined}>
                <span>{h.label[locale]}</span>
                <span className="num">{h.opens} {ui[locale].visit.to} {h.closes}</span>
              </li>
            );
          })}
        </ul>
        {band && <HoursBand band={band} locale={locale} dayLabel={dayLabel} live={live} />}
      </div>
    </section>
  );
}
