/**
 * SceneQuietNotes — two notes beside the phone on the frame-5049-6000 clip.
 * NV 5037→5295; frame = scene-local. NOTE 1 starts during the silver gap just before
 * the clip fades up at 5049.
 *   NOTE 1 @5037 (local 0)  — left of phone, vertically centred, left-aligned, out 5295
 *   NOTE 2 @5127 (local 90) — right of phone, vertically centred, right-aligned, out 5292
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { fontFamily } from "../fonts";
import { fadeIn, fadeOut } from "../util/anim";

// ─── POSITION / SIZE — edit these ────────────────────────────────────────────
const PHONE_LEFT = 767; // phone's left edge  → NOTE 1 sits GAP px left of this
const PHONE_RIGHT = 1154; // phone's right edge → NOTE 2 sits GAP px right of this
const PHONE_CY = 540; // phone's vertical centre → both notes centre on this
const GAP = 50; // gap between each text block and the phone

const SIZE_1 = 48; // NOTE 1 font size
const SIZE_2 = 48; // NOTE 2 font size
const WEIGHT = 600; // font weight for both
const LINE_H = 1.2; // line height
// ─────────────────────────────────────────────────────────────────────────────

const RIGHT_OF_LEFT_BLOCK = 1920 - (PHONE_LEFT - GAP);
const LEFT_OF_RIGHT_BLOCK = PHONE_RIGHT + GAP;

export const SceneQuietNotes = () => {
  const f = useCurrentFrame();
  const op1 = Math.min(fadeIn(f, 0, 12), fadeOut(f, 244, 14)); // @5037, out by 5295
  const op2 = Math.min(fadeIn(f, 90, 12), fadeOut(f, 241, 14)); // @5127, out by 5292
  return (
    <AbsoluteFill style={{ fontFamily }}>
      {/* NOTE 1 — left of phone, vertically centred, left-aligned */}
      <div style={{ position: "absolute", right: RIGHT_OF_LEFT_BLOCK, top: PHONE_CY, transform: "translateY(-50%)", textAlign: "left", fontSize: SIZE_1, fontWeight: WEIGHT, lineHeight: LINE_H, whiteSpace: "nowrap", opacity: op1 }}>
        <div style={{ color: COLORS.black }}>Quiet accumulation</div>
      </div>

      {/* NOTE 2 — right of phone, vertically centred, right-aligned */}
      <div style={{ position: "absolute", left: LEFT_OF_RIGHT_BLOCK, top: PHONE_CY, transform: "translateY(-50%)", textAlign: "right", fontSize: SIZE_2, fontWeight: WEIGHT, lineHeight: LINE_H, whiteSpace: "nowrap", opacity: op2 }}>
        <div>
          <span style={{ color: COLORS.black }}>Across </span>
          <span style={{ color: COLORS.purple }}>sectors,</span>
        </div>
        <div style={{ color: COLORS.purple }}>sub-sectors, groups</div>
      </div>
    </AbsoluteFill>
  );
};
