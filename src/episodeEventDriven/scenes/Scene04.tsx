/**
 * Scene 4 — Priced-in outcome (comp 638–876, dur 238). Overlay on RateChart:
 * a StatCard reads Expected: Cut · Actual: Cut · Δ ≈ 0. BI is named in VO only —
 * no figure on screen. Frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { StatCard } from "../components";
import { fadeOut } from "../helpers";

const CARD = Math.round(6.0 * 30); // @6.0s

export const Scene04 = () => {
  const f = useCurrentFrame();
  const out = fadeOut(f, 224, 14); // hand off to Scene 5 near the end
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      <StatCard
        x={150}
        y={340}
        w={480}
        title="When It's Priced In"
        rows={[
          { label: "Expected", value: "Cut", tone: "text" },
          { label: "Actual", value: "Cut", tone: "text" },
          { label: "Δ", value: "≈ 0", tone: "grey" },
        ]}
        frame={f}
        start={CARD}
      />
    </AbsoluteFill>
  );
};
