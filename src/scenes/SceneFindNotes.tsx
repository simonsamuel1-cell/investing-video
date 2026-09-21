/**
 * SceneFindNotes — two notes beside the phone on the frame-5049-6000 clip.
 * NV 5782→5995; frame = scene-local. Both fade out by 5995.
 *   NOTE 1 @5782 (local 0)  — left of phone, vertically centred, left-aligned
 *   NOTE 2 @5853 (local 71) — right of phone, vertically centred, right-aligned
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

export const SceneFindNotes = () => {
  const f = useCurrentFrame();
  const out = fadeOut(f, 199, 14); // both out by 5995 (local 213)
  const op1 = fadeIn(f, 0, 12); // @5782
  const op2 = fadeIn(f, 71, 12); // @5853
  return (
    <AbsoluteFill style={{ fontFamily, opacity: out }}>
      {/* NOTE 1 — left of phone, vertically centred, left-aligned */}
      <div style={{ position: "absolute", right: RIGHT_OF_LEFT_BLOCK, top: PHONE_CY, transform: "translateY(-50%)", textAlign: "left", fontSize: SIZE_1, fontWeight: WEIGHT, lineHeight: LINE_H, whiteSpace: "nowrap", opacity: op1 }}>
        <div style={{ color: COLORS.black }}>Find</div>
        <div style={{ color: COLORS.purple }}>accumulated stock</div>
      </div>

      {/* NOTE 2 — right of phone, vertically centred, right-aligned */}
      <div style={{ position: "absolute", left: LEFT_OF_RIGHT_BLOCK, top: PHONE_CY, transform: "translateY(-50%)", textAlign: "right", fontSize: SIZE_2, fontWeight: WEIGHT, lineHeight: LINE_H, whiteSpace: "nowrap", opacity: op2 }}>
        <div style={{ color: COLORS.black }}>Check the</div>
        <div style={{ color: COLORS.purple }}>technicals</div>
      </div>
    </AbsoluteFill>
  );
};
