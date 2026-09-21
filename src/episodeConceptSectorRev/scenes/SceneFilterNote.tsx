/**
 * SceneFilterNote — four-line note beside the chat phone clip (frame-3354-4139).
 * NV 3824→4120; frame = scene-local. Left of the phone, vertically centred,
 * left-aligned; "Filter by" indigo, the rest black. Out by 4120.
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

// Anchored by its RIGHT edge so GAP is a true measured gap to the phone; text is
// left-aligned inside, so every line starts at the same x.
const RIGHT_EDGE = 1920 - (PHONE_LEFT - GAP);

export const SceneFilterNote = () => {
  const f = useCurrentFrame();
  const op = Math.min(fadeIn(f, 0, 12), fadeOut(f, 282, 14)); // in @3824, out by 4120
  return (
    <AbsoluteFill style={{ fontFamily, opacity: op }}>
      <div style={{ position: "absolute", right: RIGHT_EDGE, top: PHONE_CY, transform: "translateY(-50%)", textAlign: "left", fontSize: SIZE, fontWeight: WEIGHT, lineHeight: LINE_H, whiteSpace: "nowrap" }}>
        <div style={{ color: COLORS.purple }}>Filter by</div>
        <div style={{ color: COLORS.black }}>foreign accumulation,</div>
        <div style={{ color: COLORS.black }}>valuation, and</div>
        <div style={{ color: COLORS.black }}>technical condition.</div>
      </div>
    </AbsoluteFill>
  );
};
