/**
 * SC14 — Failed higher high. Renders INSIDE CG-B.
 *
 * `f` is the GROUP-local frame. SC14 owns 0…492, so its beats are the spec's L
 * values unchanged.
 *
 * The line genuinely HALTS below the dashed reference and stays there. It does
 * not slow down and it does not creep. That halt is the visual claim the
 * narration makes, and it is why these two scenes are one mounted chart.
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
  reference: 96, // "harga gagal"
  push: 189, // "puncak yang lebih tinggi"
  stall: 316, // "tidak mampu melewati"
  alert: 399, // "mulai melemah"
};
// ═══════════════════════════════════════════════════════════════════════════

export const Scene14 = ({ f, p, plotRight }: { f: number; p: Plot; plotRight: number }) => {
  const lastHigh = p.turn(FAIL_LAST_HH);
  const stalled = p.turn(FAIL_STALL);
  const ref = f >= SC14.reference ? progress(f, SC14.reference, 30) : 0;
  // buyers trying: two arrows that shrink and fade as the push stalls
  const effort = f >= SC14.push ? Math.max(0, 1 - progress(f, SC14.stall, 40)) * progress(f, SC14.push, 20) : 0;
  const alert = f >= SC14.alert ? progress(f, SC14.alert, 20) : 0;

  return (
    <>
      {/* the last real higher high, extended right */}
      <Reference x1={lastHigh.x} x2={plotRight} y={lastHigh.y} draw={ref} label="Puncak terakhir" />

      {/* effort, fading: they tried and could not clear it */}
      {effort > 0.001 && (
        <Layer>
          {[0, 1].map((i) => {
            const s = 1 - i * 0.28;
            const x = stalled.x - 70 + i * 46;
            const y = stalled.y + 98 - i * 14;
            return <polygon key={i} points={`${x},${y - 22 * s} ${x - 13 * s},${y} ${x + 13 * s},${y}`} fill={theme.color.indigo} opacity={effort * (1 - i * 0.35)} />;
          })}
        </Layer>
      )}

      {/* the failed peak, marked once */}
      {alert > 0.001 && (
        <>
          <Layer opacity={alert}>
            <path d={`M ${stalled.x},${stalled.y - 64} l 20,34 l -40,0 z`} fill="none" stroke={theme.color.indigo} strokeWidth={theme.shape.rule} />
            <line x1={stalled.x} y1={stalled.y - 52} x2={stalled.x} y2={stalled.y - 42} stroke={theme.color.indigo} strokeWidth={theme.shape.rule} />
          </Layer>
          <Chip label="Gagal HH" x={stalled.x + 134} y={stalled.y - 48} tone="indigo" at={SC14.alert + 8} />
        </>
      )}
    </>
  );
};
