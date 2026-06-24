/**
 * S31 (A) — start with the theme. Text card "Start with the theme. Let it lead you
 * to the stock." + the Scene_22_-_1_Theme screen shown INSIDE a device frame
 * (PhoneFrame) for consistency with the other scenes. Phone on the right, kept
 * clear of the logo reserve. (spec §7)
 */
import { useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { PhoneFrame } from "../components/PhoneFrame";
import { ASSETS } from "../timeline";
import { COLORS } from "../theme";
import { fadeIn, rise } from "../util/anim";

export const Scene31 = () => {
  const frame = useCurrentFrame();
  return (
    <SceneWrap>
      {/* text block, left */}
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 380,
          width: 820,
          opacity: fadeIn(frame, 6, 14),
          transform: `translateY(${rise(frame, 6, 16, 22)}px)`,
        }}
      >
        <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.12, letterSpacing: -0.6, color: COLORS.black }}>
          Start with the <span style={{ color: COLORS.purple }}>theme</span>.
        </div>
        <div style={{ fontSize: 44, fontWeight: 600, lineHeight: 1.2, marginTop: 18, color: COLORS.black }}>
          Let it lead you to the stock.
        </div>
      </div>

      {/* theme screen inside a device frame, +30% (326→424). At this size it's ~857
          tall, so it's moved left/up to fit the active area AND keep its right edge
          clear of the top-right logo reserve (x<1464). */}
      <PhoneFrame x={1030} y={86} w={424} img={ASSETS.theme22} delay={14} />
    </SceneWrap>
  );
};
