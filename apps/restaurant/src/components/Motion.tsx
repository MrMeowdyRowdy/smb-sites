'use client';

import { useEffect } from 'react';
import * as rt from '../motion/runtime';

/**
 * The motion layer. On mount: the reveal watcher and the at-rest signal (no requests). After the load event and an idle moment:
 * GSAP, ScrollTrigger and the beat modules, so no motion chunk is requested before first paint (Lighthouse counts those toward LCP).
 * Nothing is hidden without JS, and with reduced motion every beat shows its end state.
 */
export function Motion() {
  useEffect(() => {
    rt.watch();
    const stopSettle = rt.settle();
    // Skip the arrival on the first interaction.
    const skip = () => document.documentElement.removeAttribute('data-arrive');
    const kinds = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;
    for (const e of kinds) window.addEventListener(e, skip, { once: true, passive: true });

    let cleanup = () => {};
    let cancelled = false;
    const start = async () => {
      const [{ gsap }, { ScrollTrigger }, ...mods] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('../motion/cover'),
        import('../motion/origin'),
        import('../motion/menuBand'),
        import('../motion/hoy'),
        import('../motion/visit'),
        import('../motion/close'),
        import('../motion/menuPage'),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      const undo = mods.map((m) => m.default({ gsap, ScrollTrigger, rt, mm }));
      const refresh = () => ScrollTrigger.refresh();
      // Lower sections render on demand (content-visibility), so their real height arrives late: measure again then.
      let t = 0;
      const later = () => { window.clearTimeout(t); t = window.setTimeout(refresh, 120); };
      const lazy = Array.from(document.querySelectorAll('[data-cv]'));
      lazy.forEach((el) => el.addEventListener('contentvisibilityautostatechange', later));
      document.fonts?.ready.then(refresh);
      cleanup = () => {
        lazy.forEach((el) => el.removeEventListener('contentvisibilityautostatechange', later));
        undo.forEach((u) => typeof u === 'function' && u());
        mm.revert();
      };
    };
    const idle = (window as unknown as { requestIdleCallback?: (f: () => void) => number }).requestIdleCallback;
    let t = 0;
    const go = () => {
      rt.loadUses();
      t = idle ? idle(() => void start()) : window.setTimeout(() => void start(), 200);
    };
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
    return () => {
      cancelled = true;
      stopSettle();
      for (const e of kinds) window.removeEventListener(e, skip);
      window.removeEventListener('load', go);
      if (!idle) clearTimeout(t);
      cleanup();
    };
  }, []);
  return null;
}
