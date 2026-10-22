import type { Locale } from '@smb/i18n';
import type { CSSProperties } from 'react';
import { ui } from '../../../copy';
import type { Band } from '../../../lib/today';
import { CtBg } from '../../brand/Ct';

/**
 * The hours line: one track for the day, segments weighted by duration, tones past / now / next, the stations from site.json
 * (the list stays whole in the markup: hidden ones are only display:none), the "ahora" marker while open, a hollow ring at the next opening
 * while closed. The marker is the one cherry dot of the chapter; closed has no cherry at all.
 */
export function HoursBand({ band, locale, dayLabel, live }: { band: Band; locale: Locale; dayLabel: string; live: boolean }) {
  const u = ui[locale].today;
  const open = band.state === 'open' && band.marker !== null;
  return (
    <div className="band" data-state={band.state} data-band data-watch>
      <CtBg name="floresta" vb="800 300 360 66" om={0.12} oi={0.18} oh={0.26} wm={0.8} wi={1.3} wh={2.2} className="band-ct" draw />
      {dayLabel && <span className="dayl">{dayLabel}</span>}
      <ol className="track" data-day>
        {band.stations.map((s) => (
          <li key={s.id} className={`seg ${s.tone}`} data-hide={[s.hideD && 'd', s.hideP && 'p'].filter(Boolean).join(' ') || undefined} style={{ ['--fd' as string]: s.fd, ['--fp' as string]: s.fp } as CSSProperties} aria-current={s.tone === 'now' ? 'time' : undefined}>
            <span className="num">{s.time}</span>
            <span className="lab">{s.label[locale]}</span>
            <span className="nt">{s.note[locale]}</span>
            {live && open && s.tone === 'now' && (
              // The phone's marker lives inside the running station, so it stays true whatever heights the column gets.
              <span className="mark mp" aria-hidden="true" style={{ ['--x' as string]: `${Math.min(100, Math.max(0, ((band.nowMin! - s.minutes) / s.fp) * 100)).toFixed(2)}%` } as CSSProperties}>
                <b>{u.now}</b>
              </span>
            )}
          </li>
        ))}
        <li className="end">
          <span className="num">{band.end.time}</span>
          {band.end.label && <span className="lab">{band.end.label[locale]}</span>}
        </li>
      </ol>
      {live && open && (
        <span className={`mark${band.marker! > 92 ? ' er' : ''}`} role="img" aria-label={u.now} style={{ ['--x' as string]: `${band.marker!.toFixed(2)}%` } as CSSProperties} data-mark>
          <b aria-hidden="true">{u.now}</b>
        </span>
      )}
      {live && !open && <span className="mark ring" role="img" aria-label={u.ring} data-ring />}
    </div>
  );
}
