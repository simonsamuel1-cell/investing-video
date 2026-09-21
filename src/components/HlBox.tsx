/**
 * HlBox — the standard highlight box that brackets a region of the phone screen.
 *
 * House spec: cyan border + glow, 10% cyan fill, and OVERHANG px wider than the phone
 * on EACH side. Callers pass only the vertical extent (`top`/`bottom` in canvas px);
 * the horizontal size/position derives from the phone geometry + overhang, so every
 * box stays identical and symmetrical.
 *
 * This file exports ONLY a component on purpose — a non-component export here would
 * break its React Fast Refresh boundary (see ./phoneGeometry).
 */
import { COLORS } from "../theme";

export const HlBox = ({
  top,
  bottom,
  phoneLeft = 767, // the centred clip phone's left edge
  phoneWidth = 387, // the centred clip phone's width
  overhang = 25, // px past EACH side of the phone
  border = 3,
  radius = 16,
  fill = 0.1, // fill opacity (0.1 = 10%)
}: {
  top: number;
  bottom: number;
  phoneLeft?: number;
  phoneWidth?: number;
  overhang?: number;
  border?: number;
  radius?: number;
  fill?: number;
}) => (
  <div
    style={{
      position: "absolute",
      left: phoneLeft - overhang,
      top,
      width: phoneWidth + overhang * 2,
      height: bottom - top,
      boxSizing: "border-box",
      borderRadius: radius,
      background: `rgba(92,200,227,${fill})`,
      border: `${border}px solid ${COLORS.cyan}`,
      boxShadow: "0 0 22px rgba(92,200,227,0.75), inset 0 0 22px rgba(92,200,227,0.35)",
    }}
  />
);
