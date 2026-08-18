/**
 * Annotations.tsx — the small marks scenes put ON a chart.
 *
 * All of them take a `f` (the scene's own local frame) rather than reading
 * `useCurrentFrame` themselves, so a continuity group can drive them across an
 * internal scene boundary without them resetting.
 *
 * None of them is ever red or green. Candle bodies and order-book rows are the
 * only places those two colours appear in this episode.
 */
import { theme } from "../theme";
import { progress, progressInOut, clamp01, textReveal } from "../helpers";
import { Layer } from "./Stage";

/**
 * A ring that expands and fades once — the episode's "look here, now" mark.
 * UI, so it is allowed to pop; type never is.
 */
export const RingPing = ({
  x,
  y,
  f,
  at,
  life = 20,
  r = 26,
}: {
  x: number;
  y: number;
  f: number;
  at: number;
  life?: number;
  r?: number;
}) => {
  if (f < at || f > at + life) return null;
  const t = (f - at) / life;
  return (
    <Layer opacity={1 - t}>
      <circle
        cx={x}
        cy={y}
        r={r * (0.45 + 0.85 * t)}
        fill="none"
        stroke={theme.color.cyan}
        strokeWidth={theme.shape.rule}
      />
    </Layer>
  );
};

/** A small label on a leader line, pointing at a place on the chart. */
export const CalloutTag = ({
  text,
  x,
  y,
  f,
  at,
  side = "above",
  tone = theme.color.indigo,
  opacity = 1,
}: {
  text: string;
  x: number;
  y: number;
  f: number;
  at: number;
  side?: "above" | "below" | "left" | "right";
  tone?: string;
  opacity?: number;
}) => {
  if (f < at || opacity <= 0.001) return null;
  const r = textReveal(f, at);
  const dx = side === "left" ? -18 : side === "right" ? 18 : 0;
  const dy = side === "above" ? -34 : side === "below" ? 34 : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x + dx,
        top: y + dy + r.dy,
        transform: `translate(${side === "left" ? "-100%" : side === "right" ? "0" : "-50%"}, -50%)`,
        fontFamily: theme.text.family,
        fontSize: theme.text.tag.size,
        fontWeight: theme.text.tag.weight,
        color: tone,
        whiteSpace: "nowrap",
        opacity: r.opacity * opacity,
      }}
    >
      {text}
    </div>
  );
};

/**
 * A measured distance, drawn the way a caliper is: two end ticks and a span
 * between them, with the reading on the span. It exists so a number the VO
 * gives can be shown as geometry between two visible points rather than
 * asserted as a statistic.
 */
export const MeasureCaliper = ({
  from,
  to,
  label,
  f,
  at,
  over = 20,
  orientation = "horizontal",
  tone = theme.color.indigo,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  label: string;
  f: number;
  at: number;
  over?: number;
  orientation?: "horizontal" | "vertical";
  tone?: string;
}) => {
  if (f < at) return null;
  const p = progressInOut(f, at, over);
  const tx = from.x + (to.x - from.x) * p;
  const ty = from.y + (to.y - from.y) * p;
  const tick = 14;
  const mid = { x: (from.x + tx) / 2, y: (from.y + ty) / 2 };
  return (
    <>
      <Layer>
        <line x1={from.x} y1={from.y} x2={tx} y2={ty} stroke={tone} strokeWidth={theme.shape.rule} />
        {[
          [from.x, from.y],
          [tx, ty],
        ].map(([cx, cy], i) => (
          <line
            key={i}
            x1={orientation === "horizontal" ? cx : cx - tick}
            y1={orientation === "horizontal" ? cy - tick : cy}
            x2={orientation === "horizontal" ? cx : cx + tick}
            y2={orientation === "horizontal" ? cy + tick : cy}
            stroke={tone}
            strokeWidth={theme.shape.rule}
          />
        ))}
      </Layer>
      <CalloutTag
        text={label}
        x={mid.x}
        y={mid.y}
        f={f}
        at={at + Math.round(over * 0.6)}
        side={orientation === "horizontal" ? "above" : "right"}
        tone={tone}
      />
    </>
  );
};

/**
 * An arrow lying along a stretch of a line, so "menanjak" is something you can
 * see rather than a word next to a shape. It reads the two endpoints of the
 * stretch and derives its own bearing, so it cannot point somewhere the line
 * does not go.
 */
export const SlopeGuide = ({
  a,
  b,
  label,
  f,
  at,
  over = 18,
  tone = theme.color.indigo,
}: {
  a: { x: number; y: number };
  b: { x: number; y: number };
  label?: string;
  f: number;
  at: number;
  over?: number;
  tone?: string;
}) => {
  if (f < at) return null;
  const p = progressInOut(f, at, over);
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  const ux = (b.x - a.x) / len;
  const uy = (b.y - a.y) / len;
  const head = 18;
  const tip = { x: a.x + ux * len * p, y: a.y + uy * len * p };
  /* the shaft stops inside the head as the head arrives — a round cap runs half
     its own weight past the endpoint and would blunt the point */
  const headIn = progress(f, at + over * 0.7, 8);
  const shaft = { x: tip.x - ux * head * 0.85 * headIn, y: tip.y - uy * head * 0.85 * headIn };
  const back = { x: -ux * head, y: -uy * head };
  const side = { x: -uy * 10, y: ux * 10 };
  return (
    <>
      <Layer>
        <line x1={a.x} y1={a.y} x2={shaft.x} y2={shaft.y} stroke={tone} strokeWidth={theme.shape.line} strokeLinecap="round" />
        {headIn > 0.001 && (
          <polygon
            points={`${tip.x},${tip.y} ${tip.x + back.x + side.x},${tip.y + back.y + side.y} ${tip.x + back.x - side.x},${tip.y + back.y - side.y}`}
            fill={tone}
            opacity={headIn}
          />
        )}
      </Layer>
      {label !== undefined && (
        <CalloutTag text={label} x={(a.x + tip.x) / 2} y={(a.y + tip.y) / 2} f={f} at={at + 8} tone={tone} />
      )}
    </>
  );
};

/**
 * An OPAQUE cover over everything right of the playhead.
 *
 * Solid background fill, not a translucent scrim: Scene 12A asks the viewer a
 * question about what happens next, and a future they can make out at 15%
 * opacity is not a question, it is a formality.
 */
export const RevealMask = ({
  x,
  rect,
  f,
  wipeFrom,
  wipeDur,
}: {
  x: number;
  rect: { x: number; y: number; w: number; h: number };
  f: number;
  wipeFrom: number;
  wipeDur: number;
}) => {
  const wiped = f >= wipeFrom ? progressInOut(f, wipeFrom, wipeDur) : 0;
  const edge = x + (rect.x + rect.w - x) * wiped;
  if (edge >= rect.x + rect.w - 0.5) return null;
  return (
    <Layer>
      <rect x={edge} y={rect.y} width={rect.x + rect.w - edge} height={rect.h} fill={theme.color.bg} />
      <line x1={edge} y1={rect.y} x2={edge} y2={rect.y + rect.h} stroke={theme.color.indigo} strokeWidth={theme.shape.rule} />
    </Layer>
  );
};

/** Three shrinking rings, exactly one per second. Numerals may pop; type may not. */
export const Countdown = ({
  x,
  y,
  f,
  at,
  count = 3,
}: {
  x: number;
  y: number;
  f: number;
  at: number;
  count?: number;
}) => {
  const i = Math.floor((f - at) / theme.canvas.fps);
  if (f < at || i >= count) return null;
  const t = clamp01(((f - at) % theme.canvas.fps) / theme.canvas.fps);
  return (
    <>
      <Layer opacity={1 - t * 0.5}>
        <circle cx={x} cy={y} r={110 * (1 - t * 0.35)} fill="none" stroke={theme.color.indigo} strokeWidth={theme.shape.line} />
      </Layer>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: "translate(-50%, -50%)",
          fontFamily: theme.text.family,
          fontSize: theme.text.display.size,
          fontWeight: theme.text.display.weight,
          color: theme.color.indigo,
        }}
      >
        {count - i}
      </div>
    </>
  );
};
