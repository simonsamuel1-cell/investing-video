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

/**
 * ⚠ THE STAGE DEFENDS ITSELF AGAINST OTHER PEOPLE'S CSS.
 *
 * Found during the Moving Average migration, and it is the reason this exists:
 * moving the episode into a repo that also contains a Tailwind composition
 * changed 21 of 22 comparison frames WITHOUT A SINGLE LINE OF THE EPISODE
 * CHANGING. Tailwind's preflight is global — it reaches every composition in
 * the bundle — and it resets `box-sizing` and `line-height`, which moves every
 * padded chip and every baseline by a pixel or two.
 *
 * Once episodes share one repo, that is not a Moving Average problem: any
 * episode that ships a stylesheet silently restyles every other one, and
 * nothing on screen says so. So the stage re-asserts the browser defaults the
 * episodes were designed against, scoped to itself.
 *
 * `box-sizing` does not inherit, which is why this is a scoped rule and not an
 * inline style.
 */
const RESET =
  /* box-sizing does not inherit, so it has to be set on every descendant */
  `.tuntun-stage,.tuntun-stage *,.tuntun-stage *::before,.tuntun-stage *::after{box-sizing:border-box;}` +
  /* ⚠ line-height ON THE ROOT ONLY. It DOES inherit, and several components
     set their own on a wrapper and rely on the children picking it up —
     forcing `normal` on every descendant overrides that and moves the type.
     Measured: on `*` it was fourteen times worse than leaving it off. */
  `.tuntun-stage{line-height:normal;}`;

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
      className="tuntun-stage"
      style={{
        backgroundColor: transparent ? undefined : c.bg,
        fontFamily: theme.text.family,
        color: c.ink,
      }}
    >
      <style>{RESET}</style>
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
