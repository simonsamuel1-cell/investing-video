/**
 * SC01 — Hook: three possible directions (from 0, dur 462).
 *
 * A chart that refuses to answer. The shape is traced from Simon's reference,
 * and the ambiguity is in the DATA — the three questions the narration asks
 * genuinely have no easy answer, and the viewer can check that themselves.
 *
 * No cursor: the candles and the three questions carry the scene on their own.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card } from "../components/Stage";
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

      <Chip label="Naik?" size={QUESTION_SIZE} x={QUESTION_X[0]} y={QUESTION_Y} tone="indigo" at={T.naik} opacity={dim} />
      <Chip label="Turun?" size={QUESTION_SIZE} x={QUESTION_X[1]} y={QUESTION_Y} tone="indigo" at={T.turun} opacity={dim} />
      <Chip label="Sideways?" size={QUESTION_SIZE} x={QUESTION_X[2]} y={QUESTION_Y} tone="indigo" at={T.sideways} opacity={dim} />

    </Stage>
  );
};
