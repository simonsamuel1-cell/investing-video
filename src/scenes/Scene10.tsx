/**
 * S10 (A→B bridge) — two question-chips ("Which theme is moving?" / "Which stocks
 * lead it?") resolve, then the first device mockup slides in from the left showing
 * the Hot Themes ranked panel as the answer. (spec §7)
 */
import { useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { Heading } from "../components/Heading";
import { Chip } from "../components/Chip";
import { PhoneClip, PHONE } from "../components/DeviceFrame";
import { ASSETS } from "../timeline";
import { COLORS } from "../theme";
import { fadeIn, ease } from "../util/anim";

export const Scene10 = () => {
  const frame = useCurrentFrame();
  // phone slides in from off-screen left.
  const phoneX = ease(frame, [120, 156], [-520, PHONE.x]);
  const phoneOp = fadeIn(frame, 120, 14);
  const answerOp = fadeIn(frame, 168, 14);

  return (
    <SceneWrap>
      <Heading x={96} y={120} width={1728} align="center" size={52}>
        So the real questions are:
      </Heading>

      {/* the two questions */}
      <Chip x={700} y={392} width={540} variant="purple" size={34} delay={20} badge="?">
        Which theme is moving?
      </Chip>
      <Chip x={700} y={500} width={540} variant="cyan" size={34} delay={36} badge="?">
        Which stocks lead it?
      </Chip>

      {/* the answer slides in */}
      <div style={{ opacity: phoneOp }}>
        <PhoneClip src={ASSETS.hotThemes} startSec={0} x={phoneX} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 700,
          top: 648,
          display: "flex",
          alignItems: "center",
          gap: 14,
          opacity: answerOp,
        }}
      >
        <span style={{ fontSize: 30, fontWeight: 800, color: COLORS.purple }}>← The answer lives here</span>
      </div>
    </SceneWrap>
  );
};
