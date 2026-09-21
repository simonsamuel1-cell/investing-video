/**
 * SceneAskAI — one note beside the phone on the chat clip (frame-3354-4139).
 * NV 3358→3727; frame = scene-local. Left of the phone, vertically centred,
 * left-aligned; "Tuntun AI" indigo, the rest black.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { fontFamily } from "../fonts";
import { fadeIn, fadeOut } from "../util/anim";

// ─── POSITION / SIZE — edit these ────────────────────────────────────────────
const PHONE_LEFT = 767; // phone's left edge — the block sits GAP px left of this
const PHONE_CY = 540; // phone's vertical centre — the block centres on this
const GAP = 50; // gap between the text block and the phone
const SIZE = 48; // font size
const WEIGHT = 600; // font weight
const LINE_H = 1.2; // line height
// ─────────────────────────────────────────────────────────────────────────────

const RIGHT_EDGE = 1920 - (PHONE_LEFT - GAP);

export const SceneAskAI = () => {
  const f = useCurrentFrame();
  const op = Math.min(fadeIn(f, 0, 12), fadeOut(f, 355, 14)); // in @3358, out by 3727
  return (
    <AbsoluteFill style={{ fontFamily, opacity: op }}>
      <div style={{ position: "absolute", right: RIGHT_EDGE, top: PHONE_CY, transform: "translateY(-50%)", textAlign: "left", fontSize: SIZE, fontWeight: WEIGHT, lineHeight: LINE_H, whiteSpace: "nowrap" }}>
        <div>
          <span style={{ color: COLORS.black }}>Ask </span>
          <span style={{ color: COLORS.purple }}>Tuntun AI</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
