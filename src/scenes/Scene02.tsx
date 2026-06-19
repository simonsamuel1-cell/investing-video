/**
 * S2 (A) — the S1 grid freezes & desaturates to grey-on-silver. Centered bold
 * black "NOISE" with a single cyan underline. (spec §7)
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { TickerGrid } from "../components/TickerGrid";
import { TextCard } from "../components/TextCard";
import { COLORS } from "../theme";
import { fadeIn } from "../util/anim";

export const Scene02 = () => {
  const frame = useCurrentFrame();
  const scrim = fadeIn(frame, 0, 10);
  return (
    <SceneWrap>
      <TickerGrid frozen />
      {/* soft silver scrim to lift the word off the frozen grid */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: scrim }}>
        <div
          style={{
            width: 1000,
            height: 460,
            borderRadius: 999,
            background: "radial-gradient(ellipse at center, rgba(237,238,240,0.96) 0%, rgba(237,238,240,0.70) 55%, rgba(237,238,240,0) 78%)",
          }}
        />
      </AbsoluteFill>
      <TextCard underline underlineWidth={160} delay={6}>
        <div style={{ fontSize: 168, fontWeight: 800, letterSpacing: -2, color: COLORS.black }}>
          NOISE
        </div>
      </TextCard>
    </SceneWrap>
  );
};
