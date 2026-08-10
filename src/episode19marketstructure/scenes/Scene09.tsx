/**
 * SC09 — Sideways balance (from 3914, dur 488).
 *
 * Sideways is the condition people read as "nothing is happening", so the scene
 * is built to contradict that: the price keeps moving, the pivots keep landing,
 * and both force bars keep pushing. What is missing is a WINNER, not activity.
 *
 * The pivot dots deliberately stack at the same two heights — that repetition
 * is the definition the narration gives, so it has to be visible at a glance.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, ChartCard } from "../components/SafeArea";
import { StructureLine, ReferenceLine } from "../components/StructureLine";
import { PivotLabel } from "../components/PivotLabel";
import { ForceBars } from "../components/ForceBars";
import { Chip } from "../components/Chip";
import { Header } from "../components/Header";
import { theme } from "../theme";
import { progress, linear } from "../helpers";
import { SIDEWAYS, SIDEWAYS_PEAKS, SIDEWAYS_TROUGHS, SIDEWAYS_CHANNEL, geom } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  title: 0, // "kondisi ketiga: sideways"
  bounds: 100, // "area yang hampir sama"
  drift: 213, // "belum memilih arah"
  forces: 331, // "pembeli dan penjual"
  chip: 427, // "memegang kendali"
};
const DRAW = { from: 14, dur: 300 };
/** The chart keeps the left of the card; the balance module takes the right. */
const BOX = { x: theme.frame.plot.x, y: theme.frame.plot.y + 40, w: theme.frame.plot.w * 0.58, h: theme.frame.plot.h - 110 };
const FORCE = { cx: theme.frame.plot.x + theme.frame.plot.w * 0.83, cy: theme.frame.plot.y + theme.frame.plot.h * 0.42, w: 420 };
// ═══════════════════════════════════════════════════════════════════════════

const G = geom(SIDEWAYS, BOX, { pad: 0.16 });
const reach = (t: number) => DRAW.from + G.arcAt(t) * DRAW.dur + 4;

export const Scene09 = () => {
  const f = useCurrentFrame();
  const draw = linear(f, DRAW.from, DRAW.dur);
  const bounds = f >= T.bounds ? progress(f, T.bounds, 30) : 0;
  const forces = f >= T.forces ? progress(f, T.forces, 30) : 0;

  return (
    <SafeArea>
      <Header title="Sideways" startFrame={T.title} />

      <ChartCard>
        {/* the two levels the market keeps returning to */}
        <ReferenceLine x1={BOX.x} x2={BOX.x + BOX.w} y={G.y(SIDEWAYS_CHANNEL[1])} draw={bounds} color={theme.colors.cyan} />
        <ReferenceLine x1={BOX.x} x2={BOX.x + BOX.w} y={G.y(SIDEWAYS_CHANNEL[0])} draw={bounds} color={theme.colors.indigo} />

        <StructureLine g={G} draw={draw} head />

        {/* dots stacking at the same two heights, over and over */}
        {SIDEWAYS_PEAKS.map((pi) => {
          const p = G.pivot(pi);
          return <PivotLabel key={`p${pi}`} x={p.x} y={p.y} variant="indigo" startFrame={Math.max(T.bounds, reach(SIDEWAYS.pivots[pi].t))} />;
        })}
        {SIDEWAYS_TROUGHS.map((pi) => {
          const p = G.pivot(pi);
          return <PivotLabel key={`t${pi}`} x={p.x} y={p.y} variant="cyan" startFrame={Math.max(T.bounds, reach(SIDEWAYS.pivots[pi].t))} />;
        })}

        {/* neither side is winning — equal bars, a divider that only shivers */}
        <ForceBars cx={FORCE.cx} cy={FORCE.cy} w={FORCE.w} reveal={forces} frame={f} />
      </ChartCard>

      {f >= T.chip && <Chip label="Belum Ada Kendali" x={FORCE.cx} y={FORCE.cy + 190} variant="slate" startFrame={T.chip} />}
    </SafeArea>
  );
};
