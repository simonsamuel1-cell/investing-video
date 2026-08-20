/**
 * SCENE 04 — SMA vs EMA. `from 1765 · dur 559` · Mode A → C at t=14.2
 *
 * ONE chart, one clear reversal. Not two panels: the method is the only
 * variable, so both averages are computed from the SAME array and the only
 * thing that can differ on screen is when each of them turns.
 *
 * The SMA/EMA binding is settled by the corrected SRT, which says SMA weights
 * every price equally and EMA leans on the most recent — matching the script.
 * The raw transcript had them the other way round; it is the corrected file
 * that is authoritative here.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartFrame, gridOf } from "../components/ChartFrame";
import { MALine } from "../components/MALine";
import { LabelChip } from "../components/LabelChip";
import { TitleChip } from "../components/TitleChip";
import { HighlightBox } from "../components/HighlightBox";
import { TextBlock, assertBlocks } from "../components/TextBlock";
import { theme } from "../theme";
import { sec, sma, ema, layoutMode } from "../helpers";
import { SERIES_REVERSAL, domainOf } from "../series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  title: sec(0.0),
  price: sec(0.6),
  mas: sec(4.8),
  turn: sec(8.5),
  turnEnd: sec(13.4),
  modeC: sec(14.2),
  head: sec(14.6),
  pair: sec(16.4),
};
const PERIOD = 16;
const TICKS = [4600, 5000, 5400, 5800];
// ═══════════════════════════════════════════════════════════════════════════

const SMA = sma(SERIES_REVERSAL, PERIOD);
const EMA = ema(SERIES_REVERSAL, PERIOD);
const DOMAIN = domainOf(SERIES_REVERSAL);

/** Where each line actually turns — derived, so the box cannot mark the wrong bar. */
const turnOf = (v: (number | null)[]) => {
  const from = Math.round(v.length * 0.55);
  for (let i = from; i < v.length - 1; i++) {
    const a = v[i];
    const b = v[i + 1];
    if (a !== null && b !== null && b < a) return i;
  }
  return from;
};
const TURN = { ema: turnOf(EMA), sma: turnOf(SMA) };

assertBlocks("Scene04", [
  { from: T.turn, until: T.turnEnd },
  { from: T.head, until: T.pair },
  { from: T.pair, until: 559 },
]);

export const Scene04 = () => {
  const f = useCurrentFrame();
  const box = layoutMode(f, [
    { at: 0, mode: "A" },
    { at: T.modeC, mode: "C" },
  ]);
  const G = gridOf(SERIES_REVERSAL, DOMAIN, box, 0.12, 150);

  return (
    <SafeArea>
      <ChartFrame
        closes={SERIES_REVERSAL}
        grid={G}
        mode="line"
        f={f}
        drawFrom={T.price}
        drawDur={sec(3.4)}
        ticks={TICKS}
        tickLabels
        opacity={box.dim * 0.55}
      />
      <MALine
        values={SMA}
        grid={G}
        f={f}
        drawFrom={T.mas}
        drawDur={sec(7)}
        variant="slow"
        opacity={box.dim}
      />
      <MALine
        values={EMA}
        grid={G}
        f={f}
        drawFrom={T.mas}
        drawDur={sec(7)}
        variant="fast"
        opacity={box.dim}
      />

      {/* the box covers just the turn — the two lines disagreeing about when */}
      <HighlightBox
        x1={G.x(TURN.ema) - 40}
        x2={G.x(TURN.sma) + 40}
        y1={box.y + 40}
        y2={box.y + box.h - 40}
        f={f}
        at={T.turn}
        gone={T.modeC}
        opacity={box.dim}
      />

      <TitleChip text="SMA vs EMA" f={f} at={T.title} />

      <LabelChip
        text="SMA"
        x={G.x(SERIES_REVERSAL.length - 6)}
        y={G.y(SMA[SERIES_REVERSAL.length - 6] ?? 0)}
        f={f}
        at={T.mas + sec(5)}
        anchor="above"
        opacity={box.dim}
      />
      <LabelChip
        text="EMA"
        x={G.x(SERIES_REVERSAL.length - 6)}
        y={G.y(EMA[SERIES_REVERSAL.length - 6] ?? 0)}
        f={f}
        at={T.mas + sec(5)}
        anchor="below"
        tone={theme.colors.cyan}
        opacity={box.dim}
      />

      <TextBlock
        mode="A"
        localFrame={f}
        from={T.turn}
        until={T.turnEnd}
        x={theme.layout.panelB.x}
        y={theme.layout.chartA.y + 120}
        lines={[{ text: "EMA Faster,\nSMA Steadier", size: "h2", color: "indigo" }]}
      />
      <TextBlock
        mode="C"
        localFrame={f}
        from={T.head}
        until={T.pair}
        lines={[{ text: "FASTER ≠ ALWAYS BETTER", size: "h1", color: "indigo" }]}
      />
      <TextBlock
        mode="C"
        localFrame={f}
        from={T.pair}
        until={559}
        lines={[
          { text: "EMA = More Responsive", size: "h2", color: "cyan" },
          { text: "SMA = More Stable", size: "h2", color: "indigo" },
        ]}
      />
    </SafeArea>
  );
};
