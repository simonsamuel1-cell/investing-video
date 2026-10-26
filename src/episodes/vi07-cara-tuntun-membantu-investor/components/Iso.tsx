/**
 * Iso.tsx — the isometric "exploded view" pieces (VI07 SC04; Simon's Pinterest reference, 26 Oct 2026: "pake objek2
 * abstrak tapi ada maknanya"). Everything is SVG drawn in the canvas's own coordinates.
 *
 * A slab is a rounded square lying flat, seen isometrically: its plan (a square `2h` wide with corner radius `r`) is
 * projected by ISO, then given a `depth`. The side is the sweep of the top face downwards — for a convex face that is
 * the face, its copy `depth` lower, and the band between their leftmost and rightmost points.
 */
import React from "react";
import { theme } from "../../../core";

/** Plan → screen: x' = (x − y)·cos30°, y' = (x + y)·sin30°. */
export const ISO = "matrix(0.866 0.5 -0.866 0.5 0 0)";
/** Half the projected width of a slab with half-side `h` and corner radius `r`. */
export const isoHalfWidth = (h: number, r: number) => (2 * h - 2 * r) * 0.866 + 1.2247 * r;

export type Slab = { h: number; r?: number; depth: number; top: string; side: string };

/**
 * One slab, its top face centred on (cx, cy). `face` draws on the top face in PLAN coordinates (−h..h on both
 * axes), so lines and dots are projected with it. `edge` is the hairline round it.
 */
export const IsoSlab = ({ cx, cy, s, face, opacity = 1, edge = theme.color.isoEdgeSolid }: { cx: number; cy: number; s: Slab; face?: React.ReactNode; opacity?: number; edge?: string }) => {
  const r = s.r ?? s.h * 0.22;
  const L = isoHalfWidth(s.h, r);
  const plan = <rect x={-s.h} y={-s.h} width={2 * s.h} height={2 * s.h} rx={r} ry={r} />;
  return (
    <g transform={`translate(${cx.toFixed(2)} ${cy.toFixed(2)})`} opacity={opacity}>
      {/* the side */}
      <g transform={`translate(0 ${s.depth})`}>
        <g transform={ISO} fill={s.side} stroke={edge} strokeWidth={1.5} vectorEffect="non-scaling-stroke">
          {React.cloneElement(plan, { vectorEffect: "non-scaling-stroke" })}
        </g>
      </g>
      <rect x={-L} y={0} width={2 * L} height={s.depth} fill={s.side} />
      <line x1={-L} y1={0} x2={-L} y2={s.depth} stroke={edge} strokeWidth={1.5} />
      <line x1={L} y1={0} x2={L} y2={s.depth} stroke={edge} strokeWidth={1.5} />
      {/* the top face, and what is drawn on it */}
      <g transform={ISO}>
        {React.cloneElement(plan, { fill: s.top, stroke: edge, strokeWidth: 1.5, vectorEffect: "non-scaling-stroke" })}
        {face}
      </g>
    </g>
  );
};

/** A flat shape standing on the axis (the reference's circle / hexagon / cylinder), centred on (cx, cy). */
export const AxisShape = ({ kind, cx, cy, size, fill, opacity = 1 }: { kind: "circle" | "hexagon" | "cylinder"; cx: number; cy: number; size: number; fill: string; opacity?: number }) => {
  const r = size / 2;
  if (kind === "circle") return <circle cx={cx} cy={cy} r={r} fill={fill} opacity={opacity} />;
  if (kind === "hexagon") {
    const pts = Array.from({ length: 6 }, (_, k) => {
      const a = (Math.PI / 3) * k + Math.PI / 6;
      return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
    }).join(" ");
    return <polygon points={pts} fill={fill} opacity={opacity} strokeLinejoin="round" />;
  }
  // a cylinder: a body and an elliptical top a touch lighter
  const ry = r * 0.32;
  return (
    <g opacity={opacity}>
      <rect x={cx - r * 0.8} y={cy - r * 0.7} width={r * 1.6} height={r * 1.4} fill={fill} />
      <ellipse cx={cx} cy={cy + r * 0.7} rx={r * 0.8} ry={ry} fill={fill} />
      <ellipse cx={cx} cy={cy - r * 0.7} rx={r * 0.8} ry={ry} fill={theme.color.isoRight} />
    </g>
  );
};
