/**
 * SceneTopGainersHighlight — cyan HL box around the KBLV / PSDN / CTTH / RONY / AGAR
 * rows on the Top Gainer list. NV 4139→4231; frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HlBox } from "../components/HlBox";
import { fadeIn, fadeOut } from "../util/anim";

// ─── POSITION / SIZE — edit these ────────────────────────────────────────────
const HL_TOP = 462; // top edge → just below the "Stock / Price / Chg / Chg(%)" header
const HL_BOTTOM = 759; // bottom edge → bottom of the AGAR row
const OVERHANG = 25; // px past EACH side of the phone
// ─────────────────────────────────────────────────────────────────────────────

export const SceneTopGainersHighlight = () => {
  const f = useCurrentFrame();
  const op = Math.min(fadeIn(f, 0, 8), fadeOut(f, 78, 14)); // in @4139, out by 4231
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <HlBox top={HL_TOP} bottom={HL_BOTTOM} overhang={OVERHANG} />
    </AbsoluteFill>
  );
};
