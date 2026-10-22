'use client';

import { useEffect } from 'react';

const fmt = (n: number, lang: string) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'es' ? '.' : ',');

/**
 * The motion layer. Loaded after the page is interactive; nothing is hidden without it, and with reduced motion it does nothing,
 * so the final states are what people see. Transform and opacity, plus the route line's dash and the numeral's count.
 */
export function Motion() {
  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;
    const start = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const q = (s: string, root: ParentNode = document) => Array.from(root.querySelectorAll<HTMLElement>(s));
      const lang = document.documentElement.lang;
      const mm = gsap.matchMedia();

      // Skip the arrival on the first interaction.
      const skip = () => document.documentElement.removeAttribute('data-arrive');
      for (const e of ['pointerdown', 'keydown', 'wheel', 'touchstart']) window.addEventListener(e, skip, { once: true, passive: true });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Entrance: hide only what is still below the fold, then rise once as the section arrives.
        const reveal = (trigger: Element | null, targets: Element[] | string, vars: gsap.TweenVars = {}) => {
          if (!trigger) return;
          const list = typeof targets === 'string' ? q(targets, trigger as HTMLElement) : targets;
          if (!list.length) return;
          if (trigger.getBoundingClientRect().top < window.innerHeight * 0.85) return;
          gsap.from(list, { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out', stagger: 0.08, ...vars, scrollTrigger: { trigger, start: 'top 82%', once: true } });
        };

        // Signature: the fog lifts and the name steps back from 1 to 0.94 as the first screen leaves.
        const hero = q('.hero')[0];
        if (hero) {
          const tl = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.5 } });
          tl.to('[data-monument]', { scale: 0.94, ease: 'none' }, 0)
            .to('.hero .fog-a', { opacity: 0.1, ease: 'none' }, 0)
            .to('.hero .fog-b', { opacity: 0.05, ease: 'none' }, 0)
            .to('[data-sky]', { yPercent: 8, ease: 'none' }, 0);
        }

        // The close: the name grows back to 1 and the fog returns as the footer arrives.
        const close = q('.close')[0];
        if (close) {
          gsap.fromTo('.close-name span', { scale: 0.94 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: close, start: 'top bottom', end: 'bottom bottom', scrub: 0.5 } });
          gsap.fromTo('.close .fog-a', { opacity: 0.03 }, { opacity: 0.2, ease: 'none', scrollTrigger: { trigger: close, start: 'top bottom', end: 'bottom bottom', scrub: 0.5 } });
          reveal(close, ['.close-invite', '.close-action', '.close-links', '.close-lang'].flatMap((s) => q(s, close)));
        }

        // Origin: pinned on a desktop, stacked entrances on a phone.
        const stage = q('.origin-stage')[0];
        const num = q('[data-count]')[0];
        const numeral = q('.origin-num')[0];
        const route = q('.route-line')[0];
        const frames = q('[data-frame]');
        const wide = window.matchMedia('(min-width: 800px)').matches;
        if (stage && wide) {
          const from = Number(numeral?.dataset.from ?? 0);
          const to = Number(numeral?.dataset.altitude ?? 0);
          const final = num?.textContent ?? '';
          const o = { v: from };
          const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: stage, start: 'top top', end: '+=130%', pin: true, scrub: 1, anticipatePin: 1 } });
          if (num) {
            num.textContent = fmt(from, lang);
            tl.to(o, { v: to, duration: 1, onUpdate: () => { num.textContent = fmt(Math.round(o.v), lang); } }, 0);
          }
          const routeSvg = route?.closest('svg');
          if (routeSvg) tl.fromTo(routeSvg, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1 }, 0);
          tl.from('.route-dot-to, .route-to', { opacity: 0, duration: 0.15 }, 0.85);
          tl.from(frames, { opacity: 0, y: 70, scale: 0.92, duration: 0.22, stagger: 0.2, ease: 'power2.out' }, 0.08);
          void final;
        } else if (stage) reveal(stage, frames);
        q('.stairs').forEach((el) => reveal(el, q('[data-stage]', el), { y: 24, stagger: 0.14 }));

        // Menu promise, Today, Visit, menu page.
        const promise = q('.promise')[0];
        if (promise) {
          reveal(q('.band', promise)[0], q('[data-panel]', promise), { y: 24, stagger: 0.12 });
          reveal(q('.list', promise)[0], [...q('.list-side h2', promise), ...q('.list-photo', promise)], { stagger: 0.12 });
          const rows = q('[data-row]', promise);
          reveal(q('.list-main', promise)[0], rows, { y: 20, stagger: 0.05, duration: 0.6 });
        }
        const todaySec = q('[data-today]')[0];
        if (todaySec) {
          reveal(todaySec, [...q('h2', todaySec), ...q('[data-focus]', todaySec)], { stagger: 0.12 });
          const moments = q('.moment', todaySec);
          if (moments.length && todaySec.getBoundingClientRect().top >= window.innerHeight * 0.85)
            gsap.from(moments, { opacity: 0, y: 24, '--fill': 0, duration: 1.1, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: q('.day', todaySec)[0], start: 'top 85%', once: true } });
        }
        const visit = q('[data-visit]')[0];
        if (visit) {
          reveal(visit, q('.rows-display [data-row]', visit), { y: 24, stagger: 0.08 });
          reveal(visit, q('.map', visit), { y: 20, delay: 0.2 });
        }
        q('.menu-cat').forEach((cat) => reveal(cat, [...q('h2', cat), ...q('[data-dish]', cat)], { y: 22, stagger: 0.06, duration: 0.65 }));
      });

      const refresh = () => ScrollTrigger.refresh();
      // Lower sections render on demand (content-visibility), so their real height arrives late: measure again then.
      let t = 0;
      const later = () => { window.clearTimeout(t); t = window.setTimeout(refresh, 120); };
      q('.promise, .today, .visit').forEach((el) => el.addEventListener('contentvisibilityautostatechange', later));
      document.fonts?.ready.then(refresh);
      window.addEventListener('load', refresh);
      cleanup = () => {
        window.removeEventListener('load', refresh);
        mm.revert();
      };
    };
    // After the load event, so the motion chunks are not requested before first paint (Lighthouse counts those toward LCP).
    const idle = (window as unknown as { requestIdleCallback?: (f: () => void) => number }).requestIdleCallback;
    let t = 0;
    const go = () => {
      t = idle ? idle(() => void start()) : window.setTimeout(() => void start(), 200);
    };
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener('load', go);
      if (!idle) clearTimeout(t);
      cleanup();
    };
  }, []);
  return null;
}
