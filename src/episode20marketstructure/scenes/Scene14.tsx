/**
 * SC14 — Failed higher high. Renders INSIDE CG-B.
 *
 * `f` is the GROUP-local frame. SC14 owns 0…492, so its beats are the spec's L
 * values unchanged.
 *
 * The line genuinely HALTS below the dashed reference and stays there. It does
 * not slow down and it does not creep. That halt is the visual claim the
 * narration makes, and it is why these two scenes are one mounted chart.
 *
 * The failure is marked by MEASURING it, not by decorating it: a vertical line
 * runs from the stalled peak up past the reference it could not reach, and the
 * name sits on top of that line. The gap the line spans is the whole point, so
 * the gap is what is drawn.
 */
import { Layer } from "../components/Stage";
import { Reference } from "../components/StructureLine";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress } from "../helpers";
import type { Plot } from "../data/shape";
import { FAIL_LAST_HH, FAIL_STALL } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
export const SC14 = {
  /**
   * "harga gagal". Moved back from 96 because CG-B now opens on a title card
   * through 6940 and the line cannot both wait for it and finish tracing by
   * 6947. 156 is 7007 — still inside the same clause, and closer to the two
   * words themselves than the start of the sentence was.
   */
  reference: 156,
  push: 189, // "puncak yang lebih tinggi"
  stall: 316, // "tidak mampu melewati"
  alert: 399, // "mulai melemah"
};
/**
 * The drop line off the failed peak. `over` is how far past the dashed
 * reference it reaches — enough to read as "through it", not as "touching it".
 * `labelDy` lifts the name clear of that end; the label rides the line, so
 * lengthening the line raises the label by the same amount.
 *
 * The arrowhead sits at the line's CURRENT end, so it leads the line out of the
 * peak rather than appearing once the line has arrived.
 */
const FAIL_MARK = { over: 20, labelDy: 30 };
/** Shared with SC15's mirror of this mark — same point, same head. */
export const LEADER_ARROW = { w: 12, h: 12 };
// ═══════════════════════════════════════════════════════════════════════════

export const Scene14 = ({ f, p, plotRight }: { f: number; p: Plot; plotRight: number }) => {
  const lastHigh = p.turn(FAIL_LAST_HH);
  const stalled = p.turn(FAIL_STALL);
  const ref = f >= SC14.reference ? progress(f, SC14.reference, 30) : 0;
  const alert = f >= SC14.alert ? progress(f, SC14.alert, 20) : 0;

  /** The top of the drop line: just past the level the push never made. */
  const top = lastHigh.y - FAIL_MARK.over;
  const end = stalled.y + (top - stalled.y) * alert;

  return (
    <>
      {/* the last real higher high, extended right. Unlabelled — the drop line
        and its name say what this level is for. */}
      <Reference x1={lastHigh.x} x2={plotRight} y={lastHigh.y} draw={ref} />

      {/* the failure, measured: the line grows UP out of the peak, so what the
        eye follows is the distance the price did not cover */}
      {alert > 0.001 && (
        <>
          <Layer opacity={alert}>
            <line x1={stalled.x} y1={stalled.y} x2={stalled.x} y2={end} stroke={theme.color.indigo} strokeWidth={theme.shape.rule} />
            <polygon
              points={`${stalled.x},${end} ${stalled.x - LEADER_ARROW.w / 2},${end + LEADER_ARROW.h} ${stalled.x + LEADER_ARROW.w / 2},${end + LEADER_ARROW.h}`}
              fill={theme.color.indigo}
            />
          </Layer>
          <Chip label="Gagal HH" x={stalled.x} y={top - FAIL_MARK.labelDy} tone="indigo" size={theme.text.tag.size} at={SC14.alert + 8} />
        </>
      )}
    </>
  );
};
