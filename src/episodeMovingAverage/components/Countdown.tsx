/**
 * Countdown.tsx — 3, 2, 1, exactly one per second.
 *
 * A numeral is the one kind of type in this episode allowed to pop: a number
 * that faded in would still be arriving when the next one is due. The ring
 * shrinks around it so the beat is legible without a second text element — the
 * episode allows at most two, and the title already has one.
 */
import { theme } from "../theme";
import { clamp01 } from "../helpers";
import { Layer } from "./ChartFrame";

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
      <Layer opacity={1 - t * 0.55}>
        <circle
          cx={x}
          cy={y}
          r={120 * (1 - t * 0.32)}
          fill="none"
          stroke={theme.color.indigo}
          strokeWidth={theme.shape.ma}
        />
      </Layer>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `translate(-50%, -50%) scale(${1.08 - 0.08 * t})`,
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
