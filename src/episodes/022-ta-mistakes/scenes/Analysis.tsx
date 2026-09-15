/**
 * scenes/Analysis.tsx — every line somebody drew on the SC08 charts, in one
 * place, meant to be edited by hand.
 *
 * ═══ HOW TO READ AND CHANGE A LINE ══════════════════════════════════════
 *
 * A line is two points, and a point is `[x, y]` in PIXELS from the top-left
 * corner of its own white window. The window is 836 wide and 536 tall.
 *
 *     [0, 0] ────────────── x ──────────────▶ [836, 0]
 *        │                                        top-right
 *        y      the chart lives here
 *        │
 *        ▼
 *     [0, 536]                                 [836, 536]
 *
 *   x    0 is the window's left edge, 836 its right edge. NEGATIVE is fine and
 *        is used on purpose: three of the four lines start off the left edge,
 *        which is how a trendline drawn on a longer chart looks from here. The
 *        candles run from x≈110 to x≈783; past that is the white space.
 *
 *   y    0 is the window's TOP and 536 its bottom — y goes DOWN, like every
 *        screen coordinate. The chart's own top is y≈122 and its floor is
 *        y≈514. A value outside 0..536 is cut by the card.
 *
 * So: to move a line DOWN, make both y bigger. To turn it, change one y. To
 * slide it sideways, change both x. Both windows use the same coordinates, so a
 * number here means the same place in either one.
 *
 * ⚠ THESE ARE PIXELS, SO THEY DO NOT FOLLOW THE CHART. Before this they were
 * bar-and-price anchors that moved with the candles; in pixels a line stays put
 * if the chart is ever re-sized or re-scaled. That is the trade for being
 * directly editable, and it is fine while the window's height is locked — just
 * know that these numbers would all need redoing if it stopped being.
 *
 * ⚠ THEY CAME OUT OF A TRACE AND ARE NOW HAND-HELD. They started as
 * scripts/trace-ss0405.mjs reading ss04 and ss05; re-running that script
 * rewrites data/ss0405.json but NOT this file, so anything edited here stays
 * edited. That is the point of the file existing.
 *
 * ⚠ AND BOTH WINDOWS STARTED IDENTICAL, WHICH WAS THE SCENE. The two
 * screenshots trace to the same four lines, and the only thing that differed
 * was the arrow — one chart, two readings. Editing LEFT away from RIGHT changes
 * that claim from "the same lines read two ways" to "two different analyses".
 * Both are worth saying; they are not the same thing, and the difference is now
 * a choice made here.
 */
import { Layer, theme, usePalette } from "../../../core";

export type Seg = { readonly a: readonly [number, number]; readonly b: readonly [number, number] };

// ═══ EDIT · LEFT WINDOW (ss05 — the one that concludes UP) ═══════════════
export const LEFT_LINES: readonly Seg[] = [
  /** The flat blue line along the bottom. */
  { a: [-408.39, 526.83], b: [739.59, 526.83] },
  /** The descending trendline down from the high off the left edge. */
  { a: [-339.72, -238.14], b: [426.87, 113.86] },
  /** The shallow rising line through the middle of the range. */
  { a: [39.52, 185.72], b: [628.48, 90.61] },
  /** The steeper rising support under the recovery. */
  { a: [-1.37, 475.64], b: [546.48, 242.89] },
];
/** ⚠ THE CONCLUSION. Its LENGTH is not used — see `REACH_PX` in TwinWindows,
 *  which gives both windows' arrows the same reach so neither reads as the more
 *  confident. What these two points set is where it starts and which way it
 *  goes. */
export const LEFT_ARROW: Seg = { a: [605.04, 183.38], b: [718.06, -222.38] };

// ═══ EDIT · RIGHT WINDOW (ss04 — the one that concludes DOWN) ════════════
export const RIGHT_LINES: readonly Seg[] = LEFT_LINES;
export const RIGHT_ARROW: Seg = { a: [604.29, 216.76], b: [717.04, 518.8] };
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ⚠ THE DRAWING IS SHARED, SO THE TWO WINDOWS CANNOT DIVERGE BY ACCIDENT. Only
 * the numbers above can make them differ, and only on purpose.
 */
export const Analysis = ({
  rect,
  lines,
  arrow,
  reach,
  opacity = 1,
}: {
  /** The window these coordinates are measured from. */
  rect: { x: number; y: number; w: number; h: number };
  lines: readonly Seg[];
  arrow: Seg;
  /** Pixels of rise or fall the arrow is given, whatever its drawn length. */
  reach: number;
  opacity?: number;
}) => {
  const c = usePalette();
  const px = (p: readonly [number, number]) => ({ x: rect.x + p[0], y: rect.y + p[1] });

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
    <Layer opacity={opacity} clip={rect}>
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
 *  say — and an edit above is exactly how that could stop being true.
 *
 *  ⚠ Y GOES DOWN, so an arrow that points UP has the SMALLER y at its tip. This
 *  check caught the coordinate change itself: written for the bar-and-price
 *  anchors it had the sign the other way round, and the first render after the
 *  switch failed on it rather than quietly drawing both arrows the same way. */
{
  const fall = (k: Seg) => k.b[1] - k.a[1];
  if (fall(LEFT_ARROW) >= 0 || fall(RIGHT_ARROW) <= 0) {
    throw new Error(
      "022-ta-mistakes/Analysis: the left arrow must point up and the right one down",
    );
  }
}
