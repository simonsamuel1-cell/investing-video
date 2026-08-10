/**
 * SC09 — Sideways: balance of forces (from 3914, dur 488) — INDEPENDENT.
 *
 * Sideways is the condition people read as "nothing is happening", so the scene
 * is built to contradict that: the price keeps moving the whole time, the
 * pivots keep landing, and the two force bars keep pushing. What is missing is
 * a WINNER, not activity — the divider only trembles.
 *
 * The pivot dots deliberately stack at the same two heights. That repetition is
 * the definition the narration gives, so it has to be visible at a glance.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartCard } from "../components/ChartCard";
import { PriceLine } from "../components/PriceLine";
import { PivotMarker } from "../components/PivotMarker";
import { Level } from "../components/Level";
import { ForceBars } from "../components/ForceBars";
import { Chip } from "../components/Chip";
import { Header } from "../components/Header";
import { usePalette } from "../palette";
import { progress, linear } from "../helpers";
import { SIDEWAYS, SIDEWAYS_PEAKS, SIDEWAYS_TROUGHS, SIDEWAYS_CHANNEL, geom } from "../data/structures";
import { CARD, PLOT } from "../layout";

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
const BOX = { x: PLOT.x, y: PLOT.y + 40, w: PLOT.w * 0.58, h: PLOT.h - 110 };
const FORCE = { cx: PLOT.x + PLOT.w * 0.83, cy: PLOT.y + PLOT.h * 0.42, w: 420 };
// ═══════════════════════════════════════════════════════════════════════════

const G = geom(SIDEWAYS, BOX, { pad: 0.16 });
const reach = (t: number) => DRAW.from + G.arcAt(t) * DRAW.dur + 4;

export const Scene09 = () => {
  const pal = usePalette();
  const f = useCurrentFrame();

  const draw = linear(f, DRAW.from, DRAW.dur);
  const bounds = f >= T.bounds ? progress(f, T.bounds, 30) : 0;
  const forces = f >= T.forces ? progress(f, T.forces, 30) : 0;

  return (
    <SafeArea>
      <Header title="Sideways" startFrame={T.title} />

      <ChartCard box={CARD}>
        {/* the two levels the market keeps returning to */}
        <Level x1={BOX.x} x2={BOX.x + BOX.w} y={G.y(SIDEWAYS_CHANNEL[1])} draw={bounds} variant="cyan" />
        <Level x1={BOX.x} x2={BOX.x + BOX.w} y={G.y(SIDEWAYS_CHANNEL[0])} draw={bounds} variant="indigo" />

        <PriceLine g={G} draw={draw} color={pal.ink} width={3} head />

        {/* dots stacking at the same two heights, over and over */}
        {SIDEWAYS_PEAKS.map((pi) => {
          const p = G.pivot(pi);
          return <PivotMarker key={`p${pi}`} x={p.x} y={p.y} variant="indigo" startFrame={Math.max(T.bounds, reach(SIDEWAYS.pivots[pi].t))} />;
        })}
        {SIDEWAYS_TROUGHS.map((pi) => {
          const p = G.pivot(pi);
          return <PivotMarker key={`t${pi}`} x={p.x} y={p.y} variant="cyan" startFrame={Math.max(T.bounds, reach(SIDEWAYS.pivots[pi].t))} />;
        })}

        {/* neither side is winning — equal bars, a divider that only shivers */}
        <ForceBars cx={FORCE.cx} cy={FORCE.cy} w={FORCE.w} reveal={forces} frame={f} buy={1} sell={1} />
      </ChartCard>

      {f >= T.chip && <Chip label="Belum Ada Kendali" x={FORCE.cx} y={FORCE.cy + 190} variant="slate" startFrame={T.chip} />}
    </SafeArea>
  );
};
