/**
 * Scene 19 — Monitoring chapter open (comp 4903–5037, dur 134). Header owned by
 * Step3Frame; this overlay adds a price chart with a steady "Watching" cursor
 * and a "Discipline" chip. Illustration. Frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { LineChart, CursorPing, Chip, Illustration } from "../components";
import type { Line } from "../components";
import { clamp01, pop, textReveal } from "../helpers";

const CHART = Math.round(1.8 * 30); // @1.8s
const CHIP = Math.round(3.2 * 30); // @3.2s

const LINES: Line[] = [{ pts: [[0, 0.4], [0.25, 0.5], [0.5, 0.44], [0.75, 0.56], [1, 0.5]], tone: "indigo" }];

export const Scene19 = () => {
  const f = useCurrentFrame();
  const watch = textReveal(f, CHART + 10, 14);
  const chip = pop(f, CHIP, 14);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <LineChart x={200} y={300} w={1200} h={480} lines={LINES} frame={f} drawStart={CHART} drawDur={30} />
      <CursorPing x={1360} y={520} frame={f} start={CHART + 10} mode="hold" />
      <div style={{ position: "absolute", left: 1360, top: 470, fontSize: 26, fontWeight: theme.font.weights.bold, color: theme.colors.grey, ...watch }}>Watching</div>
      <div style={{ position: "absolute", left: 200, top: 810, opacity: chip.opacity, transform: `scale(${chip.scale})`, transformOrigin: "left center" }}>
        <Chip label="Discipline" tone="indigo" active dot fontSize={30} />
      </div>
      <Illustration op={clamp01((f - CHART) / 16)} />
    </AbsoluteFill>
  );
};
