/**
 * Scene 02 — Big order vs small order (224, dur 334). The real app capture
 * continues in the centered phone (scene01-02 continuity); this scene provides
 * the left-column caption + the Super-Wholesaler chip.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, Chip } from "../components";
import { theme } from "../theme";
import { textReveal } from "../helpers";

const { colors, font, type } = theme;

export const Scene02 = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 300, width: 600, fontSize: type.subhead, fontWeight: font.weights.bold, color: colors.text, ...textReveal(f, 8, 18) }}>
        Some buyers move in sizes the rest of us never do.
      </div>
      <div style={{ position: "absolute", left: 96, top: 460 }}>
        <Chip label="Super-Wholesaler" variant="indigo" bounce delay={150} />
      </div>
    </SafeArea>
  );
};
