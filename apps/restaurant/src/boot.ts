/**
 * Inline boot script, run before first paint on every page (both layouts):
 * - html.js: CSS may hide what JS will reveal (only with JS and motion allowed; nothing readable depends on it otherwise).
 * - data-veil: set when the previous page left through the fixed-veil fallback (no cross-document View Transitions); the veil lifts from CSS alone.
 * - data-loaded: set on the load event; below-the-fold decoration (fog masks, contour files) waits for it so it never delays the LCP.
 * - data-arrive: the home's arrival plays once per session, only on the home, never with reduced motion.
 */
export const BOOT =
  "try{var d=document.documentElement;d.classList.add('js');addEventListener('load',function(){d.dataset.loaded='1'});var p=location.pathname;if((p==='/'||p==='/en/'||p==='/en')&&!sessionStorage.getItem('neblina-arrived')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.arrive='1';sessionStorage.setItem('neblina-arrived','1')}if(sessionStorage.getItem('neblina-veil')){sessionStorage.removeItem('neblina-veil');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.dataset.veil='1'}}catch(e){}";
