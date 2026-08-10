/**
 * SC01 — Hook: three possible directions (from 0, dur 462).
 *
 * A chart that refuses to answer. The shape is traced from Simon's reference,
 * and the ambiguity is in the DATA — the three questions the narration asks
 * genuinely have no easy answer, and the viewer can check that themselves.
 *
 * The scene opens with a camera move, not a fade: the whole chart rides up from
 * below on ONE ease-in-out and settles. The blur peaks at that curve's midpoint,
 * where the move is fastest and the eye cannot resolve detail anyway — which is
 * what makes it read as a camera arriving rather than a graphic sliding.
 *
 * Then one slow breath across the scene: the chart scales up and back down
 * exactly once. Card, candles and gridlines ride it TOGETHER, because they are
 * one object. The three questions do not — type in this episode never scales.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card } from "../components/Stage";
import { CandleChart } from "../components/CandleChart";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, progressInOut } from "../helpers";
import { candles } from "../data/shape";
import { HOOK } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  chart: 2, // "Pernah buka chart"
  naik: 126, // "naik, turun"
  turun: 160,
  sideways: 194, // "tanpa arah"
  settle: 274, // "Bukan berarti"
  habit: 353, // "kebiasaan penting"
};

/** The entrance: how far below it starts, how long the move takes, peak blur. */
const ENTER = { from: 180, over: 26, blur: 9 };
/** The single breath. One rise and one fall — never a loop. */
const BREATH = { at: 60, over: 360, amount: 0.03 };

/** Three questions, 300px apart, centred on the canvas. */
const QUESTION = { gap: 300, y: theme.stage.plot.y + 26, size: theme.text.tag.size };
const QUESTION_X = [-1, 0, 1].map((i) => theme.canvas.width / 2 + i * QUESTION.gap);

/**
 * The chart's own box: inset EQUALLY from both sides of the card, so the
 * candles and their gridlines sit centred on the white surface. The shared plot
 * rect leaves room on the right for prices, and there are none here.
 */
const BOX = {
  x: theme.stage.card.x + 64,
  y: theme.stage.plot.y + 96,
  w: theme.stage.card.w - 128,
  h: theme.stage.plot.h - 96,
};
/** A few price lines. No numbers. */
const GRID = [4400, 4800, 5200, 5600, 6000];
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 92 bars, matching the reference's density. `rough` lets closes sit slightly
 * off the curve so the bodies alternate and the odd doji prints — without it a
 * dense series reads as a smooth ribbon rather than a chart.
 */
export const BARS = candles(HOOK, 92, 17, 0.012);

const CENTRE = `${theme.stage.card.x + theme.stage.card.w / 2}px ${theme.stage.card.y + theme.stage.card.h / 2}px`;

export const Scene01 = () => {
  const f = useCurrentFrame();

  // ── the entrance ──
  const arrive = progressInOut(f, T.chart, ENTER.over);
  const dy = ENTER.from * (1 - arrive);
  const blur = Math.sin(Math.PI * arrive) * ENTER.blur;

  // ── one slow breath, up and back down ──
  const breath = f >= BREATH.at && f < BREATH.at + BREATH.over ? Math.sin(Math.PI * ((f - BREATH.at) / BREATH.over)) : 0;

  const plotted = progress(f, T.chart + 8, 96);
  // on the last line the questions step back — asked, not answered
  const dim = 1 - 0.55 * progress(f, T.habit, 20);

  return (
    <Stage>
      {/* card, candles and gridlines are ONE object and move as one */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${dy}px) scale(${1 + BREATH.amount * breath})`,
          transformOrigin: CENTRE,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        <Card>
          <CandleChart bars={BARS} box={BOX} reveal={plotted} ticks={GRID} tickLabels={false} />
        </Card>
      </div>

      <Chip label="Naik?" size={QUESTION.size} x={QUESTION_X[0]} y={QUESTION.y} tone="indigo" at={T.naik} opacity={dim} />
      <Chip label="Turun?" size={QUESTION.size} x={QUESTION_X[1]} y={QUESTION.y} tone="indigo" at={T.turun} opacity={dim} />
      <Chip label="Sideways?" size={QUESTION.size} x={QUESTION_X[2]} y={QUESTION.y} tone="indigo" at={T.sideways} opacity={dim} />
    </Stage>
  );
};
