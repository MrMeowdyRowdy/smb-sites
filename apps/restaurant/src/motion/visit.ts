import type { Beat } from './types';

/** Motion for the visit beat. Runs after load (GSAP is loaded by then). Gate travel on ctx.mm.add('(prefers-reduced-motion: no-preference)', ...). */
const beat: Beat = () => {};
export default beat;
