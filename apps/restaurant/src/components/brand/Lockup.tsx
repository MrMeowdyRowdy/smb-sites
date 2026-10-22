import type { Locale } from '@smb/i18n';
import { site, thousands } from '../../lib/content';
import { Mark } from './Mark';

/** Horizontal (or stacked) lockup: the mark, NEBLINA in Hanken 500, and the altitude line in Hanken 300 tabular (a numeral, not a label). */
export function Lockup({ locale, stacked, className = '' }: { locale: Locale; stacked?: boolean; className?: string }) {
  const alt = site.origin?.to.altitude;
  return (
    <span className={`${stacked ? 'lock-v' : 'lock-h'} ${className}`}>
      <Mark />
      <span className="lk-t">
        <span className="lk-n">{site.name}</span>
        {alt && <span className="lk-a">{thousands(alt, locale)} m</span>}
      </span>
    </span>
  );
}
