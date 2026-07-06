/**
 * Scene 8 — Repricing bridge (comp 1872–2059, dur 187), INDEPENDENT scene (own
 * SafeArea). A LineChart draws solid to a "Now" marker, a dashed ghost extends
 * ahead, then a "3 Steps" header + three pills (Screening · Analysis ·
 * Monitoring) preview the framework. Illustration. Frame = scene-local.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { SafeArea, LineChart, Chip, Illustration } from "../components";
import type { Line } from "../components";
import { textReveal, clamp01, pop } from "../helpers";

const DRAW = Math.round(0.5 * 30); // @0.5s solid to Now
const GHOST = Math.round(2.5 * 30); // @2.5s dashed ghost ahead
const HEAD = Math.round(4.0 * 30); // @4.0s header + pills

const LINES: Line[] = [
  { pts: [[0, 0.28], [0.16, 0.36], [0.3, 0.48], [0.42, 0.58], [0.5, 0.72]], tone: "indigo" },
  { pts: [[0.5, 0.72], [0.64, 0.8], [0.78, 0.76], [0.9, 0.88], [1, 0.94]], tone: "grey", dashed: true, start: GHOST - DRAW },
];

export const Scene08 = () => {
  const f = useCurrentFrame();
  const head = textReveal(f, HEAD, 18);
  const pills = ["Screening", "Analysis", "Monitoring"];
  return (
    <SafeArea>
      <LineChart x={96} y={230} w={1180} h={560} lines={LINES} frame={f} drawStart={DRAW} drawDur={40} nowX={0.5} nowLabel="Now" />
      <Illustration op={clamp01((f - DRAW) / 16)} />

      <div style={{ position: "absolute", left: 1330, top: 300, width: 460, fontSize: 64, fontWeight: theme.font.weights.extrabold, color: theme.colors.text, ...head }}>
        3 Steps
      </div>
      <div style={{ position: "absolute", left: 1330, top: 400 }}>
        {pills.map((p, i) => {
          const pp = pop(f, HEAD + 10 + i * 10, 14);
          return (
            <div key={p} style={{ marginBottom: 20, opacity: pp.opacity, transform: `scale(${pp.scale})`, transformOrigin: "left center" }}>
              <Chip label={`${i + 1}. ${p}`} tone={i === 2 ? "cyan" : "indigo"} active dot fontSize={30} />
            </div>
          );
        })}
      </div>
    </SafeArea>
  );
};
