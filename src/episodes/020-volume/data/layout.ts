/**
 * data/layout.ts — where a price pane and a volume pane sit inside the card.
 *
 * ⚠ DERIVED FROM `theme.stage.plot`, never typed. Move a margin in the theme
 * and every chart in this episode follows.
 *
 * The split is 70 / 6 / 24. The volume pane is deliberately shallow: this
 * episode's whole argument is that volume is read AGAINST price, and a
 * histogram given equal height stops being a companion and becomes a second
 * chart the eye compares to nothing.
 */
import { theme, columns } from "../../../core";
import type { Rect } from "../../../core";

const PLOT = theme.stage.plot;
const SPLIT = { price: 0.7, gap: 0.06, volume: 0.24 };

/** The price pane of a chart that has a histogram under it. */
export const PRICE: Rect = { x: PLOT.x, y: PLOT.y, w: PLOT.w, h: PLOT.h * SPLIT.price };
/** The histogram's band. */
export const VOL: Rect = {
  x: PLOT.x,
  y: PLOT.y + PLOT.h * (SPLIT.price + SPLIT.gap),
  w: PLOT.w,
  h: PLOT.h * SPLIT.volume,
};
/** The whole plot, for a scene with no histogram. */
export const FULL: Rect = PLOT;

/** Halves of the card, and the panes inside each — for the comparisons. */
export const GAP = 56;
export const halves = (): [Rect, Rect] => {
  const [a, b] = columns(theme.stage.card, 2, GAP);
  return [a, b];
};
/** A half's own price and volume panes, on the same 70/6/24 split. */
export const panes = (half: Rect, top = 0.16) => {
  const y = half.y + half.h * top;
  const h = half.h * (1 - top - 0.12);
  const inset = half.w * 0.06;
  const box = { x: half.x + inset, w: half.w - inset * 2 };
  return {
    price: { ...box, y, h: h * SPLIT.price },
    vol: { ...box, y: y + h * (SPLIT.price + SPLIT.gap), h: h * SPLIT.volume },
  };
};

/**
 * Where a SourceTag sits.
 *
 * ⚠ NOT ITS DEFAULT. The default puts the tag's top few pixels inside the
 * 360x150 logo zone, which scripts/audit-frames.mjs rejects — correctly.
 * Level with the card's own top edge clears it and still reads as belonging
 * to the chart.
 */
export const TAG_Y = theme.stage.card.y;

/**
 * ═══ SC03's TWO SCREENSHOTS ═══
 *
 * Simon supplied BBCA-02 (5m) and BBCA-03 (D) to paste whole.
 *
 * ⚠ MEASURED OFF THE FILES, NOT PLACED BY EYE. The volume band is where the
 * saturated pixels are below the price plot: the top is the tallest bar, the
 * bottom is the baseline. Stored as FRACTIONS of the image, so the mark lands
 * on the bars whatever size the screenshot is drawn at — and if he swaps the
 * screenshots the numbers can be re-derived the same way instead of nudged.
 *
 * The two panels share a top and a baseline, because it is the same app screen;
 * only the right edge differs, because the 5m tape runs further across.
 */
export const BBCA_IMG = { w: 4084, h: 5834 } as const;
/** The volume histogram inside each shot, as fractions of the image. */
export const BBCA_VOL: Record<"fiveMin" | "daily", { x1: number; x2: number; y1: number; y2: number }> = {
  fiveMin: { x1: 0.0318, x2: 0.9550, y1: 0.7953, y2: 0.9291 },
  daily: { x1: 0.0318, x2: 0.8913, y1: 0.7953, y2: 0.9291 },
};
