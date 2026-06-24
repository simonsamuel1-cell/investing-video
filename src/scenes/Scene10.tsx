/**
 * Scene 10 — Closing Principle (native, bookend to Scene 2's restraint). 498f.
 * Two-line principle resolves, then reduces to a single held lockup.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneWrap } from "../components";
import { COLORS, TYPE, WEIGHT } from "../theme";
import { fadeIn, fadeOut, popIn } from "../helpers";

export const Scene10 = () => {
  const frame = useCurrentFrame();

  const line1 = popIn(frame, 160);
  const line2 = popIn(frame, 225);
  const subOp = Math.min(fadeIn(frame, 290, 28), fadeOut(frame, 350, 30));
  const principleOut = fadeOut(frame, 350, 36);
  const lockOp = fadeIn(frame, 372, 34);

  return (
    <SceneWrap>
      {/* principle */}
      <AbsoluteFill
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          opacity: principleOut,
          textAlign: "center",
        }}
      >
        <div style={{ opacity: line1.opacity, transform: `scale(${line1.scale})`, fontSize: TYPE.principle, fontWeight: WEIGHT.bold, color: COLORS.text }}>
          Technical Analysis Isn&rsquo;t Reading Every Indicator.
        </div>
        <div style={{ opacity: line2.opacity, transform: `scale(${line2.scale})`, fontSize: TYPE.principle, fontWeight: WEIGHT.heavy, color: COLORS.primary }}>
          It&rsquo;s Asking The Right Question First.
        </div>
        <div style={{ opacity: subOp, marginTop: 18, fontSize: TYPE.headline, fontWeight: WEIGHT.medium, color: COLORS.slate }}>
          Go Deeper Only When The Answer Is Worth It.
        </div>
      </AbsoluteFill>

      {/* lockup */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: lockOp }}>
        <div style={{ fontSize: TYPE.hero, fontWeight: WEIGHT.heavy, color: COLORS.primary, textAlign: "center" }}>
          Condition First. Details Later.
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};
