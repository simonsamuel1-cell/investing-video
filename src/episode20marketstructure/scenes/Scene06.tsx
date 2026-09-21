/**
 * SC06 — Numbers on the staircase. Renders INSIDE CG-A, on the SAME geometry
 * SC05 drew. Nothing is re-drawn at the boundary.
 *
 * The four prices ARE turns 1–4 of the shape — 5.000 / 4.600 / 5.400 / 4.900 —
 * so the tags are read off the line rather than typed beside it. Move a leg and
 * the tag moves with it. No ticker is attached: these are the script's own
 * teaching numbers, shown plainly.
 *
 * `f` is GROUP-local. SC06 owns 513…1076, so its beats are the spec's L + 513.
 */
import { Layer } from "../components/Stage";
import { Guide, PriceAxis } from "../components/StructureLine";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { fadeIn, progress, price } from "../helpers";
import type { Plot } from "../data/shape";
import { STAIR_TICKS } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** Group-local frame where SC06 begins (global 2478). */
export const SC06_FROM = 513;
const at = (l: number) => l + SC06_FROM;
export const SC06 = {
  axis: at(20),
  n1: at(54), // "5.000"
  n2: at(100), // "4.600"
  n3: at(162), // "5.400"
  n4: at(251), // "4.900"
  compare: at(386), // "sama-sama makin tinggi"
  guide: at(443), // "pola ini terjaga"
};
/** How far right of a turn the delta riser sits — clear of its price chip. */
const RISER_DX = 116;
const TAG_GAP = 46;
// ═══════════════════════════════════════════════════════════════════════════

export const Scene06 = ({ f, p, plotRight }: { f: number; p: Plot; plotRight: number }) => {
  const axis = f >= SC06.axis ? fadeIn(f, SC06.axis, 26) : 0;
  const compare = f >= SC06.compare ? progress(f, SC06.compare, 30) : 0;
  const guide = f >= SC06.guide ? progress(f, SC06.guide, 44) : 0;

  const t1 = p.turn(1);
  const t2 = p.turn(2);
  const t3 = p.turn(3);
  const t4 = p.turn(4);

  return (
    <>
      {/* the light axis arrives WITH the numbers, not before them */}
      <PriceAxis ticks={STAIR_TICKS} plot={p} x1={p.x(0)} x2={plotRight} opacity={axis} format={price} />

      <Chip label={price(5000)} x={t1.x} y={t1.y - TAG_GAP} tone="indigo" at={SC06.n1} />
      <Chip label={price(4600)} x={t2.x} y={t2.y + TAG_GAP} tone="cyan" at={SC06.n2} />
      <Chip label={price(5400)} x={t3.x} y={t3.y - TAG_GAP} tone="indigo" at={SC06.n3} />
      <Chip label={price(4900)} x={t4.x} y={t4.y + TAG_GAP} tone="cyan" at={SC06.n4} />

      {/* 4.900 sits above 4.600, and 5.400 above 5.000 — shown, not claimed.
          The riser is offset past the price chip so the two never overlap. */}
      {compare > 0.001 && (
        <Layer opacity={compare}>
          {[
            [t1, t3],
            [t2, t4],
          ].map(([a, b], i) => {
            const rx = b.x + RISER_DX;
            return (
              <g key={i}>
                <line x1={a.x} y1={a.y} x2={rx} y2={a.y} stroke={theme.color.slate} strokeWidth={theme.shape.hairline} strokeDasharray="10 8" />
                <line x1={rx} y1={a.y} x2={rx} y2={b.y} stroke={theme.color.indigo} strokeWidth={theme.shape.rule} />
                <polygon points={`${rx},${b.y} ${rx - 8},${b.y + 14} ${rx + 8},${b.y + 14}`} fill={theme.color.indigo} />
              </g>
            );
          })}
        </Layer>
      )}

      {/* the guide under the lows — the pattern, as one straight idea */}
      <Guide from={p.turn(2)} to={p.turn(6)} draw={guide} dy={20} />
      {guide > 0.2 && <Chip label="Tren: naik" x={theme.stage.card.x + 56} y={theme.stage.card.y + 56} tone="indigo" anchor="left" at={SC06.guide + 10} />}
    </>
  );
};
