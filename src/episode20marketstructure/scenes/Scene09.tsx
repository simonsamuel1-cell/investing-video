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
 * then shrinks UP into a 200px band so the balance can take the space beneath
 * it. Side by side, the two halves competed for the same reading; stacked, the
 * chart states the condition and the bars explain it.
 *
 * The line traces itself across the FULL width of the card — every chart in
 * this episode arrives by being drawn, and this one now has the whole card to
 * be drawn across instead of the left half of it.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card } from "../components/Stage";
import { StructureLine, Reference } from "../components/StructureLine";
import { PivotLabel } from "../components/PivotLabel";
import { ForceBars } from "../components/ForceBars";
import { Title } from "../components/Text";
import { theme } from "../theme";
import { progress, ramp } from "../helpers";
import { CUTS, cutIn, cutBlur } from "../transitions/CameraCut";
import { longBreath, LONG_ORIGIN } from "../transitions/Breath";
import { peaksOf, troughsOf, plot } from "../data/shape";
import { CHANNEL, CHANNEL_EDGES } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** This scene's `from` in the Composition — needed to read the shared cut. */
const SCENE_FROM = 3914;
const T = {
  title: 0, // "kondisi ketiga: sideways"
  edges: 100, // global 4014 — "area yang hampir sama"
  shrink: 331, // global 4245 — "pembeli dan penjual"
};
/** Un-eased, so `reaches` maps a turn to the exact frame the line arrives. */
const DRAW = { at: 14, over: 300 };
/** Frames the chart takes to shrink up out of the way. */
const SHRINK_OVER = 26;
/** Full card, centred both ways, while the chart IS the scene. */
const WIDE = {
  x: theme.stage.plot.x,
  y: theme.stage.card.y + (theme.stage.card.h - 400) / 2,
  w: theme.stage.plot.w,
  h: 400,
};
/** A 200px band at the top, once the balance needs the room below it. */
const BAND = {
  x: theme.stage.plot.x,
  y: theme.stage.card.y + 40,
  w: theme.stage.plot.w,
  h: 200,
};
/** The balance, centred in what the chart gives back. */
const FORCE = { cx: theme.canvas.width / 2, cy: 650, width: 880 };
// ═══════════════════════════════════════════════════════════════════════════

const TURNS = [...peaksOf(CHANNEL), ...troughsOf(CHANNEL)].sort(
  (a, b) => a - b,
);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const Scene09 = () => {
  const f = useCurrentFrame();
  const draw = ramp(f, DRAW.at, DRAW.over);
  const edges = f >= T.edges ? progress(f, T.edges, 30) : 0;
  const shrink = f >= T.shrink ? progress(f, T.shrink, SHRINK_OVER) : 0;
  const forces = f >= T.shrink + 10 ? progress(f, T.shrink + 10, 30) : 0;

  /** Re-plotted every frame, so every mark on the line rides the shrink. */
  const box = {
    ...WIDE,
    y: lerp(WIDE.y, BAND.y, shrink),
    h: lerp(WIDE.h, BAND.h, shrink),
  };
  const P = plot(CHANNEL, box, { pad: 0.16 });
  /** A dot never precedes the line: it waits for the trim path to arrive. */
  const arrives = (t: number) => DRAW.at + P.reaches(t) * DRAW.over + 4;

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
          transform: `translateX(${dx}px) scale(${longBreath(g)})`,
          transformOrigin: LONG_ORIGIN,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        <Title text="Sideways" at={T.title} />

        <Card>
          {/* the two levels the market keeps returning to */}
          <Reference
            x1={box.x}
            x2={box.x + box.w}
            y={P.y(CHANNEL_EDGES[1])}
            draw={edges}
            color={theme.color.cyan}
          />
          <Reference
            x1={box.x}
            x2={box.x + box.w}
            y={P.y(CHANNEL_EDGES[0])}
            draw={edges}
            color={theme.color.indigo}
          />

          <StructureLine plot={P} draw={draw} head />

          {/* dots stacking at the same two heights, over and over */}
          {TURNS.map((idx) => {
            const t = P.turn(idx);
            return (
              <PivotLabel
                key={idx}
                x={t.x}
                y={t.y}
                tone={t.kind === "trough" ? "cyan" : "indigo"}
                at={Math.max(T.edges, arrives(t.t))}
              />
            );
          })}

          {/* neither side is winning — equal bars, a divider that only shivers */}
          <ForceBars
            cx={FORCE.cx}
            cy={FORCE.cy}
            width={FORCE.width}
            reveal={forces}
            frame={f}
          />
        </Card>
      </div>
    </Stage>
  );
};
