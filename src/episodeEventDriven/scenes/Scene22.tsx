/**
 * Scene 22 — Holds or fades (comp 5418–5631, dur 213). A gap-up candle, then two
 * ghosted continuation branches ("Holds" vs "Fades"), then a VolumeHistogram
 * contrasting "Expanded" vs "Thin". Illustration. Frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { CandleChart, VolumeHistogram, Illustration } from "../components";
import type { Candle, Branch } from "../components";
import { clamp01, textReveal } from "../helpers";

const GAP = Math.round(0.5 * 30); // @0.5s
const BRANCH = Math.round(2.0 * 30); // @2.0s
const VOL = Math.round(4.5 * 30); // @4.5s

const DATA: Candle[] = [
  { o: 100, h: 102, l: 98, c: 101 },
  { o: 101, h: 103, l: 99, c: 100 },
  { o: 100, h: 102, l: 98, c: 100 },
  { o: 112, h: 122, l: 111, c: 121 }, // gap-up
];
const BRANCHES: Branch[] = [
  { pts: [[0, 128], [0, 138]], label: "Holds", tone: "indigo" },
  { pts: [[0, 112], [0, 101]], label: "Fades", tone: "grey" },
];
const BARS = [0.3, 0.34, 0.28, 0.9, 0.82]; // last two expand

export const Scene22 = () => {
  const f = useCurrentFrame();
  const shown = f < GAP ? 0 : Math.min(4, Math.floor(clamp01((f - GAP) / 44) * 4) + 1);
  const volLabel = textReveal(f, VOL, 14);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <CandleChart x={260} y={250} w={900} h={430} data={DATA} frame={f} drawStart={GAP} count={shown} gapIndex={3} branches={BRANCHES} branchStart={BRANCH} />

      <div style={{ position: "absolute", left: 1240, top: 300, width: 420, ...volLabel }}>
        <div style={{ fontSize: 26, fontWeight: theme.font.weights.bold, color: theme.colors.text, marginBottom: 12 }}>Volume confirms</div>
        <VolumeHistogram x={0} y={20} w={420} h={200} bars={BARS} frame={f} drawStart={VOL} activeFrom={3} label="Expanded vs Thin" />
      </div>
      <Illustration op={clamp01((f - GAP) / 16)} />
    </AbsoluteFill>
  );
};
