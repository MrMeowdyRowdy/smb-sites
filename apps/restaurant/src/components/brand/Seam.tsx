import { AfterLoad } from './AfterLoad';
import { CtBg, type Terrain } from './Ct';

type Ground = 'paper' | 'surface' | 'field' | 'field-2' | 'deep';
const DARK: Ground[] = ['field', 'field-2', 'deep'];

/**
 * The fog seam: the ground above (`from`) ends in the real fog mask over the ground below (`to`), and a contour field runs across
 * the seam. Never a linear gradient, never a fade between grounds. Where scroll-driven animation exists the fog edge rises as it
 * crosses the viewport; elsewhere, and with reduced motion, it is a still edge.
 */
/** `deferField` mounts the contour after the load event (for seams on pages whose LCP must not wait for a contour file).
 *  `near` (a seam right under the first viewport) uses the 0.9 KB fog mask at once, so it is never a hard edge, and is never an LCP image. */
export function Seam({ from, to, name, vb, className = '', deferField, near }: { from: Ground; to: Ground; name: Terrain; vb: string; className?: string; deferField?: boolean; near?: boolean }) {
  const k = `${DARK.includes(from) ? 'd' : 'p'}${DARK.includes(to) ? 'd' : 'p'}`;
  const [color, o] = k === 'pp' ? ['var(--tone-next)', 0.9] : k === 'dd' ? ['var(--field-3)', 0.55] : ['var(--field-3)', 0.75];
  const field = <CtBg name={name} vb={vb} color={color} om={o * 0.55} oi={o * 0.8} oh={o} wm={1} wi={1.8} wh={3.4} draw />;
  return (
    <div className={`seam ${className}`} aria-hidden="true" style={{ ['--a' as string]: `var(--${from})`, ['--b' as string]: `var(--${to})`, ...(near ? { ['--fog-md' as string]: 'url(/brand/fog-mask-down-lo.webp)' } : {}) }}>
      <div className="sm-a" />
      {deferField ? <AfterLoad>{field}</AfterLoad> : field}
    </div>
  );
}
