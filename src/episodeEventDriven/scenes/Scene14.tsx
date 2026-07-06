/**
 * Scene 14 — Analysis chapter open (comp 3391–3527, dur 136). Header owned by
 * Step2Frame; this overlay adds the WaveformPair (signal indigo vs noise grey)
 * and a "Real, Or Just Noise?" chip between them. Illustration. Frame = local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { WaveformPair, Chip, Illustration } from "../components";
import { clamp01, pop } from "../helpers";

const WAVE = Math.round(1.5 * 30); // @1.5s
const CHIP = Math.round(3.0 * 30); // @3.0s

export const Scene14 = () => {
  const f = useCurrentFrame();
  const chip = pop(f, CHIP, 14);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <WaveformPair x={300} y={340} w={1000} frame={f} drawStart={WAVE} />
      <div style={{ position: "absolute", left: 1340, top: 430, opacity: chip.opacity, transform: `scale(${chip.scale})`, transformOrigin: "left center" }}>
        <Chip label="Real, Or Just Noise?" tone="indigo" active dot fontSize={28} />
      </div>
      <Illustration op={clamp01((f - WAVE) / 16)} />
    </AbsoluteFill>
  );
};
