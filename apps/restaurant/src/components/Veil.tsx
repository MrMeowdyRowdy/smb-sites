'use client';

import { useEffect } from 'react';

/** Fallback for browsers without cross-document View Transitions (Firefox): between the home and /menu/ the fog veil covers the page
 *  (data-veil-out, CSS), then we navigate; the next page lifts it from boot.ts' flag. Reduced motion or a modified click: a normal navigation. */
export function Veil({ paths }: { paths: string[] }) {
  useEffect(() => {
    if ('CSSViewTransitionRule' in (window as object) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const doc = document.documentElement;
    const norm = (p: string) => p.replace(/\/$/, '') || '/';
    const set = new Set(paths.map(norm));
    const clear = () => { doc.removeAttribute('data-veil-out'); doc.removeAttribute('data-veil'); };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !set.has(norm(url.pathname)) || norm(url.pathname) === norm(location.pathname)) return;
      e.preventDefault();
      try { sessionStorage.setItem('neblina-veil', '1'); } catch {}
      doc.dataset.veilOut = '1';
      window.setTimeout(() => location.assign(url.href), 300);
      window.setTimeout(clear, 1200); // never trap: the veil lifts if the navigation did not happen
    };
    document.addEventListener('click', onClick);
    window.addEventListener('pageshow', clear);
    return () => { document.removeEventListener('click', onClick); window.removeEventListener('pageshow', clear); };
  }, [paths]);
  return null;
}
