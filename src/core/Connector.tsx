/**
 * core/Connector.tsx — Benchmark v1's signature (docs/vi-style/STYLE.md §0, Simon, 22 Oct 2026): a hairline that
 * GROWS from its source to its target when the VO links the two, and the soft ground the whole look sits on.
 *
 *   shape "curve"  one smooth S between the two points (tangents run along `axis`)
 *   shape "elbow"  two straight runs and a cross-run, every corner rounded (the ancrid / mindmap look)
 *   shape "arc"    one bow over the straight line (`bend` px) — a route from one place to another
 *
 * `p` 0→1 is how much of it exists, always drawn from `a`. Dashed lines are revealed through a mask so the dashes
 * never crawl. `pulse` (0→1) sends a small light along a finished line — use it once, on the link that matters.
 * Colour: the brand hairline by default (theme.color.connector); `tone` for anything else.
 */
import React from "react";
import { usePalette } from "./palette";
import { theme } from "./theme";

export type Pt = { x: number; y: number };

/** A polyline with every inner corner rounded by `r` (clamped to half of each run). */
export const roundedPath = (pts: Pt[], r: number) => {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1];
    const l1 = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    const l2 = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const k = Math.min(r, l1 / 2, l2 / 2);
    const a = { x: p1.x - ((p1.x - p0.x) / (l1 || 1)) * k, y: p1.y - ((p1.y - p0.y) / (l1 || 1)) * k };
    const b = { x: p1.x + ((p2.x - p1.x) / (l2 || 1)) * k, y: p1.y + ((p2.y - p1.y) / (l2 || 1)) * k };
    d += ` L ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${p1.x} ${p1.y} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L ${last.x} ${last.y}`;
};

/** The path between a and b. `axis` "x": leaves a horizontally; "y": vertically. `mid` 0..1 = where the cross-run sits. */
export const connectorPath = (a: Pt, b: Pt, shape: "curve" | "elbow" | "arc" = "curve", axis: "x" | "y" = "x", r = 28, mid = 0.5, bend = 120) => {
  if (shape === "arc") {
    return `M ${a.x} ${a.y} Q ${(a.x + b.x) / 2} ${(a.y + b.y) / 2 - bend}, ${b.x} ${b.y}`;
  }
  if (shape === "curve") {
    if (axis === "x") {
      const dx = (b.x - a.x) * 0.55;
      return `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
    }
    const dy = (b.y - a.y) * 0.55;
    return `M ${a.x} ${a.y} C ${a.x} ${a.y + dy}, ${b.x} ${b.y - dy}, ${b.x} ${b.y}`;
  }
  const pts =
    axis === "x"
      ? [a, { x: a.x + (b.x - a.x) * mid, y: a.y }, { x: a.x + (b.x - a.x) * mid, y: b.y }, b]
      : [a, { x: a.x, y: a.y + (b.y - a.y) * mid }, { x: b.x, y: a.y + (b.y - a.y) * mid }, b];
  return roundedPath(pts, r);
};

export const Connector = ({
  a,
  b,
  p,
  shape = "curve",
  bend = 120,
  axis = "x",
  mid = 0.5,
  radius = 28,
  tone,
  width = 2.5,
  dashed = false,
  dash = "2 9",
  pulse = 0,
  dot = true,
}: {
  a: Pt;
  b: Pt;
  p: number;
  shape?: "curve" | "elbow" | "arc";
  /** For "arc": how far its middle rises above the straight line (px). */
  bend?: number;
  axis?: "x" | "y";
  mid?: number;
  radius?: number;
  tone?: string;
  width?: number;
  dashed?: boolean;
  /** The dash pattern when `dashed` (SVG dasharray): short dots by default; longer dashes for a link that should read as a line. */
  dash?: string;
  pulse?: number;
  /** A small dot where the line leaves its source. */
  dot?: boolean;
}) => {
  const c = usePalette();
  const id = React.useId().replace(/:/g, "");
  if (p <= 0.001) return null;
  const color = tone ?? theme.color.connector;
  const d = connectorPath(a, b, shape, axis, radius, mid, bend);
  return (
    <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      <defs>
        <mask id={`cn-${id}`} maskUnits="userSpaceOnUse">
          <path d={d} pathLength={1} fill="none" stroke="white" strokeWidth={width + 16} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, p)} />
        </mask>
      </defs>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dashed ? dash : undefined} mask={`url(#cn-${id})`} />
      {dot ? <circle cx={a.x} cy={a.y} r={width + 2.5} fill={c.cardBg} stroke={color} strokeWidth={width} /> : null}
      {pulse > 0.001 && pulse < 0.999 ? (
        <path d={d} pathLength={1} fill="none" stroke={c.cardBg} strokeWidth={width + 1} strokeLinecap="round" strokeDasharray="0.06 1" strokeDashoffset={-pulse} opacity={0.9} />
      ) : null}
    </svg>
  );
};

/**
 * The ground Benchmark v1 sits on: the paper, and two very faint blooms (indigo, cyan) drifting slowly — light,
 * not colour. `f` is the global frame so the drift does not jump at a cut.
 */
export const SoftGround = ({ f }: { f: number }) => {
  const c = usePalette();
  const t = f / 600;
  const ax = 30 + 6 * Math.sin(t);
  const ay = 28 + 5 * Math.cos(t * 0.8);
  const bx = 72 + 5 * Math.cos(t * 0.9);
  const by = 72 + 6 * Math.sin(t * 0.7);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(60% 70% at ${ax}% ${ay}%, ${theme.color.bloomTintIndigo}, transparent 70%), radial-gradient(55% 65% at ${bx}% ${by}%, ${theme.color.bloomTintCyan}, transparent 70%), ${c.bg}`,
      }}
    />
  );
};
