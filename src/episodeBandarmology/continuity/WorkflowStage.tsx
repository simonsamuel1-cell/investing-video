/**
 * WorkflowStage — Scenes 30→33 persistent chrome. Mounted once at comp frame 5609
 * (dur 3411); never remounts. Owns ONLY the StepRail, and only makes it visible
 * from comp 7839 onward — Steps 1 & 2 (Scenes 22–29) carry their own centred
 * "N. Step" titles, so the rail must stay hidden across that whole range.
 *   • StepRail — active step: Monitor 7839→9020 (Screen & Verify are shown by the
 *     Step-1 / Step-2 titles instead of the rail).
 *
 * TRANSPARENT layer (no background fill) so per-scene content stays visible.
 * Local frame = comp frame − 5609. Scene 23's phone lives in Scene23.tsx and
 * Scene 31's Market Radar video in Scene31.tsx, so no device is owned here.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { StepRail } from "../components";
import { fadeIn, fadeOut } from "../helpers";

// Boundaries in LOCAL frames (comp − 5609).
const RAIL_IN = 99999; // rail retired — every step (Screen/Verify/Monitor) now uses its own "N. Step" title, so the StepRail never shows
const B_VERIFY = 6776 - 5609; // 1167
const B_MONITOR = 7839 - 5609; // 2230

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export const WorkflowStage = () => {
  const f = useCurrentFrame();

  // Rail hidden until 6166, then cross-fade the active highlight between steps.
  const gate = clamp01(fadeIn(f, RAIL_IN, 12));
  const op1 = gate * clamp01(fadeOut(f, B_VERIFY - 6, 12));
  const op2 = gate * clamp01(Math.min(fadeIn(f, B_VERIFY - 6, 12), fadeOut(f, B_MONITOR - 6, 12)));
  const op3 = gate * clamp01(fadeIn(f, B_MONITOR - 6, 12));

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Rail (top-of-content band, respects logo clear-zone) */}
      <div style={{ zIndex: 3 }}>
        <StepRail active={1} op={op1} />
        <StepRail active={2} op={op2} />
        <StepRail active={3} op={op3} />
      </div>
    </AbsoluteFill>
  );
};
