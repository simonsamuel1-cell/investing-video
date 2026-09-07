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

export type MarkerGeom = {
  from: Pt;
  ctrl: Pt;
  to: Pt;
  width: number;
  headLen: number;
  /** Everything the stroke covers, stroke width included. */
  box: { top: number; bottom: number; left: number; right: number };
};

/**
 * ═══ WHERE THE ARROW ACTUALLY IS ═══
 *
 * `scale`, `flipY` and `rotate` are applied IN THAT ORDER and ABOUT THE TIP,
 * because the tip is the only part of an arrow that means anything: it is the
 * thing being pointed at, and it must not move when the arrow is resized or
 * turned.
 *
 * ⚠ THIS IS EXPORTED BECAUSE A CALLER HAS TO BE ABLE TO ASK. "Put the text 20px
 * above the arrow" is unanswerable from the props — the top edge depends on the
 * bow, the rotation, the head and the stroke width all at once. Measuring it
 * here means the scene never has to hold a copy of this arithmetic, and cannot
 * drift from it when a number changes.
 *
 * ⚠ AND IT IS DONE IN GEOMETRY, NOT IN A CSS TRANSFORM. A transform on the
 * element would scale the ROUGHNESS FILTER with it — half-size would get
 * half-size wobble, which is the one thing that makes the mark look drawn.
 * Moving the three control points instead leaves the filter at its own scale.
 */
export const markerGeom = ({
  from,
  to,
  bow = 0,
  scale = 1,
  flipY = false,
  rotate = 0,
  width = 16,
  headLen = 88,
  headAngle = 32,
}: {
  from: Pt;
  to: Pt;
  bow?: number;
  scale?: number;
  flipY?: boolean;
  rotate?: number;
  width?: number;
  headLen?: number;
  headAngle?: number;
}): MarkerGeom => {
  /** A quadratic only reaches HALF its control offset at the midpoint, so the
   *  bow is doubled — otherwise every arrow comes out half as curved as asked. */
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.max(1, Math.hypot(dx, dy));
  const c0 = {
    x: (from.x + to.x) / 2 + (dy / len) * bow * 2,
    y: (from.y + to.y) / 2 - (dx / len) * bow * 2,
  };
  const a = (rotate * Math.PI) / 180;
  const T = (p: Pt): Pt => {
    const x = (p.x - to.x) * scale;
    const y = ((p.y - to.y) * scale) * (flipY ? -1 : 1);
    return {
      x: to.x + x * Math.cos(a) - y * Math.sin(a),
      y: to.y + x * Math.sin(a) + y * Math.cos(a),
    };
  };
  const A = T(from);
  const C = T(c0);
  const B = { ...to };
  const w = width * scale;
  const hl = headLen * scale;

  /** The head's two strokes, backwards from the tip along the curve's tangent.
   *  A quadratic's tangent at t=1 is 2(B − C), so the travel direction is
   *  simply the tip minus the control point. */
  const tdx = B.x - C.x;
  const tdy = B.y - C.y;
  const tl = Math.max(1, Math.hypot(tdx, tdy));
  const back = { x: -tdx / tl, y: -tdy / tl };
  const rot = (v: Pt, deg: number) => {
    const r = (deg * Math.PI) / 180;
    return { x: v.x * Math.cos(r) - v.y * Math.sin(r), y: v.x * Math.sin(r) + v.y * Math.cos(r) };
  };
  const barbEnds = [headAngle, -headAngle].map((d, i) => {
    const v = rot(back, d);
    const l = hl * (i === 0 ? 1 : 0.82);
    return { x: B.x + v.x * l, y: B.y + v.y * l };
  });

  const pts: Pt[] = [...barbEnds, B];
  for (let i = 0; i <= 32; i++) {
    const t = i / 32;
    pts.push({
      x: (1 - t) ** 2 * A.x + 2 * (1 - t) * t * C.x + t * t * B.x,
      y: (1 - t) ** 2 * A.y + 2 * (1 - t) * t * C.y + t * t * B.y,
    });
  }
  const pad = w / 2 + 2;
  return {
    from: A,
    ctrl: C,
    to: B,
    width: w,
    headLen: hl,
    box: {
      top: Math.min(...pts.map((q) => q.y)) - pad,
      bottom: Math.max(...pts.map((q) => q.y)) + pad,
      left: Math.min(...pts.map((q) => q.x)) - pad,
      right: Math.max(...pts.map((q) => q.x)) + pad,
    },
  };
};

export const MarkerArrow = ({
  from,
  to,
  bow = 0,
  scale = 1,
  flipY = false,
  rotate = 0,
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
  /** Size, mirror and turn — applied in that order, about the TIP. See
   *  `markerGeom`; the tip is what the arrow means, so it is what stays put. */
  scale?: number;
  flipY?: boolean;
  rotate?: number;
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

  const G = markerGeom({ from, to, bow, scale, flipY, rotate, width, headLen, headAngle });
  const A = G.from;
  const C = G.ctrl;
  const B = G.to;
  const W = G.width;

  const N = 64;
  const pt = (t: number): Pt => ({
    x: (1 - t) ** 2 * A.x + 2 * (1 - t) * t * C.x + t * t * B.x,
    y: (1 - t) ** 2 * A.y + 2 * (1 - t) * t * C.y + t * t * B.y,
  });
  const path = (t0: number) => {
    const pts: Pt[] = [];
    for (let i = 0; i <= N; i++) pts.push(pt(t0 + (1 - t0) * (i / N)));
    return "M " + pts.map((q) => `${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(" L ");
  };

  const p = progress(f, at, over);
  /**
   * ⚠ THE SWEEP FOLLOWS THE CHORD, NOT THE X AXIS. An axis-aligned clip only
   * looks like drawing while the stroke is near-horizontal; turn the arrow 60°
   * and it uncovers from the side instead of from the pen. The clip rect is
   * laid out along the direction of travel and rotated onto it, so the reveal
   * is a pen moving however the arrow is turned.
   */
  const chord = Math.hypot(B.x - A.x, B.y - A.y);
  const deg = (Math.atan2(B.y - A.y, B.x - A.x) * 180) / Math.PI;
  const PAD = W * 3 + 40;
  const BIG = chord + PAD * 2;

  /** The head's two strokes, backwards from the tip along the tangent. */
  const tdx = B.x - C.x;
  const tdy = B.y - C.y;
  const tl = Math.max(1, Math.hypot(tdx, tdy));
  const back = { x: -tdx / tl, y: -tdy / tl };
  const rot = (v: Pt, d: number) => {
    const r = (d * Math.PI) / 180;
    return { x: v.x * Math.cos(r) - v.y * Math.sin(r), y: v.x * Math.sin(r) + v.y * Math.cos(r) };
  };
  /** ⚠ THE TWO BARBS ARE NOT THE SAME LENGTH. A symmetric head is the one
   *  detail that gives a hand-drawn arrow away as a vector. */
  const barbs = [
    { v: rot(back, headAngle), l: G.headLen, at: hAt },
    { v: rot(back, -headAngle), l: G.headLen * 0.82, at: hAt + Math.round(hOver * 0.55) },
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
            scale={W * 0.42}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <clipPath id={`sweep-${id}`}>
          <rect
            x={-PAD}
            y={-BIG / 2}
            width={PAD + chord * p}
            height={BIG}
            transform={`translate(${A.x.toFixed(1)} ${A.y.toFixed(1)}) rotate(${deg.toFixed(2)})`}
          />
        </clipPath>
      </defs>

      {/* ── the shaft ──────────────────────────────────────────────────── */}
      <g clipPath={`url(#sweep-${id})`}>
        <g filter={`url(#rough-${id})`}>
          {/* light where the pen landed … */}
          <path d={path(0)} {...common} strokeWidth={W * 0.68} />
          {/* … heavy where it pressed */}
          <path d={path(0.34)} {...common} strokeWidth={W} />
          {/* the ink breaking up */}
          <path
            d={path(0.06)}
            {...common}
            stroke="#FFFFFF"
            strokeWidth={W * 0.22}
            strokeDasharray="17 31 7 46 23 19 9 38"
            opacity={0.38}
            transform={`translate(0 ${(-W * 0.18).toFixed(1)})`}
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
              d={`M ${B.x.toFixed(1)} ${B.y.toFixed(1)} L ${(B.x + b.v.x * b.l).toFixed(1)} ${(
                B.y +
                b.v.y * b.l
              ).toFixed(1)}`}
              {...common}
              strokeWidth={W * (i === 0 ? 1 : 0.9)}
              strokeDasharray={b.l}
              strokeDashoffset={b.l * (1 - q)}
            />
          );
        })}
      </g>
    </svg>
  );
};
