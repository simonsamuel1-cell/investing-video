/**
 * SCENE 01 — Manual is slow, indicators are fast. `from 0 · dur 607`
 *
 * THE ONLY SPLIT SCREEN IN THE EPISODE. Its whole argument is a side-by-side:
 * three laboured questions on the left against one instant line on the right,
 * over IDENTICAL price data. Both halves plot the same array, so the only
 * difference on screen is how long the reading took.
 *
 * The clock is what makes that difference legible — it ticks through the
 * manual read and stops the moment the indicator answers.
 *
 * No human figure. The annotations appear on their own.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartFrame, gridOf, Layer } from "../components/ChartFrame";
import { SplitDivider, TickingClock } from "../components/SplitDivider";
import { MALine } from "../components/MALine";
import { LabelChip } from "../components/LabelChip";
import { TextBlock, assertBlocks } from "../components/TextBlock";
import { theme } from "../theme";
import { sec, sma, progress, fadeOut } from "../helpers";
import { SERIES, toBars, domainOf } from "../series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  panels: sec(0.0),
  q1: sec(3.2),
  q2: sec(4.7),
  q3: sec(6.2),
  unmask: sec(7.9),
  answer: sec(9.4),
  block1: sec(10.1),
  block1End: sec(14.0),
  block2: sec(14.6),
  strike: sec(16.5),
  block2End: sec(19.5),
};
/** Each hand-drawn mark takes ~20 frames. That slowness is the argument. */
const MARK_OVER = 20;
const LEFT = { x: 96, y: theme.layout.chartA.y, w: 840, h: theme.layout.chartA.h };
const RIGHT = { x: 984, y: theme.layout.chartA.y, w: 840, h: theme.layout.chartA.h };
const PERIOD = 20;
// ═══════════════════════════════════════════════════════════════════════════

/** IDENTICAL data both sides — the reading differs, the price does not. */
const CLOSES = SERIES;
const BARS = toBars(CLOSES, 101);
const DOMAIN = domainOf([], BARS);
const LG = gridOf(CLOSES, DOMAIN, LEFT);
const RG = gridOf(CLOSES, DOMAIN, RIGHT);
const MA = sma(CLOSES, PERIOD);

/** Where the three hand questions point, in bar indices. */
const MARKS = [
  { at: T.q1, text: "Trend?", i: 34 },
  { at: T.q2, text: "Pattern?", i: 74 },
  { at: T.q3, text: "Support?", i: 112 },
];

assertBlocks("Scene01", [
  { from: T.block1, until: T.block1End },
  { from: T.block2, until: T.block2End },
]);

export const Scene01 = () => {
  const f = useCurrentFrame();
  /** The left half steps back once the indicator has answered. */
  const left = f >= T.answer ? 1 - progress(f, T.answer, 14) * 0.65 : 1;

  return (
    <SafeArea>
      <SplitDivider f={f} at={T.panels} />

      {/* ── left: read by hand ── */}
      <div style={{ opacity: left }}>
        <ChartFrame
          closes={CLOSES}
          bars={BARS}
          grid={LG}
          mode="candle"
          f={f}
          drawFrom={T.panels}
          drawDur={sec(1.6)}
        />
        {MARKS.map((m) => (
          <LabelChip
            key={m.text}
            text={m.text}
            x={LG.x(m.i)}
            y={LG.y(CLOSES[m.i])}
            f={f}
            at={m.at}
            anchor="above"
            gap={30}
            tone={theme.colors.textMuted}
          />
        ))}
        {MARKS.map((m) =>
          f < m.at ? null : (
            <Layer key={`ring${m.i}`} opacity={progress(f, m.at, MARK_OVER)}>
              <circle
                cx={LG.x(m.i)}
                cy={LG.y(CLOSES[m.i])}
                r={30}
                fill="none"
                stroke={theme.colors.textMuted}
                strokeWidth={theme.layout.border.thick}
              />
            </Layer>
          ),
        )}
      </div>

      {/* the clock: one tick a second, and it STOPS when the line lands */}
      <TickingClock
        x={LEFT.x + 64}
        y={LEFT.y + LEFT.h - 64}
        f={f}
        at={T.panels}
        stopAt={T.answer}
      />

      {/* ── right: read by an indicator ── */}
      <ChartFrame
        closes={CLOSES}
        bars={BARS}
        grid={RG}
        mode="candle"
        f={f}
        drawFrom={T.panels}
        drawDur={sec(1.6)}
      />
      <MALine
        values={MA}
        grid={RG}
        f={f}
        drawFrom={T.unmask}
        drawDur={30}
        variant="slow"
      />
      <LabelChip
        text="Trend: Up"
        x={RG.x(CLOSES.length - 18)}
        y={RG.y(MA[CLOSES.length - 18] ?? CLOSES[CLOSES.length - 18])}
        f={f}
        at={T.answer}
        anchor="above"
        gap={30}
      />

      {/* the right half stays covered until the indicator is asked */}
      {f < T.unmask && (
        <Layer>
          <rect
            x={RIGHT.x - 8}
            y={RIGHT.y - 8}
            width={RIGHT.w + 16}
            height={RIGHT.h + 16}
            fill={theme.colors.bg}
          />
        </Layer>
      )}

      {/* the two panel names */}
      <LabelChip
        text="Manual"
        x={LEFT.x}
        y={LEFT.y - 16}
        f={f}
        at={T.panels}
        anchor="right"
        tone={theme.colors.textMuted}
        opacity={f >= T.block1 ? fadeOut(f, T.block1) : 1}
      />
      <LabelChip
        text="Indikator"
        x={RIGHT.x}
        y={RIGHT.y - 16}
        f={f}
        at={T.unmask}
        anchor="right"
        tone={theme.colors.textMuted}
        opacity={f >= T.block1 ? fadeOut(f, T.block1) : 1}
      />

      <TextBlock
        mode="A"
        localFrame={f}
        from={T.block1}
        until={T.block1End}
        x={theme.layout.panelB.x}
        y={theme.layout.chartA.y + 120}
        lines={[
          { text: "INDICATOR", size: "h2", color: "indigo" },
          { text: "Filter • Simplify • Confirm", size: "label", color: "muted" },
        ]}
      />

      {/* COMPLIANCE: struck misconception, never a statement */}
      <TextBlock
        mode="A"
        localFrame={f}
        from={T.block2}
        until={T.block2End}
        x={theme.layout.panelB.x}
        y={theme.layout.chartA.y + 120}
        lines={[
          { text: "REPLACE ANALYSIS", size: "h2", color: "muted", struck: T.strike },
          { text: "SUPPORT YOUR ANALYSIS ✓", size: "h2", color: "indigo" },
        ]}
      />
    </SafeArea>
  );
};
