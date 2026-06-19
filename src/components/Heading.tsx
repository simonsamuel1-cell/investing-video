/**
 * Heading — the single text zone for a scene heading (top-left, below the logo
 * line). Black, Plus Jakarta Sans, 48–64px. Supports an optional accent word
 * (purple/cyan, used sparingly for emphasis per §3). Text never rotates.
 */
import { useCurrentFrame } from "remotion";
import type { ReactNode } from "react";
import { COLORS } from "../theme";
import { fadeIn, rise } from "../util/anim";

export const Heading = ({
  children,
  x = 96,
  y = 96,
  width = 1300,
  size = 56,
  weight = 800,
  color = COLORS.black,
  delay = 6,
  align = "left",
}: {
  children: ReactNode;
  x?: number;
  y?: number;
  width?: number;
  size?: number;
  weight?: number;
  color?: string;
  delay?: number;
  align?: "left" | "center";
}) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn(frame, delay, 14);
  const ty = rise(frame, delay, 16, 22);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.08,
        letterSpacing: -0.6,
        color,
        textAlign: align,
        opacity,
        transform: `translateY(${ty}px)`,
      }}
    >
      {children}
    </div>
  );
};

/** Inline accent emphasis word (purple by default). */
export const Accent = ({
  children,
  color = COLORS.purple,
}: {
  children: ReactNode;
  color?: string;
}) => <span style={{ color }}>{children}</span>;
