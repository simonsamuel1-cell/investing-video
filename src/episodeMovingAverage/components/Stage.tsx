/**
 * Stage.tsx — the frame every scene is built inside.
 *
 * `Stage` fills the canvas with the episode background. `Card` is the white
 * surface charts are drawn on. `Layer` is a full-canvas SVG, which is how every
 * drawn primitive in the episode reaches the screen — one coordinate space, so
 * a marker and the line it sits on can never disagree about where a price is.
 *
 * Children position in absolute CANVAS coordinates. The bottom band belongs to
 * the subtitles and stays clear; anything in the first 150px must end before
 * theme.logoZone.maxX.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import type { Rect } from "../helpers";

export const Stage = ({ children }: { children: React.ReactNode }) => (
  <AbsoluteFill style={{ backgroundColor: theme.color.bg, fontFamily: theme.text.family, color: theme.color.ink }}>{children}</AbsoluteFill>
);

export const Card = ({
  rect = theme.stage.card,
  children,
  opacity = 1,
  radius = theme.shape.cardRadius,
  scale = 1,
}: {
  rect?: Rect;
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
          left: rect.x,
          top: rect.y,
          width: rect.w,
          height: rect.h,
          borderRadius: radius,
          background: theme.color.surface,
          border: `${theme.shape.hairline}px solid ${theme.color.hairline}`,
          boxShadow: theme.shape.shadow,
          opacity,
          transform: scale === 1 ? undefined : `scale(${scale})`,
          transformOrigin: `${rect.x + rect.w / 2}px ${rect.y + rect.h / 2}px`,
        }}
      />
      {children}
    </>
  );
};

export const Layer = ({ children, opacity = 1, clip }: { children: React.ReactNode; opacity?: number; clip?: Rect }) => {
  // one id per mounted Layer, so two clipped Layers cannot reference each other
  const id = React.useId();
  if (opacity <= 0.001) return null;
  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      width={theme.canvas.width}
      height={theme.canvas.height}
      opacity={opacity}
    >
      {clip ? (
        <>
          <defs>
            <clipPath id={id}>
              <rect x={clip.x} y={clip.y} width={clip.w} height={clip.h} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${id})`}>{children}</g>
        </>
      ) : (
        children
      )}
    </svg>
  );
};
