'use client';

import type { Locale } from '@smb/i18n';
import { ui } from '../../copy';
import { useNow } from '../../lib/useNow';
import { type Moment, type Today as TodayState, inWindow, momentsFor, quitoClock, quitoMonthDay, today } from '../../lib/today';
import type { HoursEntry, Ritual } from '../../lib/today';

type Seasonal = { from: string; to: string; name: { es: string; en: string }; note: { es: string; en: string } };
type Props = { locale: Locale; hours: (HoursEntry & { label: { es: string; en: string } })[]; rituals: Ritual[]; seasonal?: Seasonal };

const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k]));

/** Beat 4. The server renders the full static list (first hours group); the browser swaps in today's moments every minute. */
export function Today({ locale, hours, rituals, seasonal }: Props) {
  const u = ui[locale].today;
  const site = { hours, rituals };
  const now = useNow();

  const live: TodayState | null = now ? today(now, site) : null;
  const first = hours[0];
  const moments: Moment[] = live ? live.moments : momentsFor(site, first).map((m) => ({ ...m, state: 'later' as const }));
  const inText = (n: number) => (n >= 60 ? fill(u.inHourMin, { h: Math.floor(n / 60), m: String(n % 60).padStart(2, '0') }) : fill(u.inMin, { n }));

  let focus: string;
  if (!live) focus = `${first.label[locale]}, ${first.opens} - ${first.closes}`;
  else if (live.focus.kind === 'now') focus = fill(u.focusNow, { label: live.focus.moment.label[locale] });
  else if (live.focus.kind === 'next') focus = fill(u.focusNext, { label: live.focus.moment.label[locale], in: inText(live.focus.minutes) });
  else {
    const n = live.focus.next;
    focus = !n ? u.closed : n.daysAhead === 1 ? fill(u.opensTomorrow, { t: n.opens }) : fill(u.opensOn, { d: u.days[n.day], t: n.opens });
  }
  const closedNow = live?.focus.kind === 'closed';
  const showSeasonal = !!now && !!seasonal && inWindow(quitoMonthDay(now), seasonal.from, seasonal.to);

  return (
    <section id="hoy" className="today" aria-labelledby="today-title" data-today>
      <h2 id="today-title">{u.title}</h2>
      <h3 className="today-focus" aria-live="polite" data-focus>
        {closedNow && <span className="today-closed">{u.closed}. </span>}
        {focus}
      </h3>
      {live && live.hours && <p className="today-hours">{u.hoursOf}: {live.hours.opens} - {live.hours.closes}</p>}
      <ol className="day" data-day>
        {moments.map((m) => {
          // The bar fills up to now: past stretches are full, the current one is partly filled.
          const fill = m.state === 'past' ? 1 : m.state === 'current' && now ? Math.min(1, Math.max(0, (quitoClock(now).minutes - m.minutes) / m.grow)) : 0;
          return (
            <li key={m.id} className="moment" data-state={m.state} style={{ ['--grow' as string]: m.grow, ['--fill' as string]: fill }} aria-current={m.state === 'current' ? 'time' : undefined}>
              <span className="moment-time num">{m.time}</span>
              <span className="moment-bar" aria-hidden="true" />
              <span className="moment-text">
                <span className="moment-label">{m.label[locale]}</span>
                <span className="moment-note">{m.note[locale]}</span>
              </span>
            </li>
          );
        })}
      </ol>
      {!live && <p className="today-static">{u.staticNote}</p>}
      {showSeasonal && seasonal && (
        <p className="seasonal" data-seasonal>
          <strong>{u.seasonal}:</strong> {seasonal.name[locale]}. {seasonal.note[locale]}
        </p>
      )}
    </section>
  );
}

