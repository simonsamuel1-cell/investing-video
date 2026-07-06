/**
 * RateChart — Rate-decision group, Scenes 4–5 (comp 638–1075), mounted once.
 * Owns ONE CandleChart that never cuts: flat small-body candles with a
 * "Rate Decision" marker fill in during Scene 4; the gap-up run reveals in
 * Scene 5 (new candles only — no existing candle changes). Scenes 4/5 add their
 * StatCard + chip overlays. Illustration tag lives here so it persists.
 *   Scene 4: from 638 dur 238   Scene 5: from 879 dur 196
 * Frame here = group-local (0 at comp 638).
 */
import { useCurrentFrame, Sequence } from "remotion";
import { SafeArea, CandleChart, Illustration } from "../components";
import type { Candle } from "../components";
import { clamp01 } from "../helpers";
import { Scene04 } from "../scenes/Scene04";
import { Scene05 } from "../scenes/Scene05";

const FLAT: Candle[] = [
  { o: 100, h: 103, l: 98, c: 101 },
  { o: 101, h: 104, l: 99, c: 100 },
  { o: 100, h: 102, l: 97, c: 99 },
  { o: 99, h: 103, l: 98, c: 101 },
  { o: 101, h: 104, l: 99, c: 100 },
  { o: 100, h: 103, l: 98, c: 101 }, // index 5 — marked "Rate Decision"
  { o: 101, h: 103, l: 99, c: 100 },
  { o: 100, h: 103, l: 98, c: 100 },
];
const RUN: Candle[] = [
  { o: 112, h: 121, l: 111, c: 120 },
  { o: 120, h: 129, l: 119, c: 128 },
  { o: 128, h: 137, l: 127, c: 136 },
  { o: 136, h: 145, l: 135, c: 144 },
];
const DATA = FLAT.concat(RUN);

const RUN_START = 241 + Math.round(1.5 * 30); // Scene 5 (offset 241) @1.5s → group 286

export const RateChart = () => {
  const f = useCurrentFrame();
  const c1 = clamp01((f - 15) / 140) * 8; // Scene 4: 0→8 flat candles
  const c2 = clamp01((f - RUN_START) / 60) * 4; // Scene 5: +0→4 run candles
  const count = Math.min(12, Math.floor(c1) + (f >= RUN_START ? Math.floor(c2) : 0));

  return (
    <SafeArea>
      <CandleChart
        x={360}
        y={300}
        w={1040}
        h={560}
        data={DATA}
        frame={f}
        drawStart={15}
        count={count}
        marker={{ index: 5, label: "Rate Decision" }}
        gapIndex={8}
      />
      <Illustration op={clamp01((f - 15) / 16)} />

      <Sequence durationInFrames={238} layout="none"><Scene04 /></Sequence>
      <Sequence from={241} durationInFrames={196} layout="none"><Scene05 /></Sequence>
    </SafeArea>
  );
};
