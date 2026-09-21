/**
 * Card — a rounded titled panel (§3 cards ~20–24px radius, 1–2px border).
 * Accent-tinted header bar + black title and optional body. Springs in.
 */
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { ReactNode, CSSProperties } from "react";
import { COLORS, RADII, BORDER } from "../theme";
import { fadeIn, rise, springUp } from "../util/anim";

export const Card = ({
  title,
  body,
  accent = COLORS.purple,
  x,
  y,
  w,
  h,
  delay = 0,
  children,
  titleSize = 34,
  bodySize = 26,
}: {
  title?: ReactNode;
  body?: ReactNode;
  accent?: string;
  x: number;
  y: number;
  w: number;
  h?: number;
  delay?: number;
  children?: ReactNode;
  titleSize?: number;
  bodySize?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = springUp(frame, fps, delay);
  const opacity = fadeIn(frame, delay, 12);
  const ty = rise(frame, delay, 16, 20);

  const wrap: CSSProperties = {
    position: "absolute",
    left: x,
    top: y,
    width: w,
    height: h,
    borderRadius: RADII.card,
    border: `${BORDER.regular}px solid ${accent}`,
    background: COLORS.white,
    boxShadow: "0 14px 34px rgba(0,0,0,0.07)",
    overflow: "hidden",
    opacity,
    transform: `translateY(${ty}px) scale(${0.97 + 0.03 * s})`,
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div style={wrap}>
      {/* accent tab */}
      <div style={{ height: 8, background: accent }} />
      <div style={{ padding: "22px 26px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {title !== undefined && (
          <div style={{ fontSize: titleSize, fontWeight: 800, color: COLORS.black, letterSpacing: -0.3 }}>
            {title}
          </div>
        )}
        {body !== undefined && (
          <div style={{ fontSize: bodySize, fontWeight: 500, color: COLORS.black, lineHeight: 1.3 }}>
            {body}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
