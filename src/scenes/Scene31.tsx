/**
 * S31 (A) — start with the theme. Text card "Start with the theme. Let it lead you
 * to the stock." + a framed Scene_22_-_1_Theme.jpg thumbnail. (spec §7)
 */
import { Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { ASSETS } from "../timeline";
import { COLORS, RADII } from "../theme";
import { fadeIn, rise, springUp } from "../util/anim";

export const Scene31 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const thumbS = 0.92 + 0.08 * springUp(frame, fps, 14);
  return (
    <SceneWrap>
      {/* text block, left */}
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 360,
          width: 880,
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

      {/* framed thumbnail, right */}
      <div
        style={{
          position: "absolute",
          left: 1230,
          top: 226,
          width: 326,
          height: 620,
          borderRadius: RADII.device,
          border: `3px solid ${COLORS.purple}`,
          overflow: "hidden",
          background: "#000",
          opacity: fadeIn(frame, 14, 14),
          transform: `scale(${thumbS})`,
          boxShadow: "0 24px 56px rgba(70,54,184,0.20)",
        }}
      >
        <Img src={staticFile(ASSETS.theme22)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </SceneWrap>
  );
};
