/**
 * SceneValidateNote — "validate on / chart pro" beside the phone on the S23–28 block.
 * NV 6960→7029; frame = scene-local.
 *
 * This used to live inside Scene23to27, which meant it was baked into that block's
 * frozen tail frame and could not be timed independently. It is its own scene now so
 * it can outlive the block (which ends at 6991) and end exactly at 7029.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { fontFamily } from "../fonts";
import { fadeIn, fadeOut } from "../util/anim";

// ─── POSITION / SIZE — edit these ────────────────────────────────────────────
const PHONE_RIGHT = 1161; // the centred phone's right edge on this block
const GAP = 50; // gap from the phone to the text block
const CY = 512; // the phone's vertical centre
const SIZE = 48; // font size
const WEIGHT = 600; // font weight
const LINE_H = 1.2; // line height
// ─────────────────────────────────────────────────────────────────────────────

export const SceneValidateNote = () => {
  const f = useCurrentFrame();
  const op = Math.min(fadeIn(f, 0, 12), fadeOut(f, 55, 14)); // in @6960, out by 7029
  return (
    <AbsoluteFill style={{ fontFamily, opacity: op }}>
      <div style={{ position: "absolute", left: PHONE_RIGHT + GAP, top: CY, transform: "translateY(-50%)", textAlign: "right", fontSize: SIZE, fontWeight: WEIGHT, lineHeight: LINE_H, whiteSpace: "nowrap" }}>
        <div style={{ color: COLORS.black }}>validate on</div>
        <div style={{ color: COLORS.purple }}>chart pro</div>
      </div>
    </AbsoluteFill>
  );
};
