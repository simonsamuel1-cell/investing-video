/**
 * Countdown.tsx — 3, 2, 1, exactly one per second.
 *
 * A numeral is the one kind of type in this episode allowed to pop: a number
 * that faded in would still be arriving when the next one is due. The ring
 * shrinks around it so the beat is legible without a second text element.
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
  const fps = theme.layout.fps;
  const i = Math.floor((f - at) / fps);
  if (f < at || i >= count) return null;
  const t = clamp01(((f - at) % fps) / fps);
  return (
    <>
      <Layer opacity={1 - t * 0.55}>
        <circle
          cx={x}
          cy={y}
          r={120 * (1 - t * 0.32)}
          fill="none"
          stroke={theme.colors.indigo}
          strokeWidth={theme.layout.stroke.ma}
        />
      </Layer>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `translate(-50%, -50%) scale(${(1.08 - 0.08 * t).toFixed(3)})`,
          fontFamily: theme.type.family,
          fontSize: theme.type.display.size,
          fontWeight: theme.type.display.weight,
          color: theme.colors.indigo,
        }}
      >
        {count - i}
      </div>
    </>
  );
};
