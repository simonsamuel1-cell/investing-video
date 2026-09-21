/**
 * DataTitle — big centered title card for comp frames 2514–2618 (mounted as a
 * standalone Sequence). All other visuals are cleared for this window. Fades in
 * at 2514, out by 2618. Frame = comp − 2514.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { fadeIn, fadeOut } from "../helpers";

const { colors, font } = theme;

export const DataTitle = () => {
  const f = useCurrentFrame();
  const op = Math.min(fadeIn(f, 0, 14), fadeOut(f, 90, 14));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 1500, textAlign: "center", fontSize: 96, fontWeight: font.weights.extrabold, color: colors.text, letterSpacing: -1, lineHeight: 1.1, opacity: op }}>
        In Indonesia, a lot tracks public data
      </div>
    </AbsoluteFill>
  );
};
