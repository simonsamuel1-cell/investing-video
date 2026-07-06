/**
 * Scene 5 — The surprise (comp 879–1075, dur 196). Same chart, no cut: the
 * StatCard flips to Expected: Hold · Actual: Cut · Surprise as the gap-up run
 * prints, then the "The Surprise Is The Trade" chip lands. Frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { StatCard, Chip } from "../components";
import { pop } from "../helpers";

const FLIP = 0; // @0.0s
const CHIP = Math.round(4.0 * 30); // @4.0s

export const Scene05 = () => {
  const f = useCurrentFrame();
  const chip = pop(f, CHIP, 14);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <StatCard
        x={150}
        y={340}
        w={480}
        title="When It Surprises"
        rows={[
          { label: "Expected", value: "Hold", tone: "text" },
          { label: "Actual", value: "Cut", tone: "text" },
          { label: "Read", value: "Surprise", tone: "indigo" },
        ]}
        frame={f}
        start={FLIP}
      />
      <div style={{ position: "absolute", left: 360, top: 900, opacity: chip.opacity, transform: `scale(${chip.scale})`, transformOrigin: "left center" }}>
        <Chip label="The Surprise Is The Trade" tone="indigo" active dot fontSize={28} />
      </div>
    </AbsoluteFill>
  );
};
