/**
 * StepLink.tsx — the dashed connector between one turning point and the next.
 *
 * Drawn as a STEP, never a diagonal: one vertical leg and one horizontal leg.
 * A diagonal would only say "these two are joined"; the step says HOW MUCH
 * higher or lower, because the vertical leg IS the difference and its length
 * can be read straight off the chart.
 *
 * Peaks take their vertical leg first and then reach across; troughs reach
 * across first and then take the vertical. That keeps every corner in open
 * space instead of on the price line, which is what lets the two families sit
 * on one chart without tangling.
 *
 * SC05 and SC07 both draw from here so the uptrend and the downtrend cannot
 * drift apart — SC19 puts the two pictures side by side and compares them.
 */
import { theme } from "../theme";
import { progress } from "../helpers";
import { Layer } from "./Stage";

export type Pt = { x: number; y: number };

export const stepPath = (a: Pt, b: Pt, riseFirst: boolean) =>
  riseFirst ? `M${a.x},${a.y} L${a.x},${b.y} L${b.x},${b.y}` : `M${a.x},${a.y} L${b.x},${a.y} L${b.x},${b.y}`;

/** Frames a connector takes to appear alongside the mark it arrives with. */
export const LINK_IN = 14;

export const StepLinks = ({
  f,
  links,
  opacity = 1,
}: {
  f: number;
  /** One per connector: the mark it comes FROM, the mark it arrives WITH. */
  links: { at: number; from: Pt; to: Pt; tone: string; riseFirst: boolean }[];
  opacity?: number;
}) => {
  if (opacity <= 0.001) return null;
  return (
    <Layer opacity={opacity}>
      {links
        .filter((l) => f >= l.at)
        .map((l, i) => (
          <path
            key={i}
            d={stepPath(l.from, l.to, l.riseFirst)}
            fill="none"
            stroke={l.tone}
            strokeWidth={theme.shape.rule}
            strokeDasharray="9 9"
            opacity={progress(f, l.at, LINK_IN)}
          />
        ))}
    </Layer>
  );
};
