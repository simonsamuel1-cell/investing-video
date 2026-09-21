/**
 * SceneGoldHighlight — indigo highlight over the chat answer on the phone screen,
 * spanning "Gold and Gold Ecosystem" down to the bold "Gold Sector:" line.
 * NV 3600→3690; frame = scene-local. The screen is static across this range, so the
 * box is fixed.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { fadeIn, fadeOut } from "../util/anim";

// ─── POSITION / SIZE — edit these ────────────────────────────────────────────
// Measured off the phone screen (phone body spans x 767–1154, y 187–892).
const HL_X = 790; // left edge
const HL_Y = 586; // top edge  → top of "Gold and Gold Ecosystem"
const HL_W = 342; // width
const HL_H = 120; // height → down to the bottom of the bold "Gold Sector:" line
// ─────────────────────────────────────────────────────────────────────────────

export const SceneGoldHighlight = () => {
  const f = useCurrentFrame();
  const op = Math.min(fadeIn(f, 0, 8), fadeOut(f, 76, 14)); // in @3600, out by 3690
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <div style={{ position: "absolute", left: HL_X, top: HL_Y, width: HL_W, height: HL_H, boxSizing: "border-box", borderRadius: 10, background: "rgba(95,77,238,0.16)", border: `2px solid ${COLORS.purple}`, boxShadow: "0 0 18px rgba(95,77,238,0.35)" }} />
    </AbsoluteFill>
  );
};
