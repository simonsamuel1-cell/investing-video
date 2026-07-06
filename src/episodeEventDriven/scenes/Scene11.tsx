/**
 * Scene 11 — Leader vs laggard (comp 2801–3022, dur 221). One shared-axis
 * LineChart: a "Leader" line climbs ("Position Early"), a "Laggard" stays
 * flatter ("Hasn't Caught Up"). Illustration. Frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { LineChart, Chip, Illustration } from "../components";
import type { Line } from "../components";
import { clamp01, pop } from "../helpers";

const AXIS = Math.round(0.5 * 30); // @0.5s
const LEAD = Math.round(1.5 * 30); // @1.5s
const LAG = Math.round(4.0 * 30); // @4.0s

const LINES: Line[] = [
  { pts: [[0, 0.22], [0.3, 0.42], [0.6, 0.66], [1, 0.88]], tone: "indigo", start: LEAD - AXIS },
  { pts: [[0, 0.26], [0.4, 0.32], [0.7, 0.38], [1, 0.44]], tone: "grey", start: LAG - AXIS },
];

export const Scene11 = () => {
  const f = useCurrentFrame();
  const lead = pop(f, LEAD + 20, 14);
  const lag = pop(f, LAG + 20, 14);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <LineChart x={200} y={260} w={1200} h={560} lines={LINES} frame={f} drawStart={AXIS} drawDur={34} />
      <div style={{ position: "absolute", left: 1250, top: 300, opacity: lead.opacity, transform: `scale(${lead.scale})`, transformOrigin: "left center" }}>
        <Chip label="Position Early" tone="indigo" active dot fontSize={28} />
      </div>
      <div style={{ position: "absolute", left: 1250, top: 640, opacity: lag.opacity, transform: `scale(${lag.scale})`, transformOrigin: "left center" }}>
        <Chip label="Hasn't Caught Up" tone="grey" dot fontSize={28} />
      </div>
      <Illustration op={clamp01((f - AXIS) / 16)} />
    </AbsoluteFill>
  );
};
