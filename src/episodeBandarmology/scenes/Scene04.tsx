/**
 * Scene 04 — Clues, Not Fortune-Telling (755, dur 287). DISCLAIMER beat. A trail
 * of indigo footprints walks L→R, stopping at a dashed "Now" line; ahead the
 * path dissolves into a faint "?" (NOT a forecast, no upward arrow). Pinned chip
 * "Clues, Not Predictions" (~f200). The trail is the reusable FootprintTrail.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, Chip, FootprintTrail } from "../components";
import { theme } from "../theme";
import { textReveal } from "../helpers";

const { colors, font, type } = theme;

export const Scene04 = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 110,
          width: 1272,
          fontSize: type.header,
          fontWeight: font.weights.extrabold,
          ...textReveal(f, 8, 18),
        }}
      >
        Clues, Not Fortune-Telling
      </div>

      <FootprintTrail left={150} top={430} width={1480} count={9} nowIndex={5} revealStart={20} revealEnd={180} />

      <div style={{ position: "absolute", left: 96, top: 720 }}>
        <Chip label="Clues, Not Predictions" variant="outline" bounce delay={200} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 96,
          top: 800,
          width: 1480,
          fontSize: type.descriptor,
          fontWeight: font.weights.medium,
          color: colors.slate,
          ...textReveal(f, 215, 18),
        }}
      >
        The Past Is Solid. The Future Stays A Question.
      </div>
    </SafeArea>
  );
};
