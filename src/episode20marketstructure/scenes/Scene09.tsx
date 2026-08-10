/**
 * SC09 — Sideways balance (from 3914, dur 488).
 *
 * Sideways is the condition people read as "nothing is happening", so the scene
 * is built to contradict that: the price keeps moving, the turns keep landing,
 * and both force bars keep pushing. What is missing is a WINNER, not activity.
 *
 * The dots deliberately stack at the same two heights. That repetition is the
 * definition the narration gives, so it has to be visible at a glance.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card } from "../components/Stage";
import { StructureLine, Reference } from "../components/StructureLine";
import { PivotLabel } from "../components/PivotLabel";
import { ForceBars } from "../components/ForceBars";
import { Chip } from "../components/Chip";
import { Title } from "../components/Text";
import { theme } from "../theme";
import { progress, ramp } from "../helpers";
import { peaksOf, troughsOf, plot } from "../data/shape";
import { CHANNEL, CHANNEL_EDGES } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  title: 0, // "kondisi ketiga: sideways"
  edges: 100, // "area yang hampir sama"
  drift: 213, // "belum memilih arah"
  forces: 331, // "pembeli dan penjual"
  chip: 427, // "memegang kendali"
};
const DRAW = { at: 14, over: 300 };
/** The chart keeps the left of the card; the balance module takes the right. */
const BOX = { x: theme.stage.plot.x, y: theme.stage.plot.y + 30, w: theme.stage.plot.w * 0.58, h: theme.stage.plot.h - 100 };
const FORCE = { cx: theme.stage.plot.x + theme.stage.plot.w * 0.83, cy: theme.stage.plot.y + theme.stage.plot.h * 0.42, width: 420 };
// ═══════════════════════════════════════════════════════════════════════════

const P = plot(CHANNEL, BOX, { pad: 0.16 });
const TURNS = [...peaksOf(CHANNEL), ...troughsOf(CHANNEL)];
const arrives = (t: number) => DRAW.at + P.reaches(t) * DRAW.over + 4;

export const Scene09 = () => {
  const f = useCurrentFrame();
  const draw = ramp(f, DRAW.at, DRAW.over);
  const edges = f >= T.edges ? progress(f, T.edges, 30) : 0;
  const forces = f >= T.forces ? progress(f, T.forces, 30) : 0;

  return (
    <Stage>
      <Title text="Sideways" at={T.title} />

      <Card>
        {/* the two levels the market keeps returning to */}
        <Reference x1={BOX.x} x2={BOX.x + BOX.w} y={P.y(CHANNEL_EDGES[1])} draw={edges} color={theme.color.cyan} />
        <Reference x1={BOX.x} x2={BOX.x + BOX.w} y={P.y(CHANNEL_EDGES[0])} draw={edges} color={theme.color.indigo} />

        <StructureLine plot={P} draw={draw} head />

        {/* dots stacking at the same two heights, over and over */}
        {TURNS.map((idx) => {
          const t = P.turn(idx);
          return <PivotLabel key={idx} x={t.x} y={t.y} tone={t.kind === "trough" ? "cyan" : "indigo"} at={Math.max(T.edges, arrives(t.t))} />;
        })}

        {/* neither side is winning — equal bars, a divider that only shivers */}
        <ForceBars cx={FORCE.cx} cy={FORCE.cy} width={FORCE.width} reveal={forces} frame={f} />
      </Card>

      {f >= T.chip && <Chip label="Belum ada kendali" x={FORCE.cx} y={FORCE.cy + 190} tone="slate" at={T.chip} />}
    </Stage>
  );
};
