/**
 * Scene 21 — Don't (comp 5275–5406, dur 131). A large bold "Don't" hold-state
 * stops the cursor; behind it the chart prints the first post-news candles while
 * the cursor waits. Illustration. Frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { CandleChart, CursorPing, Illustration } from "../components";
import type { Candle } from "../components";
import { clamp01 } from "../helpers";

const DONT = 0; // @0.0s
const PRINT = Math.round(2.0 * 30); // @2.0s

const DATA: Candle[] = [
  { o: 100, h: 108, l: 99, c: 106 },
  { o: 106, h: 112, l: 104, c: 108 },
  { o: 108, h: 110, l: 102, c: 104 },
  { o: 104, h: 109, l: 103, c: 107 },
];

export const Scene21 = () => {
  const f = useCurrentFrame();
  const count = Math.min(DATA.length, Math.floor(clamp01((f - PRINT) / 60) * DATA.length));
  const dontOp = clamp01((f - DONT) / 14);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ opacity: 0.4 }}>
        <CandleChart x={300} y={280} w={1000} h={560} data={DATA} frame={f} drawStart={PRINT} count={count} />
      </div>
      <div style={{ position: "absolute", left: 96, top: 380, width: 1728, textAlign: "center", fontSize: 200, fontWeight: theme.font.weights.extrabold, color: theme.colors.text, opacity: dontOp }}>
        Don&rsquo;t
      </div>
      <CursorPing x={1120} y={560} frame={f} start={DONT} mode="hold" />
      <Illustration op={dontOp} />
    </AbsoluteFill>
  );
};
