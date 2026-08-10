/**
 * StructureLine.tsx — a price line drawn on with a trim path, and the markers
 * that belong to it.
 *
 * Every chart in this episode ARRIVES the same way: the shape is not placed, it
 * is traced. That is the episode's whole argument — price leaves a shape behind
 * as it moves — so a chart that simply appeared would be arguing against the
 * script.
 *
 * Mounted only when `draw > 0`, so scrubbing to a scene's frame 0 can never
 * reveal a finished line.
 */
import { theme } from "../theme";
import { Layer } from "./Stage";
import { PivotLabel } from "./PivotLabel";
import type { Plot } from "../data/shape";
import type { Tone } from "./Chip";

export type Mark = {
  /** Index into the curve's own turn list. */
  turn: number;
  label?: string;
  tone?: Tone;
  side?: "above" | "below";
  at: number;
  dx?: number;
  size?: number;
  opacity?: number;
};

export const StructureLine = ({
  plot,
  draw = 1,
  color = theme.color.ink,
  width = theme.shape.line,
  opacity = 1,
  head = false,
  marks,
}: {
  plot: Plot;
  draw?: number;
  color?: string;
  width?: number;
  opacity?: number;
  head?: boolean;
  marks?: Mark[];
}) => {
  if (draw <= 0.001 || opacity <= 0.001) return null;
  const u = Math.max(0, Math.min(1, draw));
  const tip = plot.along(u); // measured along the line, so it sits on the drawn end

  return (
    <>
      <Layer opacity={opacity}>
        <path
          d={plot.d}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={plot.length}
          strokeDashoffset={plot.length * (1 - u)}
        />
        {head && u < 0.999 && <circle cx={tip.x} cy={tip.y} r={width + 2} fill={color} />}
      </Layer>
      {marks?.map((m) => {
        const t = plot.turn(m.turn);
        return (
          <PivotLabel
            key={`${m.turn}-${m.label ?? "dot"}`}
            x={t.x}
            y={t.y}
            label={m.label}
            tone={m.tone ?? (t.kind === "trough" ? "cyan" : "indigo")}
            side={m.side ?? (t.kind === "trough" ? "below" : "above")}
            at={m.at}
            dx={m.dx}
            size={m.size}
            opacity={m.opacity}
          />
        );
      })}
    </>
  );
};

/**
 * A horizontal reference at one price, drawn left→right, with an optional
 * glow where price crosses it.
 *
 * Descriptive only. A reference line is never an entry, a target or a stop.
 * Its label is parked INSIDE the right end — these lines reach the edge of the
 * plot, and a label hung past the end would cross the safe margin.
 */
export const Reference = ({
  x1,
  x2,
  y,
  draw = 1,
  color = theme.color.slate,
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
        <line x1={x1} y1={y} x2={x1 + w} y2={y} stroke={color} strokeWidth={theme.shape.rule} strokeDasharray="12 10" opacity={0.85} />
        {pierce && pierce.amount > 0.001 && (
          <circle cx={pierce.x} cy={y} r={10 + 30 * pierce.amount} fill="none" stroke={color} strokeWidth={theme.shape.rule} opacity={(1 - pierce.amount) * 0.9} />
        )}
      </Layer>
      {label && (
        <div
          style={{
            position: "absolute",
            left: x1 + w - 10,
            top: y - 12,
            transform: "translate(-100%, -100%)",
            fontFamily: theme.text.family,
            fontSize: theme.text.axis.size,
            fontWeight: theme.text.axis.weight,
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

/** A straight guide between two turns — SC06's trend line under the lows. */
export const Guide = ({
  from,
  to,
  draw,
  color = theme.color.indigo,
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
        strokeWidth={theme.shape.rule}
        strokeLinecap="round"
      />
    </Layer>
  );
};

/** A light price axis: round gridlines with their prices on the right. */
export const PriceAxis = ({
  ticks,
  plot,
  x1,
  x2,
  opacity = 1,
  format,
}: {
  ticks: number[];
  plot: Plot;
  x1: number;
  x2: number;
  opacity?: number;
  format: (n: number) => string;
}) => {
  if (opacity <= 0.001) return null;
  return (
    <Layer opacity={opacity}>
      {ticks.map((p) => (
        <g key={p}>
          <line x1={x1} y1={plot.y(p)} x2={x2} y2={plot.y(p)} stroke={theme.color.hairline} strokeWidth={theme.shape.hairline} />
          <text
            x={x2 + 16}
            y={plot.y(p) + 8}
            fontFamily={theme.text.family}
            fontSize={theme.text.axis.size}
            fontWeight={theme.text.axis.weight}
            fill={theme.color.slate}
          >
            {format(p)}
          </text>
        </g>
      ))}
    </Layer>
  );
};
