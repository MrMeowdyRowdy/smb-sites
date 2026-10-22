'use client';

import { useEffect, useState } from 'react';
import { watch } from '../motion/runtime';
import { Ct } from './brand/Ct';

/** /menu/ arrival: the farm contour draws in under the "Menú" title. Mounted after the load event so its file never competes with the cup (LCP). */
export function MenuArrival() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    let t = 0;
    const go = () => { t = window.setTimeout(() => setOn(true), 0); };
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
    return () => { window.removeEventListener('load', go); window.clearTimeout(t); };
  }, []);
  useEffect(() => { if (on) watch(); }, [on]);
  return on ? <Ct name="nanegal" vb="200 300 800 500" draw eager className="menu-arrival" /> : null;
}
