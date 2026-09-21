/**
 * SceneColumnHighlight — cyan HL box over the Price / Chg(%) / 5D Chg(%) columns of
 * the sector table. NV 5301→5405; frame = scene-local. The box is STILL for the whole
 * range (the table scrolls sideways from ~5338, but the box stays put by design).
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HlBox } from "../components/HlBox";
import { fadeIn, fadeOut } from "../util/anim";

// ─── POSITION / SIZE — edit these ────────────────────────────────────────────
const HL_LEFT = 905; // left edge  (Price column)
const HL_RIGHT = 1120; // right edge (end of 5D Chg(%))
const HL_TOP = 298; // top edge (header row)
const HL_BOTTOM = 884; // bottom edge (last visible row)
// ─────────────────────────────────────────────────────────────────────────────

export const SceneColumnHighlight = () => {
  const f = useCurrentFrame();
  const op = Math.min(fadeIn(f, 0, 10), fadeOut(f, 90, 14)); // in @5301, out by 5405
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <HlBox top={HL_TOP} bottom={HL_BOTTOM} phoneLeft={HL_LEFT} phoneWidth={HL_RIGHT - HL_LEFT} overhang={0} />
    </AbsoluteFill>
  );
};
