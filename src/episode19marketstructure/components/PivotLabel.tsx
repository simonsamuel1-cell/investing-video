/**
 * PivotLabel — a dot on a turning point plus an optional label chip.
 *
 * The colour pairing is fixed for the whole episode and never inverts, not even
 * in SC07 where the trend is down: INDIGO marks a peak, CYAN marks a trough.
 * The colours name the KIND of turn, not the direction of the trend — if they
 * swapped, SC19's recap cards would teach the wrong thing.
 *
 * The dot pops (it is a UI marker). The label rides Chip, which fades in and
 * never bounces.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import { Chip, type ChipVariant } from "./Chip";
import { Layer } from "./SafeArea";

export const PivotLabel = ({
  x,
  y,
  label,
  variant = "indigo",
  startFrame = 0,
  side = "above",
  gap = 34,
  size = theme.type.chip.size,
  opacity = 1,
  dx = 0,
}: {
  x: number;
  y: number;
  /** Omit for a dot-only pivot — later repeats of an already-named turn. */
  label?: string;
  variant?: ChipVariant;
  startFrame?: number;
  side?: "above" | "below";
  gap?: number;
  size?: number;
  opacity?: number;
  /** Nudges the LABEL only, leaving the dot on the pivot. */
  dx?: number;
}) => {
  const f = useCurrentFrame();
  if (f < startFrame || opacity <= 0.001) return null;
  const color = variant === "indigo" ? theme.colors.indigo : variant === "cyan" ? theme.colors.cyan : theme.colors.slate;
  const p = interpolate(f, [startFrame, startFrame + theme.motion.popFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.motion.ease,
  });

  return (
    <>
      <Layer>
        <circle cx={x} cy={y} r={9 * (0.6 + 0.4 * p)} fill={color} opacity={p * opacity} />
        {/* one expanding ring on arrival, then gone */}
        <circle cx={x} cy={y} r={9 + 10 * p} fill="none" stroke={color} strokeWidth={theme.stroke.rule} opacity={(1 - p) * 0.8 * opacity} />
      </Layer>
      {label && (
        <Chip
          label={label}
          x={x + dx}
          y={side === "above" ? y - gap : y + gap}
          variant={variant}
          size={size}
          startFrame={startFrame + 4}
          opacity={opacity}
        />
      )}
    </>
  );
};
