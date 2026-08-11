/**
 * SC05 — Uptrend staircase. Renders INSIDE CG-A, never as a top-level scene:
 * SC06 keeps this exact line and only adds to it.
 *
 * `f` is the GROUP-local frame. SC05 owns 0…512, so its beats are the spec's L
 * values unchanged.
 *
 * Which turns are peaks and which are troughs is not decided here — it comes
 * from the shape, so the scene cannot mislabel one. The first of each kind is
 * named in full; the rest carry the short form, and on "higher high dan higher
 * low" the full names hand over to the short ones too.
 */
import React from "react";
import { Layer } from "../components/Stage";
import { PivotLabel } from "../components/PivotLabel";
import { Chip } from "../components/Chip";
import { Title } from "../components/Text";
import { theme } from "../theme";
import { progress } from "../helpers";
import { peaksOf, troughsOf, type Plot } from "../data/shape";
import { STAIR, zoomed, clipRight, pathOf, CLIP_X } from "../data/staircaseView";
import { STAIRCASE, STAIR_BREATH } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
export const SC05 = {
  title: 0, // "uptrend"
  highs: 65, // global 2030 — "puncak terbentuk lebih tinggi"
  lows: 152, // global 2117 — "lembah juga berhenti lebih tinggi"
  shorten: 224, // global 2189 — the names give way to the short forms
  breath: 300, // "penurunan kecil"
  breathChip: 421, // "mengambil napas"
};
/**
 * Every mark has to be on screen by global 2160 — local 195. The peaks have
 * room to breathe; the troughs start late and have to keep up, so they step
 * faster. The last trough pops at 182 and is settled by 192.
 */
const PEAK_STEP = 40;
const TROUGH_STEP = 15;
/**
 * The first of each kind is just the level. Only the SECOND one can be called
 * higher — there is nothing to be higher than until then, and naming the first
 * "Higher high" is the mistake the whole scene exists to correct.
 */
const PEAK_NAMES = ["High", "Higher high", "Higher high"];
const PEAK_SHORT = ["H", "HH", "HH"];
const TROUGH_NAMES = ["Low", "Higher low", "Higher low"];
const TROUGH_SHORT = ["L", "HL", "HL"];
/** Distance from a turn to its label — PivotLabel's own default, matched. */
const LABEL_GAP = 46;
/**
 * The label sits this far to the LEFT of its dot instead of centred over it —
 * its right edge lands 10px short of the turn. The height is unchanged; only
 * the horizontal anchor moves, so the dot itself is never covered.
 */
const LABEL_DX = -10;
const LABEL_ANCHOR = "right" as const;
/**
 * Per-mark vertical nudge, negative = up. The middle trough's label sat right
 * on the horizontal leg of its own connector, which runs at the PREVIOUS
 * trough's height — 10px of clearance is enough to separate the two.
 */
const TROUGH_DY = [0, -10, 0];
/** Frames a connector takes to appear alongside the mark it arrives with. */
const LINK_IN = 14;
/** The pullback's caption sits at the foot of the card, out of the chart. */
const BREATH_CHIP_Y = theme.stage.card.y + theme.stage.card.h - 50;
/**
 * The staircase is not traced on. SC04 was this same chart cropped to its first
 * step; the scene opens on that crop and DOLLIES BACK until the whole climb is
 * in frame, the further steps sliding in from off-card as the camera pulls out.
 *
 * Nothing is drawn and nothing is morphed. The chart was always whole — only
 * the framing changes, which is the honest picture: the point of this scene is
 * the repetition, and a repetition cannot be seen one leg at a time.
 */

// ═══════════════════════════════════════════════════════════════════════════

const PEAKS = peaksOf(STAIRCASE);
const TROUGHS = troughsOf(STAIRCASE);

type Pt = { x: number; y: number };
/**
 * The connector between one mark and the next, drawn as a STEP rather than a
 * diagonal: a vertical leg and a horizontal one. A diagonal would only say
 * "these two are joined"; the step says HOW MUCH higher, because the vertical
 * leg is the rise itself and you can read its length off the chart.
 *
 * Peaks rise first and then reach across; troughs reach across first and then
 * rise. Either way the corner lands in open space rather than on the price
 * line, which is what makes the two families readable on the same chart.
 */
const stepPath = (a: Pt, b: Pt, riseFirst: boolean) =>
  riseFirst ? `M${a.x},${a.y} L${a.x},${b.y} L${b.x},${b.y}` : `M${a.x},${a.y} L${b.x},${a.y} L${b.x},${b.y}`;

/**
 * `names` lets CG-A fade the HH/HL labels out as SC06's numbers take their
 * place — both want the same spot beside each turn.
 */
export const Scene05 = ({ f, p, zoomOver, names = 1 }: { f: number; p: Plot; zoomOver: number; names?: number }) => {
  /** 0 = SC04's framing, 1 = this scene's. The only thing that animates here. */
  const zoom = f < zoomOver ? progress(f, 0, zoomOver) : 1;
  const shorten = f >= SC05.shorten ? progress(f, SC05.shorten, 14) : 0;
  const breath = f >= SC05.breath ? progress(f, SC05.breath, 26) : 0;

  const from = p.turn(STAIR_BREATH[0]);
  const to = p.turn(STAIR_BREATH[1]);

  return (
    <>
      <Title text="Uptrend" at={SC05.title} />

      {/* the pullback, re-framed: a pause inside the climb, not a warning */}
      {breath > 0.001 && (
        <Layer>
          <rect
            x={from.x}
            y={from.y - 26}
            width={(to.x - from.x) * breath}
            height={to.y - from.y + 52}
            rx={theme.shape.chipRadius}
            fill={theme.color.indigoWashStrong}
          />
        </Layer>
      )}

      {/* the same whole staircase throughout — only the framing moves */}
      <Layer clip={theme.stage.card}>
        <path
          d={pathOf(clipRight(STAIR.points.map((pt) => zoomed(pt, zoom)), CLIP_X))}
          fill="none"
          stroke={theme.color.ink}
          strokeWidth={theme.shape.line}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Layer>

      {/* the steps between marks, arriving with the mark they lead TO and
          leaving the moment the names give way to the short forms */}
      <Layer opacity={(1 - shorten) * names}>
        {[
          ...PEAKS.map((idx, k) => ({ idx, k, at: SC05.highs + k * PEAK_STEP, prev: PEAKS[k - 1], tone: theme.color.indigo, riseFirst: true })),
          ...TROUGHS.map((idx, k) => ({ idx, k, at: SC05.lows + k * TROUGH_STEP, prev: TROUGHS[k - 1], tone: theme.color.cyan, riseFirst: false })),
        ]
          .filter((l) => l.k > 0 && f >= l.at)
          .map((l) => (
            <path
              key={`link${l.tone}${l.idx}`}
              d={stepPath(p.turn(l.prev), p.turn(l.idx), l.riseFirst)}
              fill="none"
              stroke={l.tone}
              strokeWidth={theme.shape.rule}
              strokeDasharray="9 9"
              opacity={progress(f, l.at, LINK_IN)}
            />
          ))}
      </Layer>

      {PEAKS.map((idx, k) => {
        const t = p.turn(idx);
        const at = SC05.highs + k * PEAK_STEP;
        return (
          <React.Fragment key={`hh${idx}`}>
            {/* the dot is drawn once and stays; only the WORD crossfades */}
            <PivotLabel x={t.x} y={t.y} tone="indigo" at={at} opacity={names} />
            <Chip label={PEAK_NAMES[k]} x={t.x + LABEL_DX} y={t.y - LABEL_GAP} anchor={LABEL_ANCHOR} tone="indigo" at={at + 4} opacity={(1 - shorten) * names} />
            <Chip label={PEAK_SHORT[k]} x={t.x + LABEL_DX} y={t.y - LABEL_GAP} anchor={LABEL_ANCHOR} tone="indigo" at={SC05.shorten} opacity={shorten * names} />
          </React.Fragment>
        );
      })}
      {TROUGHS.map((idx, k) => {
        const t = p.turn(idx);
        const at = SC05.lows + k * TROUGH_STEP;
        return (
          <React.Fragment key={`hl${idx}`}>
            <PivotLabel x={t.x} y={t.y} tone="cyan" at={at} opacity={names} />
            <Chip label={TROUGH_NAMES[k]} x={t.x + LABEL_DX} y={t.y + LABEL_GAP + TROUGH_DY[k]} anchor={LABEL_ANCHOR} tone="cyan" at={at + 4} opacity={(1 - shorten) * names} />
            <Chip label={TROUGH_SHORT[k]} x={t.x + LABEL_DX} y={t.y + LABEL_GAP + TROUGH_DY[k]} anchor={LABEL_ANCHOR} tone="cyan" at={SC05.shorten} opacity={shorten * names} />
          </React.Fragment>
        );
      })}

      {/* Down at the foot of the card, clear of the line and of every mark.
          Still centred on the pullback it names, so it reads as a caption for
          that stretch rather than for the chart as a whole. */}
      {breath > 0.5 && <Chip label="Pembeli ambil napas" x={(from.x + to.x) / 2} y={BREATH_CHIP_Y} tone="indigo" at={SC05.breathChip} />}
    </>
  );
};
