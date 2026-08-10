/**
 * SC01 — Hook: three possible directions (from 0, dur 462) — INDEPENDENT.
 *
 * A chart that refuses to answer. The candles alternate green and red with
 * three peaks at nearly the same height and three troughs likewise, so the
 * three questions the narration asks genuinely have no easy answer — the
 * ambiguity is in the data (data/structures AMBIGUOUS), not in the drawing.
 *
 * The scene starts at global 0 rather than the script's 2, so the episode has
 * no black frames; every beat below is therefore the doc's L + 2.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartCard } from "../components/ChartCard";
import { CandlestickChart } from "../components/CandlestickChart";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { usePalette } from "../palette";
import { fadeIn, progress } from "../helpers";
import { AMBIGUOUS_CANDLES } from "../data/structures";
import { CARD, PLOT } from "../layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** The scene opens 2 frames before the first word; doc beats are L + OFFSET. */
const OFFSET = 2;
const B = (l: number) => l + OFFSET;
const T = {
  chartIn: B(0), // "Pernah buka chart"
  naik: B(124), // "naik, turun"
  turun: B(160),
  sideways: B(192), // "tanpa arah"
  settle: B(272), // "Bukan berarti kamu nggak bisa"
  habit: B(351), // "kebiasaan penting"
};
/** Chips sit in a row across the top of the card, above the candles. */
const CHIP_Y = PLOT.y + 26;
const CHIP_X = [560, 960, 1364];
// The candles start below the chip row so nothing ever overlaps.
const BOX = { x: PLOT.x, y: PLOT.y + 96, w: PLOT.w, h: PLOT.h - 96 };
// ═══════════════════════════════════════════════════════════════════════════

/**
 * The reading cursor. It drifts slowly across the candles and stops on
 * "Bukan berarti kamu nggak bisa membaca chart" — the moment the narration
 * stops describing confusion and starts addressing the viewer.
 */
const Cursor = ({ f }: { f: number }) => {
  const pal = usePalette();
  const travel = interpolate(f, [T.chartIn + 20, T.settle], [0.12, 0.74], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.motion.ease,
  });
  const x = BOX.x + BOX.w * travel;
  const y = BOX.y + BOX.h * (0.34 + 0.06 * Math.sin(f / 26));
  const blink = f < T.settle ? 0.45 + 0.55 * (Math.sin(f / 9) > 0 ? 1 : 0) : 1;
  const op = fadeIn(f, T.chartIn + 14, 16) * blink;

  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
      <polygon points={`${x},${y} ${x},${y + 26} ${x + 7},${y + 19} ${x + 15},${y + 30} ${x + 20},${y + 27} ${x + 12},${y + 17} ${x + 20},${y + 15}`} fill={pal.slate} opacity={op} />
    </svg>
  );
};

export const Scene01 = () => {
  const pal = usePalette();
  const f = useCurrentFrame();

  const cardIn = fadeIn(f, T.chartIn, 16);
  const draw = progress(f, T.chartIn + 8, 96);
  // On the last line the questions step back: they have been asked, not answered.
  const chipDim = 1 - 0.55 * progress(f, T.habit, 20);
  const sweep = f >= T.habit ? progress(f, T.habit, 34) : 0;

  return (
    <SafeArea>
      <ChartCard box={CARD} opacity={cardIn}>
        <CandlestickChart
          data={AMBIGUOUS_CANDLES}
          window={[0, AMBIGUOUS_CANDLES.length - 1]}
          box={BOX}
          revealProgress={draw}
          dimOpacity={cardIn}
          axesOpacity={cardIn * 0.9}
          ticks={4}
        />
      </ChartCard>

      <Cursor f={f} />

      {/* The three readings, asked in the order the narration asks them. */}
      <Chip label="Naik?" x={CHIP_X[0]} y={CHIP_Y} variant="indigo" startFrame={T.naik} opacity={chipDim} />
      <Chip label="Turun?" x={CHIP_X[1]} y={CHIP_Y} variant="indigo" startFrame={T.turun} opacity={chipDim} />
      <Chip label="Sideways?" x={CHIP_X[2]} y={CHIP_Y} variant="cyan" startFrame={T.sideways} opacity={chipDim} />

      {/* One indigo rule sweeps in under the card — the habit, not yet named. */}
      {sweep > 0.001 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
          <line
            x1={theme.canvas.width / 2 - 310}
            y1={890}
            x2={theme.canvas.width / 2 - 310 + 620 * sweep}
            y2={890}
            stroke={pal.indigo}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </svg>
      )}
    </SafeArea>
  );
};
