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
import { Candles, Card, gridOf, progressInOut, theme, usePalette } from "../../../core";
import { halves } from "../data/layout";
import { TWIN } from "../data/timing";
import { SS03 } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = TWIN;
// ═══════════════════════════════════════════════════════════════════════════

const [LEFT, RIGHT] = halves();

/** ⚠ THE PLOT IS INSET FROM THE WINDOW, so a wick at the top of the tape has
 *  paper above it rather than the card's own edge. */
const PAD = 40;
const plotOf = (r: typeof LEFT) => ({
  x: r.x + PAD,
  y: r.y + PAD,
  w: r.w - PAD * 2,
  h: r.h - PAD * 2,
});

/**
 * ⚠ THE DOMAIN COVERS THE WICKS, NOT THE CLOSES. `gridOf` is handed the highs
 * and lows as well, because a domain solved from closes alone clips the two
 * extremes of a traced tape — and this tape's extremes are most of its shape.
 */
const DOMAIN: [number, number] = [
  Math.min(...SS03.map((b) => b.l)),
  Math.max(...SS03.map((b) => b.h)),
];
const gridFor = (r: typeof LEFT) =>
  gridOf(SS03.map((b) => b.c), DOMAIN, plotOf(r), 0);

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
          <Candles bars={SS03} grid={grid} />
        </Card>
      ))}
    </div>
  );
};

/** Kept honest: the two windows have to be the same size, or "the same chart"
 *  is drawn at two different scales and the claim quietly stops being true. */
{
  const fail = (m: string) => {
    throw new Error(`022-ta-mistakes/TwinWindows: ${m}`);
  };
  if (LEFT.w !== RIGHT.w || LEFT.h !== RIGHT.h) {
    fail(`the windows are ${LEFT.w}x${LEFT.h} and ${RIGHT.w}x${RIGHT.h}`);
  }
  /** And the tape has to fit inside them. */
  const top = GRID_L.y(DOMAIN[1]);
  const bot = GRID_L.y(DOMAIN[0]);
  if (top < LEFT.y || bot > LEFT.y + LEFT.h) {
    fail(`the tape runs ${top.toFixed(0)}..${bot.toFixed(0)}, outside a window at ${LEFT.y}..${LEFT.y + LEFT.h}`);
  }
  if (V.at < 0 || V.at + V.over > theme.canvas.width * 100) fail("unreachable");
}
