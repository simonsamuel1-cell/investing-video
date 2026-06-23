/**
 * S17 (Layout B-top) — "Start from the homepage. Hot Themes shows you which
 * sectors and concepts are gaining momentum today." Centred phone playing the
 * Hot Themes recording (~1:1, playbackRate 0.988). Minimal label on silver,
 * no grey panel (G2). (spec §17)
 */
import { interpolate, useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { PhoneCenter } from "../components/PhoneCenter";
import { Heading } from "../components/Heading";
import { ASSETS } from "../timeline";
import { COLORS } from "../theme";
import { fadeIn } from "../util/anim";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// Highlight over the on-phone "Concept Sector" section (header + 6 cards). Wider
// than the phone template (phone ≈361px; box 470px), centred on x=960.
const HL = { x: 725, y: 390, w: 470, h: 265 };

export const Scene17 = () => {
  const frame = useCurrentFrame();
  // appear at frame 68, then blink twice, then stay solid to the end of the scene.
  const hlOp = interpolate(frame, [68, 74, 82, 88, 94, 100, 106], [0, 1, 1, 0, 1, 0, 1], CLAMP);
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

      {/* highlight over the "Concept Sector" section — wider than the phone; appears
          at f68, blinks twice, then stays solid until the scene ends. */}
      <div
        style={{
          position: "absolute",
          left: HL.x,
          top: HL.y,
          width: HL.w,
          height: HL.h,
          borderRadius: 18,
          border: `3px solid ${COLORS.cyan}`,
          background: COLORS.cyanWash,
          boxShadow: "0 0 0 4px rgba(92,200,227,0.18), 0 10px 28px rgba(92,200,227,0.35)",
          opacity: hlOp,
        }}
      />
    </SceneWrap>
  );
};
