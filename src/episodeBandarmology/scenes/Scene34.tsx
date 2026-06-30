/**
 * Scene 34 — Bottom Line (9035, dur 306). DISCLAIMER beat / close. Reuses the
 * Scene 04 FootprintTrail, now resolved across the frame. Final centered statement
 * "A Probability, Never A Promise" (~f80); sub-line "Read The Public Tracks
 * Honestly" (~f140); calm fade-out over the last ~30f.
 *
 * NOTE: if house/OJK style needs a formal disclaimer card after this, it is NOT
 * in the script — Simon must supply that VO/text; do not author it here.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, FootprintTrail } from "../components";
import { theme } from "../theme";
import { fadeOut, textReveal } from "../helpers";

const { colors, font, type } = theme;

export const Scene34 = () => {
  const f = useCurrentFrame();
  const out = fadeOut(f, 276, 30);

  return (
    <SafeArea>
      <div style={{ opacity: out }}>
        <FootprintTrail left={150} top={250} width={1480} count={11} nowIndex={10} revealStart={0} revealEnd={120} showQuestion={false} />

        <div style={{ position: "absolute", left: 96, top: 470, width: 1728, textAlign: "center", fontSize: type.display, fontWeight: font.weights.extrabold, color: colors.indigo, letterSpacing: -1, ...textReveal(f, 80, 22) }}>
          A Probability, Never A Promise
        </div>

        <div style={{ position: "absolute", left: 96, top: 640, width: 1728, textAlign: "center", fontSize: type.subhead, fontWeight: font.weights.medium, color: colors.slate, ...textReveal(f, 140, 20) }}>
          Read The Public Tracks Honestly
        </div>
      </div>
    </SafeArea>
  );
};
