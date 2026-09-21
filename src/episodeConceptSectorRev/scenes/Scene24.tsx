/**
 * S24 (B-top, two highlight states; phone fixed, v3) — Company Quality → Reference
 * Fair Value. A single centered phone (combined clip 00:03–00:15, slow ×1.036).
 * ONE cyan highlight box travels between the two bottom sections on the sentence
 * boundary. No right-zone cards. Refs: Scene_24.png / Scene_24_2.png.
 *
 * TODO(studio): tune BOX1/BOX2 to the real Company Quality / Reference Fair Value
 * sections in the recording (coords are over the centred phone screen).
 */
import { useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { PhoneCenter } from "../components/PhoneCenter";
import { ASSETS } from "../timeline";
import { COLORS } from "../theme";
import { fadeIn, ease } from "../util/anim";

const STATE2_AT = 188; // VO reaches "Reference Fair Value"
const BOX1 = { x: 776, y: 674, w: 126, h: 66 }; // Company Quality
const BOX2 = { x: 900, y: 674, w: 142, h: 66 }; // Reference Fair Value

export const Scene24 = () => {
  const frame = useCurrentFrame();
  const t = ease(frame, [STATE2_AT, STATE2_AT + 18], [0, 1]);
  const x = BOX1.x + (BOX2.x - BOX1.x) * t;
  const w = BOX1.w + (BOX2.w - BOX1.w) * t;
  return (
    <SceneWrap fade={0}>
      <PhoneCenter video={ASSETS.combo23_27} startSec={3.533} top={80} height={865} />
      <div
        style={{
          position: "absolute",
          left: x,
          top: BOX1.y,
          width: w,
          height: BOX1.h,
          borderRadius: 12,
          border: `2px solid ${COLORS.cyan}`,
          background: "rgba(92,200,227,0.12)",
          opacity: fadeIn(frame, 20, 10),
        }}
      />
    </SceneWrap>
  );
};
