/**
 * SC07 — Downtrend: LH & LL (from 3042, dur 466) — INDEPENDENT.
 *
 * The same argument inverted, drawn the same way, so the two shapes can be
 * compared by eye later in SC19. Peaks stay indigo and troughs stay cyan even
 * though the trend has flipped: the colours name the TURN, not the direction —
 * if they swapped here, the recap cards would teach the wrong thing.
 *
 * One deviation from the doc, deliberate: it asks for a mirror WIPE out of
 * SC06. Wipes between scenes are not used in these videos, so this is a plain
 * hard cut and the descending line simply draws itself from nothing.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartCard } from "../components/ChartCard";
import { PriceLine } from "../components/PriceLine";
import { PivotMarker } from "../components/PivotMarker";
import { Chip } from "../components/Chip";
import { Header } from "../components/Header";
import { theme } from "../theme";
import { usePalette } from "../palette";
import { progress, linear } from "../helpers";
import { DOWNTREND, DOWN_PEAKS, DOWN_TROUGHS, geom } from "../data/structures";
import { CARD, PLOT } from "../layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  draw: 36, // "turun lalu memantul"
  lh: 84, // "berhenti lebih rendah"
  ll: 206, // "titik terendah baru"
  shorten: 336, // "lower high dan lower low"
  title: 422, // "downtrend"
};
const DRAW = { from: T.draw, dur: 210 };
const BOX = { x: PLOT.x, y: PLOT.y + 40, w: PLOT.w, h: PLOT.h - 110 };
// ═══════════════════════════════════════════════════════════════════════════

const G = geom(DOWNTREND, BOX, { pad: 0.12 });
const reach = (t: number) => DRAW.from + G.arcAt(t) * DRAW.dur + 6;

export const Scene07 = () => {
  const pal = usePalette();
  const f = useCurrentFrame();

  const draw = linear(f, DRAW.from, DRAW.dur);
  const shorten = f >= T.shorten ? progress(f, T.shorten, 14) : 0;
  const press = f >= T.ll ? progress(f, T.ll, 28) : 0;
  const firstLow = G.pivot(DOWN_TROUGHS[1]); // the new low the sellers force

  return (
    <SafeArea>
      <Header title="Downtrend" startFrame={T.title} />

      <ChartCard box={CARD}>
        <PriceLine g={G} draw={draw} color={pal.ink} width={3} head />

        {DOWN_PEAKS.map((pi, k) => {
          const p = G.pivot(pi);
          const start = Math.max(T.lh + k * 46, reach(DOWNTREND.pivots[pi].t));
          return (
            <React.Fragment key={`lh${pi}`}>
              {k === 0 && <PivotMarker x={p.x} y={p.y} label="Lower High" variant="indigo" startFrame={start} opacity={1 - shorten} />}
              <PivotMarker x={p.x} y={p.y} label="LH" variant="indigo" startFrame={k === 0 ? T.shorten : start} opacity={k === 0 ? shorten : 1} />
            </React.Fragment>
          );
        })}
        {/* The FIRST low is just a low — nothing has been undercut yet, so it
            gets a dot and no name. The label only appears once there is a
            previous low for it to be lower than. */}
        {DOWN_TROUGHS.map((pi, k) => {
          const p = G.pivot(pi);
          const start = Math.max(k === 0 ? T.draw + 30 : T.ll + (k - 1) * 46, reach(DOWNTREND.pivots[pi].t));
          if (k === 0) return <PivotMarker key={`ll${pi}`} x={p.x} y={p.y} variant="cyan" startFrame={start} />;
          return (
            <React.Fragment key={`ll${pi}`}>
              {k === 1 && <PivotMarker x={p.x} y={p.y} label="Lower Low" variant="cyan" side="below" startFrame={start} opacity={1 - shorten} />}
              <PivotMarker x={p.x} y={p.y} label="LL" variant="cyan" side="below" startFrame={k === 1 ? T.shorten : start} opacity={k === 1 ? shorten : 1} />
            </React.Fragment>
          );
        })}

        {/* sellers leaning on it — descriptive pressure, never an exit marker */}
        {press > 0.001 && (
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
            {[0, 1, 2].map((i) => {
              const a = Math.max(0, Math.min(1, press * 3 - i));
              const y = firstLow.y - 96 + 22 * a;
              const x = firstLow.x - 34 + i * 34;
              return <polygon key={i} points={`${x},${y} ${x - 11},${y - 18} ${x + 11},${y - 18}`} fill={pal.slate} opacity={a * 0.9} />;
            })}
          </svg>
        )}
        {press > 0.4 && <Chip label="Penjual Menekan" x={firstLow.x} y={firstLow.y - 150} variant="slate" startFrame={T.ll + 12} />}
      </ChartCard>
    </SafeArea>
  );
};
