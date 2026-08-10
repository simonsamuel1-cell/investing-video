/**
 * SC05 — Uptrend staircase. Renders INSIDE CG-A (continuity/StaircaseGroup),
 * never as a top-level scene: SC06 keeps the same line and only adds to it.
 *
 * `f` is the GROUP-local frame; SC05 owns 0…512, so its beats are the spec's
 * L values unchanged.
 *
 * Every peak is a higher high and every trough a higher low. The first of each
 * is named in full; the rest carry the short form, and on "higher high dan
 * higher low" the full labels hand over to the short ones as well.
 */
import React from "react";
import { Layer } from "../components/SafeArea";
import { StructureLine } from "../components/StructureLine";
import { PivotLabel } from "../components/PivotLabel";
import { Chip } from "../components/Chip";
import { Header } from "../components/Header";
import { theme } from "../theme";
import { progress, linear } from "../helpers";
import { UPTREND, UP_PEAKS, UP_TROUGHS, type Geom } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
export const SC05 = {
  title: 0, // "uptrend"
  hh: 61, // "puncak terbentuk lebih tinggi"
  hl: 151, // "lembah juga berhenti lebih tinggi"
  shorten: 227, // "higher high dan higher low"
  breath: 300, // "penurunan kecil"
  breathChip: 421, // "mengambil napas"
};
/** Linear, so arcAt maps a pivot to the exact frame the line reaches it. */
export const DRAW = { from: 0, dur: 200 };
/** The pullback re-framed as a pause: peak 3 → trough 4. */
export const BREATH: [number, number] = [0.45, 0.59];
const LABEL_STEP = 40;
// ═══════════════════════════════════════════════════════════════════════════

/**
 * `labels` lets CG-A fade the HH/HL names out as SC06's numbers take their
 * place — the two would otherwise want the same spot above each pivot.
 */
export const Scene05 = ({ f, g, labels = 1 }: { f: number; g: Geom; labels?: number }) => {
  const draw = linear(f, DRAW.from, DRAW.dur);
  const shorten = f >= SC05.shorten ? progress(f, SC05.shorten, 14) : 0;
  const breath = f >= SC05.breath ? progress(f, SC05.breath, 26) : 0;
  /** A label never precedes the line: it waits for the trim path to arrive. */
  const reach = (t: number) => DRAW.from + g.arcAt(t) * DRAW.dur + 6;

  return (
    <>
      <Header title="Uptrend" startFrame={SC05.title} />

      {/* the pullback, re-framed: a pause inside the climb, not a warning */}
      {breath > 0.001 && (
        <Layer>
          <rect
            x={g.x(BREATH[0])}
            y={g.pivot(3).y - 24}
            width={(g.x(BREATH[1]) - g.x(BREATH[0])) * breath}
            height={g.pivot(4).y - g.pivot(3).y + 48}
            rx={theme.radius.chip}
            fill={theme.colors.indigoTint14}
          />
        </Layer>
      )}

      <StructureLine g={g} draw={draw} head />

      {UP_PEAKS.map((pi, k) => {
        const p = g.pivot(pi);
        const start = Math.max(SC05.hh + k * LABEL_STEP, reach(UPTREND.pivots[pi].t));
        return (
          <React.Fragment key={`hh${pi}`}>
            {k === 0 && <PivotLabel x={p.x} y={p.y} label="Higher High" variant="indigo" startFrame={start} opacity={(1 - shorten) * labels} />}
            <PivotLabel x={p.x} y={p.y} label="HH" variant="indigo" startFrame={k === 0 ? SC05.shorten : start} opacity={(k === 0 ? shorten : 1) * labels} />
          </React.Fragment>
        );
      })}
      {UP_TROUGHS.map((pi, k) => {
        const p = g.pivot(pi);
        const start = Math.max(SC05.hl + k * LABEL_STEP, reach(UPTREND.pivots[pi].t));
        return (
          <React.Fragment key={`hl${pi}`}>
            {k === 0 && <PivotLabel x={p.x} y={p.y} label="Higher Low" variant="cyan" side="below" startFrame={start} opacity={(1 - shorten) * labels} />}
            <PivotLabel x={p.x} y={p.y} label="HL" variant="cyan" side="below" startFrame={k === 0 ? SC05.shorten : start} opacity={(k === 0 ? shorten : 1) * labels} />
          </React.Fragment>
        );
      })}

      {/* clears the peak's own chip, which sits 34px above the pivot */}
      {breath > 0.5 && (
        <Chip label="Ambil Napas" x={(g.x(BREATH[0]) + g.x(BREATH[1])) / 2} y={g.pivot(3).y - 116} variant="indigo" startFrame={SC05.breathChip} />
      )}
    </>
  );
};
