/**
 * S12 (Layout B-top + lift-up popup) — "It organizes the entire IDX market into
 * three layers: Sectors, Concepts, and Groups." A centred phone on the Sector tab;
 * on the "Sectors, Concepts, and Groups" beat a cyan-bordered tab card lifts up
 * and out of the phone's tab region. Reference: Scene_12.png / Scene_12_2.png
 * (layout only). Clip: Scene_12__13__14__15.mp4 @00:00 (Sector tab). (spec §12)
 */
import { Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { PhoneCenter } from "../components/PhoneCenter";
import { ASSETS } from "../timeline";
import { COLORS } from "../theme";
import { fadeIn, ease, springUp } from "../util/anim";

const POPUP_AT = 96; // VO reaches "Sectors, Concepts, and Groups."
// ~20% larger (708→850). Centred in the usable band so the visual frame (incl.
// scale 1.05 overshoot) clears both the y=54 top and y=972 bottom margins.
// Visual ≈ y67–959; the lifted card overlaps its top tab area.
const PHONE = { top: 88, height: 850 };
// 3-Tabs card: centred horizontally (x=960) AND vertically (frame centre y=540).
const CARD = { left: 690, top: 540 - 122 / 2, width: 540, height: 122 };

export const Scene12 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const op = fadeIn(frame, POPUP_AT, 10);
  const lift = ease(frame, [POPUP_AT, POPUP_AT + 20], [160, 0]); // rises out of the phone's tab area
  const scale = 0.9 + 0.1 * springUp(frame, fps, POPUP_AT);

  return (
    <SceneWrap>
      {/* combo12_15 plays from 0, centred horizontally, no edits — fits the
          template 1:1 (clip is 980×1920, matching the screen cutout aspect). */}
      <PhoneCenter
        video={ASSETS.combo12_15}
        startSec={0}
        top={PHONE.top}
        height={PHONE.height}
      />
      {/* tab card that lifts up and out of the phone */}
      <div
        style={{
          position: "absolute",
          left: CARD.left,
          top: CARD.top,
          width: CARD.width,
          height: CARD.height,
          padding: 12,
          borderRadius: 22,
          background: COLORS.white,
          border: `2px solid ${COLORS.cyan}`,
          boxShadow: "0 26px 60px rgba(0,0,0,0.18)",
          opacity: op,
          transform: `translateY(${lift}px) scale(${scale})`,
        }}
      >
        <Img
          src={staticFile(ASSETS.tabs3)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
            scale: 1.14,
          }}
        />
      </div>
    </SceneWrap>
  );
};
