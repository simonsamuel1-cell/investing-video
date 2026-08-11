/**
 * 3914 → 4401 — Sideways balance.
 *
 * Sideways is the condition people read as "nothing is happening", so the scene
 * is built to contradict that: the price keeps moving, the turns keep landing,
 * and both force bars keep pushing. What is missing is a WINNER, not activity.
 *
 * The dots deliberately stack at the same two heights. That repetition is the
 * definition the narration gives, so it has to be visible at a glance.
 *
 * LAYOUT: one column, not two. The chart holds the whole card until 4245 and
 * then shrinks UP into a 150px band so the balance can take the space beneath
 * it. Side by side, the two halves competed for the same reading; stacked, the
 * chart states the condition and the bars explain it.
 *
 * The line is NOT traced on. It is complete on the first frame: the claim is
 * about a shape that has been repeating for a while, and a line still being
 * drawn would be arguing that something is underway.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card } from "../components/Stage";
import { StructureLine, Reference } from "../components/StructureLine";
import { PivotLabel } from "../components/PivotLabel";
import { ForceBars } from "../components/ForceBars";
import { Chip } from "../components/Chip";
import { Title } from "../components/Text";
import { theme } from "../theme";
import { progress } from "../helpers";
import { CUTS, cutIn, cutBlur } from "../transitions/CameraCut";
import { peaksOf, troughsOf, plot } from "../data/shape";
import { CHANNEL, CHANNEL_EDGES } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** This scene's `from` in the Composition — needed to read the shared cut. */
const SCENE_FROM = 3914;
const T = {
  title: 0, // "kondisi ketiga: sideways"
  edges: 100, // global 4014 — "area yang hampir sama"
  shrink: 331, // global 4245 — "pembeli dan penjual"
  chip: 427, // global 4341 — "memegang kendali"
};
/** Frames between one dot landing and the next. */
const DOT_STEP = 14;
/** Frames the chart takes to shrink up out of the way. */
const SHRINK_OVER = 26;
/** Full card, centred both ways, while the chart IS the scene. */
const WIDE = { x: theme.stage.plot.x, y: theme.stage.card.y + (theme.stage.card.h - 400) / 2, w: theme.stage.plot.w, h: 400 };
/** A 150px band at the top, once the balance needs the room below it. */
const BAND = { x: theme.stage.plot.x, y: theme.stage.card.y + 40, w: theme.stage.plot.w, h: 150 };
/** The balance, centred in what the chart gives back. */
const FORCE = { cx: theme.canvas.width / 2, cy: 600, width: 880 };
// ═══════════════════════════════════════════════════════════════════════════

const TURNS = [...peaksOf(CHANNEL), ...troughsOf(CHANNEL)].sort((a, b) => a - b);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const Scene09 = () => {
  const f = useCurrentFrame();
  const edges = f >= T.edges ? progress(f, T.edges, 30) : 0;
  const shrink = f >= T.shrink ? progress(f, T.shrink, SHRINK_OVER) : 0;
  const forces = f >= T.shrink + 10 ? progress(f, T.shrink + 10, 30) : 0;

  /** Re-plotted every frame, so every mark on the line rides the shrink. */
  const box = { ...WIDE, y: lerp(WIDE.y, BAND.y, shrink), h: lerp(WIDE.h, BAND.h, shrink) };
  const P = plot(CHANNEL, box, { pad: 0.16 });

  // ── arriving from the right, on the move the last scene left in flight ──
  const g = f + SCENE_FROM;
  const dx = cutIn(g, CUTS.toSideways);
  const blur = cutBlur(g, CUTS.toSideways);

  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${dx}px)`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        <Title text="Sideways" at={T.title} />

        <Card>
          {/* the two levels the market keeps returning to */}
          <Reference x1={box.x} x2={box.x + box.w} y={P.y(CHANNEL_EDGES[1])} draw={edges} color={theme.color.cyan} />
          <Reference x1={box.x} x2={box.x + box.w} y={P.y(CHANNEL_EDGES[0])} draw={edges} color={theme.color.indigo} />

          {/* complete from the first frame — see the note at the top */}
          <StructureLine plot={P} draw={1} />

          {/* dots stacking at the same two heights, over and over */}
          {TURNS.map((idx, k) => {
            const t = P.turn(idx);
            return <PivotLabel key={idx} x={t.x} y={t.y} tone={t.kind === "trough" ? "cyan" : "indigo"} at={T.edges + k * DOT_STEP} />;
          })}

          {/* neither side is winning — equal bars, a divider that only shivers */}
          <ForceBars cx={FORCE.cx} cy={FORCE.cy} width={FORCE.width} reveal={forces} frame={f} />

          {f >= T.chip && <Chip label="Belum ada kendali" x={FORCE.cx} y={FORCE.cy + 190} tone="slate" at={T.chip} />}
        </Card>
      </div>
    </Stage>
  );
};
