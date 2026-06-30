/**
 * Card — white rounded panel (radius 16–24, 1–2px border, no shadow unless asked).
 * Title is optional. Consumes theme tokens only.
 */
import type { CSSProperties, ReactNode } from "react";
import { theme } from "../theme";

const { colors, radius, border } = theme;

export const Card = ({
  title,
  children,
  width,
  height,
  left,
  top,
  borderColor,
  fill,
  pad = 28,
  style,
}: {
  title?: string;
  children?: ReactNode;
  width: number;
  height?: number;
  left?: number;
  top?: number;
  borderColor?: string;
  fill?: string;
  pad?: number;
  style?: CSSProperties;
}) => (
  <div
    style={{
      position: left !== undefined || top !== undefined ? "absolute" : "relative",
      left,
      top,
      width,
      height,
      boxSizing: "border-box",
      background: fill ?? colors.card,
      border: `${border.regular}px solid ${borderColor ?? colors.divider}`,
      borderRadius: radius.lg,
      padding: pad,
      ...style,
    }}
  >
    {title && (
      <div
        style={{
          fontSize: theme.type.descriptor,
          fontWeight: theme.font.weights.bold,
          color: colors.text,
          marginBottom: 12,
        }}
      >
        {title}
      </div>
    )}
    {children}
  </div>
);
