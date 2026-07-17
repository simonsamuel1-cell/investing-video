/**
 * SceneWhichSectors — one centred line in the gap between "US-Iran Tensions Escalate"
 * (out 3291) and the chat clip (starts 3354). NV 3294→3354; frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { fontFamily } from "../fonts";
import { fadeIn, fadeOut } from "../util/anim";

// ─── POSITION / SIZE — edit these ────────────────────────────────────────────
const CY = 540; // vertical centre (matches the phones' / catalyst text centre)
const SIZE = 60; // font size
const WEIGHT = 800; // font weight
// ─────────────────────────────────────────────────────────────────────────────

export const SceneWhichSectors = () => {
  const f = useCurrentFrame();
  const op = Math.min(fadeIn(f, 0, 12), fadeOut(f, 46, 14)); // in @3294, out by 3354
  return (
    <AbsoluteFill style={{ fontFamily, opacity: op }}>
      <div style={{ position: "absolute", left: 96, right: 96, top: CY, transform: "translateY(-50%)", textAlign: "center", fontSize: SIZE, fontWeight: WEIGHT, color: COLORS.black }}>
        Which sectors benefit?
      </div>
    </AbsoluteFill>
  );
};
