/**
 * Scene 13 — Leader then followers (comp 3187–3382, dur 195). A "Leader"
 * uptrend is established, a dotted "Path Of Least Resistance" guide appears, and
 * follower lines animate in one after another beneath it. Illustration.
 * Frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { LineChart, Chip, Illustration } from "../components";
import type { Line } from "../components";
import { clamp01, pop } from "../helpers";

const LEAD = Math.round(0.5 * 30); // @0.5s
const GUIDE = Math.round(2.0 * 30); // @2.0s
const FOLLOW = Math.round(3.5 * 30); // @3.5s

const LINES: Line[] = [
  { pts: [[0, 0.32], [0.4, 0.52], [0.7, 0.68], [1, 0.84]], tone: "indigo", start: LEAD },
  { pts: [[0.08, 0.24], [0.45, 0.36], [0.75, 0.5], [1, 0.62]], tone: "grey", start: FOLLOW },
  { pts: [[0.12, 0.18], [0.5, 0.26], [0.8, 0.38], [1, 0.5]], tone: "grey", start: FOLLOW + 24 },
  { pts: [[0.16, 0.12], [0.55, 0.18], [0.85, 0.28], [1, 0.4]], tone: "grey", start: FOLLOW + 48 },
];

export const Scene13 = () => {
  const f = useCurrentFrame();
  const guide = pop(f, GUIDE, 14);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <LineChart x={200} y={260} w={1200} h={560} lines={LINES} frame={f} drawStart={0} drawDur={34} />
      <div style={{ position: "absolute", left: 1250, top: 320, opacity: guide.opacity, transform: `scale(${guide.scale})`, transformOrigin: "left center" }}>
        <Chip label="Path Of Least Resistance" tone="indigo" dot fontSize={26} />
      </div>
      <Illustration op={clamp01((f - LEAD) / 16)} />
    </AbsoluteFill>
  );
};
