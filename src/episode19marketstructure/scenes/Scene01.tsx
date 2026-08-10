/**
 * SC01 — Hook: three possible directions (from 0, dur 462).
 *
 * A chart that refuses to answer. The candle sequence is seeded and shaped so
 * three peaks land at nearly the same height and three troughs likewise: the
 * ambiguity is in the DATA, not in the drawing, so the three questions the
 * narration asks genuinely have no easy answer.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { SafeArea, ChartCard, Layer } from "../components/SafeArea";
import { CandleChart } from "../components/CandleChart";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { fadeIn, progress } from "../helpers";
import { AMBIGUOUS_CANDLES, AMBIGUOUS_TICKS } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  chartIn: 2, // "Pernah buka chart"
  naik: 126, // "naik, turun"
  turun: 160,
  sideways: 194, // "tanpa arah"
  settle: 274, // "Bukan berarti"
  habit: 353, // "kebiasaan penting"
};
const CHIP_Y = theme.frame.plot.y + 26;
const CHIP_X = [560, 960, 1364];
/** Candles start below the chip row, so the two can never overlap. */
const BOX = { x: theme.frame.plot.x, y: theme.frame.plot.y + 96, w: theme.frame.plot.w, h: theme.frame.plot.h - 96 };
const SWEEP = { y: 890, halfW: 310 };
// ═══════════════════════════════════════════════════════════════════════════

/**
 * The reading cursor. It drifts across the candles and stops on "Bukan berarti
 * kamu nggak bisa membaca chart" — the moment the narration stops describing
 * confusion and starts addressing the viewer.
 */
const Cursor = ({ f }: { f: number }) => {
  const travel = interpolate(f, [T.chartIn + 20, T.settle], [0.12, 0.74], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.motion.ease,
  });
  const x = BOX.x + BOX.w * travel;
  const y = BOX.y + BOX.h * (0.34 + 0.06 * Math.sin(f / 26));
  const blink = f < T.settle ? 0.45 + 0.55 * (Math.sin(f / 9) > 0 ? 1 : 0) : 1;
  const op = fadeIn(f, T.chartIn + 14, 16) * blink;
  if (op <= 0.001) return null;
  return (
    <Layer>
      <polygon
        points={`${x},${y} ${x},${y + 26} ${x + 7},${y + 19} ${x + 15},${y + 30} ${x + 20},${y + 27} ${x + 12},${y + 17} ${x + 20},${y + 15}`}
        fill={theme.colors.slate}
        opacity={op}
      />
    </Layer>
  );
};

export const Scene01 = () => {
  const f = useCurrentFrame();
  const cardIn = fadeIn(f, T.chartIn, 16);
  const draw = progress(f, T.chartIn + 8, 96);
  // on the last line the questions step back — asked, not answered
  const chipDim = 1 - 0.55 * progress(f, T.habit, 20);
  const sweep = f >= T.habit ? progress(f, T.habit, 34) : 0;

  return (
    <SafeArea>
      <ChartCard opacity={cardIn}>
        <CandleChart
          data={AMBIGUOUS_CANDLES}
          window={[0, AMBIGUOUS_CANDLES.length - 1]}
          box={BOX}
          reveal={draw}
          opacity={cardIn}
          axesOpacity={cardIn * 0.9}
          tickValues={AMBIGUOUS_TICKS}
        />
      </ChartCard>

      <Cursor f={f} />

      <Chip label="Naik?" x={CHIP_X[0]} y={CHIP_Y} variant="outline" startFrame={T.naik} opacity={chipDim} />
      <Chip label="Turun?" x={CHIP_X[1]} y={CHIP_Y} variant="outline" startFrame={T.turun} opacity={chipDim} />
      <Chip label="Sideways?" x={CHIP_X[2]} y={CHIP_Y} variant="cyan" startFrame={T.sideways} opacity={chipDim} />

      {/* one indigo rule sweeps in under the card — the habit, not yet named */}
      {sweep > 0.001 && (
        <Layer>
          <line
            x1={theme.canvas.width / 2 - SWEEP.halfW}
            y1={SWEEP.y}
            x2={theme.canvas.width / 2 - SWEEP.halfW + SWEEP.halfW * 2 * sweep}
            y2={SWEEP.y}
            stroke={theme.colors.indigo}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </Layer>
      )}
    </SafeArea>
  );
};
