'use client';

import { useEffect, useState } from 'react';
import type { EdgeGeometry } from './edge';

/**
 * One fit of the tree-line edge: the photo and the three lines share one svg, in the photo's own pixel coordinates.
 * Built in the browser after the load event (geometry and photo in a lazy chunk): the traced lines are ~150 KB of path data
 * that would otherwise sit in the home HTML twice (markup and RSC payload) and delay the first paint. Without JS the opening
 * keeps its deep ground and label; the edge is decoration.
 */
export function Edge({ box }: { box: [number, number, number, number] }) {
  const [e, setE] = useState<EdgeGeometry | null>(null);
  useEffect(() => {
    let alive = true;
    let t = 0;
    const go = () => {
      t = window.setTimeout(async () => {
        const { edgePaths } = await import('./edge');
        if (alive) setE(edgePaths(box));
      }, 150);
    };
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
    return () => { alive = false; window.removeEventListener('load', go); window.clearTimeout(t); };
  }, [box]); // box comes from the server props, stable after hydration
  if (!e) return <svg className="fo-svg" aria-hidden="true" focusable="false" />;
  return (
    <svg className="fo-svg" viewBox={e.viewBox} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <g className="fo-ph"><image href="/brand/cloud-forest-edge.webp" x={e.img.x} y={e.img.y} width={e.img.w} height={e.img.h} preserveAspectRatio="none" /></g>
      <path className="fo-l fo-min" pathLength={1} style={{ ['--d' as string]: '0ms' }} vectorEffect="non-scaling-stroke" d={e.minor} />
      <path className="fo-l fo-idx" pathLength={1} style={{ ['--d' as string]: '60ms' }} vectorEffect="non-scaling-stroke" d={e.ridge} />
      <path className="fo-l fo-hvy" pathLength={1} style={{ ['--d' as string]: '120ms' }} vectorEffect="non-scaling-stroke" d={e.heavy} />
    </svg>
  );
}
