/**
 * SafeArea — structural enforcement of the §0.5 layout contract:
 *  • persistent #F5F5F5 background (episode BG1),
 *  • children clipped to the 1728×918 active box (margins L96 R96 T54 B108),
 *    so nothing can render in the side/top margins or the bottom subtitle zone,
 *  • optional `__debug` outline of the top-right 360×150 logo clear-zone.
 *
 * Children use absolute coordinates in the full 1920×1080 space; the clip keeps
 * them inside the safe box.
 */
import { AbsoluteFill } from "remotion";
import type { ReactNode } from "react";
import { theme } from "../theme";

const { layout: L, colors } = theme;

export const SafeArea = ({
  children,
  __debug = false,
}: {
  children: ReactNode;
  __debug?: boolean;
}) => (
  <AbsoluteFill
    style={{
      backgroundColor: colors.background,
      fontFamily: theme.font.family,
      color: colors.text,
    }}
  >
    <AbsoluteFill
      style={{
        clipPath: `inset(${L.safeTop}px ${L.safeRight}px ${L.safeBottom}px ${L.safeLeft}px)`,
      }}
    >
      {children}
    </AbsoluteFill>

    {__debug && (
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {/* active box */}
        <div
          style={{
            position: "absolute",
            left: L.left,
            top: L.top,
            width: L.activeW,
            height: L.activeH,
            outline: `1px dashed ${colors.indigo}`,
            opacity: 0.5,
          }}
        />
        {/* logo clear-zone (must stay empty in drawn content) */}
        <div
          style={{
            position: "absolute",
            left: L.logoZone.x,
            top: L.logoZone.y,
            width: L.logoZone.w,
            height: L.logoZone.h,
            outline: "1px dashed rgba(0,0,0,0.45)",
          }}
        />
        {/* subtitle zone */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: L.bottom,
            width: "100%",
            height: L.safeBottom,
            background: colors.cyanSoft,
          }}
        />
      </AbsoluteFill>
    )}
  </AbsoluteFill>
);
