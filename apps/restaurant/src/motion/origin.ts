import type { Beat } from './types';

/**
 * Origin beat. The edge draws and the photo rises in CSS (.fo gets .in from the watcher). Here:
 * - pinned (>= 1024 px wide, stage fits the viewport): one timed count 1.600 -> 2.810 when the pin starts, reset when scrolling back above it;
 *   the route draws with the scrub (mask offset --rp), the four windows rise past the numeral and settle above it;
 * - otherwise (tablet, phone, short screens): the count plays once when the numeral enters; route and windows arrive on enter.
 * End state (SSR, reduced motion, no JS): 2.810, route drawn, windows in place.
 */
const beat: Beat = ({ gsap, ScrollTrigger, rt, mm }) => {
  const root = document.querySelector<HTMLElement>('[data-origin]');
  const stage = root?.querySelector<HTMLElement>('[data-pin]');
  const num = root?.querySelector<HTMLElement>('[data-count]');
  if (!root || !stage || !num) return;
  const from = Number(num.dataset.countFrom), to = Number(num.dataset.countTo);
  const wins = gsap.utils.toArray<HTMLElement>('[data-win]', stage);
  const cleanupWins = () => gsap.set(wins, { clearProps: 'opacity,transform' });

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const fits = matchMedia('(min-width: 1024px) and (min-height: 700px)').matches && stage.offsetHeight <= innerHeight + 2;
    if (fits) {
      rt.stop(num, from);
      stage.style.setProperty('--rp', '1');
      gsap.set(wins, { opacity: 0 });
      const rise = 48; // from just below their own slot: the captions never pass under the numeral
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: stage, start: 'top top', end: () => `+=${Math.round(innerHeight * 1.3)}`, scrub: 0.6, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
          onEnter: () => rt.count(num, from, to, 800),
          onLeaveBack: () => rt.stop(num, from),
        },
      });
      tl.fromTo(stage, { '--rp': 1 }, { '--rp': 0, duration: 0.65 }, 0.1);
      wins.forEach((w, i) => tl.fromTo(w, { y: rise, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, immediateRender: true }, 0.08 + i * 0.14));
      tl.to({}, { duration: 0.1 });
      // loaded below or past the pin: show the held end state
      if (tl.scrollTrigger && tl.scrollTrigger.progress > 0) rt.stop(num, to);
      return () => { stage.style.removeProperty('--rp'); cleanupWins(); rt.stop(num, to); };
    }
    // unpinned: count once on enter, windows arrive staggered, the route draws when the map enters
    rt.stop(num, from);
    stage.style.setProperty('--rp', '1');
    gsap.set(wins, { opacity: 0, y: 20 });
    const sts = [
      ScrollTrigger.create({ trigger: num, start: 'top 88%', once: true, onEnter: () => rt.count(num, from, to, 800) }),
      ScrollTrigger.create({ trigger: stage.querySelector('.or-map'), start: 'top 75%', once: true, onEnter: () => void gsap.to(stage, { '--rp': 0, duration: 1.4, ease: 'expo.inOut' }) }),
      ...wins.map((w, i) => ScrollTrigger.create({ trigger: w, start: 'top 90%', once: true, onEnter: () => void gsap.to(w, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', delay: (i % 2) * 0.08 }) })),
    ];
    return () => { sts.forEach((s) => s.kill()); stage.style.removeProperty('--rp'); cleanupWins(); rt.stop(num, to); };
  });
};
export default beat;
