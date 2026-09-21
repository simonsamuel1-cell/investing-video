/**
 * SceneCatalyst — two centred lines in the gap between the phone clips (NV 3183→3291).
 * Frame = scene-local (0 at NV 3183).
 *   "A catalyst hits"           @3183 (local 0)  — black
 *   "US-Iran tensions escalate" @3232 (local 49) — indigo, below
 * Both fade out by 3291. The four entry-point tags above are a separate persistent
 * row (SceneEntryTags, 2598→6000) and deliberately run on past this.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { fontFamily } from "../fonts";
import { fadeIn, fadeOut } from "../util/anim";

// ─── POSITION / SIZE — edit these ────────────────────────────────────────────
const CY = 540; // vertical centre of the two-line block (matches the phones' centre)
const SIZE = 80; // font size for both lines
const WEIGHT = 800; // font weight for both lines
const LINE_H = 1.2; // line height
// ─────────────────────────────────────────────────────────────────────────────

export const SceneCatalyst = () => {
  const f = useCurrentFrame();
  const out = fadeOut(f, 94, 14); // both out by 3291 (local 108)
  const op1 = fadeIn(f, 0, 12); // @3183
  const op2 = fadeIn(f, 49, 12); // @3232
  // Both lines are always mounted (only opacity animates) so line 1 never shifts
  // when line 2 arrives.
  return (
    <AbsoluteFill style={{ fontFamily, opacity: out }}>
      <div style={{ position: "absolute", left: 96, right: 96, top: CY, transform: "translateY(-50%)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", fontSize: SIZE, fontWeight: WEIGHT, lineHeight: LINE_H }}>
        <div style={{ color: COLORS.black, opacity: op1 }}>A catalyst hits</div>
        <div style={{ color: COLORS.purple, opacity: op2 }}>"US-Iran Tensions Escalate"</div>
      </div>
    </AbsoluteFill>
  );
};
