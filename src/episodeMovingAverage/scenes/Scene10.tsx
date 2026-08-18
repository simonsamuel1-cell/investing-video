/**
 * SC10 — Walking the band (from 5439, dur 595).
 *
 * ONE LABEL THAT GETS CANCELLED. `Sell?` pops at the first touch of the upper
 * band and then STAYS FIXED at that touch point while the price runs away from
 * it. The growing distance between the chip and the candles is the argument —
 * it is visibly wrong for eight seconds before anything strikes it out.
 *
 * No touch counter, no distance caliper. The chip being left behind does the job.
 *
 * ⚠ COMPLIANCE. `Sell?` renders only as a struck-through misconception. There
 * is no buy marker, no entry marker and no exit marker anywhere in this scene.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartFrame, gridOf, clearAbove, CHART } from "../components/ChartFrame";
import { BollingerBands } from "../components/BollingerBands";
import { LabelChip } from "../components/LabelChip";
import { TitleChip } from "../components/TitleChip";
import { theme } from "../theme";
import { sec, bollinger, progress, progressInOut, fadeOut, clamp01 } from "../helpers";
import { SERIES_UPTREND, BARS_UPTREND as BARS } from "../series";
import { CUTS, cutIn, cutOut, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const SCENE_FROM = 5439;
const T = { title: sec(0.2), chart: sec(0.4), sell: sec(4.2), strike: sec(11.0), walk: sec(13.0) };
const PERIOD = 20;
// ═══════════════════════════════════════════════════════════════════════════

const BB = bollinger(SERIES_UPTREND, PERIOD, 2);
const DOMAIN: [number, number] = [
  Math.min(...BB.lower.filter((v): v is number => v !== null), ...BARS.map((b) => b.l)),
  Math.max(...BB.upper.filter((v): v is number => v !== null), ...BARS.map((b) => b.h)),
];
const G = gridOf(SERIES_UPTREND, DOMAIN, CHART);

/** The first bar that closes at or above the upper band — where `Sell?` lands. */
const FIRST_TOUCH = (() => {
  for (let i = PERIOD; i < SERIES_UPTREND.length; i++) {
    const u = BB.upper[i];
    if (u !== null && SERIES_UPTREND[i] >= u - 12) return i;
  }
  return PERIOD + 6;
})();
/**
 * Where the run of band-hugging candles is named.
 *
 * Deliberately NOT at the right-hand end. This scene leaves on a 90px upward
 * cut, and a label sitting high on the last bars gets carried into the
 * top-right logo zone on the way out — which is the one place nothing may go.
 * Two thirds across keeps it left of x = 1368 and low enough to survive the lift.
 */
const WALK_AT = Math.min(SERIES_UPTREND.length - 18, FIRST_TOUCH + 26);

export const Scene10 = () => {
  const f = useCurrentFrame();
  const g = f + SCENE_FROM;
  const dx = cutIn(g, CUTS.toTrap);
  const dy = cutOut(g, CUTS.toProcess);
  const blur = Math.max(cutBlur(g, CUTS.toTrap), cutBlur(g, CUTS.toProcess));
  /** The chart keeps drawing the whole time the chip is being left behind. */
  const shown = clamp01((f - T.chart) / sec(12));

  return (
    <SafeArea>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${dx}px, ${dy}px)`,
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
          drawDur={sec(12)}
          tickLabels={false}
        />
        <BollingerBands
          mid={BB.mid}
          upper={BB.upper}
          lower={BB.lower}
          grid={G}
          opacity={progressInOut(f, T.chart + sec(1), sec(1.4))}
        />

        {/* the title leaves as the second label arrives — at most two at once */}
        <TitleChip
          text="Jebakan Pemula"
          f={f}
          at={T.title}
          opacity={f >= T.walk ? fadeOut(f, T.walk - 12, 14) : 1}
        />

        {/* fixed at the touch it was made on — the price runs away from it */}
        <LabelChip
          text="Sell?"
          x={G.x(FIRST_TOUCH)}
          y={clearAbove(G, FIRST_TOUCH, 6, [BB.upper], BARS)}
          f={f}
          at={T.sell}
          anchor="above"
          gap={28}
          tone={theme.color.textMuted}
          strike={f >= T.strike ? progress(f, T.strike, 16) : 0}
        />
        <LabelChip
          text="Walking the Band"
          x={G.x(WALK_AT)}
          y={clearAbove(G, WALK_AT, 10, [BB.upper], BARS)}
          f={f}
          at={T.walk}
          anchor="above"
          gap={28}
          opacity={shown > 0.01 ? 1 : 0}
        />
      </div>
    </SafeArea>
  );
};
