'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { loadUses, watch } from '../../motion/runtime';

/** Renders its children only after the load event, so their files (contour svgs) never compete with a page's LCP image. */
export function AfterLoad({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const go = () => setOn(true);
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
    return () => window.removeEventListener('load', go);
  }, []);
  useEffect(() => {
    if (!on) return;
    loadUses();
    watch();
  }, [on]);
  return on ? children : null;
}
