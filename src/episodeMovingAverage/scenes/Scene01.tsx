/**
 * SC01 — Manual is slow, indicators are fast (from 0, dur 659).
 *
 * THE CONTRAST IS THE WHOLE SCENE: four laboured marks on the left, one instant
 * line on the right, over IDENTICAL price data. Both halves plot the same
 * array, so the only difference on screen is how long the reading took.
 *
 * This is the one scene that splits the chart box. Every other scene uses it
 * whole.
 *
 * No human figure anywhere — the marks appear on their own.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartFrame, gridOf, Layer, CHART } from "../components/ChartFrame";
import { SplitDivider } from "../components/SplitDivider";
import { MALine } from "../components/MALine";
import { LabelChip } from "../components/LabelChip";
import { theme } from "../theme";
import { sec, sma, progress, fadeOut } from "../helpers";
import { SERIES, toBars } from "../series";
import { CUTS, cutOut, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const SCENE_FROM = 0;
const T = {
  left: sec(0.4),
  mark2: sec(2.9),
  mark3: sec(5.4),
  dim: sec(8.0),
  right: sec(14.0),
  label: sec(17.5),
};
/** Each hand mark is drawn slowly — that slowness is the argument. */
const MARK_OVER = sec(0.7);
/** The two halves of the split box, 840 wide each. */
const LEFT = { x: 96, y: CHART.y, w: 840, h: CHART.h };
const RIGHT = { x: 984, y: CHART.y, w: 840, h: CHART.h };
const PERIOD = 18;
// ═══════════════════════════════════════════════════════════════════════════

/** IDENTICAL data both sides — the reading differs, the price does not. */
const CLOSES = SERIES.slice(0, 90);
const BARS = toBars(CLOSES, 101);
const DOMAIN: [number, number] = [
  Math.min(...BARS.map((b) => b.l)),
  Math.max(...BARS.map((b) => b.h)),
];
const LG = gridOf(CLOSES, DOMAIN, LEFT);
const RG = gridOf(CLOSES, DOMAIN, RIGHT);
const MA = sma(CLOSES, PERIOD);
/** Where the three hand marks land, in bar indices. */
const TREND = { a: 12, b: 62 };
const RING_AT = 44;
const LEVEL = CLOSES[70];

export const Scene01 = () => {
  const f = useCurrentFrame();
  const g = f + SCENE_FROM;
  const dy = cutOut(g, CUTS.toAverage);
  const blur = cutBlur(g, CUTS.toAverage);
  /** The left half steps back once its slow reading is finished. */
  const left = f >= T.dim ? 1 - progress(f, T.dim, 14) * 0.65 : 1;

  return (
    <SafeArea>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${dy}px)`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        <SplitDivider f={f} at={T.left} />

        {/* ── left: read by hand ── */}
        <div style={{ opacity: left }}>
          <ChartFrame
            closes={CLOSES}
            bars={BARS}
            grid={LG}
            mode="candle"
            f={f}
            drawFrom={T.left}
            drawDur={sec(1.6)}
            tickLabels={false}
            box={LEFT}
          />
          {f >= T.left + sec(1.6) && (
            <Layer opacity={progress(f, T.left + sec(1.6), MARK_OVER)}>
              <line
                x1={LG.x(TREND.a)}
                y1={LG.y(CLOSES[TREND.a])}
                x2={LG.x(TREND.b)}
                y2={LG.y(CLOSES[TREND.b])}
                stroke={theme.color.indigo}
                strokeWidth={theme.shape.band}
              />
            </Layer>
          )}
          {f >= T.mark2 && (
            <Layer opacity={progress(f, T.mark2, MARK_OVER)}>
              <circle
                cx={LG.x(RING_AT)}
                cy={LG.y(CLOSES[RING_AT])}
                r={34}
                fill="none"
                stroke={theme.color.indigo}
                strokeWidth={theme.shape.band}
              />
            </Layer>
          )}
          {f >= T.mark3 && (
            <Layer opacity={progress(f, T.mark3, MARK_OVER)}>
              <line
                x1={LEFT.x + 20}
                y1={LG.y(LEVEL)}
                x2={LEFT.x + LEFT.w - 20}
                y2={LG.y(LEVEL)}
                stroke={theme.color.indigo}
                strokeWidth={theme.shape.band}
                strokeDasharray="10 8"
              />
            </Layer>
          )}
        </div>

        {/* ── right: read by an indicator ── */}
        {f >= T.right && (
          <>
            <ChartFrame
              closes={CLOSES}
              bars={BARS}
              grid={RG}
              mode="candle"
              f={f}
              drawFrom={T.right}
              drawDur={sec(1.2)}
              tickLabels={false}
              box={RIGHT}
            />
            <MALine values={MA} grid={RG} f={f} drawFrom={T.right + sec(1.2)} drawDur={30} variant="slow" />
          </>
        )}

        {/* the two panel names, and then the one label — never three at once */}
        <LabelChip
          text="Manual"
          x={LEFT.x}
          y={CHART.y - 16}
          f={f}
          at={T.left}
          anchor="right"
          tone={theme.color.textMuted}
          size={theme.text.labelSm.size}
          weight={theme.text.labelSm.weight}
          opacity={f >= T.right ? fadeOut(f, T.right, 12) : 1}
        />
        <LabelChip
          text="Indikator"
          x={RIGHT.x}
          y={CHART.y - 16}
          f={f}
          at={T.right}
          anchor="right"
          tone={theme.color.textMuted}
          size={theme.text.labelSm.size}
          weight={theme.text.labelSm.weight}
          opacity={f >= T.label ? fadeOut(f, T.label, 12) : 1}
        />
        <LabelChip
          text="Trend: Up"
          x={RG.x(CLOSES.length - 1)}
          y={RG.y(MA[MA.length - 1] ?? CLOSES[CLOSES.length - 1])}
          f={f}
          at={T.label}
          anchor="left"
        />
      </div>
    </SafeArea>
  );
};
