/**
 * SafeArea — enforces the layout contract structurally:
 *  • persistent flat #F5F5F5 background (never white/dark),
 *  • content clipped to the 1728×918 usable box so nothing renders in the side/
 *    top margins or the bottom 108px subtitle band,
 *  • the top-right logo clear-zone (x ≥ 1560, y < 150) is kept clear by POSITION
 *    — NOT a painted mask (project decision; superseded the old reserve fill).
 * Children use absolute coordinates in the full 1920×1080 space; the clip keeps
 * them inside the safe box.
 */
import { AbsoluteFill } from "remotion";
import type { ReactNode } from "react";
import { COLORS, MARGIN, USABLE, LOGO_CLEAR, FRAME, DEV_GUIDES } from "../theme";
import { fontFamily } from "../fonts";

const Guides = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div
      style={{
        position: "absolute",
        left: USABLE.x,
        top: USABLE.y,
        width: USABLE.w,
        height: USABLE.h,
        outline: `1px dashed ${COLORS.primaryWash}`,
      }}
    />
    {/* subtitle band */}
    <div
      style={{
        position: "absolute",
        left: 0,
        top: USABLE.bottom,
        width: "100%",
        height: MARGIN.bottom,
        background: COLORS.secondaryWash,
      }}
    />
    {/* logo clear-zone */}
    <div
      style={{
        position: "absolute",
        left: LOGO_CLEAR.xMin,
        top: 0,
        width: FRAME.width - LOGO_CLEAR.xMin,
        height: LOGO_CLEAR.yMax,
        outline: `1px dashed ${COLORS.primary}`,
        background: COLORS.scrim,
      }}
    />
  </AbsoluteFill>
);

export const SafeArea = ({ children }: { children: ReactNode }) => (
  <AbsoluteFill
    style={{ backgroundColor: COLORS.background, fontFamily, color: COLORS.text }}
  >
    <AbsoluteFill
      style={{
        clipPath: `inset(${MARGIN.top}px ${MARGIN.right}px ${MARGIN.bottom}px ${MARGIN.left}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
    {DEV_GUIDES && <Guides />}
  </AbsoluteFill>
);
