/**
 * Morph — one line becoming another, left to right.
 *
 * The alternative was to clear the card and draw the next scene's line onto
 * nothing. That says the two shapes are unrelated, which is exactly wrong: the
 * mechanism IS the shape the previous scene was pointing at, seen up close. So
 * the previous line stays, and the new one grows out of it — the transformation
 * sweeps across the frame instead of the drawing starting over.
 *
 * Both curves are resampled to the same number of points, spread evenly across
 * each one's own x-range, so sample i of one always corresponds to sample i of
 * the other. At amount 0 the path is EXACTLY the old line, at 1 exactly the new
 * one, and in between each point travels its own short distance.
 *
 * The sweep has a soft front rather than a hard edge, and the front is pushed
 * past 1 so that a fully-advanced sweep leaves nothing untransformed at the
 * right-hand tail.
 */
export type Pt = { x: number; y: number };

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** y of a polyline at an arbitrary x, clamped to its ends. */
export const yAt = (pts: Pt[], x: number) => {
  if (x <= pts[0].x) return pts[0].y;
  const last = pts[pts.length - 1];
  if (x >= last.x) return last.y;
  let lo = 0;
  let hi = pts.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (pts[mid].x <= x) lo = mid;
    else hi = mid;
  }
  const a = pts[lo];
  const b = pts[hi];
  return a.y + ((b.y - a.y) * (x - a.x)) / (b.x - a.x);
};

export type Morph = {
  pairs: { from: Pt; to: Pt }[];
  /** Width of the soft front, as a fraction of the line. */
  front: number;
};

/** Pairs sample i of `from` with sample i of `to`. Built once, at module load. */
export const morph = (from: Pt[], to: Pt[], samples = 260, front = 0.1): Morph => {
  const fx0 = from[0].x;
  const fx1 = from[from.length - 1].x;
  const tx0 = to[0].x;
  const tx1 = to[to.length - 1].x;
  return {
    front,
    pairs: Array.from({ length: samples }, (_, i) => {
      const u = i / (samples - 1);
      const fx = fx0 + (fx1 - fx0) * u;
      const tx = tx0 + (tx1 - tx0) * u;
      return { from: { x: fx, y: yAt(from, fx) }, to: { x: tx, y: yAt(to, tx) } };
    }),
  };
};

/** The blended points at a given sweep position. 0 = old shape, 1 = new one. */
export const morphPoints = (m: Morph, amount: number): Pt[] => {
  const head = amount * (1 + m.front); // so amount 1 clears the right-hand tail
  const n = m.pairs.length;
  return m.pairs.map((p, i) => {
    const a = clamp01((head - i / (n - 1)) / m.front);
    return { x: p.from.x + (p.to.x - p.from.x) * a, y: p.from.y + (p.to.y - p.from.y) * a };
  });
};

export const pathOf = (pts: Pt[]) => pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");

/** Where the transformation front currently is — the head dot rides here. */
export const morphFront = (m: Morph, amount: number): Pt => {
  const pts = morphPoints(m, amount);
  return pts[Math.round(clamp01(amount) * (pts.length - 1))];
};
