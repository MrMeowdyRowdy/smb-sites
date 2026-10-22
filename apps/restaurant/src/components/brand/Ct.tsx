import type { CSSProperties, ReactNode } from 'react';
import len from './ct-len.json';

export type Terrain = 'floresta' | 'nanegal' | 'route';
const FULL: Record<Terrain, string> = { floresta: '0 0 1168 818', nanegal: '0 0 1168 818', route: '0 0 906 1284' };

type Props = {
  name: Terrain;
  /** the crop, in the terrain's own coordinates (see crops.txt in the brand book); no crop twice at full size on a page */
  vb?: string;
  className?: string;
  /** draw the three weights on (500 ms, 60 ms apart) when the element gets .in */
  draw?: boolean;
  par?: string;
  /** first-viewport fields only: load the file at once. Every other field gets its href after the load event (runtime loadUses). */
  eager?: boolean;
  /** look variables: --om/--oi/--oh opacities, --wm/--wi/--wh widths, color */
  style?: CSSProperties;
  children?: ReactNode;
};

/** A contour field: real USGS terrain in three weights, each a <use> of the shared file in public/ct so the paths load once and cache.
 *  --len is the weight's longest line (ct-len.json), so on draw-on every line grows from its start at once and the longest finishes last. */
export function Ct({ name, vb, className = '', draw, eager, par = 'xMidYMid slice', style, children }: Props) {
  return (
    <svg className={`ct${draw ? ' draw' : ''} ${className}`} viewBox={vb ?? FULL[name]} preserveAspectRatio={par} aria-hidden="true" focusable="false" style={style}>
      {(['minor', 'index', 'heavy'] as const).map((p, i) => (
        <use key={p} className={`u-${p}`} {...{ [eager ? 'href' : 'data-href']: `/ct/${name}.svg#${p}` }} style={{ ['--d' as string]: `${i * 60}ms`, ['--len' as string]: len[name][p] }} />
      ))}
      {children}
    </svg>
  );
}

/** A quiet contour ground behind a composition (the field stays quiet under copy). */
export function CtBg({ name, vb, eager, color = 'var(--ink)', om = 0.12, oi = 0.2, oh = 0.35, wm = 0.8, wi = 1.4, wh = 2.6, className = '', draw }: Omit<Props, 'style' | 'children'> & { color?: string; om?: number; oi?: number; oh?: number; wm?: number; wi?: number; wh?: number }) {
  const style = { color, '--om': om, '--oi': oi, '--oh': oh, '--wm': wm, '--wi': wi, '--wh': wh } as CSSProperties;
  return <Ct name={name} vb={vb} className={`bgc ${className}`} draw={draw} eager={eager} style={style} />;
}
