/**
 * plot.ts — one coordinate space for every chart in the episode.
 *
 * `barGrid` in CandleChart and `seriesGrid` here share an identical y formula,
 * so a moving average drawn as a line and the candles it is drawn over agree
 * about where a price is. If those two ever diverge, every overlay in the
 * episode is subtly wrong and nothing on screen says so.
 *
 * A grid is built from an EXPLICIT domain wherever two things must be compared.
 * Left to itself each series would be normalised to its own range, which is how
 * a chart quietly rigs a comparison the viewer is being asked to make.
 */
import type { Rect } from "../helpers";

export type Grid = {
  lo: number;
  hi: number;
  slot: number;
  x: (i: number) => number;
  y: (v: number) => number;
};

export const seriesGrid = (
  values: (number | null)[],
  box: Rect,
  pad = 0.1,
  domain?: [number, number],
): Grid => {
  const real = values.filter((v): v is number => v !== null);
  const [lo, hi] = domain ?? [Math.min(...real), Math.max(...real)];
  const span = Math.max(1e-9, hi - lo);
  return {
    lo,
    hi,
    slot: box.w / Math.max(1, values.length),
    x: (i) => box.x + (box.w * i) / Math.max(1, values.length - 1),
    y: (v) => box.y + box.h * (1 - pad) - ((v - lo) / span) * box.h * (1 - pad * 2),
  };
};

/**
 * A path through the values, SKIPPING the nulls at the front rather than
 * treating them as zero. A moving average that starts on bar 0 is a lie about
 * how much history it had.
 */
export const pathOf = (values: (number | null)[], g: Grid) => {
  let d = "";
  let started = false;
  values.forEach((v, i) => {
    if (v === null) return;
    d += `${started ? "L" : "M"}${g.x(i).toFixed(1)},${g.y(v).toFixed(1)} `;
    started = true;
  });
  return d.trim();
};

/** Straight-line length — close enough for a trim on series this smooth. */
export const lengthOf = (values: (number | null)[], g: Grid) => {
  let len = 0;
  let prev: { x: number; y: number } | null = null;
  values.forEach((v, i) => {
    if (v === null) return;
    const p = { x: g.x(i), y: g.y(v) };
    if (prev) len += Math.hypot(p.x - prev.x, p.y - prev.y);
    prev = p;
  });
  return len;
};

/** The index the first non-null lands on — where a trim path has to start. */
export const firstReal = (values: (number | null)[]) => values.findIndex((v) => v !== null);
