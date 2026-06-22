/**
 * S26 (B-top, v3) — "...confirm with the Technical Tab. Watch MA5 — when price
 * closes back above it, that's often the earliest bullish signal..." A single
 * centered phone (combined clip 00:23–00:34, slow ×1.19). A cyan box highlights the
 * MA5 row. Plus the compliance disclaimer chip — the ONLY text in 23–27. No
 * right-zone gauge/chip. Ref: Scene_26.png.
 *
 * TODO(studio): tune BOX_MA5 to the MA5 row on the centred phone.
 * TODO(compliance): confirm disclaimer wording with Tuntun/OJK (v3 brief shows the
 * Indonesian "Edukasi, bukan saran investasi."; currently English for consistency).
 */
import { interpolate, useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { PhoneCenter } from "../components/PhoneCenter";
import { DisclaimerChip } from "../components/DisclaimerChip";
import { ASSETS } from "../timeline";
import { COLORS } from "../theme";

const BOX_MA5 = { x: 775, y: 592, w: 378, h: 46 };

export const Scene26 = () => {
  const frame = useCurrentFrame();
  // Highlight appears at 03:03.15 (local f75) and disappears at 03:10.05 (local f275).
  const boxOp = interpolate(frame, [75, 87, 263, 275], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <SceneWrap fade={0}>
      <PhoneCenter video={ASSETS.combo23_27} startSec={21} top={80} height={865} />
      <div
        style={{
          position: "absolute",
          left: BOX_MA5.x,
          top: BOX_MA5.y,
          width: BOX_MA5.w,
          height: BOX_MA5.h,
          borderRadius: 10,
          border: `2px solid ${COLORS.cyan}`,
          background: "rgba(92,200,227,0.12)",
          opacity: boxOp,
        }}
      />
      {/* compliance chip, bottom-left clear of the phone, subtitle margin & reserve */}
      <DisclaimerChip x={110} y={906} delay={20} />
    </SceneWrap>
  );
};
