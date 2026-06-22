/**
 * S10 — the two real questions ("Which theme is moving?" / "Which stocks lead
 * it?") resolve on screen. (Formerly the A→B bridge; the phone mockup and the
 * "answer lives here" cue were removed — the device mockup is now introduced in
 * S11.) (spec §7)
 */
import { SceneWrap } from "../components/SceneWrap";
import { Heading } from "../components/Heading";
import { Chip } from "../components/Chip";

export const Scene10 = () => {
  return (
    <SceneWrap>
      <Heading x={96} y={150} width={1728} align="center" size={56}>
        So the real questions are:
      </Heading>

      {/* the two questions, centred */}
      <Chip x={660} y={452} width={600} variant="purple" size={36} delay={20} badge="?">
        Which theme is moving?
      </Chip>
      <Chip x={660} y={576} width={600} variant="cyan" size={36} delay={36} badge="?">
        Which stocks lead it?
      </Chip>
    </SceneWrap>
  );
};
