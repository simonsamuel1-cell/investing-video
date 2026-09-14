/**
 * core/chart/grid.ts — the coordinate space every chart and every annotation
 * shares.
 *
 * `gridOf` is the single source of "where is this price on screen". Exported
 * and passed around rather than recomputed, so a marker and the line it sits on
 * can never disagree about where a price is. Every annotation in an episode
 * takes a Grid.
 */
import { theme } from "../theme";
import type { Bar } from "./series";

export type Box = { x: number; y: number; w: number; h: number };

export type Grid = {
  lo: number;
  hi: number;
  /** Horizontal distance between two bars — the candle width is derived from it. */
  slot: number;
  box: Box;
  x: (i: number) => number;
  y: (v: number) => number;
};

/**
 * A grid over `values`, inside `box`.
 *
 * `domain` FORCES the price scale. Pass it wherever two things must be read
 * against each other; see domainOf in series.ts for why.
 *
 * `gutter` reserves room on the RIGHT for price labels, so a tick never lands
 * on the line it is measuring.
 */
/**
 * The breathing room `gridOf` leaves inside its box on each side, so the first
 * and last candle are not welded to the plot's edges.
 *
 * ⚠ EXPORTED BECAUSE A SCENE SOMETIMES HAS TO SOLVE FOR A BOX. Whenever a move
 * is specified as "this bar lands on this pixel" — a pan that keeps the last N
 * candles, a chart that continues an earlier one — the box has to be derived
 * from `x(i) = box.x + GRID_PAD_X + …`, and a scene that types 18 for it is a
 * scene that silently breaks the day this number changes.
 */
export const GRID_PAD_X = 18;

export const gridOf = (
  values: (number | null)[],
  domain: [number, number],
  box: Box,
  pad = 0.12,
  gutter = 0,
): Grid => {
  const [lo, hi] = domain;
  const span = Math.max(1e-9, hi - lo);
  const n = Math.max(1, values.length);
  const padX = GRID_PAD_X;
  const inner = box.w - padX * 2 - gutter;
  return {
    lo,
    hi,
    box,
    slot: inner / n,
    x: (i) => box.x + padX + (inner * i) / Math.max(1, n - 1),
    y: (v) =>
      box.y + box.h * (1 - pad) - ((v - lo) / span) * box.h * (1 - pad * 2),
  };
};

/** A path through the values, skipping the leading nulls a warm-up leaves. */
export const pathOf = (values: (number | null)[], g: Grid) => {
  let d = "";
  values.forEach((v, i) => {
    if (v === null) return;
    d += `${d === "" ? "M" : "L"}${g.x(i).toFixed(1)},${g.y(v).toFixed(1)} `;
  });
  return d.trim();
};

/** Path length, for a trim-path draw-on. */
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

/**
 * strokeDasharray/offset for a line that DRAWS ON rather than fades in. This is
 * the only entrance a line is allowed: never a slide, never an opacity fade.
 *
 * Takes an eased 0→1 so the caller decides the timing with useMotion.
 */
export const drawPath = (p: number, length: number) => ({
  strokeDasharray: length,
  strokeDashoffset: length * (1 - Math.max(0, Math.min(1, p))),
});

/** Candle width from the grid's own slot — never a typed pixel value. */
/**
 * ⚠ A CANDLE FILLS ITS SLOT. There is no absolute pixel cap here any more: the
 * old `min(20, …)` meant that whenever a tape had room — a wide card, few bars,
 * a zoomed-in view — the candles stayed thin and stood far apart with white
 * space between them, which is exactly the look Simon has rejected every time
 * it has appeared. A fraction of the slot cannot fuse two bars however wide the
 * box gets, so the fraction is the only limit that was ever needed.
 */
export const candleWidth = (g: Grid) => Math.max(3, g.slot * 0.68);

/**
 * Round price levels inside a domain, for gridlines and the price scale.
 * Chooses a step that yields roughly `want` lines, from a 1/2/5 ladder so the
 * numbers read as prices rather than as arbitrary divisions.
 */
export const ticksOf = (
  [lo, hi]: [number, number],
  want = 5,
): number[] => {
  const raw = (hi - lo) / Math.max(1, want);
  const mag = 10 ** Math.floor(Math.log10(Math.max(1e-9, raw)));
  const step = [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? mag * 10;
  const first = Math.ceil(lo / step) * step;
  const out: number[] = [];
  for (let v = first; v <= hi; v += step) out.push(Math.round(v * 1e6) / 1e6);
  return out;
};

/** The plot box a scene gets by default — the card, inset, with a price gutter. */
export const defaultBox = (): Box => theme.stage.plot;

/** Bars → the values a grid must cover, for convenience at a call site. */
export const barValues = (bars: Bar[]) => bars.flatMap((b) => [b.h, b.l]);

/** Two boxes, blended. */
export const lerpBox = (a: Box, b: Box, t: number): Box => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  w: a.w + (b.w - a.w) * t,
  h: a.h + (b.h - a.h) * t,
});

/**
 * Two grids, blended — how a chart ZOOMS.
 *
 * ⚠ THIS IS THE ONLY HONEST WAY TO ANIMATE A ZOOM, and it is why no scene in
 * this project scales a chart in CSS. A CSS scale takes the stroke widths, the
 * candle corner radii and the type with it, so what arrives is a PICTURE of a
 * chart at a different size. Blending the grids moves every bar and every price
 * to where it belongs at the new scale and leaves everything drawn on it drawn
 * at its own weight.
 *
 * ⚠ AND IT BLENDS THE MAPPINGS, NOT THE INPUTS. The two grids may hold
 * different numbers of bars — zooming out is usually exactly that — so there is
 * no single `gridOf` call in between them. `x(i)` extrapolates outside a grid's
 * own range, so a bar that only exists at one end still has somewhere to be.
 */
export const lerpGrid = (a: Grid, b: Grid, t: number): Grid =>
  t <= 0 ? a : t >= 1 ? b : {
    lo: a.lo + (b.lo - a.lo) * t,
    hi: a.hi + (b.hi - a.hi) * t,
    slot: a.slot + (b.slot - a.slot) * t,
    box: lerpBox(a.box, b.box, t),
    x: (i) => a.x(i) + (b.x(i) - a.x(i)) * t,
    y: (v) => a.y(v) + (b.y(v) - a.y(v)) * t,
  };

/**
 * The same grid, with room for bars OUTSIDE the range it was built for.
 *
 * ⚠ IT RE-INDEXES, IT DOES NOT RE-SOLVE. `gridOf` spreads n bars across a box,
 * so calling it again with a longer series changes the pitch AND the candle
 * width: every bar already on screen shifts and every body gets wider. This
 * keeps the pitch and the slot the base grid solved and only moves the origin,
 * so bar `before` of the longer series sits exactly where bar 0 of the base sat.
 *
 * ⚠ WHICH IS WHAT MAKES HISTORY ADDABLE WITHOUT REDRAWING ANYTHING. A chart
 * that has been approved at one scale must stay at that scale when what is
 * around it is revealed; the reveal is a mask, not a re-layout.
 */
export const extendGrid = (base: Grid, before: number): Grid => {
  const pitch = base.x(1) - base.x(0);
  return { ...base, x: (i) => base.x(0) + (i - before) * pitch };
};
