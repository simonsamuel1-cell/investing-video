/**
 * S17 (Layout B-top) — "Start from the homepage. Hot Themes shows you which
 * sectors and concepts are gaining momentum today." Centred phone playing the
 * Hot Themes recording (~1:1, playbackRate 0.988). Minimal label on silver,
 * no grey panel (G2). (spec §17)
 */
import { useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { PhoneCenter } from "../components/PhoneCenter";
import { Heading } from "../components/Heading";
import { ASSETS } from "../timeline";
import { COLORS } from "../theme";
import { fadeIn } from "../util/anim";

export const Scene17 = () => {
  const frame = useCurrentFrame();
  return (
    <SceneWrap>
      <Heading x={96} y={70} width={1728} align="center" size={56} delay={2}>
        Step 1 · Hot Themes
      </Heading>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 146,
          width: 1728,
          textAlign: "center",
          fontSize: 30,
          fontWeight: 600,
          color: COLORS.black,
          opacity: fadeIn(frame, 12, 12),
        }}
      >
        What's gaining momentum today.
      </div>
      <PhoneCenter video={ASSETS.hotThemes} startSec={0} playbackRate={0.988} top={210} height={730} delay={4} />
    </SceneWrap>
  );
};
