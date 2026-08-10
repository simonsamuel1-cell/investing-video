/**
 * SC01 — Hook: three possible directions (from 0, dur 462).
 *
 * A chart that refuses to answer. HOOK's peaks land at nearly one height and
 * its troughs at another, so the ambiguity is in the DATA — the three questions
 * the narration asks genuinely have no easy answer, and the viewer can check
 * that for themselves.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { CandleChart } from "../components/CandleChart";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { fadeIn, progress } from "../helpers";
import { candles } from "../data/shape";
import { HOOK, HOOK_TICKS } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  chart: 2, // "Pernah buka chart"
  naik: 126, // "naik, turun"
  turun: 160,
  sideways: 194, // "tanpa arah"
  settle: 274, // "Bukan berarti"
  habit: 353, // "kebiasaan penting"
};
const QUESTION_Y = theme.stage.plot.y + 26;
const QUESTION_X = [560, 960, 1364];
const QUESTION_SIZE = theme.text.tag.size; // 30px
/** Candles start below the question row, so the two can never overlap. */
const BOX = { x: theme.stage.plot.x, y: theme.stage.plot.y + 96, w: theme.stage.plot.w, h: theme.stage.plot.h - 96 };
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 92 bars, matching the reference's density. `rough` lets closes sit slightly
 * off the curve so the bodies alternate and the odd doji prints — without it a
 * dense series reads as a smooth ribbon rather than a chart.
 */
export const BARS = candles(HOOK, 92, 17, 0.012);

/**
 * The reading cursor. It drifts across the candles and stops on "Bukan berarti
 * kamu nggak bisa membaca chart" — the moment the narration stops describing
 * confusion and starts addressing the viewer.
 */
const Cursor = ({ f }: { f: number }) => {
  const travel = interpolate(f, [T.chart + 20, T.settle], [0.12, 0.74], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.motion.settle,
  });
  const x = BOX.x + BOX.w * travel;
  const y = BOX.y + BOX.h * (0.34 + 0.06 * Math.sin(f / 26));
  const blink = f < T.settle ? 0.45 + 0.55 * (Math.sin(f / 9) > 0 ? 1 : 0) : 1;
  const o = fadeIn(f, T.chart + 14, 16) * blink;
  if (o <= 0.001) return null;
  return (
    <Layer>
      <polygon
        points={`${x},${y} ${x},${y + 26} ${x + 7},${y + 19} ${x + 15},${y + 30} ${x + 20},${y + 27} ${x + 12},${y + 17} ${x + 20},${y + 15}`}
        fill={theme.color.slate}
        opacity={o}
      />
    </Layer>
  );
};

export const Scene01 = () => {
  const f = useCurrentFrame();
  const card = fadeIn(f, T.chart, 16);
  const plotted = progress(f, T.chart + 8, 96);
  // on the last line the questions step back — asked, not answered
  const dim = 1 - 0.55 * progress(f, T.habit, 20);

  return (
    <Stage>
      <Card opacity={card}>
        <CandleChart bars={BARS} box={BOX} reveal={plotted} opacity={card} axisOpacity={card * 0.9} ticks={HOOK_TICKS} />
      </Card>

      <Cursor f={f} />

      <Chip label="Naik?" size={QUESTION_SIZE} x={QUESTION_X[0]} y={QUESTION_Y} tone="indigo" at={T.naik} opacity={dim} />
      <Chip label="Turun?" size={QUESTION_SIZE} x={QUESTION_X[1]} y={QUESTION_Y} tone="indigo" at={T.turun} opacity={dim} />
      <Chip label="Sideways?" size={QUESTION_SIZE} x={QUESTION_X[2]} y={QUESTION_Y} tone="indigo" at={T.sideways} opacity={dim} />

    </Stage>
  );
};
