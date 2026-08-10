/**
 * SC07 — Downtrend (from 3042, dur 466).
 *
 * The same argument inverted, drawn the same way, so SC19 can compare the two
 * shapes by eye later. Peaks stay indigo and troughs stay cyan even though the
 * trend has flipped: the colours name the TURN, not the direction.
 *
 * One deviation, stated plainly: the spec asks for a MIRROR WIPE out of SC06.
 * Wipes are not used as scene transitions in these videos, so this is a plain
 * hard cut and the descending line simply traces itself from nothing. The
 * mirroring is in the SHAPE, which is SC05's staircase inverted, not in a
 * transition effect.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { SafeArea, ChartCard, Layer } from "../components/SafeArea";
import { StructureLine } from "../components/StructureLine";
import { PivotLabel } from "../components/PivotLabel";
import { Chip } from "../components/Chip";
import { Header } from "../components/Header";
import { theme } from "../theme";
import { progress, linear } from "../helpers";
import { DOWNTREND, DOWN_PEAKS, DOWN_TROUGHS, geom } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  draw: 36, // "turun lalu memantul"
  lh: 84, // "berhenti lebih rendah"
  ll: 206, // "titik terendah baru"
  shorten: 336, // "lower high dan lower low"
  title: 422, // "downtrend"
};
const DRAW = { from: T.draw, dur: 210 };
const BOX = {
  x: theme.frame.plot.x,
  y: theme.frame.plot.y + 40,
  w: theme.frame.plot.w,
  h: theme.frame.plot.h - 110,
};
const LABEL_STEP = 46;
// ═══════════════════════════════════════════════════════════════════════════

const G = geom(DOWNTREND, BOX, { pad: 0.12 });
const reach = (t: number) => DRAW.from + G.arcAt(t) * DRAW.dur + 6;

export const Scene07 = () => {
  const f = useCurrentFrame();
  const draw = linear(f, DRAW.from, DRAW.dur);
  const shorten = f >= T.shorten ? progress(f, T.shorten, 14) : 0;
  const press = f >= T.ll ? progress(f, T.ll, 28) : 0;
  const newLow = G.pivot(DOWN_TROUGHS[1]); // the low the sellers force

  return (
    <SafeArea>
      <Header title="Downtrend" startFrame={T.title} />

      <ChartCard>
        <StructureLine g={G} draw={draw} head />

        {DOWN_PEAKS.map((pi, k) => {
          const p = G.pivot(pi);
          const start = Math.max(
            T.lh + k * LABEL_STEP,
            reach(DOWNTREND.pivots[pi].t),
          );
          return (
            <React.Fragment key={`lh${pi}`}>
              {k === 0 && (
                <PivotLabel
                  x={p.x}
                  y={p.y}
                  label="Lower High"
                  variant="indigo"
                  startFrame={start}
                  opacity={1 - shorten}
                />
              )}
              <PivotLabel
                x={p.x}
                y={p.y}
                label="LH"
                variant="indigo"
                startFrame={k === 0 ? T.shorten : start}
                opacity={k === 0 ? shorten : 1}
              />
            </React.Fragment>
          );
        })}

        {/* The FIRST low is just a low — nothing has been undercut yet, so it
              gets a dot and no name. The label only appears once there is a
              previous low for it to be lower than. */}
        {DOWN_TROUGHS.map((pi, k) => {
          const p = G.pivot(pi);
          const start = Math.max(
            k === 0 ? T.draw + 30 : T.ll + (k - 1) * LABEL_STEP,
            reach(DOWNTREND.pivots[pi].t),
          );
          if (k === 0)
            return (
              <PivotLabel
                key={`ll${pi}`}
                x={p.x}
                y={p.y}
                variant="cyan"
                startFrame={start}
              />
            );
          return (
            <React.Fragment key={`ll${pi}`}>
              {k === 1 && (
                <PivotLabel
                  x={p.x}
                  y={p.y}
                  label="Lower Low"
                  variant="cyan"
                  side="below"
                  startFrame={start}
                  opacity={1 - shorten}
                />
              )}
              <PivotLabel
                x={p.x}
                y={p.y}
                label="LL"
                variant="cyan"
                side="below"
                startFrame={k === 1 ? T.shorten : start}
                opacity={k === 1 ? shorten : 1}
              />
            </React.Fragment>
          );
        })}

        {/* sellers leaning on it — descriptive pressure, never an exit marker */}
        {press > 0.001 && (
          <Layer>
            {[0, 1, 2].map((i) => {
              const a = Math.max(0, Math.min(1, press * 3 - i));
              const y = newLow.y - 96 + 22 * a;
              const x = newLow.x - 34 + i * 34;
              return (
                <polygon
                  key={i}
                  points={`${x},${y} ${x - 11},${y - 18} ${x + 11},${y - 18}`}
                  fill={theme.colors.slate}
                  opacity={a * 0.9}
                />
              );
            })}
          </Layer>
        )}
        {/* tied back with a hairline: directly above the trough is where the
              Lower High chip already sits */}
        {press > 0.4 && (
          <Chip
            label="Penjual Menekan"
            x={newLow.x + 300}
            y={newLow.y - 250}
            variant="slate"
            startFrame={T.ll + 12}
            connectorTo={{ x: newLow.x, y: newLow.y - 30 }}
          />
        )}
      </ChartCard>
    </SafeArea>
  );
};
