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

export type Seg = {
  readonly a: readonly [number, number];
  readonly b: readonly [number, number];
  /** ⚠ HIDDEN, NOT DELETED — Simon's word, and the same rule the hidden candles
   *  follow: a line kept here stays editable and can come back by removing one
   *  flag. Deleting it would mean re-tracing the screenshot to get it again. */
  readonly hidden?: true;
};

// ═══ EDIT · LEFT WINDOW (ss05 — the one that concludes UP) ═══════════════
export const LEFT_LINES: readonly Seg[] = [
  /** The flat blue line along the bottom. ⚠ HIDDEN — Simon. */
  { a: [-408.39, 526.83], b: [739.59, 526.83], hidden: true },
  /** The descending trendline down from the high off the left edge.
   *  ⚠ HIDDEN — Simon. */
  { a: [-339.72, -238.14], b: [426.87, 113.86], hidden: true },
  /** The shallow rising line through the middle of the range. */
  { a: [39.52, 185.72], b: [628.48, 90.61] },
  /** The steeper rising support under the recovery. */
  { a: [140, 515], b: [680, 185] },
];
/**
 * ⚠ THE CONCLUSION. `a` is where it starts and `b` IS THE TIP — it sets the
 * direction AND the length, both. Keep `b` inside 0..836 by 0..536 or the head
 * is cut off by the card.
 *
 * ⚠ IT USED TO BE DIRECTION ONLY. Both arrows were given one fixed reach so
 * neither could read as the more confident of the two; Simon moved `b` to make
 * one longer and nothing happened, so the normalising is gone and the two
 * lengths are now his to set. Worth knowing what that costs: a longer arrow
 * looks like a stronger claim, and the scene's point is that neither claim is
 * worth anything.
 */
export const LEFT_ARROW: Seg = { a: [620, 200], b: [775, 45] };

// ═══ EDIT · RIGHT WINDOW (ss04 — the one that concludes DOWN) ════════════
/** ⚠ THE SAME ARRAY, NOT A COPY OF IT — Simon: "copy garis-garis bantu analisa
 *  ini ke window kanan. Kecuali panah garis putus putus". Pointing at it rather
 *  than duplicating the four lines is what makes "the same" true rather than
 *  maintained: hide a line on the left and it is hidden on the right too. Give
 *  the right window its own list here the day they are meant to differ. */
export const RIGHT_LINES: readonly Seg[] = LEFT_LINES;
/** ⚠ AND THE ARROW IS THE ONE THING THAT DOES NOT COME ACROSS. It has its own
 *  file, scenes/ArrowRight.tsx, because it is the only thing in the right
 *  window that says something different — and because Simon asked for it. */
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ⚠ THE DRAWING IS SHARED, SO THE TWO WINDOWS CANNOT DIVERGE BY ACCIDENT. Only
 * the numbers above can make them differ, and only on purpose.
 */
/**
 * ⚠ A POLYLINE CUT AT A FRACTION OF ITS OWN LENGTH. Walk the legs adding up
 * distance, keep whole legs until the budget runs out, then land part-way along
 * the one that spends it. Cutting at a vertex instead would make the line
 * arrive in jumps of very different sizes, since the legs are not equal.
 */
const partial = (pts: { x: number; y: number }[], k: number) => {
  if (k >= 0.999) return pts;
  const seg = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y));
  const want = seg.reduce((a, b) => a + b, 0) * k;
  const out = [pts[0]];
  let run = 0;
  for (let i = 0; i < seg.length; i++) {
    if (run + seg[i] >= want) {
      const f = seg[i] === 0 ? 0 : (want - run) / seg[i];
      out.push({
        x: pts[i].x + (pts[i + 1].x - pts[i].x) * f,
        y: pts[i].y + (pts[i + 1].y - pts[i].y) * f,
      });
      break;
    }
    run += seg[i];
    out.push(pts[i + 1]);
  }
  return out;
};

export const Analysis = ({
  rect,
  lines,
  arrow,
  zig,
  show,
  opacity = 1,
}: {
  /** The window these coordinates are measured from. */
  rect: { x: number; y: number; w: number; h: number };
  lines: readonly Seg[];
  arrow: Seg;
  /** The swing line, in the same window pixels — see TwinWindows, which reads
   *  it off the candles. Its last point is joined to the arrow's start. */
  zig: readonly (readonly [number, number])[];
  /**
   * How much of each thing is drawn, 0 to 1. ⚠ THESE ARE LENGTHS, NOT
   * OPACITIES: a trendline that fades up arrives everywhere at once, which is
   * not how anybody draws one. Each of these truncates the thing it names, so
   * it grows from the end a pen would have started at.
   */
  show: { lines: readonly number[]; zig: number; arrow: number };
  opacity?: number;
}) => {
  const c = usePalette();
  const px = (p: readonly [number, number]) => ({ x: rect.x + p[0], y: rect.y + p[1] });

  const a0 = px(arrow.a);
  const tip = px(arrow.b);
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
        if (l.hidden) return null;
        const k = show.lines[i] ?? 1;
        if (k <= 0.001) return null;
        const p = px(l.a);
        const e = px(l.b);
        /** ⚠ GROWN FROM `a`, the end a pen starts at. */
        const q = { x: p.x + (e.x - p.x) * k, y: p.y + (e.y - p.y) * k };
        return (
          <line
            key={i}
            x1={p.x}
            y1={p.y}
            x2={q.x}
            y2={q.y}
            stroke={c.indigo}
            /** ⚠ SIMON'S 3px, and it is `theme.shape.line` rather than a typed
             *  3 — the theme already calls that weight `line`, and a number
             *  here would be the same value with nothing tying it to the rest
             *  of the video. */
            strokeWidth={theme.shape.line}
          />
        );
      })}
      {/* ═══ THE SWING LINE ═══  Simon: same style as the arrow, and running
          into the point the arrow starts from. It is drawn as ONE polyline with
          the arrow's start appended, so the join cannot open up: a separate
          connecting segment would be a second object that has to be kept
          touching this one.

          ⚠ AND IT IS REVEALED BY LENGTH ALONG ITSELF, not per vertex. Cut at a
          vertex the line would arrive in six jumps of very different sizes,
          because the legs are not the same length; cut by distance it moves at
          one speed, which is what a hand does. */}
      {show.zig > 0.001 ? (
        <polyline
          points={partial(
            [...zig, arrow.a].map((p) => px(p)),
            show.zig,
          )
            .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
            .join(" ")}
          fill="none"
          stroke={c.ink}
          strokeWidth={theme.shape.line}
          strokeDasharray="14 10"
        />
      ) : null}

      {show.arrow > 0.001 ? (
        <line
          x1={a0.x}
          y1={a0.y}
          x2={a0.x + (tip.x - a0.x) * show.arrow}
          y2={a0.y + (tip.y - a0.y) * show.arrow}
          stroke={c.ink}
          strokeWidth={theme.shape.line}
          strokeDasharray="14 10"
        />
      ) : null}

      {/* ⚠ THE HEAD LANDS WITH THE TIP, not before it. A head waiting at the
          end of a line that has not arrived is a destination, and the whole
          point of a projection is that it is still being drawn. */}
      {show.arrow > 0.999 &&
        head.map((h, i) => (
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

/** Kept honest.
 *
 *  ⚠ Y GOES DOWN, so an arrow that points UP has the SMALLER y at its tip. This
 *  check caught the coordinate change itself: written for the bar-and-price
 *  anchors it had the sign the other way round, and the first render after the
 *  switch failed on it rather than quietly drawing both arrows the same way.
 *  The right window's arrow is checked in its own file now. */
{
  if (LEFT_ARROW.b[1] >= LEFT_ARROW.a[1]) {
    throw new Error("022-ta-mistakes/Analysis: the left window's arrow must point UP");
  }
  /** And at least one line has to survive being hidden. */
  if (LEFT_LINES.every((l) => l.hidden)) {
    throw new Error("022-ta-mistakes/Analysis: every analysis line is hidden");
  }
}
