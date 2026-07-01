/**
 * Scene 17 — Mistake 2: rank vs value (4246, dur 290). Real app capture plays in the centered
 * phone via the scene16-20 continuity; this scene provides the left-column
 * title + sentence-case sub. Drawn visuals removed.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { textReveal } from "../helpers";

const { colors, font, type } = theme;

export const Scene17 = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 350, width: 620, fontSize: type.subhead, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(f, 8, 18) }}>
        2 · Rank Without Value
      </div>
      <div style={{ position: "absolute", left: 96, top: 516, width: 620, fontSize: type.descriptor, fontWeight: font.weights.medium, color: colors.slate, ...textReveal(f, 40, 18) }}>
        Topping the list with a small position isn't conviction.
      </div>
    </SafeArea>
  );
};
