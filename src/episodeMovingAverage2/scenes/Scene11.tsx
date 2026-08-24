/**
 * SCENE 11 — Where indicators fit. `from 5999 · dur 646` · Mode B throughout
 *
 * THE ORDER OF ARRIVAL IS THE TEACHING. Your own markings are drawn on the
 * chart FIRST; the indicators arrive afterwards and are seen to agree with what
 * is already there. Reverse the order and the scene argues the opposite.
 *
 * The hierarchy on the right is ONE text element that grows, not three blocks
 * — three would break Rule 2 the moment the second one mounted.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartFrame, gridOf, Layer } from "../components/ChartFrame";
import { MALine } from "../components/MALine";
import { BollingerBands } from "../components/BollingerBands";
import { TitleChip } from "../components/TitleChip";
import { TextBlock, assertBlocks } from "../components/TextBlock";
import { theme } from "../theme";
import { sec, sma, bollinger, progress, progressInOut } from "../helpers";
import { SERIES_UPTREND, BARS_UPTREND, domainOf } from "../series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  title: sec(0.0),
  chart: sec(0.4),
  mark1: sec(2.2),
  mark2: sec(4.4),
  mark3: sec(6.6),
  layer1: sec(2.2),
  layer2: sec(10.3),
  layer3: sec(12.5),
  hierEnd: sec(17.0),
  flow: sec(17.0),
  flowEnd: sec(19.0),
  close: sec(19.0),
  strike: sec(20.0),
};
const PERIOD = 20;
/** Your three marks, in bar indices — your own reading, drawn by hand. */
const TREND = { a: 8, b: 58 };
const BREAK = 72;
const LEVEL_AT = 40;
// ═══════════════════════════════════════════════════════════════════════════

const BB = bollinger(SERIES_UPTREND, PERIOD, 2);
const MA = sma(SERIES_UPTREND, PERIOD);
const DOMAIN = domainOf([...BB.lower, ...BB.upper], BARS_UPTREND);

assertBlocks("Scene11", [
  { from: T.layer1, until: T.hierEnd },
  { from: T.flow, until: T.flowEnd },
  { from: T.close, until: 646 },
]);

export const Scene11 = () => {
  const f = useCurrentFrame();
  const box = theme.layout.chartB;
  const G = gridOf(SERIES_UPTREND, DOMAIN, box);

  return (
    <SafeArea>
      <ChartFrame
        closes={SERIES_UPTREND}
        bars={BARS_UPTREND}
        grid={G}
        mode="candle"
        f={f}
        drawFrom={T.chart}
        drawDur={sec(3.2)}
      />

      {/* ── layer 1: your own marks, first ── */}
      {f >= T.mark1 && (
        <Layer opacity={progress(f, T.mark1, 16)}>
          <line
            x1={G.x(TREND.a)}
            y1={G.y(SERIES_UPTREND[TREND.a])}
            x2={G.x(TREND.b)}
            y2={G.y(SERIES_UPTREND[TREND.b])}
            stroke={theme.colors.indigo}
            strokeWidth={theme.layout.stroke.band}
          />
        </Layer>
      )}
      {f >= T.mark2 && (
        <Layer opacity={progress(f, T.mark2, 16)}>
          <circle
            cx={G.x(BREAK)}
            cy={G.y(SERIES_UPTREND[BREAK])}
            r={38}
            fill="none"
            stroke={theme.colors.indigo}
            strokeWidth={theme.layout.stroke.band}
          />
        </Layer>
      )}
      {f >= T.mark3 && (
        <Layer opacity={progress(f, T.mark3, 16)}>
          <line
            x1={box.x + 20}
            y1={G.y(SERIES_UPTREND[LEVEL_AT])}
            x2={box.x + box.w - 20}
            y2={G.y(SERIES_UPTREND[LEVEL_AT])}
            stroke={theme.colors.indigo}
            strokeWidth={theme.layout.stroke.band}
            strokeDasharray="10 8"
          />
        </Layer>
      )}

      {/* ── layer 2 and 3: the indicators, agreeing with what is already there ── */}
      <MALine values={MA} grid={G} f={f} drawFrom={T.layer2} drawDur={sec(2)} variant="slow" />
      <BollingerBands
        mid={BB.mid}
        upper={BB.upper}
        lower={BB.lower}
        grid={G}
        opacity={progressInOut(f, T.layer3, sec(1.8)) * 0.9}
      />

      <TitleChip text="Where Indicators Fit" f={f} at={T.title} />

      {/* one element that grows — see the header note */}
      <TextBlock
        mode="B"
        localFrame={f}
        from={T.layer1}
        until={T.hierEnd}
        gap={10}
        lines={[
          { text: "1 — PRICE ACTION", size: "h2", color: "indigo", at: T.layer1 },
          { text: "Trend • Pattern • Support / Resistance", size: "labelSm", color: "muted", at: T.layer1 + 8 },
          { text: "↓", size: "label", color: "muted", at: T.layer2 - 10 },
          { text: "2 — MOVING AVERAGE", size: "h2", color: "indigo", at: T.layer2 },
          { text: "Trend Confirmation", size: "labelSm", color: "muted", at: T.layer2 + 8 },
          { text: "↓", size: "label", color: "muted", at: T.layer3 - 10 },
          { text: "3 — BOLLINGER BANDS", size: "h2", color: "cyan", at: T.layer3 },
          { text: "Volatility Context", size: "labelSm", color: "muted", at: T.layer3 + 8 },
        ]}
      />

      <TextBlock
        mode="B"
        localFrame={f}
        from={T.flow}
        until={T.flowEnd}
        lines={[
          { text: "PRICE ACTION\n↓\nINDICATOR CONFIRMATION\n↓\nBETTER CONTEXT", size: "h2", color: "indigo" },
        ]}
      />

      {/* COMPLIANCE: struck misconception, never a statement */}
      <TextBlock
        mode="B"
        localFrame={f}
        from={T.close}
        until={646}
        lines={[
          { text: "INDICATOR = SECOND OPINION", size: "h2", color: "indigo" },
          { text: "INDICATOR = DECISION MAKER", size: "h2", color: "muted", struck: T.strike },
        ]}
      />
    </SafeArea>
  );
};
