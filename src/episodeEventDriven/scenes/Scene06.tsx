/**
 * Scene 6 — Reading faster vs judging better (comp 1082–1341, dur 259). The
 * three empty cards are created by QuestionCards; this overlay carries the
 * headline: "Reading faster" mutes to grey, "judging better" holds ink-black.
 * Frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { textReveal, clamp01 } from "../helpers";

const MUTE = Math.round(0.5 * 30); // @0.5s
const HOLD = Math.round(1.5 * 30); // @1.5s

export const Scene06 = () => {
  const f = useCurrentFrame();
  const a = textReveal(f, 0, 16);
  const grey = clamp01((f - MUTE) / 16);
  const hold = textReveal(f, HOLD, 16);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 96, top: 150, width: 1600, fontSize: 52, fontWeight: theme.font.weights.extrabold, color: theme.colors.text, ...a }}>
        <span style={{ color: `rgb(${Math.round(138 * grey)},${Math.round(141 * grey)},${Math.round(148 * grey)})` }}>Reading faster</span>
        <span style={{ color: theme.colors.grey }}> isn&rsquo;t the edge — </span>
        <span style={{ color: theme.colors.text, ...hold }}>judging better is.</span>
      </div>
    </AbsoluteFill>
  );
};
