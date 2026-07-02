/**
 * AnswerTitle — big centered title card for comp frames 3110–3187 (standalone
 * Sequence). Two lines: "All of these" / "answer". Fades in at 3110, out by 3187.
 * Frame = comp − 3110.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { fadeIn, fadeOut } from "../helpers";

const { colors, font } = theme;

export const AnswerTitle = () => {
  const f = useCurrentFrame();
  const op = Math.min(fadeIn(f, 0, 14), fadeOut(f, 63, 14));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", fontSize: 104, fontWeight: font.weights.extrabold, color: colors.text, letterSpacing: -1.5, lineHeight: 1.08, opacity: op }}>
        All of these
        <br />
        answer
      </div>
    </AbsoluteFill>
  );
};
