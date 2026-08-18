/**
 * SC06 — Moving support and resistance (from 2882, dur 562).
 *
 * ONE CANDLESTICK CHART, TWO PHASES. The label rides the sloping line: it is
 * anchored to the average itself, so as the line climbs the word `Support`
 * climbs with it. That is the whole scene — "the level moves" is shown by the
 * label moving, not stated in a caption.
 *
 * No caption here on purpose. The label riding the line already says it, and a
 * second text element would be a third thing on screen.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartFrame, gridOf, CHART } from "../components/ChartFrame";
import { MALine } from "../components/MALine";
import { LabelChip } from "../components/LabelChip";
import { TitleChip } from "../components/TitleChip";
import { Ping } from "../components/Ping";
import { sec, sma, clamp01 } from "../helpers";
import { SERIES_UPTREND, SERIES_DOWN, toBars } from "../series";
import { CUTS, cutIn, cutPushOut, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const SCENE_FROM = 2882;
const T = { title: sec(0.2), up: sec(0.6), down: sec(10.0) };
/** The cross-fade between the two phases. */
const FADE = 20;
const PERIOD = 16;
/** Bars the price comes back onto the line on — one Ping each. */
const TOUCH_UP = [26, 50];
const TOUCH_DOWN = [24, 48];
/** Where the riding label sits along the line. */
const RIDE_AT = 60;
// ═══════════════════════════════════════════════════════════════════════════

const UP_BARS = toBars(SERIES_UPTREND, 611);
const DOWN_BARS = toBars(SERIES_DOWN, 612);
const UP_DOMAIN: [number, number] = [
  Math.min(...UP_BARS.map((b) => b.l)),
  Math.max(...UP_BARS.map((b) => b.h)),
];
const DOWN_DOMAIN: [number, number] = [
  Math.min(...DOWN_BARS.map((b) => b.l)),
  Math.max(...DOWN_BARS.map((b) => b.h)),
];
const UG = gridOf(SERIES_UPTREND, UP_DOMAIN, CHART);
const DG = gridOf(SERIES_DOWN, DOWN_DOMAIN, CHART);
const UMA = sma(SERIES_UPTREND, PERIOD);
/** Lifted, so the falling average sits ABOVE the candles and caps them. */
/** Lifted just enough to sit ON the highs, so price rallies INTO it and stops. */
const DMA = sma(SERIES_DOWN, PERIOD).map((v) => (v === null ? null : v + 34));

export const Scene06 = () => {
  const f = useCurrentFrame();
  const g = f + SCENE_FROM;
  const dx = cutIn(g, CUTS.toSupport);
  const push = cutPushOut(g, CUTS.toCross, 0.16);
  const blur = Math.max(cutBlur(g, CUTS.toSupport), cutBlur(g, CUTS.toCross));
  const down = clamp01((f - T.down) / FADE);

  return (
    <SafeArea>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${dx}px) scale(${push})`,
          transformOrigin: `${CHART.x + CHART.w / 2}px ${CHART.y + CHART.h / 2}px`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        {down < 0.999 && (
          <div style={{ opacity: 1 - down }}>
            <ChartFrame
              closes={SERIES_UPTREND}
              bars={UP_BARS}
              grid={UG}
              mode="candle"
              f={f}
              drawFrom={T.up}
              drawDur={sec(5)}
              tickLabels={false}
            />
            <MALine values={UMA} grid={UG} f={f} drawFrom={T.up} drawDur={sec(5)} variant="slow" />
            {TOUCH_UP.map((i, k) => (
              <Ping key={i} x={UG.x(i)} y={UG.y(UMA[i] ?? SERIES_UPTREND[i])} f={f} at={T.up + sec(3.4) + k * sec(2.2)} />
            ))}
            {/* anchored to the LINE, so it rides upward as the line slopes */}
            <LabelChip
              text="Support"
              x={UG.x(RIDE_AT)}
              y={UG.y(UMA[RIDE_AT] ?? SERIES_UPTREND[RIDE_AT])}
              f={f}
              at={T.up + sec(4)}
              anchor="below"
              opacity={1 - down}
            />
          </div>
        )}

        {down > 0.001 && (
          <div style={{ opacity: down }}>
            <ChartFrame
              closes={SERIES_DOWN}
              bars={DOWN_BARS}
              grid={DG}
              mode="candle"
              f={f}
              drawFrom={T.down}
              drawDur={sec(4)}
              tickLabels={false}
            />
            <MALine values={DMA} grid={DG} f={f} drawFrom={T.down} drawDur={sec(4)} variant="slow" />
            {TOUCH_DOWN.map((i, k) => (
              <Ping key={i} x={DG.x(i)} y={DG.y(DMA[i] ?? SERIES_DOWN[i])} f={f} at={T.down + sec(2.6) + k * sec(1.8)} />
            ))}
            <LabelChip
              text="Resistance"
              x={DG.x(RIDE_AT)}
              y={DG.y(DMA[RIDE_AT] ?? SERIES_DOWN[RIDE_AT])}
              f={f}
              at={T.down + sec(3)}
              anchor="above"
              opacity={down}
            />
          </div>
        )}

        <TitleChip text="Support & Resistance" f={f} at={T.title} />
      </div>
    </SafeArea>
  );
};
