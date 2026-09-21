/**
 * S32 (A) — end card. "Concept Sector" wordmark + cyan underline + tagline.
 *
 * NO LOGO. Per Simon's standing instruction the top-right Tuntun logo was removed
 * and must never be re-added (see memory: no-new-logo).
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { COLORS } from "../theme";
import { fadeIn, ease, rise } from "../util/anim";

export const Scene32 = () => {
  const frame = useCurrentFrame();
  const lineW = ease(frame, [20, 44], [0, 300]);
  return (
    <SceneWrap>
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
