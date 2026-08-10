/**
 * SC07 — Downtrend (from 3042, dur 466).
 *
 * The same argument inverted, drawn the same way, so SC19 can compare the two
 * shapes by eye. Peaks stay indigo and troughs stay cyan even though the trend
 * has flipped — the colours name the TURN, not the direction.
 *
 * One deviation, stated plainly: the spec asks for a MIRROR WIPE out of SC06.
 * Wipes are not used as scene transitions in these videos, so this is a hard
 * cut and the descending line traces itself from nothing. The mirroring lives
 * in the SHAPE — DESCENT is the staircase turned over — not in an effect.
 *
 * The first low gets a dot and NO name: nothing has been undercut yet, so there
 * is nothing for it to be lower than.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { StructureLine } from "../components/StructureLine";
import { PivotLabel } from "../components/PivotLabel";
import { Chip } from "../components/Chip";
import { Title } from "../components/Text";
import { theme } from "../theme";
import { progress, ramp } from "../helpers";
import { peaksOf, troughsOf, plot } from "../data/shape";
import { DESCENT } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  draw: 36, // "turun lalu memantul"
  highs: 84, // "berhenti lebih rendah"
  lows: 206, // "titik terendah baru"
  shorten: 336, // "lower high dan lower low"
  title: 422, // "downtrend"
};
const DRAW = { at: T.draw, over: 210 };
const BOX = { x: theme.stage.plot.x, y: theme.stage.plot.y + 30, w: theme.stage.plot.w, h: theme.stage.plot.h - 100 };
const STEP = 46;
// ═══════════════════════════════════════════════════════════════════════════

const P = plot(DESCENT, BOX, { pad: 0.12 });
const PEAKS = peaksOf(DESCENT);
const TROUGHS = troughsOf(DESCENT);
const arrives = (t: number) => DRAW.at + P.reaches(t) * DRAW.over + 6;

export const Scene07 = () => {
  const f = useCurrentFrame();
  const draw = ramp(f, DRAW.at, DRAW.over);
  const shorten = f >= T.shorten ? progress(f, T.shorten, 14) : 0;
  const press = f >= T.lows ? progress(f, T.lows, 28) : 0;
  const newLow = P.turn(TROUGHS[1]); // the low the sellers force

  return (
    <Stage>
      <Title text="Downtrend" at={T.title} />

      <Card>
        <StructureLine plot={P} draw={draw} head />

        {PEAKS.map((idx, k) => {
          const t = P.turn(idx);
          const at = Math.max(T.highs + k * STEP, arrives(t.t));
          return (
            <React.Fragment key={`lh${idx}`}>
              {k === 0 && <PivotLabel x={t.x} y={t.y} label="Lower High" tone="indigo" at={at} opacity={1 - shorten} />}
              <PivotLabel x={t.x} y={t.y} label="LH" tone="indigo" at={k === 0 ? T.shorten : at} opacity={k === 0 ? shorten : 1} />
            </React.Fragment>
          );
        })}

        {TROUGHS.map((idx, k) => {
          const t = P.turn(idx);
          const at = Math.max(k === 0 ? T.draw + 30 : T.lows + (k - 1) * STEP, arrives(t.t));
          if (k === 0) return <PivotLabel key={`ll${idx}`} x={t.x} y={t.y} tone="cyan" at={at} />;
          return (
            <React.Fragment key={`ll${idx}`}>
              {k === 1 && <PivotLabel x={t.x} y={t.y} label="Lower Low" tone="cyan" side="below" at={at} opacity={1 - shorten} />}
              <PivotLabel x={t.x} y={t.y} label="LL" tone="cyan" side="below" at={k === 1 ? T.shorten : at} opacity={k === 1 ? shorten : 1} />
            </React.Fragment>
          );
        })}

        {/* sellers leaning on it — descriptive pressure, never an exit marker */}
        {press > 0.001 && (
          <Layer>
            {[0, 1, 2].map((i) => {
              const a = Math.max(0, Math.min(1, press * 3 - i));
              const y = newLow.y - 98 + 22 * a;
              const x = newLow.x - 34 + i * 34;
              return <polygon key={i} points={`${x},${y} ${x - 11},${y - 18} ${x + 11},${y - 18}`} fill={theme.color.slate} opacity={a * 0.9} />;
            })}
          </Layer>
        )}
        {/* tied back with a hairline: directly above the trough is where the
            Lower High label already sits */}
        {press > 0.4 && (
          <Chip label="Penjual Menekan" x={newLow.x + 300} y={newLow.y - 250} tone="slate" at={T.lows + 12} leaderTo={{ x: newLow.x, y: newLow.y - 30 }} />
        )}
      </Card>
    </Stage>
  );
};
