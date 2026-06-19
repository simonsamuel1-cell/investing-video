/**
 * S32 (A) — end card. "Concept Sector" wordmark + cyan underline + tagline, and
 * the logo placed in the top-right 360×150 reserve (the ONE scene that uses it,
 * via allowLogoSlot). (spec §7)
 *
 * TODO(assets): replace the text wordmark below with the real Tuntun logo asset
 * (drop a PNG/SVG into public/ and swap in an <Img>).
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { LOGO_RESERVE, COLORS } from "../theme";
import { fadeIn, ease, rise } from "../util/anim";

const LogoMark = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: LOGO_RESERVE.x,
        top: LOGO_RESERVE.y,
        width: LOGO_RESERVE.w,
        height: LOGO_RESERVE.h,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 16,
        opacity: fadeIn(frame, 8, 14),
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: COLORS.purple,
          color: COLORS.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 38,
          fontWeight: 800,
        }}
      >
        T
      </div>
      <span style={{ fontSize: 46, fontWeight: 800, letterSpacing: -0.5, color: COLORS.black }}>Tuntun</span>
    </div>
  );
};

export const Scene32 = () => {
  const frame = useCurrentFrame();
  const lineW = ease(frame, [20, 44], [0, 300]);
  return (
    <SceneWrap allowLogoSlot>
      <LogoMark />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", opacity: fadeIn(frame, 6, 16), transform: `translateY(${rise(frame, 6, 18, 22)}px)` }}>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -1, color: COLORS.black }}>Concept Sector</div>
          <div style={{ height: 7, width: lineW, background: COLORS.cyan, borderRadius: 4, margin: "26px auto 26px" }} />
          <div style={{ fontSize: 38, fontWeight: 600, color: COLORS.black, opacity: fadeIn(frame, 30, 14) }}>
            Built for how the market really moves.
          </div>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};
