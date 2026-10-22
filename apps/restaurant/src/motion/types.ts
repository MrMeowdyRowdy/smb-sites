import type { gsap as Gsap } from 'gsap';
import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger';
import type * as Runtime from './runtime';

/** What every beat module receives after the page has loaded. Return a cleanup. Do the beat's work only if its section is on the page. */
export type BeatContext = { gsap: typeof Gsap; ScrollTrigger: typeof ST; rt: typeof Runtime; mm: ReturnType<typeof Gsap.matchMedia> };
export type Beat = (ctx: BeatContext) => void | (() => void);
