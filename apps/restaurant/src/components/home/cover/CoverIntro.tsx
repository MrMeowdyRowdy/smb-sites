'use client';

import { useEffect } from 'react';
import * as rt from '../../../motion/runtime';

/** Beat 0, the arrival (once per session, html[data-arrive], at most 1.4 s). The contour draw and the fog thinning are CSS (cover.css) and
 *  start before hydration; this adds the pin label count 1.600 -> 2.810 (0.8 s from ~350 ms) only if it can still begin within ~600 ms of
 *  navigation start, so the SSR value never jumps back late. Any input ends it at rest. */
export function CoverIntro() {
  useEffect(() => {
    const doc = document.documentElement;
    const el = document.querySelector<HTMLElement>('[data-count-to]');
    if (doc.dataset.arrive !== '1' || !el) return;
    const to = Number(el.dataset.countTo);
    const wait = 350 - performance.now();
    if (performance.now() > 600 || !to) return;
    const t = window.setTimeout(() => rt.count(el, 1600, to, 800), Math.max(0, wait));
    const skip = () => { window.clearTimeout(t); rt.stop(el, to); };
    const kinds = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;
    for (const k of kinds) window.addEventListener(k, skip, { once: true, passive: true });
    return () => { window.clearTimeout(t); for (const k of kinds) window.removeEventListener(k, skip); };
  }, []);
  return null;
}
