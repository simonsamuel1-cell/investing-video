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
import { progress, ramp } from "../helpers";
import { peaksOf, troughsOf, type Plot } from "../data/shape";
import { morphPoints, morphFront, pathOf, type Morph } from "../transitions/Morph";
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
/** Un-eased, so `reaches` maps a turn to the exact frame the line arrives. */
export const DRAW = { at: 0, over: 200 };
const STEP = 40; // frames between one label and the next
// ═══════════════════════════════════════════════════════════════════════════

const PEAKS = peaksOf(STAIRCASE);
const TROUGHS = troughsOf(STAIRCASE);

/**
 * `names` lets CG-A fade the HH/HL labels out as SC06's numbers take their
 * place — both want the same spot beside each turn.
 */
export const Scene05 = ({ f, p, shape, names = 1 }: { f: number; p: Plot; shape: Morph; names?: number }) => {
  const draw = ramp(f, DRAW.at, DRAW.over);
  /**
   * `draw` no longer trims a path onto an empty card — it advances the
   * transformation of SC04's line into this one. At 0 the picture is SC04's
   * final frame exactly; at 1 it is the staircase.
   */
  const front = morphFront(shape, draw);
  const shorten = f >= SC05.shorten ? progress(f, SC05.shorten, 14) : 0;
  const breath = f >= SC05.breath ? progress(f, SC05.breath, 26) : 0;
  /** A label never precedes the line: it waits for the trim path to arrive. */
  const arrives = (t: number) => DRAW.at + p.reaches(t) * DRAW.over + 6;

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

      {/* always a whole line; what advances is the transformation, not a trim */}
      <Layer>
        <path
          d={pathOf(morphPoints(shape, draw))}
          fill="none"
          stroke={theme.color.ink}
          strokeWidth={theme.shape.line}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {draw > 0.001 && draw < 0.999 && <circle cx={front.x} cy={front.y} r={theme.shape.line + 2} fill={theme.color.ink} />}
      </Layer>

      {PEAKS.map((idx, k) => {
        const t = p.turn(idx);
        const at = Math.max(SC05.highs + k * STEP, arrives(t.t));
        return (
          <React.Fragment key={`hh${idx}`}>
            {k === 0 && <PivotLabel x={t.x} y={t.y} label="Higher high" tone="indigo" at={at} opacity={(1 - shorten) * names} />}
            <PivotLabel x={t.x} y={t.y} label="HH" tone="indigo" at={k === 0 ? SC05.shorten : at} opacity={(k === 0 ? shorten : 1) * names} />
          </React.Fragment>
        );
      })}
      {TROUGHS.map((idx, k) => {
        const t = p.turn(idx);
        const at = Math.max(SC05.lows + k * STEP, arrives(t.t));
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
