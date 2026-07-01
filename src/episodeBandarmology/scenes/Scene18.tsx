/**
 * Scene 18 — Mistake 3: concentration (4544, dur 226). Real app capture plays in the centered
 * phone via the scene16-20 continuity; this scene provides the left-column
 * title + sentence-case sub. Drawn visuals removed.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { textReveal } from "../helpers";

const { colors, font, type } = theme;

export const Scene18 = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 350, width: 620, fontSize: type.subhead, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(f, 8, 18) }}>
        3 · Ignoring Concentration
      </div>
      <div style={{ position: "absolute", left: 96, top: 516, width: 620, fontSize: type.descriptor, fontWeight: font.weights.medium, color: colors.slate, ...textReveal(f, 40, 18) }}>
        A few big hands matter more than a scattered crowd.
      </div>
    </SafeArea>
  );
};
