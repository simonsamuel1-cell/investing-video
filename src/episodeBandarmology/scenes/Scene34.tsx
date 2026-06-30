/**
 * Scene 34 — Bottom line recap (9035, dur 306). DISCLAIMER / close. The Scene 11
 * public-data StatCards briefly re-tile, then resolve to a centered statement
 * "A Probability, Never A Promise" (textReveal ~f80) + sub (sentence case). Calm
 * fadeOut over the last ~30f.
 *
 * NOTE: no formal disclaimer card is in the script; Simon supplies VO/text if
 * house/OJK style needs one after this.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, StatCard } from "../components";
import { theme } from "../theme";
import { fadeOut, fadeIn, textReveal } from "../helpers";

const { colors, font, type } = theme;

export const Scene34 = () => {
  const f = useCurrentFrame();
  const out = fadeOut(f, 276, 30);
  const tilesOut = fadeOut(f, 70, 20); // recede as the statement resolves

  return (
    <SafeArea>
      <div style={{ opacity: out }}>
        {/* recap tiles */}
        <div style={{ opacity: tilesOut }}>
          <StatCard left={150} top={240} width={480} height={170} label="Foreign Flow" value="+Rp 84 Bn" op={fadeIn(f, 0, 16)} />
          <StatCard left={720} top={240} width={480} height={170} label="Insider Trades" value="3 filings" op={fadeIn(f, 12, 16)} />
          <StatCard left={1290} top={240} width={480} height={170} label="Shareholders" value="14,905" op={fadeIn(f, 24, 16)} />
        </div>

        <div style={{ position: "absolute", left: 96, top: 470, width: 1728, textAlign: "center", fontSize: type.display, fontWeight: font.weights.extrabold, color: colors.indigo, letterSpacing: -1, ...textReveal(f, 80, 22) }}>
          A Probability, Never A Promise
        </div>
        <div style={{ position: "absolute", left: 96, top: 640, width: 1728, textAlign: "center", fontSize: type.subhead, fontWeight: font.weights.medium, color: colors.slate, ...textReveal(f, 140, 20) }}>
          The tracks are public — the skill is reading them honestly.
        </div>
      </div>
    </SafeArea>
  );
};
