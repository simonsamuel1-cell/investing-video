/**
 * SC13 — Close (from 8318, dur 582).
 *
 * ONE CLEAN CHART, THREE LINES OF TEXT. The chart settles, steps back to 0.4,
 * and stays as a backdrop for the rest of the episode — it is the thing all
 * three lines are about, so removing it would leave the words floating.
 *
 * The lines are left-aligned at x = 96 and stack in the chart box's own middle.
 * They arrive one at a time and then hold together to the end.
 *
 * Does NOT fade to black. The silver background carries out.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartFrame, gridOf, CHART } from "../components/ChartFrame";
import { BollingerBands } from "../components/BollingerBands";
import { MALine } from "../components/MALine";
import { theme } from "../theme";
import { sec, sma, bollinger, progress, progressInOut, textReveal } from "../helpers";
import { SERIES, BARS, domainOf } from "../series";
import { CUTS, cutPushIn, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const SCENE_FROM = 8318;
const T = { chart: sec(0.2), back: sec(4.4) };
const LINES = [
  { text: "Confirm the Trend", at: sec(5.0) },
  { text: "Spot the Squeeze", at: sec(9.0) },
  { text: "Never Use It Alone", at: sec(13.0) },
];
const PERIOD = 20;
/** Left-aligned at the safe margin, stacked about the chart box's middle. */
/**
 * Inset from the card's own left edge, not flush to it. The lines are read
 * against the white surface now, so they need the same breathing room any
 * other content on that surface gets.
 */
const STACK = { x: 96 + 56, lead: 96 };
// ═══════════════════════════════════════════════════════════════════════════

const MA = sma(SERIES, PERIOD);
const BB = bollinger(SERIES, PERIOD, 2);
/** The domain has to hold the candles AND the bands, or one of them is cropped. */
const G = gridOf(SERIES, domainOf(BARS, [BB.lower, BB.upper]), CHART);
const MID_Y = CHART.y + CHART.h / 2;

export const Scene13 = () => {
  const f = useCurrentFrame();
  const g = f + SCENE_FROM;
  /** Arrives on the pull-back CG-C left in flight. */
  const push = cutPushIn(g, CUTS.toClose, -0.14);
  const blur = cutBlur(g, CUTS.toClose);
  /**
   * The chart steps well back — the three lines are read ON it, and at 0.4 a
   * price line still crossed the type. The card stays; only what is drawn on
   * it recedes.
   */
  const back = f >= T.back ? 1 - progress(f, T.back, sec(1)) * 0.75 : 1;

  return (
    <SafeArea>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${push})`,
          transformOrigin: `${theme.canvas.width / 2}px ${theme.canvas.height / 2}px`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        <div style={{ opacity: back }}>
          <ChartFrame
            closes={SERIES}
            bars={BARS}
            grid={G}
            f={f}
            drawFrom={T.chart}
            drawDur={sec(3.4)}
            tickLabels={false}
            opacity={0.55}
          />
          <MALine values={MA} grid={G} f={f} drawFrom={T.chart} drawDur={sec(3.4)} variant="slow" />
          <BollingerBands
            mid={BB.mid}
            upper={BB.upper}
            lower={BB.lower}
            grid={G}
            opacity={progressInOut(f, T.chart + sec(1), sec(2)) * 0.85}
          />
        </div>

        {LINES.map((l, i) => {
          const r = textReveal(f, l.at);
          if (f < l.at) return null;
          return (
            <div
              key={l.text}
              style={{
                position: "absolute",
                left: STACK.x,
                top: MID_Y + (i - 1) * STACK.lead + r.dy,
                transform: "translateY(-50%)",
                fontFamily: theme.text.family,
                fontSize: theme.text.h1.size,
                fontWeight: theme.text.h1.weight,
                color: i === 2 ? theme.color.indigo : theme.color.ink,
                opacity: r.opacity,
                whiteSpace: "nowrap",
              }}
            >
              {l.text}
            </div>
          );
        })}
      </div>
    </SafeArea>
  );
};
