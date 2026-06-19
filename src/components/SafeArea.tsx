/**
 * SafeArea — enforces the §4 layout contract structurally so scenes can't easily
 * violate it:
 *  • persistent flat silver background (never white/dark),
 *  • content is clipped to the 1728×918 usable box (clipPath inset) so nothing
 *    renders in the side/top margins or the bottom 108px subtitle zone,
 *  • the top-right 360×150 logo reserve is masked with silver in every scene
 *    EXCEPT when `allowLogoSlot` is set (Scene 32).
 * Children use absolute coordinates in the full 1920×1080 space (matching the
 * spec's pixel callouts); the clip keeps them inside the safe box.
 */
import { AbsoluteFill } from "remotion";
import type { ReactNode } from "react";
import {
  COLORS,
  MARGIN,
  LOGO_RESERVE,
  USABLE,
  DEV_GUIDES,
} from "../theme";
import { fontFamily } from "../fonts";

const Guides = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {/* usable box */}
    <div
      style={{
        position: "absolute",
        left: USABLE.x,
        top: USABLE.y,
        width: USABLE.w,
        height: USABLE.h,
        outline: "1px dashed rgba(95,77,238,0.5)",
      }}
    />
    {/* subtitle zone */}
    <div
      style={{
        position: "absolute",
        left: 0,
        top: USABLE.bottom,
        width: "100%",
        height: MARGIN.bottom,
        background: "rgba(92,200,227,0.10)",
      }}
    />
    {/* logo reserve */}
    <div
      style={{
        position: "absolute",
        left: LOGO_RESERVE.x,
        top: LOGO_RESERVE.y,
        width: LOGO_RESERVE.w,
        height: LOGO_RESERVE.h,
        outline: "1px dashed rgba(0,0,0,0.4)",
      }}
    />
    {/* right-zone start (Layout B) */}
    <div
      style={{
        position: "absolute",
        left: 580,
        top: USABLE.y,
        width: 1,
        height: USABLE.h,
        background: "rgba(0,0,0,0.25)",
      }}
    />
  </AbsoluteFill>
);

export const SafeArea = ({
  children,
  allowLogoSlot = false,
}: {
  children: ReactNode;
  allowLogoSlot?: boolean;
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.silver,
        fontFamily,
        color: COLORS.black,
      }}
    >
      <AbsoluteFill
        style={{
          clipPath: `inset(${MARGIN.top}px ${MARGIN.right}px ${MARGIN.bottom}px ${MARGIN.left}px)`,
        }}
      >
        {children}
      </AbsoluteFill>

      {!allowLogoSlot && (
        <div
          style={{
            position: "absolute",
            left: LOGO_RESERVE.x,
            top: LOGO_RESERVE.y,
            width: LOGO_RESERVE.w,
            height: LOGO_RESERVE.h,
            backgroundColor: COLORS.silver,
          }}
        />
      )}

      {DEV_GUIDES && <Guides />}
    </AbsoluteFill>
  );
};
