/**
 * Scene 20 — Mistake 5: nego blind spot (5010, dur 216). Real app capture plays in the centered
 * phone via the scene16-20 continuity; this scene provides the left-column
 * title + sentence-case sub. Drawn visuals removed.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { textReveal } from "../helpers";

const { colors, font, type } = theme;

export const Scene20 = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 350, width: 620, fontSize: type.subhead, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(f, 8, 18) }}>
        5 · Forgetting The Nego Market
      </div>
      <div style={{ position: "absolute", left: 96, top: 516, width: 620, fontSize: type.descriptor, fontWeight: font.weights.medium, color: colors.slate, ...textReveal(f, 40, 18) }}>
        On-screen story isn't the off-screen flow.
      </div>
    </SafeArea>
  );
};
