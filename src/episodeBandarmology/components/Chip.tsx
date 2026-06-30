/**
 * Chip — small Title-Case pill. indigo / cyan / outline variants. Pop/bounce
 * entrance allowed (UI element, §0.6) when `bounce` is set; never used on body
 * type. Position absolutely via left/top, or inline if omitted.
 */
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { popIn, fadeIn } from "../helpers";

const { colors, radius, font, type } = theme;

export const Chip = ({
  label,
  variant = "indigo",
  bounce = false,
  delay = 0,
  left,
  top,
  size = type.chip,
  badge,
}: {
  label: string;
  variant?: "indigo" | "cyan" | "outline";
  bounce?: boolean;
  delay?: number;
  left?: number;
  top?: number;
  size?: number;
  badge?: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const grow = bounce ? popIn(frame, fps, delay, true) : 1;
  const op = fadeIn(frame, delay, 12);

  const fill =
    variant === "indigo" ? colors.indigo : variant === "cyan" ? colors.cyan : "transparent";
  const fg = variant === "outline" ? colors.indigo : colors.white;
  const stroke = variant === "outline" ? colors.indigo : "transparent";

  return (
    <div
      style={{
        position: left !== undefined || top !== undefined ? "absolute" : "relative",
        left,
        top,
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        padding: `${Math.round(size * 0.42)}px ${Math.round(size * 0.8)}px`,
        background: fill,
        border: `2px solid ${stroke}`,
        borderRadius: radius.pill,
        color: fg,
        fontSize: size,
        fontWeight: font.weights.bold,
        whiteSpace: "nowrap",
        opacity: op,
        transform: `scale(${grow})`,
        transformOrigin: "left center",
      }}
    >
      {badge && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: size,
            height: size,
            borderRadius: radius.pill,
            background: variant === "outline" ? colors.indigo : colors.white,
            color: variant === "outline" ? colors.white : fill,
            fontSize: Math.round(size * 0.62),
            fontWeight: font.weights.extrabold,
          }}
        >
          {badge}
        </span>
      )}
      {label}
    </div>
  );
};
