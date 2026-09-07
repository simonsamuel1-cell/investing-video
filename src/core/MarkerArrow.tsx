/**
 * core/MarkerArrow.tsx — a curved arrow that looks DRAWN, not placed.
 *
 * Simon's reference is a photograph of a red marker stroke on paper: the line
 * wobbles, its edges are ragged, the ink breaks up where the pen ran dry, and
 * the head is two separate strokes. Every one of those is what makes it read as
 * a person pointing at something rather than as another piece of chrome.
 *
 * ⚠ THIS IS AN ANNOTATION, NOT CHART CONTENT. It is the one thing on screen
 * that is allowed to look like it came from outside the video — which is why it
 * is red, and why the red is its own named slot rather than `warn` or
 * `candleRed`. Pointing with the same red the candles are drawn in makes the
 * mark look like data.
 *
 * ═══ HOW THE HAND IS FAKED ═══
 *
 *   · THE WOBBLE is feTurbulence + feDisplacementMap. Nothing about the path is
 *     hand-authored; the filter pushes every edge around by a few pixels and
 *     that alone kills the vector look. `seed` makes it deterministic.
 *   · THE TAPER is two strokes, not one: a thin one over the whole curve and a
 *     thicker one over its last two thirds, so the mark is light where the pen
 *     landed and heavy where it pressed.
 *   · THE DRY INK is a broken white line running along the shaft, slightly off
 *     centre. A marker never lays down a solid block.
 *   · THE HEAD IS TWO STROKES, drawn one after the other and NOT the same
 *     length. Nobody draws a symmetric arrowhead.
 *
 * ⚠ THE SHAFT IS REVEALED BY A SWEEPING CLIP, NOT BY A DASH OFFSET. The shaft
 * is three overlaid paths of different lengths plus a dashed texture line; a
 * dash reveal would need a different offset per path and could not touch the
 * texture at all. One clip travelling along x reveals all of them together,
 * which for a near-horizontal stroke IS what drawing looks like.
 *
 * ⚠ FILTER INSIDE, CLIP OUTSIDE. In SVG the filter runs before the clip, so a
 * displaced edge would otherwise be pushed past the clip and appear ahead of
 * the pen. The group order here is clip → filter → strokes.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "./theme";
import { progress } from "./helpers";

type Pt = { x: number; y: number };

export const MarkerArrow = ({
  from,
  to,
  bow = 0,
  at,
  over,
  headAt,
  headOver,
  color = theme.color.marker,
  width = 16,
  headLen = 88,
  headAngle = 32,
  seed = 7,
  opacity = 1,
}: {
  /** Where the pen lands. */
  from: Pt;
  /** Where it stops — the tip, and the point of the head. */
  to: Pt;
  /** How far the curve bulges off the straight line between them. Sign picks
   *  the side; positive bulges to the left of the direction of travel. */
  bow?: number;
  at: number;
  over: number;
  /** When the head is drawn. Defaults to the frame the shaft finishes. */
  headAt?: number;
  headOver?: number;
  color?: string;
  width?: number;
  headLen?: number;
  headAngle?: number;
  seed?: number;
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  const id = React.useId().replace(/:/g, "");
  if (opacity <= 0.001 || f < at) return null;

  const hAt = headAt ?? at + over;
  const hOver = headOver ?? Math.max(6, Math.round(over * 0.42));

  /** The control point that turns the chord into the drawn curve. A quadratic
   *  only reaches HALF its control offset at the midpoint, so the bow is
   *  doubled here — otherwise every arrow comes out half as curved as asked. */
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.max(1, Math.hypot(dx, dy));
  const ctrl = {
    x: (from.x + to.x) / 2 + (dy / len) * bow * 2,
    y: (from.y + to.y) / 2 - (dx / len) * bow * 2,
  };

  const N = 64;
  const pt = (t: number): Pt => ({
    x: (1 - t) ** 2 * from.x + 2 * (1 - t) * t * ctrl.x + t * t * to.x,
    y: (1 - t) ** 2 * from.y + 2 * (1 - t) * t * ctrl.y + t * t * to.y,
  });
  const path = (t0: number) => {
    const pts: Pt[] = [];
    for (let i = 0; i <= N; i++) {
      const t = t0 + (1 - t0) * (i / N);
      pts.push(pt(t));
    }
    return "M " + pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ");
  };

  const p = progress(f, at, over);
  /** The pen's own x, and the clip edge that follows it. */
  const edge = from.x + (to.x - from.x) * p;
  const PAD = width * 3 + 40;
  const clip = {
    x: Math.min(from.x, edge) - (to.x < from.x ? 0 : PAD),
    w: Math.abs(edge - from.x) + PAD,
  };

  /** The head's two strokes, backwards from the tip along the curve's tangent.
   *  A quadratic's tangent at t=1 is 2(B − C), so the direction of travel is
   *  simply the tip minus the control point. */
  const tdx = to.x - ctrl.x;
  const tdy = to.y - ctrl.y;
  const tl = Math.max(1, Math.hypot(tdx, tdy));
  const back = { x: -tdx / tl, y: -tdy / tl };
  const rot = (v: Pt, deg: number) => {
    const a = (deg * Math.PI) / 180;
    return { x: v.x * Math.cos(a) - v.y * Math.sin(a), y: v.x * Math.sin(a) + v.y * Math.cos(a) };
  };
  /** ⚠ THE TWO BARBS ARE NOT THE SAME LENGTH. A symmetric head is the one
   *  detail that gives a hand-drawn arrow away as a vector. */
  const barbs = [
    { v: rot(back, headAngle), l: headLen, at: hAt },
    { v: rot(back, -headAngle), l: headLen * 0.82, at: hAt + Math.round(hOver * 0.55) },
  ];

  const common = {
    fill: "none" as const,
    stroke: color,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity }}
      width={theme.canvas.width}
      height={theme.canvas.height}
    >
      <defs>
        <filter id={`rough-${id}`} x="-20%" y="-40%" width="140%" height="180%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.038"
            numOctaves={3}
            seed={seed}
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale={width * 0.32}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <clipPath id={`sweep-${id}`}>
          <rect x={clip.x} y={0} width={clip.w} height={theme.canvas.height} />
        </clipPath>
      </defs>

      {/* ── the shaft ──────────────────────────────────────────────────── */}
      <g clipPath={`url(#sweep-${id})`}>
        <g filter={`url(#rough-${id})`}>
          {/* light where the pen landed … */}
          <path d={path(0)} {...common} strokeWidth={width * 0.68} />
          {/* … heavy where it pressed */}
          <path d={path(0.34)} {...common} strokeWidth={width} />
          {/* the ink breaking up */}
          <path
            d={path(0.06)}
            {...common}
            stroke="#FFFFFF"
            strokeWidth={width * 0.22}
            strokeDasharray="17 31 7 46 23 19 9 38"
            opacity={0.38}
            transform={`translate(0 ${(-width * 0.18).toFixed(1)})`}
          />
        </g>
      </g>

      {/* ── the head, one stroke then the other ────────────────────────── */}
      <g filter={`url(#rough-${id})`}>
        {barbs.map((b, i) => {
          const q = progress(f, b.at, hOver);
          if (q <= 0.001) return null;
          return (
            <path
              key={i}
              d={`M ${to.x.toFixed(1)} ${to.y.toFixed(1)} L ${(to.x + b.v.x * b.l).toFixed(1)} ${(
                to.y +
                b.v.y * b.l
              ).toFixed(1)}`}
              {...common}
              strokeWidth={width * (i === 0 ? 1 : 0.9)}
              strokeDasharray={b.l}
              strokeDashoffset={b.l * (1 - q)}
            />
          );
        })}
      </g>
    </svg>
  );
};
