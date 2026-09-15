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
import { Candles, Card, Layer, candleWidth, gridOf, progressInOut, theme, usePalette } from "../../../core";
import { halves } from "../data/layout";
import { TWIN } from "../data/timing";
import { SS03, TA_ARROWS, TA_LINES } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = TWIN;
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ═══ THE TWO WINDOWS ═══
 *
 * ⚠ THE BOTTOM EDGE IS THE ANCHOR — Simon: "anchor bawah". Height is taken off
 * the TOP, so the pair keeps its footing on the frame while it shrinks and
 * nothing below it has to move. Written as a bottom and a height rather than a
 * top and a height, because the anchor is the thing that must not drift: a top
 * plus a height re-centres itself every time the height changes, which is the
 * one thing "anchor bawah" rules out.
 *
 * ⚠ THE BOTTOM IS WHERE THE FIRST SHRINK LEFT IT. Simon's earlier "diturunkan
 * 150 px" came off both ends, so the pair sat centred at 265..801; that 801 is
 * now the fixed edge, derived from the same 150 rather than typed, so the two
 * instructions cannot come apart.
 */
const DROP_H = 150;
const [L0, R0] = halves();
const BOTTOM = L0.y + L0.h - DROP_H / 2;
/** ⚠ THE WINDOW'S OWN HEIGHT IS THE ONE SIMON LOCKED, and it has not moved. It
 *  briefly did — I read "shrink heightnya" as the window and he corrected it:
 *  "maksudnya shrink chartnya saja, tidak termasuk background putih/windownya".
 *  The shrink lives in the plot below instead. */
const WIN_H = 536;
const shorter = (r: typeof L0) => ({ ...r, y: BOTTOM - WIN_H, h: WIN_H });
const LEFT = shorter(L0);
const RIGHT = shorter(R0);

/**
 * ⚠ FORTY-FIVE BARS ARE HIDDEN, NOT DELETED — Simon, and he said why: "nanti aku
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
/** ⚠ RAISED THREE TIMES, FIFTEEN AT A TIME, EACH TIME TO THE SAME COMPLAINT:
 *  "masih terlalu cluttered". This is the only number that moves for it — the
 *  plot's width and height are both fixed, so hiding bars is what widens the
 *  ones that are left. */
const HIDDEN = 45;
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
 * is 702px of an 836px window, and what that slot is worth per bar depends on
 * how many are shown: 66 bars make it a 10.1px slot and a 6.9px body, against
 * the 4.4px it was when 96 were drawn — with ~148px still free at the right.
 *
 * ⚠ THE WIDTH HAS NOT MOVED SINCE, and should not have to. Clutter is now fixed
 * by hiding bars, which widens the rest without touching either edge of the
 * plot; widening the plot instead would eat the white space Simon asked for
 * first.
 *
 * ⚠ AND THE CHART SHRINKS INSIDE A WINDOW THAT DOES NOT — Simon's correction.
 * The plot is given an explicit height rather than an inset top and bottom, so
 * "shrink the chart" is one number and the white card it sits in is untouched
 * by it. What the shrink leaves behind is headroom at the top of the window.
 *
 * ⚠ AND THE BOTTOM INSET IS THE ANCHOR — "anchor bawah", now applied where he
 * meant it. The plot's foot is a fixed distance up from the window's floor and
 * the height is taken off the top; expressed as a top inset plus a height it
 * would re-centre itself every time either moved.
 */
const PLOT_W = 0.84;
const PAD_BOTTOM = 22;
const PLOT_H = 392;
const plotOf = (r: typeof LEFT) => ({
  x: r.x,
  y: r.y + r.h - PAD_BOTTOM - PLOT_H,
  w: r.w * PLOT_W,
  h: PLOT_H,
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

/**
 * ═══ WHAT SOMEBODY DREW ON THE CHART ═══  Simon: ss05 on the left, ss04 on the
 * right — "contoh gambar technical analysis by a human".
 *
 * ⚠ THE SAME FOUR LINES IN BOTH WINDOWS, AND THAT IS THE SCENE. Two people were
 * given one chart, drew the same trendlines on it, and arrived at opposite
 * conclusions. If the lines differed the picture would be about two analyses;
 * identical, it is about two readings — which is what confirmation bias is.
 *
 * ⚠ A RULE EXTENSION, ON THE RECORD. A dashed arrow projecting price out of the
 * last bar is, on its own, indistinguishable from a signal. It is drawn here
 * because the scene shows TWO of them pointing opposite ways from the same bar,
 * which is an argument that neither is worth anything — a portrait of the
 * mistake, in the same class as the "Buy" badges at 4356 and the position tool.
 * The video never draws one of these alone.
 *
 * ⚠ AND THE ARROWS ARE RE-SCALED, NOT REPRODUCED. Simon's screenshots frame the
 * whole tape; these windows show its last 66 bars, so the same arrow in level
 * units is far taller than the room here — ss05's would finish 220px above the
 * card. What is preserved is what he pointed at: the direction and the slope.
 * Both get the same vertical reach, so the only difference the eye can find
 * between the two windows is which way they go.
 *
 * ⚠ THE REACH IS SET BY THE ARROW WITH LESS ROOM. The two do not start from the
 * same price — the up arrow was drawn from the wedge's apex and the down one
 * from a little below it — so the rising one runs out of card first, and 150
 * is what leaves it air at the top. The falling one could go further and
 * deliberately does not: an arrow that is longer because it happened to have
 * space would read as the more confident of the two.
 */
const REACH_PX = 150;

/** Global bar index → the grid's own index, since the grid covers only what is
 *  shown. Linear, so the hidden bars to the left still have a place. */
const ix = (bar: number) => bar - HIDDEN;

const arrowOf = (grid: typeof GRID_L, k: { a: number[]; b: number[] }) => {
  const x0 = grid.x(ix(k.a[0]));
  const y0 = grid.y(k.a[1]);
  const dx = grid.x(ix(k.b[0])) - x0;
  const dy = grid.y(k.b[1]) - y0;
  /** ⚠ SCALED BY ITS RISE, NOT ITS LENGTH. Equal lengths on two different
   *  slopes would put the steeper arrow's tip nearer the card's edge; equal
   *  rises put both tips the same distance from it. */
  const k2 = REACH_PX / Math.abs(dy);
  return { x0, y0, x1: x0 + dx * k2, y1: y0 + dy * k2 };
};

/** ⚠ THE HEAD IS BUILT FROM THE ARROW'S OWN DIRECTION, so it can never end up
 *  pointing somewhere the line does not. */
const headOf = (a: ReturnType<typeof arrowOf>, len = 26, spread = 0.42) => {
  const th = Math.atan2(a.y1 - a.y0, a.x1 - a.x0);
  return [th - Math.PI + spread, th - Math.PI - spread].map((t) => ({
    x: a.x1 + Math.cos(t) * len,
    y: a.y1 + Math.sin(t) * len,
  }));
};

export const TwinWindows = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const g = f + V.at;
  const t = progressInOut(g, V.at, V.over);
  if (t <= 0.001) return null;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0, background: c.bg }} />
      {(
        [
          [LEFT, GRID_L, TA_ARROWS.up],
          [RIGHT, GRID_R, TA_ARROWS.down],
        ] as const
      ).map(([rect, grid, arrow], i) => {
        const a = arrowOf(grid, arrow);
        return (
          <Card key={i} rect={rect} opacity={t}>
            <Candles bars={SHOWN} grid={grid} />
            {/* ⚠ CLIPPED TO THE WINDOW, not to the plot. Three of the four
                lines start back in the hidden bars, so they have to be allowed
                to run off the left edge and be cut by the card — which is what
                a trendline drawn on a longer chart looks like from here. */}
            <Layer opacity={t} clip={rect}>
              {TA_LINES.map((l, k) => (
                <line
                  key={k}
                  x1={grid.x(ix(l.a[0]))}
                  y1={grid.y(l.a[1])}
                  x2={grid.x(ix(l.b[0]))}
                  y2={grid.y(l.b[1])}
                  stroke={c.indigo}
                  strokeWidth={theme.shape.rule}
                />
              ))}
              <line
                x1={a.x0}
                y1={a.y0}
                x2={a.x1}
                y2={a.y1}
                stroke={c.ink}
                strokeWidth={theme.shape.line}
                strokeDasharray="14 10"
              />
              {headOf(a).map((h, k) => (
                <line
                  key={k}
                  x1={a.x1}
                  y1={a.y1}
                  x2={h.x}
                  y2={h.y}
                  stroke={c.ink}
                  strokeWidth={theme.shape.line}
                />
              ))}
            </Layer>
          </Card>
        );
      })}
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
  const LOCKED = { window: 536, plot: PLOT_H };
  if (LEFT.h !== LOCKED.window) {
    fail(`the window is ${LEFT.h}px tall, and its height is locked at ${LOCKED.window}`);
  }
  if (plotOf(LEFT).h !== LOCKED.plot) {
    fail(`the plot is ${plotOf(LEFT).h}px tall, and its height is locked at ${LOCKED.plot}`);
  }
  /** ⚠ AND THE FEET HAVE NOT MOVED — either of them. The window's bottom is
   *  where the first shrink left it, and the chart's bottom is a fixed inset up
   *  from that. A shrink that came off the wrong end would pass every other
   *  check in this file. */
  if (LEFT.y + LEFT.h !== BOTTOM) {
    fail(`the windows end at ${LEFT.y + LEFT.h}, not on the anchored bottom at ${BOTTOM}`);
  }
  const foot = plotOf(LEFT).y + plotOf(LEFT).h;
  if (foot !== BOTTOM - PAD_BOTTOM) {
    fail(`the chart's foot is at ${foot}, not ${PAD_BOTTOM}px up from the window's floor`);
  }
  /** ⚠ AND THE HIDDEN BARS ARE STILL REACHABLE. They are the reference for a
   *  resistance level Simon has not drawn yet; sliced out of the series rather
   *  than out of this window, they would be gone. */
  if (SS03.length !== SHOWN.length + HIDDEN) {
    fail("the hidden bars have left the series, so nothing can be measured off them");
  }
}
