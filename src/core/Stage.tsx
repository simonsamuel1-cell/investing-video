/**
 * core/Stage.tsx — the frame every scene is built inside.
 *
 * `Stage` fills the canvas with the episode background. `Card` is the surface
 * charts are drawn on. `Layer` is a full-canvas SVG, which is how every drawn
 * primitive reaches the screen — one coordinate space, so a marker and the line
 * it sits on can never disagree about where a price is.
 *
 * Children position in absolute CANVAS coordinates. The bottom band belongs to
 * the subtitles and stays clear; anything in the first 150px must end before
 * theme.logoZone.maxX.
 *
 * Colours come from usePalette(), not theme.color, so a palette segment change
 * reaches the ground and the card without touching a scene.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "./theme";
import { usePalette, useShadow } from "./palette";
import type { Rect } from "./helpers";

export const Stage = ({
  children,
  transparent = false,
}: {
  children: React.ReactNode;
  /** For overlay stages inside a continuity group, which must not repaint
   *  the ground the group already owns. */
  transparent?: boolean;
}) => {
  const c = usePalette();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: transparent ? undefined : c.bg,
        fontFamily: theme.text.family,
        color: c.ink,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

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
  const c = usePalette();
  const shadow = useShadow();
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
          background: c.cardBg,
          border: `${theme.shape.hairline}px solid ${c.border}`,
          boxShadow: shadow.rest,
          opacity,
          transform: scale === 1 ? undefined : `scale(${scale})`,
          transformOrigin: `${rect.x + rect.w / 2}px ${rect.y + rect.h / 2}px`,
        }}
      />
      {children}
    </>
  );
};

export const Layer = ({
  children,
  opacity = 1,
  clip,
}: {
  children: React.ReactNode;
  opacity?: number;
  clip?: Rect;
}) => {
  /** One id per mounted Layer, so two clipped Layers cannot reference
   *  each other's clipPath. */
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
