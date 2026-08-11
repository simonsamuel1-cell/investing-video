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
  highs: 61, // "puncak terbentuk lebih tinggi"
  lows: 151, // "lembah juga berhenti lebih tinggi"
  shorten: 227, // "higher high dan higher low"
  breath: 300, // "penurunan kecil"
  breathChip: 421, // "mengambil napas"
};
/**
 * The staircase is not traced on. SC04 was this same chart cropped to its first
 * step; the scene opens on that crop and DOLLIES BACK until the whole climb is
 * in frame, the further steps sliding in from off-card as the camera pulls out.
 *
 * Nothing is drawn and nothing is morphed. The chart was always whole — only
 * the framing changes, which is the honest picture: the point of this scene is
 * the repetition, and a repetition cannot be seen one leg at a time.
 */
const STEP = 40; // frames between one label and the next
// ═══════════════════════════════════════════════════════════════════════════

const PEAKS = peaksOf(STAIRCASE);
const TROUGHS = troughsOf(STAIRCASE);

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

      {PEAKS.map((idx, k) => {
        const t = p.turn(idx);
        const at = SC05.highs + k * STEP;
        return (
          <React.Fragment key={`hh${idx}`}>
            {k === 0 && <PivotLabel x={t.x} y={t.y} label="Higher high" tone="indigo" at={at} opacity={(1 - shorten) * names} />}
            <PivotLabel x={t.x} y={t.y} label="HH" tone="indigo" at={k === 0 ? SC05.shorten : at} opacity={(k === 0 ? shorten : 1) * names} />
          </React.Fragment>
        );
      })}
      {TROUGHS.map((idx, k) => {
        const t = p.turn(idx);
        const at = SC05.lows + k * STEP;
        return (
          <React.Fragment key={`hl${idx}`}>
            {k === 0 && <PivotLabel x={t.x} y={t.y} label="Higher low" tone="cyan" side="below" at={at} opacity={(1 - shorten) * names} />}
            <PivotLabel x={t.x} y={t.y} label="HL" tone="cyan" side="below" at={k === 0 ? SC05.shorten : at} opacity={(k === 0 ? shorten : 1) * names} />
          </React.Fragment>
        );
      })}

      {/* clears the peak's own chip, which sits 46px above the turn */}
      {breath > 0.5 && <Chip label="Ambil napas" x={(from.x + to.x) / 2} y={from.y - 128} tone="indigo" at={SC05.breathChip} />}
    </>
  );
};
