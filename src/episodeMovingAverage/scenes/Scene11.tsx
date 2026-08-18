/**
 * SC11 — Where indicators fit (from 6034, dur 636).
 *
 * ORDER OF ARRIVAL IS THE ARGUMENT. Your own marks go on the chart first — a
 * trendline, a breakout, a level — and the indicators fade in over them
 * afterwards, visibly agreeing with what is already there. Foundation, then
 * confirmation, said by sequence rather than by a stacked diagram.
 *
 * No layer stack. A schematic of the idea would replace the demonstration of it.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartFrame, gridOf, Layer, clearAbove, clearBelow, CHART } from "../components/ChartFrame";
import { BollingerBands } from "../components/BollingerBands";
import { MALine } from "../components/MALine";
import { LabelChip } from "../components/LabelChip";
import { TitleChip } from "../components/TitleChip";
import { theme } from "../theme";
import { sec, sma, bollinger, progress, progressInOut, fadeOut, textReveal } from "../helpers";
import { SERIES_UPTREND, BARS_UPTREND as BARS } from "../series";
import { CUTS, cutIn, cutPushOut, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const SCENE_FROM = 6034;
const T = {
  title: sec(0.2),
  chart: sec(0.4),
  trend: sec(4.0),
  pattern: sec(6.3),
  level: sec(8.6),
  indicators: sec(11.0),
  caption: sec(17.5),
};
const PERIOD = 20;
/** The three marks, in bar indices — your own reading, drawn by hand. */
const TREND = { a: 6, b: 44 };
const BREAK = 52;
const LEVEL_AT = 30;
// ═══════════════════════════════════════════════════════════════════════════

const BB = bollinger(SERIES_UPTREND, PERIOD, 2);
const DOMAIN: [number, number] = [
  Math.min(...BB.lower.filter((v): v is number => v !== null), ...BARS.map((b) => b.l)),
  Math.max(...BB.upper.filter((v): v is number => v !== null), ...BARS.map((b) => b.h)),
];
const G = gridOf(SERIES_UPTREND, DOMAIN, CHART);
const MA = sma(SERIES_UPTREND, PERIOD);

export const Scene11 = () => {
  const f = useCurrentFrame();
  const g = f + SCENE_FROM;
  const dy = cutIn(g, CUTS.toProcess);
  const push = cutPushOut(g, CUTS.toCase, 0.16);
  const blur = Math.max(cutBlur(g, CUTS.toProcess), cutBlur(g, CUTS.toCase));
  const cap = textReveal(f, T.caption);
  /** Each mark's own label leaves as the next one arrives — never three at once. */
  const until = (next: number) => (f >= next ? fadeOut(f, next, 12) : 1);

  return (
    <SafeArea>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${dy}px) scale(${push})`,
          transformOrigin: `${theme.canvas.width / 2}px ${theme.canvas.height / 2}px`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        <ChartFrame
          closes={SERIES_UPTREND}
          bars={BARS}
          grid={G}
          mode="candle"
          f={f}
          drawFrom={T.chart}
          drawDur={sec(3.2)}
          tickLabels={false}
        />

        {/* your marks, first */}
        {f >= T.trend && (
          <Layer opacity={progress(f, T.trend, 16)}>
            <line
              x1={G.x(TREND.a)}
              y1={G.y(SERIES_UPTREND[TREND.a])}
              x2={G.x(TREND.b)}
              y2={G.y(SERIES_UPTREND[TREND.b])}
              stroke={theme.color.indigo}
              strokeWidth={theme.shape.band}
            />
          </Layer>
        )}
        {f >= T.pattern && (
          <Layer opacity={progress(f, T.pattern, 16)}>
            <circle
              cx={G.x(BREAK)}
              cy={G.y(SERIES_UPTREND[BREAK])}
              r={38}
              fill="none"
              stroke={theme.color.indigo}
              strokeWidth={theme.shape.band}
            />
          </Layer>
        )}
        {f >= T.level && (
          <Layer opacity={progress(f, T.level, 16)}>
            <line
              x1={CHART.x + 20}
              y1={G.y(SERIES_UPTREND[LEVEL_AT])}
              x2={CHART.x + CHART.w - 20}
              y2={G.y(SERIES_UPTREND[LEVEL_AT])}
              stroke={theme.color.indigo}
              strokeWidth={theme.shape.band}
              strokeDasharray="10 8"
            />
          </Layer>
        )}

        {/* the indicators, second, agreeing with what is already there */}
        <MALine values={MA} grid={G} f={f} drawFrom={T.indicators} drawDur={sec(3)} variant="slow" />
        {f >= T.indicators && (
          <BollingerBands
            mid={BB.mid}
            upper={BB.upper}
            lower={BB.lower}
            grid={G}
            opacity={progressInOut(f, T.indicators + sec(1), sec(2)) * 0.9}
          />
        )}

        <TitleChip text="Your Analysis" f={f} at={T.title} />

        <LabelChip text="Trend" x={G.x(TREND.b)} y={clearAbove(G, TREND.b, 8, [], BARS)} f={f} at={T.trend + 8} anchor="above" gap={28} opacity={until(T.pattern)} />
        <LabelChip text="Pattern" x={G.x(BREAK)} y={clearAbove(G, BREAK, 8, [], BARS) - 34} f={f} at={T.pattern + 8} anchor="above" gap={28} opacity={until(T.level)} />
        <LabelChip text="Level" x={G.x(6)} y={clearBelow(G, 6, 8, [], BARS)} f={f} at={T.level + 8} anchor="below" gap={28} opacity={until(T.indicators)} />
        <LabelChip text="Trend: Up" x={G.x(SERIES_UPTREND.length - 11)} y={clearAbove(G, SERIES_UPTREND.length - 11, 9, [BB.upper, MA], BARS)} f={f} at={T.indicators + sec(2.4)} anchor="above" gap={28} opacity={until(T.caption)} />

        {f >= T.caption && (
          <div
            style={{
              position: "absolute",
              left: theme.canvas.width / 2,
              top: theme.stage.captionY + cap.dy,
              transform: "translate(-50%, -50%)",
              fontFamily: theme.text.family,
              fontSize: theme.text.label.size,
              fontWeight: theme.text.label.weight,
              color: theme.color.ink,
              opacity: cap.opacity,
            }}
          >
            Second Opinion
          </div>
        )}
      </div>
    </SafeArea>
  );
};
