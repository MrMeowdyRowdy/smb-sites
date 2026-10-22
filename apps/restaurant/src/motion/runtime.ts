/**
 * The motion runtime shared by every beat (no dependencies, runs on mount, requests nothing).
 * - watch(): adds .in to .rv, .ct.draw and [data-watch] elements once they enter (reveal recipe, draw-on, chapter entrances).
 * - count(): one timed count between two numbers (never scrubbed by scroll), tracked so the page knows when it is at rest.
 * - settle: html[data-settled]="1" when no count, draw or transition is running; captures wait for it plus 300 ms.
 */
export const reduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Thousands separator by the page language: 2.810 in Spanish, 2,810 in English. */
export const fmt = (n: number, lang = document.documentElement.lang) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'es' ? '.' : ',');

let busy = 0;
const tokens = new WeakMap<Element, number>();

/** Count `el` from `from` to `to` in `ms` (ease-out cubic), ending exactly on `to`. A new count or stop() on the same element cancels the old one. */
export function count(el: HTMLElement, from: number, to: number, ms = 800, done?: () => void) {
  const tok = (tokens.get(el) ?? 0) + 1;
  tokens.set(el, tok);
  if (reduced()) {
    el.textContent = fmt(to);
    done?.();
    return;
  }
  busy++;
  let t0 = 0;
  const step = (t: number) => {
    if (tokens.get(el) !== tok) return void busy--;
    if (!t0) t0 = t;
    const p = Math.min(1, (t - t0) / ms);
    el.textContent = fmt(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(step);
    else {
      busy--;
      done?.();
    }
  };
  requestAnimationFrame(step);
}

/** Cancel a running count and show `value` at once. */
export function stop(el: HTMLElement, value: number) {
  tokens.set(el, (tokens.get(el) ?? 0) + 1);
  el.textContent = fmt(value);
}

let io: IntersectionObserver | null = null;
/** Observe reveal targets under `root` (call again after rendering new ones). Each .rv gets --i from its order among its .rv siblings (max 7). */
export function watch(root: ParentNode = document) {
  const els = Array.from(root.querySelectorAll<HTMLElement>('.rv, .ct.draw, [data-watch]')).filter((e) => !e.classList.contains('in'));
  for (const el of els)
    if (el.classList.contains('rv') && el.parentElement) {
      const sib = Array.from(el.parentElement.children).filter((c) => c.classList.contains('rv'));
      el.style.setProperty('--i', String(Math.min(sib.indexOf(el), 7)));
    }
  if (!('IntersectionObserver' in window)) return els.forEach((e) => e.classList.add('in'));
  io ??= new IntersectionObserver(
    (es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io?.unobserve(e.target);
    }),
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );
  els.forEach((e) => io!.observe(e));
}

/** Starts the at-rest signal; returns a stop function. Scroll-driven and infinite animations (fog drift, steam) do not count as motion in progress. */
export function settle() {
  const doc = document.documentElement;
  let calm = 0;
  const quiet = () => {
    if (busy > 0) return false;
    const an = document.getAnimations?.() ?? [];
    return !an.some((a) => {
      const t = a.effect?.getTiming?.();
      return a.playState === 'running' && a.timeline instanceof DocumentTimeline && t && t.iterations !== Infinity;
    });
  };
  doc.dataset.settled = '0';
  const id = window.setInterval(() => {
    if (quiet()) calm = Math.min(calm + 1, 3);
    else calm = 0;
    doc.dataset.settled = calm >= 3 ? '1' : '0';
  }, 100);
  return () => window.clearInterval(id);
}

/** Lets a beat hold the at-rest signal while it runs something the animation list cannot see (a GSAP tween, a pin). */
export const hold = () => {
  busy++;
  return () => void busy--;
};

/** Gives deferred contour fields (Ct without `eager`) their file: call after the load event, and after mounting new ones. */
export function loadUses(root: ParentNode = document) {
  for (const u of Array.from(root.querySelectorAll<SVGUseElement>('use[data-href]'))) {
    u.setAttribute('href', u.dataset.href!);
    u.removeAttribute('data-href');
  }
}
