/**
 * Scene 24 — Recap opens (comp 5823–6034, dur 211). The StepRail (owned by
 * RecapFrame) lands cards 1 & 2; this overlay carries the section title.
 * Frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { textReveal } from "../helpers";

export const Scene24 = () => {
  const f = useCurrentFrame();
  const title = textReveal(f, 0, 18);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 96, top: 150, fontSize: 60, fontWeight: theme.font.weights.extrabold, color: theme.colors.text, ...title }}>
        The playbook, in three
      </div>
    </AbsoluteFill>
  );
};
