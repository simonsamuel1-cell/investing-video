/**
 * Chip — a labelled pill used for callout labels and concept tags (§4).
 * Soft tint fill + 1.5px accent border + black text. Optional leading number
 * badge or dot. Springs in with a small rise.
 */
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { ReactNode } from "react";
import { COLORS, RADII } from "../theme";
import { fadeIn, rise, springUp } from "../util/anim";

type Variant = "cyan" | "purple" | "neutral";

const VARIANTS: Record<Variant, { border: string; fill: string }> = {
  cyan: { border: COLORS.cyan, fill: COLORS.cyanWash },
  purple: { border: COLORS.purple, fill: COLORS.purpleWash },
  neutral: { border: COLORS.hairline, fill: "rgba(255,255,255,0.65)" },
};

export const Chip = ({
  children,
  x,
  y,
  width,
  variant = "cyan",
  delay = 0,
  size = 30,
  badge,
  align = "left",
  padding = "16px 22px",
}: {
  children: ReactNode;
  x: number;
  y: number;
  width?: number;
  variant?: Variant;
  delay?: number;
  size?: number;
  badge?: ReactNode;
  align?: "left" | "center";
  padding?: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = springUp(frame, fps, delay);
  const opacity = fadeIn(frame, delay, 10);
  const ty = rise(frame, delay, 14, 16);
  const v = VARIANTS[variant];

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        display: "flex",
        alignItems: "center",
        justifyContent: align === "center" ? "center" : "flex-start",
        gap: 14,
        padding,
        borderRadius: RADII.chip,
        border: `1.5px solid ${v.border}`,
        background: v.fill,
        color: COLORS.black,
        fontSize: size,
        fontWeight: 600,
        lineHeight: 1.15,
        opacity,
        transform: `translateY(${ty}px) scale(${0.96 + 0.04 * s})`,
        boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
      }}
    >
      {badge !== undefined && (
        <span
          style={{
            flex: "0 0 auto",
            minWidth: 34,
            height: 34,
            borderRadius: 10,
            background: v.border,
            color: COLORS.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 800,
            padding: "0 8px",
          }}
        >
          {badge}
        </span>
      )}
      <span>{children}</span>
    </div>
  );
};
