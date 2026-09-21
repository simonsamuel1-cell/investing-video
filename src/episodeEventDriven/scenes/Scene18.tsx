/**
 * Scene 18 — Signal spreads (comp 4660–4884, dur 224). A NodeCluster lights one
 * node, then the highlight spreads to neighbours while a capped "Signal
 * Strength" meter climbs. Illustration. Frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { NodeCluster, Illustration } from "../components";
import { clamp01, textReveal } from "../helpers";

const c = theme.colors;
const NODE = Math.round(0.5 * 30); // @0.5s one lit node + meter low
const SPREAD = Math.round(2.5 * 30); // @2.5s spread to neighbours
const CLIMB = Math.round(4.5 * 30); // @4.5s more nodes, meter climbs

export const Scene18 = () => {
  const f = useCurrentFrame();
  // meter: low at NODE, climbs after SPREAD, tops out after CLIMB — capped at 1
  const meter = Math.min(1, 0.18 + 0.5 * clamp01((f - SPREAD) / 60) + 0.32 * clamp01((f - CLIMB) / 60));
  const label = textReveal(f, NODE, 16);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <NodeCluster x={160} y={280} w={1000} h={560} frame={f} companyStart={NODE} spreadStart={SPREAD} spreadStep={12} count={8} />

      {/* Signal Strength meter (capped 0..1) */}
      <div style={{ position: "absolute", left: 1260, top: 360, width: 420, ...label }}>
        <div style={{ fontSize: 26, color: c.grey, fontWeight: theme.font.weights.semibold, marginBottom: 14 }}>Signal Strength</div>
        <div style={{ width: "100%", height: 30, borderRadius: 15, background: c.hairline, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${meter * 100}%`, background: c.indigo, borderRadius: 15 }} />
        </div>
        <div style={{ marginTop: 12, fontSize: 40, fontWeight: theme.font.weights.extrabold, color: c.indigo }}>{Math.round(meter * 100)}%</div>
      </div>
      <Illustration op={clamp01((f - NODE) / 16)} />
    </AbsoluteFill>
  );
};
