import type { Beat } from './types';

/** The close: the name grows 0.94 -> 1 and the fog behind it returns as the footer arrives. Scrubbed, transform and opacity only; ends exactly at rest on the last screen. */
const beat: Beat = ({ gsap, mm }) => {
  const foot = document.querySelector<HTMLElement>('[data-close]');
  const name = foot?.querySelector<HTMLElement>('[data-close-name]');
  const fog = foot?.querySelector<HTMLElement>('[data-close-fog]');
  if (!foot || !name) return;
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: foot, start: 'top bottom', end: 'bottom bottom', scrub: true } });
    tl.fromTo(name, { scale: 0.94 }, { scale: 1 }, 0);
    if (fog) tl.fromTo(fog, { yPercent: 40 }, { yPercent: 0 }, 0);
    return () => { tl.scrollTrigger?.kill(); tl.kill(); gsap.set([name, fog].filter(Boolean), { clearProps: 'all' }); };
  });
};
export default beat;
