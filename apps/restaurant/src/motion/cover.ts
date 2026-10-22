import type { Beat } from './types';

/** Beat 1 motion (after load, motion allowed only): as the cover leaves the name scales 1 -> 0.94 and a second fog layer (same raster mask)
 *  climbs over the base of the name. Scrubbed, never a counter. The steam (CSS) pauses while the tab is hidden. */
const beat: Beat = ({ gsap, mm }) => {
  const doc = document.documentElement;
  const onVis = () => doc.toggleAttribute('data-tab-hidden', document.hidden);
  document.addEventListener('visibilitychange', onVis);
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const cv = document.querySelector<HTMLElement>('.cv-chap');
    const name = cv?.querySelector<HTMLElement>('.cv-name');
    const fog = cv?.querySelector<HTMLElement>('.cv-fogu');
    if (!cv || !name || !fog) return;
    gsap
      .timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: cv, start: 'top top', end: 'bottom top', scrub: true } })
      .fromTo(name, { '--ns': 1 }, { '--ns': 0.94 }, 0)
      .fromTo(fog, { '--fy': -12 }, { '--fy': 55 }, 0);
  });
  return () => document.removeEventListener('visibilitychange', onVis);
};
export default beat;
