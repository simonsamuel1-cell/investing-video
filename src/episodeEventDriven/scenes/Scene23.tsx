/**
 * Scene 23 — Day 1 vs Day 2 (comp 5631–5814, dur 183). Day 1 candles print,
 * then two paths branch across a "Day 1 | Day 2" divider: Path A carries
 * momentum into Day 2, Path B is a one-day flash that fades flat. Illustration.
 * Frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { CandleChart, Illustration } from "../components";
import type { Candle, Branch } from "../components";
import { clamp01, textReveal } from "../helpers";

const c = theme.colors;
const DAY1 = Math.round(0.5 * 30); // @0.5s divider + Day 1
const PATHS = Math.round(2.5 * 30); // @2.5s Path A (and B @4.0 follows)

const DATA: Candle[] = [
  { o: 100, h: 106, l: 99, c: 105 },
  { o: 105, h: 112, l: 104, c: 111 },
  { o: 111, h: 118, l: 110, c: 116 },
  { o: 116, h: 122, l: 114, c: 120 },
];
const BRANCHES: Branch[] = [
  { pts: [[0, 128], [0, 137]], label: "Path A · momentum", tone: "indigo" },
  { pts: [[0, 118], [0, 116]], label: "Path B · fades flat", tone: "grey" },
];

export const Scene23 = () => {
  const f = useCurrentFrame();
  const shown = f < DAY1 ? 0 : Math.min(4, Math.floor(clamp01((f - DAY1) / 44) * 4) + 1);
  const day2 = textReveal(f, PATHS, 14);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <CandleChart x={260} y={280} w={1100} h={520} data={DATA} frame={f} drawStart={DAY1} count={shown} branches={BRANCHES} branchStart={PATHS} />

      {/* Day 1 | Day 2 divider */}
      <div style={{ position: "absolute", left: 720, top: 300, width: 2, height: 480, background: c.line }} />
      <div style={{ position: "absolute", left: 300, top: 250, fontSize: 24, fontWeight: theme.font.weights.bold, color: c.grey, opacity: clamp01((f - DAY1) / 14) }}>Day 1</div>
      <div style={{ position: "absolute", left: 760, top: 250, fontSize: 24, fontWeight: theme.font.weights.bold, color: c.grey, ...day2 }}>Day 2</div>
      <Illustration op={clamp01((f - DAY1) / 16)} />
    </AbsoluteFill>
  );
};
