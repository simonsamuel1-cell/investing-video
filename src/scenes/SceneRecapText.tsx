/**
 * SceneRecapText — two centred lines replacing the old S30 recap scene.
 * NV 7047→7243; frame = scene-local.
 *   "Finding opportunities earlier isn't luck" @7047 (local 0)   — black
 *   "it's looking at a different level"        @7176 (local 129) — indigo, below
 * Both fade out by 7243, handing over to S31 at 7244.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { fontFamily } from "../fonts";
import { fadeIn, fadeOut } from "../util/anim";

// ─── POSITION / SIZE — edit these ────────────────────────────────────────────
const CY = 540; // vertical centre of the two-line block
const SIZE = 60; // font size for both lines
const WEIGHT = 800; // font weight for both lines
const LINE_H = 1.3; // line height
// ─────────────────────────────────────────────────────────────────────────────

export const SceneRecapText = () => {
  const f = useCurrentFrame();
  const out = fadeOut(f, 182, 14); // both out by 7243 (local 196)
  const op1 = fadeIn(f, 0, 12); // @7047
  const op2 = fadeIn(f, 129, 12); // @7176
  // Both lines stay mounted (only opacity animates) so line 1 never shifts.
  return (
    <AbsoluteFill style={{ fontFamily, opacity: out }}>
      <div style={{ position: "absolute", left: 96, right: 96, top: CY, transform: "translateY(-50%)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", fontSize: SIZE, fontWeight: WEIGHT, lineHeight: LINE_H }}>
        <div style={{ color: COLORS.black, opacity: op1 }}>Finding opportunities earlier isn't luck</div>
        <div style={{ color: COLORS.purple, opacity: op2 }}>it's looking at a different level</div>
      </div>
    </AbsoluteFill>
  );
};
