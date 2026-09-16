/**
 * SC11 · TWO WINDOWS, THE SAME PATTERN.  `from 9320 · to 10185`
 *
 * ⚠ THE BULLISH FLAG FROM SIMON'S REFERENCE SHEET — "cuplikat gambar itu di 2
 * window", the Flag cell under Bullish Patterns in chart pattern.webp. Sixteen
 * bars traced off that drawing, and the two converging lines that make it a
 * flag rather than a run of candles.
 *
 * ⚠ ONE SET OF BARS, DRAWN TWICE — not two that match. FLAG_BARS is read by
 * both windows, so "the same pattern in both" is true by construction rather
 * than by maintenance. If the two are ever meant to diverge, that divergence
 * has to be written down as a difference; it can never happen by accident.
 * Same rule SC08's two windows are built on.
 *
 * ⚠ AND ONE GRID SHAPE, NOT ONE GRID. Each window solves its own grid inside
 * its own box — the boxes are the same size, so the two come out identical —
 * rather than sharing a grid that would draw both patterns in the left-hand
 * window's pixels.
 *
 * ⚠ NO "Entry" AND NO ARROW. The reference labels an entry on the breakout and
 * draws an arrow down to it. Both are directional markers, scripts/audit.mjs is
 * right to refuse them, and they are the one part of that cell that cannot come
 * across. The pattern is the drawing; the instruction is not.
 *
 * ⚠ NO PRICE SCALE, NO GRIDLINES, NO TIME AXIS. core/Chart is here for its
 * left-to-right build — the animation Simon kept — and everything it would
 * otherwise draw is turned off. A pattern diagram with a price scale is a
 * chart of something, and this is a chart of nothing in particular.
 *
 * ⚠ THE LINES DRAW, THEY DO NOT FADE. They are a reading OF the candles, so
 * they arrive after them and they arrive by being drawn from the triangle's
 * mouth to its apex — which is where the bars put it. See FLAG_LINES.
 */
import { useCurrentFrame } from "remotion";
import {
  Card, Chart, Layer, Line, Stage,
  domainOf, drawPath, fadeOut, gridOf, progress, theme, useMotion, usePalette,
} from "../../../core";
import { WINDOW11, local } from "../data/timing";
import { WIN11 } from "../data/layout";
import { FLAG, FLAG_BARS, FLAG_LINES } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = WINDOW11;
const W = WIN11;
const F = FLAG_LINES;
// ═══════════════════════════════════════════════════════════════════════════

const NAME = "Flag";
const DOMAIN = domainOf(FLAG.closes, FLAG_BARS);

/** ⚠ SOLVED ONCE, AT MODULE LOAD. Two grids, one per window — same size boxes,
 *  so the two drawings are identical without sharing a coordinate space. */
const GRIDS = W.plots.map((box) => gridOf(FLAG.closes, DOMAIN, box, 0.08));

export const ChartWindow = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  const open = progress(f, local(V.card, V.at), m.fade);
  const drawn = progress(f, local(V.lines, V.at), m.sec(0.5));
  const out = fadeOut(f, local(V.out, V.at), m.fade);

  return (
    <Stage>
      <div style={{ opacity: out }}>
        {W.cards.map((rect, i) => (
          <Card key={`win${i}`} rect={rect} opacity={open} soft />
        ))}

        {GRIDS.map((g, i) => (
          <Chart
            key={`bars${i}`}
            series={FLAG}
            grid={g}
            at={local(V.candles, V.at)}
            over={m.sec(0.83)}
            ticks={[]}
            tickLabels={false}
            baseline={false}
          />
        ))}

        {/* ⚠ MOUNTED ON THEIR OWN FRAME. An animated path that exists before
            its beat is a path that flashes its end state on frame zero. */}
        {f >= local(V.lines, V.at) &&
          GRIDS.map((g, i) => {
            /** The triangle's mouth and its apex, in this window's pixels. */
            const ends = [
              { a: { i: F.from, p: F.upAt(F.from) }, b: F.apex },
              { a: { i: F.from, p: F.loAt(F.from) }, b: F.apex },
            ];
            return (
              <Layer key={`lines${i}`}>
                {ends.map((e, k) => {
                  const x1 = g.x(e.a.i);
                  const y1 = g.y(e.a.p);
                  const x2 = g.x(e.b.i);
                  const y2 = g.y(e.b.p);
                  return (
                    <line
                      key={k}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={c.indigo}
                      strokeWidth={theme.shape.line}
                      strokeLinecap="round"
                      {...drawPath(drawn, Math.hypot(x2 - x1, y2 - y1))}
                    />
                  );
                })}
              </Layer>
            );
          })}

        {W.names.map((n, i) => (
          <Line
            key={`name${i}`}
            text={NAME}
            x={n.x}
            y={n.y}
            at={local(V.name, V.at)}
            size={theme.text.chip.size}
            weight={theme.text.chip.weight}
            color={c.slate}
          />
        ))}
      </div>
    </Stage>
  );
};
