/**
 * SCENE 05 — Price position & slope. `from 2324 · dur 579` · Mode A → B at t=15.1
 *
 * Three states shown IN SEQUENCE on the same chart, never three panels side by
 * side. They cross-fade over 15 frames, and the Arrow sits at the same place in
 * all three — so the only thing that changes is the slope, which is the lesson.
 *
 * The Arrow is the episode's only slope indicator. No protractor, no meter, no
 * angle readout.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartFrame, gridOf } from "../components/ChartFrame";
import { MALine } from "../components/MALine";
import { TitleChip } from "../components/TitleChip";
import { Arrow } from "../components/Arrow";
import { TextBlock, assertBlocks } from "../components/TextBlock";
import { theme } from "../theme";
import { sec, sma, layoutMode, clamp01 } from "../helpers";
import { SERIES_UPTREND, SERIES_FLAT, domainOf } from "../series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = { title: sec(0.0), modeB: sec(15.1), panel: sec(15.6) };
const FADE = 15;
const PERIOD = 20;
/** The arrow's fixed anchor — the same place in every state, so slope reads. */
const ARROW = { run: 380, rise: 150 };
const STATES = [
  { at: sec(2.1), until: sec(5.4), series: SERIES_UPTREND, steep: -1,
    line: "PRICE > MA + SLOPE ↑ → UPTREND" },
  { at: sec(5.7), until: sec(8.8), series: [...SERIES_UPTREND].reverse(), steep: 1,
    line: "PRICE < MA + SLOPE ↓ → DOWNTREND" },
  { at: sec(10.2), until: sec(14.3), series: SERIES_FLAT, steep: 0,
    line: "FLAT MA → NO CLEAR TREND" },
];
// ═══════════════════════════════════════════════════════════════════════════

const PLOTS = STATES.map((s) => ({ ma: sma(s.series, PERIOD), domain: domainOf(s.series) }));

assertBlocks("Scene05", [
  ...STATES.map((s) => ({ from: s.at, until: s.until })),
  { from: T.panel, until: 579 },
]);

export const Scene05 = () => {
  const f = useCurrentFrame();
  const box = layoutMode(f, [
    { at: 0, mode: "A" },
    { at: T.modeB, mode: "B" },
  ]);
  /** Which state owns the frame. */
  const live = STATES.reduce((k, s, i) => (f >= s.at ? i : k), 0);

  return (
    <SafeArea>
      {STATES.map((s, i) => {
        const next = STATES[i + 1];
        const o =
          clamp01((f - s.at) / FADE) * (next ? 1 - clamp01((f - next.at) / FADE) : 1);
        if (o <= 0.001) return null;
        const G = gridOf(s.series, PLOTS[i].domain, box);
        return (
          <div key={i}>
            <ChartFrame
              closes={s.series}
              grid={G}
              mode="line"
              f={f}
              drawFrom={s.at}
              drawDur={sec(2.2)}
              opacity={o * 0.5}
            />
            <MALine
              values={PLOTS[i].ma}
              grid={G}
              f={f}
              drawFrom={s.at}
              drawDur={sec(2.2)}
              variant="slow"
              opacity={o}
            />
          </div>
        );
      })}

      {/* one arrow, in the same place in every state */}
      {STATES.map((s, i) => {
        if (i !== live) return null;
        const cx = box.x + box.w * 0.42;
        const cy = box.y + box.h / 2;
        return (
          <Arrow
            key={i}
            from={{ x: cx, y: cy - s.steep * ARROW.rise * 0.5 }}
            to={{
              x: cx + ARROW.run * (s.steep === 0 ? 0.6 : 1),
              y: cy + s.steep * ARROW.rise * 0.5,
            }}
            f={f}
            at={s.at + sec(1.2)}
          />
        );
      })}

      <TitleChip text="How to Read It" f={f} at={T.title} />

      {STATES.map((s, i) => (
        <TextBlock
          key={i}
          mode="A"
          localFrame={f}
          from={s.at}
          until={s.until}
          x={theme.layout.chartA.x + 64}
          y={theme.layout.chartA.y + theme.layout.chartA.h - 120}
          lines={[{ text: s.line, size: "h2", color: "indigo" }]}
        />
      ))}

      <TextBlock
        mode="B"
        localFrame={f}
        from={T.panel}
        until={579}
        lines={[
          { text: "READ 2 THINGS", size: "h2", color: "indigo" },
          { text: "1. PRICE POSITION", size: "label", color: "text" },
          { text: "2. MA SLOPE", size: "label", color: "text" },
        ]}
      />
    </SafeArea>
  );
};
