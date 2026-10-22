import crown from './crown.json';

/**
 * The tree-line edge geometry. The photo is a real cut-out of the crowns (keyed against the sky of the ungraded original, sky and
 * fringe removed, the fog sea dissolving upward), so the cut needs no clip. The three lines are contours around that silhouette at
 * three distances (heavy nearest, then index, then minor), one subpath each, in the photo's own pixel coordinates (2400 x 1600).
 */
export type EdgeGeometry = ReturnType<typeof edgePaths>;

export function edgePaths([x, y, w, h]: [number, number, number, number]) {
  const [ix, iy, iw, ih] = crown.img;
  return { viewBox: `${x} ${y} ${w} ${h}`, img: { x: ix, y: iy, w: iw, h: ih }, heavy: crown.heavy, ridge: crown.index, minor: crown.minor };
}
