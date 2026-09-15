/**
 * SC08 · TWO WINDOWS, THE SAME CHART.  Simon: "buat 2 window kiri kanan, isi
 * chartnya sama".
 *
 * ⚠ ONE SERIES, DRAWN TWICE — not two series that match. `SS03` is read by both
 * windows, so "the same" is true by construction rather than by maintenance. If
 * the two are ever meant to diverge, that divergence has to be written down as
 * a difference; it can never happen by accident.
 *
 * ⚠ AND ONE GRID SHAPE, NOT ONE GRID. Each window solves its own grid inside
 * its own box — the boxes are the same size, so the two come out identical —
 * rather than sharing a single grid that would draw both tapes in the left-hand
 * window's pixels. Same reason the zoom at 2676 changes the grid instead of
 * transforming the picture: a chart's geometry belongs to the box it is in.
 *
 * ⚠ THE WINDOWS ARE `halves()`, the box SC09 already compares things in. A
 * second pair of side-by-side windows that were merely a similar size would be
 * two devices where the video has one.
 */
import { useCurrentFrame } from "remotion";
import { Candles, Card, candleWidth, gridOf, progressInOut, usePalette } from "../../../core";
import { halves } from "../data/layout";
import { TWIN } from "../data/timing";
import { SS03 } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = TWIN;
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ⚠ 150px SHORTER THAN THE STAGE CARD — Simon — and the height comes off both
 * ends, so the pair stays centred in the band every other scene draws in. Taken
 * off the bottom alone they would sit high against a subtitle band that is
 * already the lowest thing on screen.
 */
const DROP_H = 150;
const [L0, R0] = halves();
const shorter = (r: typeof L0) => ({ ...r, y: r.y + DROP_H / 2, h: r.h - DROP_H });
const LEFT = shorter(L0);
const RIGHT = shorter(R0);

/**
 * ⚠ THIRTY BARS ARE HIDDEN, NOT DELETED — Simon, and he said why: "nanti aku
 * butuh candlesticks yang di-hide ini sebagai acuan untuk membuat garis
 * resistance". So `SS03` stays whole in data/series.ts and this is only the
 * window onto it. A price taken off any of the thirty is still there to be
 * taken.
 *
 * ⚠ AND THEY ARE OUT OF THE GRID, WHICH IS THE POINT OF HIDING THEM. A bar
 * drawn at zero opacity still holds its slot: the visible bars would stay
 * exactly as thin as they are, and "agar setiap candle bisa terlihat" would be
 * impossible. The grid is solved over what is SHOWN, so dropping bars is what
 * widens the rest. A level read off a hidden bar needs its PRICE, not its slot,
 * so nothing is lost by them having no place on this axis.
 */
const HIDDEN = 30;
const SHOWN = SS03.slice(HIDDEN);

/**
 * ═══ WHERE THE CHART SITS INSIDE ITS WINDOW ═══
 *
 * ⚠ FLUSH LEFT, AND NARROWER THAN THE WINDOW — Simon: "geser chartnya mentok
 * kiri", with white space kept on the right. `gridOf` insets the first bar by
 * GRID_PAD_X on its own, so a plot that starts exactly on the window's left
 * edge still has air in front of the tape rather than a candle cut by the card.
 *
 * ⚠ FLUSH LEFT, AND STILL NARROWER THAN THE WINDOW. Simon wants the chart
 * stretched wide enough that every candle reads, and he wants white space at
 * the right; a grid spreads its bars across whatever width it is given, so
 * those two are traded against each other in this one number. At 0.84 the tape
 * is 702px of an 836px window: an 8.2px slot and a 5.6px body, against the
 * 4.4px it was before the second fifteen went — and 134px still free at the
 * right.
 *
 * ⚠ AND THE HEIGHT IS LOCKED — Simon: "lock size height chart (2 2nya)". Both
 * of the numbers that set it are held below and asserted, so the width can be
 * tuned again without the chart quietly changing shape underneath it.
 */
const PLOT_W = 0.84;
const PAD_Y = 22;
const plotOf = (r: typeof LEFT) => ({
  x: r.x,
  y: r.y + PAD_Y,
  w: r.w * PLOT_W,
  h: r.h - PAD_Y * 2,
});

/**
 * ⚠ THE DOMAIN COVERS THE WICKS, NOT THE CLOSES. `gridOf` is handed the highs
 * and lows as well, because a domain solved from closes alone clips the two
 * extremes of a traced tape — and this tape's extremes are most of its shape.
 */
const DOMAIN: [number, number] = [
  Math.min(...SHOWN.map((b) => b.l)),
  Math.max(...SHOWN.map((b) => b.h)),
];
const gridFor = (r: typeof LEFT) =>
  gridOf(SHOWN.map((b) => b.c), DOMAIN, plotOf(r), 0);

const GRID_L = gridFor(LEFT);
const GRID_R = gridFor(RIGHT);

export const TwinWindows = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const g = f + V.at;
  const t = progressInOut(g, V.at, V.over);
  if (t <= 0.001) return null;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0, background: c.bg }} />
      {([[LEFT, GRID_L], [RIGHT, GRID_R]] as const).map(([rect, grid], i) => (
        <Card key={i} rect={rect} opacity={t}>
          <Candles bars={SHOWN} grid={grid} />
        </Card>
      ))}
    </div>
  );
};

/** Kept honest. */
{
  const fail = (m: string) => {
    throw new Error(`022-ta-mistakes/TwinWindows: ${m}`);
  };
  /** The two windows have to be the same size, or "the same chart" is drawn at
   *  two different scales and the claim quietly stops being true. */
  if (LEFT.w !== RIGHT.w || LEFT.h !== RIGHT.h) {
    fail(`the windows are ${LEFT.w}x${LEFT.h} and ${RIGHT.w}x${RIGHT.h}`);
  }
  /** The tape has to stay inside them. */
  const top = GRID_L.y(DOMAIN[1]);
  const bot = GRID_L.y(DOMAIN[0]);
  if (top < LEFT.y || bot > LEFT.y + LEFT.h) {
    fail(`the tape runs ${top.toFixed(0)}..${bot.toFixed(0)}, outside a window at ${LEFT.y}..${LEFT.y + LEFT.h}`);
  }
  /** ⚠ AND THE WHITE SPACE ON THE RIGHT HAS TO ACTUALLY BE THERE. It is the
   *  thing Simon asked for first, and it is the one part of this that a later
   *  change to PLOT_W could take away without anything looking broken. */
  const lastBar = GRID_L.x(SHOWN.length - 1) + candleWidth(GRID_L) / 2;
  const free = LEFT.x + LEFT.w - lastBar;
  /**
   * ⚠ THE FLOOR IS MINE, NOT SIMON'S, and it is a floor rather than a spec. He
   * asked for white space at the right and did not say how much; this exists so
   * that a later tweak to PLOT_W cannot take it away without the build noticing.
   * It started at a fifth and came down to a seventh when he asked for the
   * chart to be stretched wider — which is the trade, stated once here instead
   * of being argued each time the width moves.
   */
  if (free < LEFT.w * 0.15) {
    fail(`only ${free.toFixed(0)}px of the window is free to the right of the tape`);
  }
  /** And nothing may reach the card's own right edge. */
  if (lastBar > LEFT.x + LEFT.w) fail("the tape runs past the window's right edge");
  /**
   * ⚠ THE HEIGHT IS LOCKED, SO IT IS WRITTEN DOWN — Simon: "lock size height
   * chart (2 2nya)". Both windows and both plots, stated as the numbers that
   * were on screen when he locked them. A lock nobody can read is a convention;
   * this one fails the build.
   */
  const LOCKED = { window: 536, plot: 492 };
  if (LEFT.h !== LOCKED.window) {
    fail(`the window is ${LEFT.h}px tall, and its height is locked at ${LOCKED.window}`);
  }
  if (plotOf(LEFT).h !== LOCKED.plot) {
    fail(`the plot is ${plotOf(LEFT).h}px tall, and its height is locked at ${LOCKED.plot}`);
  }
  /** ⚠ AND THE HIDDEN BARS ARE STILL REACHABLE. They are the reference for a
   *  resistance level Simon has not drawn yet; sliced out of the series rather
   *  than out of this window, they would be gone. */
  if (SS03.length !== SHOWN.length + HIDDEN) {
    fail("the hidden bars have left the series, so nothing can be measured off them");
  }
}
