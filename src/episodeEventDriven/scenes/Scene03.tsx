/**
 * Scene 3 — Expected vs Actual (comp 268–621, dur 353). The feed has resolved
 * into a TwoBarGap: baseline, Expected (cyan) then Actual (indigo) grow to
 * different lengths, the gap band highlights, "The Gap" chip lands. Illustration.
 * Frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { TwoBarGap, Illustration } from "../components";
import { textReveal, clamp01 } from "../helpers";

const BASE = Math.round(0.5 * 30); // @0.5s
const EXP = Math.round(2.5 * 30); // @2.5s
const ACT = Math.round(5.5 * 30); // @5.5s
const GAP = Math.round(8.0 * 30); // @8.0s
const CHIP = Math.round(9.5 * 30); // @9.5s

export const Scene03 = () => {
  const f = useCurrentFrame();
  const title = textReveal(f, BASE, 18);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 96, top: 150, width: 1200, fontSize: 40, fontWeight: theme.font.weights.bold, color: theme.colors.grey, ...title }}>
        The move isn&rsquo;t the news — it&rsquo;s the distance from what was priced in.
      </div>
      <TwoBarGap x={360} y={430} w={1080} expected={0.52} actual={0.86} frame={f} expStart={EXP} actStart={ACT} gapStart={GAP} chipStart={CHIP} />
      <Illustration op={clamp01((f - BASE) / 16)} />
    </AbsoluteFill>
  );
};
