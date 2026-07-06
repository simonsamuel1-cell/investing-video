/**
 * Scene 7 — The three questions fill (comp 1354–1864, dur 510). Cards are
 * filled by QuestionCards; this overlay adds the closing line that builds
 * beneath once all three settle: "The principle is the same" (@14.5s).
 * Frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { textReveal } from "../helpers";

const LINE = Math.round(14.5 * 30); // @14.5s

export const Scene07 = () => {
  const f = useCurrentFrame();
  const rv = textReveal(f, LINE, 20);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 96, top: 820, width: 1728, textAlign: "center", fontSize: 44, fontWeight: theme.font.weights.bold, color: theme.colors.text, ...rv }}>
        Different events, same three questions — the principle is the same.
      </div>
    </AbsoluteFill>
  );
};
