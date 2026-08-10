/**
 * PivotLabel.tsx — a dot on a turning point, with an optional name.
 *
 * THE COLOUR RULE, and it never inverts anywhere in the episode, not even in
 * SC07 where the trend is down: INDIGO marks a peak, CYAN marks a trough. The
 * colours name the KIND of turn, not the direction of the trend. If they
 * swapped with the trend, SC19's recap cards would teach the wrong thing.
 *
 * The name is offset and tied back with a short leader rather than sitting
 * directly on top of the dot. On a dense staircase that is the difference
 * between six readable labels and six overlapping ones.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { progress } from "../helpers";
import { Chip, type Tone } from "./Chip";
import { Layer } from "./Stage";

export const PivotLabel = ({
  x,
  y,
  label,
  tone = "indigo",
  at = 0,
  side = "above",
  gap = 46,
  dx = 0,
  size = theme.text.chip.size,
  opacity = 1,
}: {
  x: number;
  y: number;
  /** Leave off for a dot-only turn — a repeat of something already named. */
  label?: string;
  tone?: Tone;
  at?: number;
  side?: "above" | "below";
  /** Distance from the dot to the label's centre. */
  gap?: number;
  /** Nudges the LABEL only. The dot stays on the turn. */
  dx?: number;
  size?: number;
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  if (f < at || opacity <= 0.001) return null;
  const color = tone === "indigo" ? theme.color.indigo : tone === "cyan" ? theme.color.cyan : theme.color.slate;
  const p = progress(f, at, theme.motion.pop);
  const ly = side === "above" ? y - gap : y + gap;

  return (
    <>
      <Layer>
        <circle cx={x} cy={y} r={9 * (0.6 + 0.4 * p)} fill={color} opacity={p * opacity} />
        {/* one ring on arrival, then gone */}
        <circle cx={x} cy={y} r={9 + 11 * p} fill="none" stroke={color} strokeWidth={theme.shape.rule} opacity={(1 - p) * 0.8 * opacity} />
      </Layer>
      {label && (
        <Chip
          label={label}
          x={x + dx}
          y={ly}
          tone={tone}
          size={size}
          at={at + 4}
          opacity={opacity}
          leaderTo={dx !== 0 ? { x, y: side === "above" ? y - 14 : y + 14 } : undefined}
        />
      )}
    </>
  );
};
