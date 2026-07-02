/**
 * WorkflowStage — Scenes 22→33 persistent chrome. Mounted once at comp frame
 * 5609 (dur 3411); never remounts. Owns ONLY the elements that must persist
 * across these scenes:
 *   • StepRail — active step: Screen 5609→6776, Verify 6776→7839, Monitor 7839→9020
 *     (cross-faded ~12f at each boundary).
 *   • PhoneFrame — single instance; appears for Scene 23 (Bandar Tracker →
 *     Dominant Brokers, cross-dissolve) and Scene 31 (Market Radar). Stays
 *     mounted/positioned; only its screen source changes.
 *
 * TRANSPARENT layer (no background fill) so the per-scene content sequenced
 * behind it stays visible. Local frame = comp frame − 5609.
 *
 * Phone is only made visible during Scenes 23 & 31, whose native content is
 * arranged around it, so no scene checklist is ever hidden behind the device.
 *
 * [NEEDS DATA] — Scene 23 Bandar Tracker + Dominant Brokers Analysis captures,
 * Scene 31 Market Radar capture. Replace the placeholders with real recordings
 * (verbatim, no redraw) + on-screen data date when supplied.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { StepRail, PhoneFrame } from "../components";
import { fadeIn, fadeOut } from "../helpers";

// Boundaries in LOCAL frames (comp − 5609).
const B_VERIFY = 6776 - 5609; // 1167
const B_MONITOR = 7839 - 5609; // 2230

// Scene 23 phone window in LOCAL frames. (Scene 31's Market Radar video lives in
// Scene31.tsx so it plays from its own start, not this 3411-frame span.)
const S23_IN = 5806 - 5609; // 197
const S23_OUT = 6165 - 5609; // 556
const S23_DISSOLVE = 5806 - 5609 + 190; // ~387, Bandar Tracker → Dominant Brokers

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export const WorkflowStage = () => {
  const f = useCurrentFrame();

  // Rail cross-fades (render all three, fade the active highlight between them).
  const op1 = clamp01(fadeOut(f, B_VERIFY - 6, 12));
  const op2 = clamp01(Math.min(fadeIn(f, B_VERIFY - 6, 12), fadeOut(f, B_MONITOR - 6, 12)));
  const op3 = clamp01(fadeIn(f, B_MONITOR - 6, 12));

  // Phone visibility window opacities.
  const phoneWin = (inAt: number, outAt: number) =>
    clamp01(Math.min(fadeIn(f, inAt, 12), fadeOut(f, outAt - 12, 12)));

  const win23 = phoneWin(S23_IN, S23_OUT);

  // Within Scene 23, cross-dissolve Bandar Tracker → Dominant Brokers.
  const bandarOp = win23 * clamp01(fadeOut(f, S23_DISSOLVE, 16));
  const brokersOp = win23 * clamp01(fadeIn(f, S23_DISSOLVE, 16));

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Phone (mid-layer) — only visible during Scenes 23 & 31 */}
      <div style={{ zIndex: 1 }}>
        {win23 > 0 && (
          <>
            {/* [NEEDS DATA: Bandar Tracker capture] */}
            <PhoneFrame placeholder="Bandar Tracker capture" op={bandarOp} />
            {/* [NEEDS DATA: Dominant Brokers Analysis capture] */}
            <PhoneFrame placeholder="Dominant Brokers Analysis capture" op={brokersOp} />
          </>
        )}
      </div>

      {/* Rail (top-of-content band, respects logo clear-zone) */}
      <div style={{ zIndex: 3 }}>
        <StepRail active={1} op={op1} />
        <StepRail active={2} op={op2} />
        <StepRail active={3} op={op3} />
      </div>
    </AbsoluteFill>
  );
};
