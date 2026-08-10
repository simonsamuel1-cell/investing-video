/**
 * PivotMarker — a dot on a turning point, with an optional label above or below
 * it. Indigo marks peaks, cyan marks troughs, and that pairing never varies
 * across the episode: by SC19 the colour alone should read as "high" or "low".
 *
 * The dot is a UI element, so a small pop-in is allowed. The label rides the
 * shared Chip, which fades and never bounces.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import { usePalette } from "../palette";
import { Chip, type ChipVariant } from "./Chip";

export const PivotMarker = ({
  x,
  y,
  label,
  variant = "indigo",
  startFrame = 0,
  side = "above",
  gap = 34,
  size = theme.type.chip.size,
  opacity = 1,
  dotOnly = false,
}: {
  x: number;
  y: number;
  label?: string;
  variant?: ChipVariant;
  startFrame?: number;
  side?: "above" | "below";
  /** Distance from the dot to the label's centre. */
  gap?: number;
  size?: number;
  opacity?: number;
  /** Later instances of a repeated pivot drop the label and keep the dot. */
  dotOnly?: boolean;
}) => {
  const pal = usePalette();
  const f = useCurrentFrame();
  if (f < startFrame || opacity <= 0.001) return null;
  const color = variant === "indigo" ? pal.indigo : variant === "cyan" ? pal.cyan : pal.slate;
  const p = interpolate(f, [startFrame, startFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.motion.ease,
  });

  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
        <circle cx={x} cy={y} r={9 * (0.6 + 0.4 * p)} fill={color} opacity={p * opacity} />
        <circle cx={x} cy={y} r={9 + 10 * p} fill="none" stroke={color} strokeWidth={theme.stroke.rule} opacity={(1 - p) * 0.8 * opacity} />
      </svg>
      {label && !dotOnly && (
        <Chip
          label={label}
          x={x}
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
