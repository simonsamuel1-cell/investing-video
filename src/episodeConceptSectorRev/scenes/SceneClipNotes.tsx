/**
 * SceneClipNotes — two text notes beside the centred phone clip (frame-2868-3178).
 * Frame = scene-local (0 at NV 2876). Both fade out with the clip at 3178.
 *   NOTE 2 @2931 (local 55)  — left of phone, vertically centred, left-aligned
 *   NOTE 3 @3088 (local 212) — right of phone, vertically centred, right-aligned
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { fontFamily } from "../fonts";
import { fadeIn, fadeOut } from "../util/anim";

// ─── POSITION / SIZE — edit these ────────────────────────────────────────────
// The phone's measured visible edges (cx 960, top 137, height 806).
const PHONE_LEFT = 767; // phone's left edge
const PHONE_RIGHT = 1154; // phone's right edge
const PHONE_CY = 540; // phone's vertical centre → both notes centre here
const GAP = 50; // gap between each text block and the phone

const SIZE_2 = 40; // NOTE 2 font size
const SIZE_3 = 40; // NOTE 3 font size
const WEIGHT = 600; // font weight for both
const LINE_H = 1.2; // line height
// ─────────────────────────────────────────────────────────────────────────────

// The block left of the phone is anchored by its RIGHT edge (GAP from the phone);
// the block right of the phone is anchored by its LEFT edge.
const RIGHT_OF_LEFT_BLOCK = 1920 - (PHONE_LEFT - GAP);
const LEFT_OF_RIGHT_BLOCK = PHONE_RIGHT + GAP;

export const SceneClipNotes = () => {
  const f = useCurrentFrame();
  const out = fadeOut(f, 288, 14); // both out by 3178 (local 302)
  const op2 = fadeIn(f, 55, 12); // @2931
  const op3 = fadeIn(f, 212, 12); // @3088
  return (
    <AbsoluteFill style={{ fontFamily, opacity: out }}>
      {/* NOTE 2 — left of phone, vertically centred, left-aligned */}
      <div style={{ position: "absolute", right: RIGHT_OF_LEFT_BLOCK, top: PHONE_CY, transform: "translateY(-50%)", textAlign: "left", fontSize: SIZE_2, fontWeight: WEIGHT, lineHeight: LINE_H, whiteSpace: "nowrap", opacity: op2 }}>
        <div style={{ color: COLORS.black }}>Other stocks from</div>
        <div style={{ color: COLORS.black }}>same sector moving,</div>
        <div style={{ color: COLORS.purple }}>worth checking</div>
      </div>

      {/* NOTE 3 — right of phone, vertically centred, right-aligned */}
      <div style={{ position: "absolute", left: LEFT_OF_RIGHT_BLOCK, top: PHONE_CY, transform: "translateY(-50%)", textAlign: "right", fontSize: SIZE_3, fontWeight: WEIGHT, lineHeight: LINE_H, whiteSpace: "nowrap", opacity: op3 }}>
        <div style={{ color: COLORS.black }}>Only one moving,</div>
        <div style={{ color: COLORS.purple }}>probably noise.</div>
      </div>
    </AbsoluteFill>
  );
};
