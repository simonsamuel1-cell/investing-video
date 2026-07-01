/**
 * Scene 01 — Order book: retail price ladder (0, dur 207). The real app capture
 * plays in a centered phone via the scene01-02 continuity in Composition; this
 * scene provides only the left-column caption. Sentence case.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { textReveal } from "../helpers";

const { colors, font, type } = theme;

export const Scene01 = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 300, width: 600, fontSize: type.subhead, fontWeight: font.weights.bold, color: colors.text, ...textReveal(f, 8, 18) }}>
        Most of us walk in and buy a few lots at the going price.
      </div>
    </SafeArea>
  );
};
