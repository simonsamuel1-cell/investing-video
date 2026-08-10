/**
 * SC06 — Numbers on the staircase. Renders INSIDE CG-A, on the SAME geometry
 * SC05 drew; nothing is re-drawn at the boundary.
 *
 * The four prices ARE the staircase's own pivot values — UPTREND pivots 1–4 are
 * 5.000 / 4.600 / 5.400 / 4.900 — so the tags are read off the shape rather
 * than typed beside it. Move a pivot and the tag moves with it. They carry no
 * ticker: these are the script's teaching numbers, shown plainly.
 *
 * `f` is GROUP-local; SC06 owns 513…1076, so its beats are the spec's L + 513.
 */
import { Layer } from "../components/SafeArea";
import { GuideLine } from "../components/StructureLine";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { fadeIn, progress, fmtPrice } from "../helpers";
import type { Geom } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** Group-local frame where SC06 begins (global 2478). */
export const SC06_FROM = 513;
const B = (l: number) => l + SC06_FROM;
export const SC06 = {
  axis: B(20),
  n1: B(54), // "5.000"
  n2: B(100), // "4.600"
  n3: B(162), // "5.400"
  n4: B(251), // "4.900"
  compare: B(386), // "sama-sama makin tinggi"
  guide: B(443), // "pola ini terjaga"
};
const AXIS_TICKS = [4400, 4800, 5200, 5600];
/** How far right of a pivot the delta riser sits — clear of its price chip. */
const DELTA_DX = 116;
const TAG_GAP = 40;
// ═══════════════════════════════════════════════════════════════════════════

export const Scene06 = ({ f, g }: { f: number; g: Geom }) => {
  const axis = f >= SC06.axis ? fadeIn(f, SC06.axis, 26) : 0;
  const compare = f >= SC06.compare ? progress(f, SC06.compare, 30) : 0;
  const guide = f >= SC06.guide ? progress(f, SC06.guide, 44) : 0;

  const p1 = g.pivot(1);
  const p2 = g.pivot(2);
  const p3 = g.pivot(3);
  const p4 = g.pivot(4);

  return (
    <>
      {/* the light y-axis arrives WITH the numbers, not before them */}
      {axis > 0.001 && (
        <Layer opacity={axis}>
          {AXIS_TICKS.map((p) => (
            <g key={p}>
              <line x1={g.x(0)} y1={g.y(p)} x2={g.x(1)} y2={g.y(p)} stroke={theme.colors.border} strokeWidth={theme.stroke.hair} />
              <text
                x={g.x(1) + 14}
                y={g.y(p) + 8}
                fontFamily={theme.type.family}
                fontSize={theme.type.axis.size}
                fontWeight={theme.type.axis.weight}
                fill={theme.colors.slate}
              >
                {fmtPrice(p)}
              </text>
            </g>
          ))}
        </Layer>
      )}

      <Chip label={fmtPrice(5000)} x={p1.x} y={p1.y - TAG_GAP} variant="indigo" startFrame={SC06.n1} />
      <Chip label={fmtPrice(4600)} x={p2.x} y={p2.y + TAG_GAP} variant="cyan" startFrame={SC06.n2} />
      <Chip label={fmtPrice(5400)} x={p3.x} y={p3.y - TAG_GAP} variant="indigo" startFrame={SC06.n3} />
      <Chip label={fmtPrice(4900)} x={p4.x} y={p4.y + TAG_GAP} variant="cyan" startFrame={SC06.n4} />

      {/* 4.900 sits above 4.600, and 5.400 above 5.000 — shown, not claimed.
          The riser is offset past the price chip so the two never overlap. */}
      {compare > 0.001 && (
        <Layer opacity={compare}>
          {[
            [p1, p3],
            [p2, p4],
          ].map(([a, b], i) => {
            const rx = b.x + DELTA_DX;
            return (
              <g key={i}>
                <line x1={a.x} y1={a.y} x2={rx} y2={a.y} stroke={theme.colors.slate} strokeWidth={theme.stroke.hair} strokeDasharray="10 8" />
                <line x1={rx} y1={a.y} x2={rx} y2={b.y} stroke={theme.colors.indigo} strokeWidth={theme.stroke.rule} />
                <polygon points={`${rx},${b.y} ${rx - 8},${b.y + 14} ${rx + 8},${b.y + 14}`} fill={theme.colors.indigo} />
              </g>
            );
          })}
        </Layer>
      )}

      {/* the guide under the lows — the pattern, as one straight idea */}
      <GuideLine from={g.pivot(2)} to={g.pivot(6)} draw={guide} dy={18} />
      {guide > 0.2 && (
        <Chip
          label="Tren: Naik"
          x={theme.frame.card.x + 56}
          y={theme.frame.card.y + 56}
          variant="indigo"
          anchor="left"
          startFrame={SC06.guide + 10}
        />
      )}
    </>
  );
};
