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
 * ⚠ THE FIRST FIFTEEN BARS ARE GONE — Simon: "hapus 15 candlestick paling kiri
 * setiap window". Sliced at the front rather than masked, because a bar that is
 * hidden is still in the grid: it would keep its slot, the remaining bars would
 * stay exactly as thin as they are now, and the clutter this is meant to fix
 * would be untouched.
 */
const SHOWN = SS03.slice(15);

/**
 * ═══ WHERE THE CHART SITS INSIDE ITS WINDOW ═══
 *
 * ⚠ FLUSH LEFT, AND NARROWER THAN THE WINDOW — Simon: "geser chartnya mentok
 * kiri", with white space kept on the right. `gridOf` insets the first bar by
 * GRID_PAD_X on its own, so a plot that starts exactly on the window's left
 * edge still has air in front of the tape rather than a candle cut by the card.
 *
 * ⚠ THE TWO ASKS PULL AGAINST EACH OTHER, AND THIS IS WHERE THEY MEET. A grid
 * spreads its bars across whatever width it is given, so white space on the
 * right can only come from a NARROWER plot — and a narrower plot means a
 * tighter bar pitch, which is the clutter Simon wants less of. The width below
 * is the one that buys the most right-hand space while keeping the bars no
 * thinner than they were before the 15 were dropped: 96 bars across 624px of
 * inner is a 6.5px slot, the same the full 111 had across the full window.
 * Fewer bars at the same width is what "less cluttered" means here; going wider
 * would stretch them further but there would be almost no white space left.
 *
 * ⚠ SO THE STRETCH THAT IS LEFT IS VERTICAL, and it is real: the inset is cut
 * right down, so the same price range covers more of a shorter window than it
 * covered of a taller one.
 */
const PLOT_W = 0.79;
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
  if (free < LEFT.w * 0.2) {
    fail(`only ${free.toFixed(0)}px of the window is free to the right of the tape`);
  }
  /** And nothing may reach the card's own right edge. */
  if (lastBar > LEFT.x + LEFT.w) fail("the tape runs past the window's right edge");
}
