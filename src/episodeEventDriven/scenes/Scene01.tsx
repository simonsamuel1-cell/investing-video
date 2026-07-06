/**
 * Scene 1 — News-feed cold open (comp 0–175). The persistent feed lives in
 * HookFrame; this overlay adds the supertitle. @3.4s the supertitle reveals.
 * Frame = scene-local (0 at comp 0).
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { textReveal } from "../helpers";

const SUPER = Math.round(3.4 * 30); // @3.4s

export const Scene01 = () => {
  const f = useCurrentFrame();
  const rv = textReveal(f, SUPER, 20);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 880, top: 300, width: 900, fontSize: 46, lineHeight: 1.28, fontWeight: theme.font.weights.bold, color: theme.colors.text, ...rv }}>
        Most people think the goal is to see the headline first.
      </div>
    </AbsoluteFill>
  );
};
