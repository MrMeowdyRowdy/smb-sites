import crown from './crown.json';

/** The tree-line edge geometry (brand book lib.mjs edge()): heavy = the real crown silhouette of the cloud-forest photo, index = its far ridge, minor = an echo. */
type P = number[];
const r1 = (v: number) => Math.round(v * 10) / 10;
function spline(P: P[]) {
  let d = `M${r1(P[0][0])} ${r1(P[0][1])}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return d;
}
const avg = (P: P[], n: number) => P.map((p, i) => { let s = 0, c = 0; for (let k = -n; k <= n; k++) { const q = P[i + k]; if (q) { s += q[1]; c++; } } return [p[0], s / c]; });

/** Upper envelope with a slope limit: every near-vertical crown cliff becomes a steep but finite ramp and no crown is cut (valleys rise toward the crowns, never the other way). */
const SLOPE = 4; // 2.5 turned crowns into mountain peaks; 4 keeps the crown shape and still removes the vertical cliffs
const crownEnv: number[][] = crown.crown.map(([x]) => [x, Math.min(...crown.crown.map(([x2, y2]) => y2 + SLOPE * Math.abs(x - x2)))]);

export const PHOTO = { w: crown.size[0], h: crown.size[1] };

export type EdgeGeometry = ReturnType<typeof edgePaths>;

export function edgePaths([x, y, w, h]: [number, number, number, number]) {
  const m = 120;
  const pick = (L: number[][]) => L.filter((p) => p[0] >= x - m && p[0] <= x + w + m);
  const heavy = pick(crownEnv), ridge = pick(crown.ridge), e = w * 0.02;
  const minor = avg(heavy, 8).map((p) => [p[0], p[1] - e * 2.4]);
  const hv = spline(heavy);
  return {
    viewBox: `${x} ${y} ${w} ${h}`,
    below: `${hv}L${x + w + m} ${y + h + m}L${x - m} ${y + h + m}Z`,
    above: `${hv}L${x + w + m} ${y - h}L${x - m} ${y - h}Z`,
    heavy: hv,
    ridge: spline(ridge),
    minor: spline(minor),
  };
}
