/**
 * scenes/Analysis.tsx — every line somebody drew on the SC08 charts, in one
 * place, meant to be edited by hand.
 *
 * ═══ HOW TO READ AND CHANGE A LINE ═══════════════════════════════════════
 *
 * A line is two points, and a point is `[bar, level]`.
 *
 *   bar    Which candle it sits over, counting the whole traced tape from 0.
 *          There are 111. ⚠ ONLY BARS 45 TO 110 ARE ON SCREEN — the first 45
 *          are hidden (see TwinWindows), so bar 45 is at the window's LEFT
 *          EDGE and bar 110 is the last candle. A bar below 45 is off the left
 *          edge and gets cut by the card, which is what the long trendlines do
 *          on purpose. Bars above 110 land in the white space on the right,
 *          which is where the arrow goes. Fractions are fine.
 *
 *   level  How high, in units of the dotted level from Simon's screenshot.
 *          0 is that line, 1 is the distance from it to the top of the original
 *          picture. ⚠ ONLY ABOUT -0.36 TO 0.31 IS ON SCREEN — that is the range
 *          the 66 visible candles cover, and the plot is solved to it. A level
 *          outside that is above or below the chart; it is not an error, but it
 *          will be cut by the card.
 *
 * So: to MOVE a line, change both levels by the same amount. To TURN it, change
 * one of them. To slide it along, change both bars.
 *
 * ⚠ THE NUMBERS ARE AT THE TRACE'S FULL PRECISION, not rounded for looks. Four
 * decimals is no harder to type over than three, and rounding them moved the
 * lines by about a third of a pixel — which is nothing to look at but would
 * have meant this file could not be shown to be the same drawing as the code it
 * replaced. Type whatever you like over them; they are only a starting point.
 *
 * ⚠ THESE NUMBERS CAME OUT OF A TRACE, AND THEY ARE NOW HAND-HELD. They started
 * as scripts/trace-ss0405.mjs reading ss04 and ss05; re-running that script
 * rewrites data/ss0405.json but NOT this file, so anything edited here stays
 * edited. That is the point of the file existing.
 *
 * ⚠ AND BOTH WINDOWS STARTED IDENTICAL, WHICH WAS THE SCENE. The two
 * screenshots trace to the same four lines within a hundredth of a level unit,
 * and the only thing that differed was the arrow — one chart, two readings.
 * Editing LEFT away from RIGHT changes that claim from "the same lines read two
 * ways" to "two different analyses". Both are worth saying; they are not the
 * same thing, and the difference is now a choice made here.
 */
import { Layer, theme, usePalette } from "../../../core";
import type { Grid } from "../../../core";

export type Seg = { readonly a: readonly [number, number]; readonly b: readonly [number, number] };

// ═══ EDIT · LEFT WINDOW (ss05 — the one that concludes UP) ═══════════════
export const LEFT_LINES: readonly Seg[] = [
  /** The flat blue line along the bottom. */
  { a: [3.4, -0.3817], b: [115.4, -0.3817] },
  /** The descending trendline down from the high on the far left. */
  { a: [10.1, 0.9244], b: [84.89, 0.3234] },
  /** The shallow rising line through the middle of the range. */
  { a: [47.1, 0.2007], b: [104.56, 0.3631] },
  /** The steeper rising support under the recovery. */
  { a: [43.11, -0.2943], b: [96.56, 0.1031] },
];
/** ⚠ THE CONCLUSION. Its LENGTH is not used — see `REACH_PX` in TwinWindows,
 *  which gives both windows' arrows the same reach so neither reads as the more
 *  confident. What these two points set is where it starts and which way it
 *  goes. */
export const LEFT_ARROW: Seg = { a: [102.273, 0.2047], b: [113.3, 0.8975] };

// ═══ EDIT · RIGHT WINDOW (ss04 — the one that concludes DOWN) ════════════
export const RIGHT_LINES: readonly Seg[] = LEFT_LINES;
export const RIGHT_ARROW: Seg = { a: [102.2, 0.1477], b: [113.2, -0.368] };
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ⚠ THE DRAWING IS SHARED, SO THE TWO WINDOWS CANNOT DIVERGE BY ACCIDENT. Only
 * the numbers above can make them differ, and only on purpose.
 *
 * ⚠ `first` IS THE GLOBAL INDEX OF THE GRID'S OWN BAR 0. The grid covers the
 * visible bars alone; everything here is written against the whole tape, and
 * this is the one place the two are reconciled. `grid.x` is linear, so a bar
 * before `first` simply lands left of the plot rather than failing.
 */
export const Analysis = ({
  grid,
  first,
  clip,
  lines,
  arrow,
  reach,
  opacity = 1,
}: {
  grid: Grid;
  first: number;
  clip: { x: number; y: number; w: number; h: number };
  lines: readonly Seg[];
  arrow: Seg;
  /** Pixels of rise or fall the arrow is given, whatever its drawn length. */
  reach: number;
  opacity?: number;
}) => {
  const c = usePalette();
  const px = (p: readonly [number, number]) => ({
    x: grid.x(p[0] - first),
    y: grid.y(p[1]),
  });

  const a0 = px(arrow.a);
  const a1 = px(arrow.b);
  /** ⚠ SCALED BY ITS RISE, NOT ITS LENGTH. Equal lengths on two different
   *  slopes would put the steeper arrow's tip nearer the card's edge; equal
   *  rises put both tips the same distance from it. */
  const k = reach / Math.max(1e-6, Math.abs(a1.y - a0.y));
  const tip = { x: a0.x + (a1.x - a0.x) * k, y: a0.y + (a1.y - a0.y) * k };
  /** ⚠ THE HEAD IS BUILT FROM THE ARROW'S OWN DIRECTION, so it can never end up
   *  pointing somewhere the line does not. */
  const th = Math.atan2(tip.y - a0.y, tip.x - a0.x);
  const head = [th - Math.PI + 0.42, th - Math.PI - 0.42].map((t) => ({
    x: tip.x + Math.cos(t) * 26,
    y: tip.y + Math.sin(t) * 26,
  }));

  return (
    <Layer opacity={opacity} clip={clip}>
      {lines.map((l, i) => {
        const p = px(l.a);
        const q = px(l.b);
        return (
          <line
            key={i}
            x1={p.x}
            y1={p.y}
            x2={q.x}
            y2={q.y}
            stroke={c.indigo}
            strokeWidth={theme.shape.rule}
          />
        );
      })}
      <line
        x1={a0.x}
        y1={a0.y}
        x2={tip.x}
        y2={tip.y}
        stroke={c.ink}
        strokeWidth={theme.shape.line}
        strokeDasharray="14 10"
      />
      {head.map((h, i) => (
        <line
          key={i}
          x1={tip.x}
          y1={tip.y}
          x2={h.x}
          y2={h.y}
          stroke={c.ink}
          strokeWidth={theme.shape.line}
        />
      ))}
    </Layer>
  );
};

/** Kept honest: the two arrows have to disagree, or the scene has nothing to
 *  say — and an edit above is exactly how that could stop being true. */
{
  const rise = (k: Seg) => k.b[1] - k.a[1];
  if (rise(LEFT_ARROW) <= 0 || rise(RIGHT_ARROW) >= 0) {
    throw new Error(
      "022-ta-mistakes/Analysis: the left arrow must point up and the right one down",
    );
  }
}
