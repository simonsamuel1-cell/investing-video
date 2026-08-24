/**
 * CG-B — Scenes 08 + 09 as ONE spanning Sequence (global 4140 → 5366).
 *
 * The chart and its bands mount once and persist. The bands keep breathing
 * across the internal boundary: Scene 09's squeeze is a stretch of Scene 08's
 * own demonstration, not a new chart, and a remount would restart the breath
 * the viewer has just been taught to read.
 *
 * ⚠ COMPLIANCE (Scene 09). `BREAKOUT ↑ ?` and `BREAKDOWN ↓ ?` are generated
 * from ONE shared style object with a mirrored sign flip — identical size,
 * weight and colour, enforced by construction rather than by eye. If one read
 * as more prominent, a volatility explainer would become a directional call.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartFrame, gridOf } from "../components/ChartFrame";
import { BollingerBands } from "../components/BollingerBands";
import { LabelChip } from "../components/LabelChip";
import { TitleChip } from "../components/TitleChip";
import { HighlightBox } from "../components/HighlightBox";
import { TextBlock, assertBlocks, type Line } from "../components/TextBlock";
import { theme } from "../theme";
import { sec, bollinger, layoutMode, progressInOut } from "../helpers";
import { SERIES, domainOf } from "../series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** Scene 09 begins here, in the group's own local frames. */
const SC09 = 591;
const T = {
  title: sec(0.0),
  price: sec(0.4),
  mid: sec(2.2),
  bands: sec(5.0),
  calm: sec(11.8),
  active: sec(13.7),
  // ── Scene 09 ──
  squeeze: SC09 + sec(0.0),
  pulseText: SC09 + sec(3.5),
  hold: SC09 + sec(8.3),
  modeB: SC09 + sec(11.7),
  both: SC09 + sec(11.9),
  coming: SC09 + sec(14.3),
  close: SC09 + sec(17.1),
  strikeA: SC09 + sec(18.2),
  strikeB: SC09 + sec(19.0),
};
const PERIOD = 20;
const TICKS = [4400, 4800, 5200, 5600, 6000, 6400];
// ═══════════════════════════════════════════════════════════════════════════

const BB = bollinger(SERIES, PERIOD, 2);
const DOMAIN = domainOf([...SERIES, ...BB.lower, ...BB.upper]);

/**
 * The calmest and most active stretches, FOUND in the data. Pointing at a
 * pinch that was staged would teach a shape rather than a reading.
 */
const WIDTH = BB.upper.map((u, i) =>
  u === null || BB.lower[i] === null ? null : u - (BB.lower[i] as number),
);
const pick = (want: "min" | "max") => {
  let best = PERIOD;
  WIDTH.forEach((w, i) => {
    if (w === null) return;
    const b = WIDTH[best];
    if (b === null) best = i;
    else if (want === "min" ? w < b : w > b) best = i;
  });
  return best;
};
const CALM = pick("min");
const ACTIVE = pick("max");

assertBlocks("BandsGroup", [
  { from: T.pulseText, until: T.hold },
  { from: T.both, until: T.coming },
  { from: T.coming, until: T.close },
  { from: T.close, until: 1226 },
]);

/** ONE style, two directions. See the compliance note above. */
const POSSIBILITY: Omit<Line, "text"> = { size: "h2", color: "text" };

export const BandsGroup = () => {
  const f = useCurrentFrame();
  const box = layoutMode(f, [
    { at: 0, mode: "A" },
    { at: T.modeB, mode: "B" },
  ]);
  const G = gridOf(SERIES, DOMAIN, box, 0.12, 150);
  const unfold = progressInOut(f, T.bands, sec(3.8));

  return (
    <SafeArea>
      <ChartFrame
        closes={SERIES}
        grid={G}
        mode="line"
        f={f}
        drawFrom={T.price}
        drawDur={sec(2.4)}
        ticks={TICKS}
        tickLabels
        opacity={0.5}
      />
      {f >= T.mid && (
        <BollingerBands
          mid={BB.mid}
          upper={BB.upper}
          lower={BB.lower}
          grid={G}
          unfold={unfold}
          opacity={progressInOut(f, T.mid, sec(1.4))}
        />
      )}

      <TitleChip text="Bollinger Bands" f={f} at={T.title} />

      {/* the three band names are LINE labels, not a text block — they name
          parts of one object and may coexist */}
      <LabelChip
        text="MIDDLE BAND — Moving Average"
        x={G.x(28)}
        y={G.y(BB.mid[28] ?? SERIES[28])}
        f={f}
        at={T.mid + sec(1)}
        anchor="below"
        gap={26}
        opacity={f >= T.calm ? 0 : 1}
      />
      <LabelChip
        text="UPPER BAND"
        x={G.x(58)}
        y={G.y(BB.upper[58] ?? SERIES[58])}
        f={f}
        at={T.bands + sec(2)}
        anchor="above"
        gap={26}
        tone={theme.colors.cyan}
        opacity={f >= T.calm ? 0 : 1}
      />
      <LabelChip
        text="LOWER BAND"
        x={G.x(58)}
        y={G.y(BB.lower[58] ?? SERIES[58])}
        f={f}
        at={T.bands + sec(2)}
        anchor="below"
        gap={26}
        tone={theme.colors.cyan}
        opacity={f >= T.calm ? 0 : 1}
      />

      <LabelChip
        text="LOW VOLATILITY → BANDS CONTRACT"
        x={G.x(CALM)}
        y={G.y(BB.upper[CALM] ?? SERIES[CALM])}
        f={f}
        at={T.calm}
        anchor="above"
        gap={30}
        opacity={f >= T.active ? 0 : 1}
      />
      <LabelChip
        text="HIGH VOLATILITY → BANDS EXPAND"
        x={G.x(ACTIVE)}
        y={G.y(BB.upper[ACTIVE] ?? SERIES[ACTIVE])}
        f={f}
        at={T.active}
        anchor="above"
        gap={30}
        opacity={f >= T.squeeze ? 0 : 1}
      />

      {/* ── Scene 09 ── the squeeze, boxed on the chart it happens on */}
      <HighlightBox
        x1={G.x(Math.max(0, CALM - 14))}
        x2={G.x(CALM + 14)}
        y1={box.y + 30}
        y2={box.y + box.h - 30}
        f={f}
        at={T.squeeze}
        pulse
      />
      <LabelChip
        text="Squeeze"
        x={G.x(CALM)}
        y={box.y + 40}
        f={f}
        at={T.squeeze + sec(0.6)}
        anchor="below"
        opacity={f >= T.modeB ? 0 : 1}
      />

      <TextBlock
        mode="A"
        localFrame={f}
        from={T.pulseText}
        until={T.hold}
        x={theme.layout.panelB.x}
        y={theme.layout.chartA.y + 120}
        lines={[
          { text: "BAND WIDTH ↓", size: "h2", color: "indigo" },
          { text: "VOLATILITY ↓", size: "h2", color: "indigo" },
        ]}
      />

      {/* COMPLIANCE: identical weight, one style, mirrored sign */}
      <TextBlock
        mode="B"
        localFrame={f}
        from={T.both}
        until={T.coming}
        lines={[
          { ...POSSIBILITY, text: "BREAKOUT ↑ ?" },
          { ...POSSIBILITY, text: "BREAKDOWN ↓ ?" },
        ]}
      />
      <TextBlock
        mode="B"
        localFrame={f}
        from={T.coming}
        until={T.close}
        lines={[{ text: "SQUEEZE =\nMOVE MAY BE COMING", size: "h2", color: "indigo" }]}
      />

      {/* COMPLIANCE: struck misconceptions, never statements */}
      <TextBlock
        mode="B"
        localFrame={f}
        from={T.close}
        until={1226}
        lines={[
          { text: "SQUEEZE = BULLISH", size: "h2", color: "muted", struck: T.strikeA },
          { text: "SQUEEZE = BEARISH", size: "h2", color: "muted", struck: T.strikeB },
          { text: "DIRECTION = UNKNOWN", size: "h2", color: "indigo" },
          { text: "Check Trend + Key Levels", size: "labelSm", color: "muted" },
        ]}
      />
    </SafeArea>
  );
};
