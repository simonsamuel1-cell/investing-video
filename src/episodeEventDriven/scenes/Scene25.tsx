/**
 * Scene 25 — Confirmation checkpoint (comp 6040–6154, dur 114). A "Confirmation"
 * checkpoint chip lights between cards 2 and 3 as the connector draws to card 3
 * (card 3 itself is owned by the RecapFrame StepRail). Frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Chip } from "../components";
import { pop } from "../helpers";

const CHIP = 0; // @0.0s

export const Scene25 = () => {
  const f = useCurrentFrame();
  const chip = pop(f, CHIP, 14);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 1160, top: 320, opacity: chip.opacity, transform: `scale(${chip.scale})`, transformOrigin: "left center" }}>
        <Chip label="Confirmation" tone="cyan" active dot fontSize={28} />
      </div>
    </AbsoluteFill>
  );
};
