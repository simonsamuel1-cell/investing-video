/**
 * S11 (B) — "This is Concept Sector". Phone shows the Concept Sector panel
 * (crossfade between the two stills). Right zone: large title springs in. (spec §7)
 */
import { useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { PhoneStill } from "../components/DeviceFrame";
import { Heading } from "../components/Heading";
import { ASSETS } from "../timeline";
import { COLORS } from "../theme";
import { fadeIn, ease } from "../util/anim";

export const Scene11 = () => {
  const frame = useCurrentFrame();
  const swap = fadeIn(frame, 34, 12);
  const lineW = ease(frame, [22, 40], [0, 360]);
  return (
    <SceneWrap>
      <PhoneStill src={ASSETS.concept1} />
      <div style={{ opacity: swap }}>
        <PhoneStill src={ASSETS.concept2} />
      </div>

      <Heading x={600} y={392} width={1224} align="center" size={92} delay={6}>
        Concept Sector
      </Heading>
      <div
        style={{
          position: "absolute",
          left: 600,
          top: 528,
          width: 1224,
          textAlign: "center",
        }}
      >
        <div style={{ height: 6, width: lineW, background: COLORS.cyan, borderRadius: 3, margin: "0 auto 22px" }} />
        <div style={{ fontSize: 34, fontWeight: 600, color: COLORS.black, opacity: fadeIn(frame, 30, 12) }}>
          One screen for how the market really moves.
        </div>
      </div>
    </SceneWrap>
  );
};
