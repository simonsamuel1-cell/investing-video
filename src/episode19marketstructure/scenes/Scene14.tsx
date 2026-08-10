/**
 * SC14 — Failed higher high. Renders INSIDE CG-B (continuity/FailedPeakGroup).
 *
 * `f` is the GROUP-local frame; SC14 owns 0…492, so its beats are the spec's L
 * values unchanged.
 *
 * The line genuinely HALTS below the dashed reference and stays there — it does
 * not slow down and it does not continue. SC15 resumes the same path from the
 * same frame. That halt is the visual claim the narration makes, and it is why
 * these two are one mounted chart rather than two scenes.
 */
import { Layer } from "../components/SafeArea";
import { ReferenceLine } from "../components/StructureLine";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress } from "../helpers";
import { FAIL_LAST_HH, FAIL_PEAK, type Geom } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
export const SC14 = {
  ref: 96, // "harga gagal"
  push: 189, // "puncak yang lebih tinggi"
  stall: 316, // "tidak mampu melewati"
  alert: 399, // "mulai melemah"
};
// ═══════════════════════════════════════════════════════════════════════════

export const Scene14 = ({ f, g, boxRight }: { f: number; g: Geom; boxRight: number }) => {
  const hh = g.pivot(FAIL_LAST_HH);
  const peak = g.pivot(FAIL_PEAK);
  const ref = f >= SC14.ref ? progress(f, SC14.ref, 30) : 0;
  // buyers trying: two arrows that shrink and fade as the push stalls
  const effort = f >= SC14.push ? Math.max(0, 1 - progress(f, SC14.stall, 40)) * progress(f, SC14.push, 20) : 0;
  const alert = f >= SC14.alert ? progress(f, SC14.alert, 20) : 0;

  return (
    <>
      {/* the last real higher high, extended right */}
      <ReferenceLine x1={hh.x} x2={boxRight} y={hh.y} draw={ref} label="Puncak terakhir" />

      {/* effort, fading: they tried and could not clear it */}
      {effort > 0.001 && (
        <Layer>
          {[0, 1].map((i) => {
            const s = 1 - i * 0.28;
            const x = peak.x - 70 + i * 46;
            const y = peak.y + 96 - i * 14;
            return <polygon key={i} points={`${x},${y - 22 * s} ${x - 13 * s},${y} ${x + 13 * s},${y}`} fill={theme.colors.indigo} opacity={effort * (1 - i * 0.35)} />;
          })}
        </Layer>
      )}

      {/* the failed peak, marked once */}
      {alert > 0.001 && (
        <>
          <Layer opacity={alert}>
            <path d={`M ${peak.x},${peak.y - 62} l 20,34 l -40,0 z`} fill="none" stroke={theme.colors.indigo} strokeWidth={theme.stroke.rule} />
            <line x1={peak.x} y1={peak.y - 50} x2={peak.x} y2={peak.y - 40} stroke={theme.colors.indigo} strokeWidth={theme.stroke.rule} />
          </Layer>
          <Chip label="Gagal HH" x={peak.x + 130} y={peak.y - 46} variant="indigo" startFrame={SC14.alert + 8} />
        </>
      )}
    </>
  );
};
