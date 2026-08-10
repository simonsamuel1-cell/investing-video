/**
 * SafeArea — wraps every scene. Solid theme background, Plus Jakarta throughout.
 *
 * Children position in absolute CANVAS coordinates and are expected to respect
 * the fixed margins 96 / 96 / 54 / 108. The bottom 108px is the subtitle zone
 * and stays visually empty; anything drawn in the top 150px must end at
 * x ≤ theme.layout.logoMaxContentX.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";

export const SafeArea = ({ children }: { children: React.ReactNode }) => (
  <AbsoluteFill style={{ backgroundColor: theme.colors.bg, fontFamily: theme.type.family, color: theme.colors.ink }}>
    {children}
  </AbsoluteFill>
);

/** The white card every chart sits on. Radius 24, 1px border, resting shadow. */
export const ChartCard = ({
  box = theme.frame.card,
  children,
  opacity = 1,
  radius = theme.radius.cardLg,
  scale = 1,
}: {
  box?: { x: number; y: number; w: number; h: number };
  children?: React.ReactNode;
  opacity?: number;
  radius?: number;
  scale?: number;
}) => {
  if (opacity <= 0.001) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: box.x,
          top: box.y,
          width: box.w,
          height: box.h,
          borderRadius: radius,
          background: theme.colors.cardBg,
          border: `${theme.stroke.hair}px solid ${theme.colors.border}`,
          boxShadow: theme.shadow.rest,
          opacity,
          transform: scale === 1 ? undefined : `scale(${scale})`,
          transformOrigin: `${box.x + box.w / 2}px ${box.y + box.h / 2}px`,
        }}
      />
      {children}
    </>
  );
};

/** A full-canvas SVG layer. Every drawn primitive in the episode uses this. */
export const Layer = ({ children, opacity = 1 }: { children: React.ReactNode; opacity?: number }) => (
  <svg
    style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
    width={theme.canvas.width}
    height={theme.canvas.height}
    opacity={opacity}
  >
    {children}
  </svg>
);
