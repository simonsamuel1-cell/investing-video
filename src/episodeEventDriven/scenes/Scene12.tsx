/**
 * Scene 12 — Already ran (comp 3032–3184, dur 152). A steep LineChart that has
 * already run up; a grey "Already Ran" label sits at the peak as the cursor
 * recoils, and a name-only "Jesse Livermore" credit card sits in the corner (no
 * portrait). Illustration. Frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { LineChart, CursorPing, Illustration } from "../components";
import type { Line } from "../components";
import { clamp01, textReveal } from "../helpers";

const DRAW = 0; // @0.0s
const LABEL = Math.round(2.0 * 30); // @2.0s
const CREDIT = Math.round(3.5 * 30); // @3.5s

const LINES: Line[] = [{ pts: [[0, 0.16], [0.3, 0.3], [0.55, 0.56], [0.8, 0.86], [1, 0.92]], tone: "indigo" }];

export const Scene12 = () => {
  const f = useCurrentFrame();
  const label = textReveal(f, LABEL, 14);
  const credit = textReveal(f, CREDIT, 16);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <LineChart x={200} y={260} w={1120} h={560} lines={LINES} frame={f} drawStart={DRAW} drawDur={40} />
      <div style={{ position: "absolute", left: 1230, top: 300, fontSize: 30, fontWeight: theme.font.weights.bold, color: theme.colors.grey, ...label }}>
        Already Ran
      </div>
      <CursorPing x={1230} y={360} frame={f} start={LABEL} mode="recoil" />

      {/* name-only credit card */}
      <div style={{ position: "absolute", left: 1360, top: 760, padding: "16px 24px", borderRadius: theme.radius.card, background: theme.colors.cardBg, border: `1px solid ${theme.colors.cardBorder}`, ...credit }}>
        <div style={{ fontSize: 16, color: theme.colors.grey, fontWeight: theme.font.weights.semibold }}>Attributed to</div>
        <div style={{ fontSize: 30, color: theme.colors.text, fontWeight: theme.font.weights.extrabold }}>Jesse Livermore</div>
      </div>
      <Illustration op={clamp01((f - DRAW) / 16)} />
    </AbsoluteFill>
  );
};
