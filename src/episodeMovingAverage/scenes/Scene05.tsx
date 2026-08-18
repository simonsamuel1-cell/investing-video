/**
 * SC05 — Position and slope (from 2306, dur 576).
 *
 * ONE CHART, THREE STATES IN SEQUENCE — never three panels side by side. The
 * chart re-draws into each state in turn, so there is only ever one thing on
 * screen and the viewer compares against memory rather than across the frame.
 *
 * The chart box, the MA colour and the label position never change between
 * states. Only the shape and the one label do. That constancy is what makes the
 * three readings comparable at all.
 *
 * The Arrow is the ONLY slope indicator. No protractor, no meter, no angle.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartFrame, gridOf, CHART } from "../components/ChartFrame";
import { MALine } from "../components/MALine";
import { LabelChip } from "../components/LabelChip";
import { TitleChip } from "../components/TitleChip";
import { Arrow } from "../components/Arrow";
import { sec, sma, clamp01 } from "../helpers";
import { SERIES_UP, SERIES_DOWN, SERIES_FLAT, BARS_UP, BARS_DOWN, BARS_FLAT, domainOf } from "../series";
import { CUTS, cutIn, cutOut, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const SCENE_FROM = 2306;
/** Each state owns the frame outright; they cross-fade over 15. */
const STATES = [
  { at: sec(0.4), series: SERIES_UP, bars: BARS_UP, label: "Trend: Up", steep: -1 },
  { at: sec(6.0), series: SERIES_DOWN, bars: BARS_DOWN, label: "Trend: Down", steep: 1 },
  { at: sec(12.0), series: SERIES_FLAT, bars: BARS_FLAT, label: "No Trend", steep: 0 },
];
const FADE = 15;
const PERIOD = 16;
/** The arrow's fixed anchor — the same place in every state, so slope reads. */
const ARROW = { x: CHART.x + 520, y: CHART.y + CHART.h / 2, run: 420, rise: 150 };
// ═══════════════════════════════════════════════════════════════════════════

const PLOTS = STATES.map((s) => {
  const grid = gridOf(s.series, domainOf(s.bars), CHART);
  return { grid, ma: sma(s.series, PERIOD) };
});

export const Scene05 = () => {
  const f = useCurrentFrame();
  const g = f + SCENE_FROM;
  const dy = cutIn(g, CUTS.toReading);
  const dx = cutOut(g, CUTS.toSupport);
  const blur = Math.max(cutBlur(g, CUTS.toReading), cutBlur(g, CUTS.toSupport));

  /** Which state owns the frame, and how far the hand-over has got. */
  const live = STATES.reduce((k, s, i) => (f >= s.at ? i : k), 0);

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
        {STATES.map((s, i) => {
          const inFade = clamp01((f - s.at) / FADE);
          const next = STATES[i + 1];
          const outFade = next === undefined ? 0 : clamp01((f - next.at) / FADE);
          const o = inFade * (1 - outFade);
          if (o <= 0.001) return null;
          const { grid, ma } = PLOTS[i];
          return (
            <div key={s.label}>
              <ChartFrame
                closes={s.series}
                bars={s.bars}
                grid={grid}
                f={f}
                drawFrom={s.at}
                drawDur={sec(2.2)}
                tickLabels={false}
                opacity={o * 0.5}
              />
              <MALine values={ma} grid={grid} f={f} drawFrom={s.at} drawDur={sec(2.2)} variant="slow" opacity={o} />
            </div>
          );
        })}

        {/* one arrow, one label, at the same place in every state */}
        <Arrow
          key={live}
          from={{ x: ARROW.x, y: ARROW.y - STATES[live].steep * ARROW.rise * 0.5 }}
          to={{
            x: ARROW.x + ARROW.run * (STATES[live].steep === 0 ? 0.62 : 1),
            y: ARROW.y + STATES[live].steep * ARROW.rise * 0.5,
          }}
          f={f}
          at={STATES[live].at + sec(1.6)}
        />
        <LabelChip
          key={`l${live}`}
          text={STATES[live].label}
          x={CHART.x + CHART.w / 2}
          y={CHART.y + CHART.h - 40}
          f={f}
          at={STATES[live].at + sec(2.2)}
          anchor="above"
        />

        <TitleChip text="Posisi & Slope" f={f} at={sec(0.2)} />
      </div>
    </SafeArea>
  );
};
