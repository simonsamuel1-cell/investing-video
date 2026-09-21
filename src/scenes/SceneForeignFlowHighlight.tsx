/**
 * SceneForeignFlowHighlight — small cyan HL box around JUST the words "Foreign Flow"
 * in the sector table header (not the column). NV 5405→5552; frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HlBox } from "../components/HlBox";
import { fadeIn, fadeOut } from "../util/anim";

// ─── POSITION / SIZE — edit these ────────────────────────────────────────────
// The words "Foreign Flow" measure exactly x 896–955, y 311–318; these add ~7px pad.
const HL_LEFT = 889; // left edge
const HL_RIGHT = 961; // right edge — stops after "Flow", clear of the ⇅ sort arrows
const HL_TOP = 304; // top edge
const HL_BOTTOM = 325; // bottom edge
const SCALE = 1.2; // grow/shrink the box about its own centre (1.2 = +20%)
const RADIUS = 8; // smaller radius — 16 looks over-rounded on a box this short
// ─────────────────────────────────────────────────────────────────────────────

// Scaled about the centre, so SCALE keeps the box on the same words.
const CX = (HL_LEFT + HL_RIGHT) / 2;
const CY = (HL_TOP + HL_BOTTOM) / 2;
const W = (HL_RIGHT - HL_LEFT) * SCALE;
const H = (HL_BOTTOM - HL_TOP) * SCALE;
const LEFT = Math.round(CX - W / 2);
const TOP = Math.round(CY - H / 2);
const BOTTOM = Math.round(CY + H / 2);

export const SceneForeignFlowHighlight = () => {
  const f = useCurrentFrame();
  const op = Math.min(fadeIn(f, 0, 10), fadeOut(f, 133, 14)); // in @5405, out by 5552
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <HlBox top={TOP} bottom={BOTTOM} phoneLeft={LEFT} phoneWidth={Math.round(W)} overhang={0} radius={RADIUS} />
    </AbsoluteFill>
  );
};
