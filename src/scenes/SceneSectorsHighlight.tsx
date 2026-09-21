/**
 * SceneSectorsHighlight — cyan HL box around the "IDX Sectors", "Tuntun Sector" and
 * "Group" blocks on the KBLV Concept Sector tab. NV 4391→4462; frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HlBox } from "../components/HlBox";
import { fadeIn, fadeOut } from "../util/anim";

// ─── POSITION / SIZE — edit these ────────────────────────────────────────────
const HL_TOP = 348; // top edge → top of the "IDX Sectors" heading
const HL_BOTTOM = 602; // bottom edge → bottom of the "Lippo Group" chip
const OVERHANG = 25; // px past EACH side of the phone
// ─────────────────────────────────────────────────────────────────────────────

export const SceneSectorsHighlight = () => {
  const f = useCurrentFrame();
  const op = Math.min(fadeIn(f, 0, 8), fadeOut(f, 57, 14)); // in @4391, out by 4462
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <HlBox top={HL_TOP} bottom={HL_BOTTOM} overhang={OVERHANG} />
    </AbsoluteFill>
  );
};
