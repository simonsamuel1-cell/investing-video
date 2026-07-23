/**
 * Chip — white card, radius chip, 1px neutral border, 36px Title Case label.
 * Variants indigo / cyan / neutral / muted. Pop entrance allowed (UI element).
 * Cross-fade between labels: render two Chips and drive `opacity`.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";

export type ChipVariant = "indigo" | "cyan" | "neutral" | "muted";

const VARIANT: Record<ChipVariant, { border: string; text: string; bg: string }> = {
  indigo: { border: theme.colors.indigo, text: theme.colors.indigo, bg: theme.colors.neutralFill },
  cyan: { border: theme.colors.cyan, text: theme.colors.slate, bg: theme.colors.cyanTint },
  neutral: { border: theme.colors.neutralLine, text: theme.colors.ink, bg: theme.colors.neutralFill },
  muted: { border: theme.colors.neutralLine, text: theme.colors.neutralMuted, bg: theme.colors.neutralFill },
};

export const Chip = ({
  label,
  x,
  y,
  variant = "indigo",
  startFrame = 0,
  opacity = 1,
  anchor = "center",
}: {
  label: string;
  x: number;
  y: number; // top edge
  variant?: ChipVariant;
  startFrame?: number; // pop entrance start (scene-local frame)
  opacity?: number;
  anchor?: "center" | "left" | "right";
}) => {
  const f = useCurrentFrame();
  if (f < startFrame) return null;
  const pop = interpolate(f, [startFrame, startFrame + 9], [0.82, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.motion.ease,
  });
  const inOp = interpolate(f, [startFrame, startFrame + 7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const v = VARIANT[variant];
  const tx = anchor === "center" ? "-50%" : anchor === "right" ? "-100%" : "0%";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translateX(${tx}) scale(${pop})`,
        padding: "10px 22px",
        borderRadius: theme.radius.chip,
        background: v.bg,
        border: `${theme.stroke.hairline}px solid ${v.border}`,
        boxShadow: variant === "indigo" ? `inset 0 0 0 1px ${v.border}` : undefined,
        fontSize: theme.type.label.size,
        fontWeight: theme.type.label.weight,
        color: v.text,
        whiteSpace: "nowrap",
        opacity: opacity * inOp,
      }}
    >
      {label}
    </div>
  );
};
