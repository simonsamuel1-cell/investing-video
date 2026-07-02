/**
 * BandarTitle — clean centered title card for comp frames 570–750 (mounted as a
 * standalone Sequence). All other visuals are cleared for this window (Scene 03
 * is empty, the S01-02 phone ends at 570). Frame = comp − 570.
 *   0   (570): "Following the big players" (black) fades in
 *   90  (660): "Bandarmology" (indigo, larger, above) fades in
 *   180 (750): both gone
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { fadeIn, fadeOut } from "../helpers";

const { colors, font } = theme;

export const BandarTitle = () => {
  const f = useCurrentFrame();
  const tagOp = Math.min(fadeIn(f, 0, 14), fadeOut(f, 166, 14));
  const brandOp = Math.min(fadeIn(f, 90, 14), fadeOut(f, 166, 14));

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 116, fontWeight: font.weights.extrabold, color: colors.indigo, letterSpacing: -1.5, lineHeight: 1, marginBottom: 20, opacity: brandOp }}>
          Bandarmology
        </div>
        <div style={{ fontSize: 52, fontWeight: font.weights.bold, color: colors.text, opacity: tagOp }}>
          Following the big players
        </div>
      </div>
    </AbsoluteFill>
  );
};
