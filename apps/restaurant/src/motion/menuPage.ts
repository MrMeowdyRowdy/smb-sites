import type { Beat } from './types';

/** /menu/ (unchanged from round 1): each category's heading and dishes rise once as they arrive. */
const beat: Beat = ({ gsap, mm }) => {
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    for (const cat of Array.from(document.querySelectorAll<HTMLElement>('.menu-cat'))) {
      if (cat.getBoundingClientRect().top < window.innerHeight * 0.85) continue;
      const list = Array.from(cat.querySelectorAll('h2, [data-dish]'));
      gsap.from(list, { opacity: 0, y: 22, duration: 0.65, ease: 'power3.out', stagger: 0.06, scrollTrigger: { trigger: cat, start: 'top 82%', once: true } });
    }
  });
};
export default beat;
