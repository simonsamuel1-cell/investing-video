/**
 * StructureLine — a smoothed price line drawn on with a trim path, plus the
 * pivot markers that belong to it.
 *
 * Every chart in this episode arrives the same way: the shape is not placed, it
 * is TRACED, because the episode's whole argument is that price leaves a shape
 * behind as it moves.
 *
 * Conditionally mounted by `draw > 0`, so scrubbing to a scene's frame 0 can
 * never show a ghost end-state.
 *
 * `pivots` is optional. When given, each entry lands on its own beat frame and
 * is rendered by PivotLabel, so a label can never be positioned by hand — it
 * sits on the turning point the geometry actually produced.
 */
import { theme } from "../theme";
import { Layer } from "./SafeArea";
import { PivotLabel } from "./PivotLabel";
import type { Geom } from "../data/series";
import type { ChipVariant } from "./Chip";

export type PivotMark = {
  /** Index into the structure's own pivot list. */
  index: number;
  label?: string;
  variant?: ChipVariant;
  side?: "above" | "below";
  startFrame: number;
  size?: number;
  opacity?: number;
  dx?: number;
};

export const StructureLine = ({
  g,
  draw = 1,
  color = theme.colors.ink,
  width = theme.stroke.line,
  opacity = 1,
  head = false,
  pivots,
}: {
  g: Geom;
  /** 0→1 trim-path reveal. */
  draw?: number;
  color?: string;
  width?: number;
  opacity?: number;
  /** A dot riding the drawn end while the line is still being traced. */
  head?: boolean;
  pivots?: PivotMark[];
}) => {
  if (draw <= 0.001 || opacity <= 0.001) return null;
  const p = Math.max(0, Math.min(1, draw));
  // measured ALONG THE LINE, not by parameter: a trim path advances by arc
  // length, so sampling by t leaves the dot floating off a steep leg's end
  const tip = g.atArc(p);

  return (
    <>
      <Layer opacity={opacity}>
        <path
          d={g.path}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={g.len}
          strokeDashoffset={g.len * (1 - p)}
        />
        {head && p < 0.999 && <circle cx={tip.x} cy={tip.y} r={width + 2} fill={color} />}
      </Layer>
      {pivots?.map((pv) => {
        const pt = g.pivot(pv.index);
        return (
          <PivotLabel
            key={`${pv.index}-${pv.label ?? "dot"}`}
            x={pt.x}
            y={pt.y}
            label={pv.label}
            variant={pv.variant ?? "indigo"}
            side={pv.side ?? "above"}
            startFrame={pv.startFrame}
            size={pv.size}
            opacity={pv.opacity}
            dx={pv.dx}
          />
        );
      })}
    </>
  );
};

/** A straight guide between two pivots, drawn on — SC06's trend line. */
export const GuideLine = ({
  from,
  to,
  draw,
  color = theme.colors.indigo,
  dy = 0,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  draw: number;
  color?: string;
  dy?: number;
}) => {
  if (draw <= 0.001) return null;
  return (
    <Layer opacity={0.85}>
      <line
        x1={from.x}
        y1={from.y + dy}
        x2={from.x + (to.x - from.x) * draw}
        y2={from.y + dy + (to.y - from.y) * draw}
        stroke={color}
        strokeWidth={theme.stroke.rule}
        strokeLinecap="round"
      />
    </Layer>
  );
};

/**
 * A horizontal reference at one price, drawn left→right, with an optional
 * pierce glow where price crosses it.
 *
 * Descriptive only. This is never an entry, a target, or a stop.
 */
export const ReferenceLine = ({
  x1,
  x2,
  y,
  draw = 1,
  color = theme.colors.slate,
  label,
  opacity = 1,
  pierce,
}: {
  x1: number;
  x2: number;
  y: number;
  draw?: number;
  color?: string;
  label?: string;
  opacity?: number;
  pierce?: { x: number; amount: number };
}) => {
  if (draw <= 0.001 || opacity <= 0.001) return null;
  const w = (x2 - x1) * Math.max(0, Math.min(1, draw));
  return (
    <>
      <Layer opacity={opacity}>
        <line x1={x1} y1={y} x2={x1 + w} y2={y} stroke={color} strokeWidth={theme.stroke.rule} strokeDasharray="12 10" opacity={0.85} />
        {pierce && pierce.amount > 0.001 && (
          <circle cx={pierce.x} cy={y} r={10 + 30 * pierce.amount} fill="none" stroke={color} strokeWidth={theme.stroke.rule} opacity={(1 - pierce.amount) * 0.9} />
        )}
      </Layer>
      {label && (
        <div
          style={{
            position: "absolute",
            // parked INSIDE the line's right end — these lines reach the edge
            // of the plot, and a label hung past it would cross the margin
            left: x1 + w - 8,
            top: y - 12,
            transform: "translate(-100%, -100%)",
            fontFamily: theme.type.family,
            fontSize: theme.type.axis.size,
            fontWeight: theme.type.axis.weight,
            color,
            opacity: opacity * Math.max(0, Math.min(1, draw * 2 - 1)),
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      )}
    </>
  );
};
