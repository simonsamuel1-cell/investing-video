/**
 * SCENE 07 — Golden cross & death cross. `from 3490 · dur 650` · Mode A → C at t=18.2
 *
 * Both crossings are FOUND in the data, never chosen by eye. The box marks the
 * stretch of rise that had ALREADY happened by the time the cross printed —
 * that gap is the argument, and it is why the cross is a confirmation.
 *
 * No day count, no measured lag bracket, no generalising copy.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartFrame, gridOf } from "../components/ChartFrame";
import { MALine } from "../components/MALine";
import { LabelChip } from "../components/LabelChip";
import { TitleChip } from "../components/TitleChip";
import { HighlightBox } from "../components/HighlightBox";
import { Ping } from "../components/Ping";
import { Arrow } from "../components/Arrow";
import { TextBlock, assertBlocks } from "../components/TextBlock";
import { theme } from "../theme";
import { sec, sma, layoutMode } from "../helpers";
import { SERIES_REVERSAL, domainOf } from "../series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  chart: sec(0.0),
  golden: sec(3.4),
  death: sec(5.2),
  lag: sec(8.6),
  lagEnd: sec(11.7),
  lagging: sec(11.9),
  modeC: sec(18.2),
  block: sec(18.4),
  strike: sec(19.0),
};
const FAST = 16;
const SLOW = 52;
const TICKS = [4600, 5000, 5400, 5800];
// ═══════════════════════════════════════════════════════════════════════════

const F = sma(SERIES_REVERSAL, FAST);
const S = sma(SERIES_REVERSAL, SLOW);
const DOMAIN = domainOf(SERIES_REVERSAL);

const CROSS = (() => {
  let up = -1;
  let down = -1;
  for (let i = 1; i < SERIES_REVERSAL.length; i++) {
    const a = F[i - 1], b = F[i], c = S[i - 1], d = S[i];
    if (a === null || b === null || c === null || d === null) continue;
    if (up < 0 && a <= c && b > d) up = i;
    else if (up > 0 && down < 0 && a >= c && b < d) down = i;
  }
  const n = SERIES_REVERSAL.length;
  /* fallbacks clamped INTO the series — an out-of-range index put a label at
     an undefined price, which is how a label once ended up over the logo */
  return { up: up < 0 ? Math.round(n * 0.35) : up, down: down < 0 ? Math.round(n * 0.75) : down };
})();

/** Where price actually turned, before the crossing confirmed anything. */
const LOW = (() => {
  const from = Math.max(0, CROSS.up - 40);
  let best = from;
  for (let i = from; i < CROSS.up; i++) if (SERIES_REVERSAL[i] < SERIES_REVERSAL[best]) best = i;
  return best;
})();

assertBlocks("Scene07", [
  { from: T.lag, until: T.lagEnd },
  { from: T.block, until: 650 },
]);

export const Scene07 = () => {
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
        drawFrom={T.chart}
        drawDur={sec(3)}
        ticks={TICKS}
        tickLabels
        opacity={box.dim * 0.4}
      />
      <MALine values={S} grid={G} f={f} drawFrom={T.chart} drawDur={sec(3.4)} variant="slow" opacity={box.dim} />
      <MALine values={F} grid={G} f={f} drawFrom={T.chart} drawDur={sec(3.4)} variant="fast" opacity={box.dim} />

      <HighlightBox
        x1={G.x(LOW)}
        x2={G.x(CROSS.up)}
        y1={box.y + 30}
        y2={box.y + box.h - 30}
        f={f}
        at={T.lag}
        gone={T.modeC}
        opacity={box.dim}
      />
      <Ping x={G.x(CROSS.up)} y={G.y(F[CROSS.up] ?? 0)} f={f} at={T.golden} />
      <Ping x={G.x(CROSS.down)} y={G.y(F[CROSS.down] ?? 0)} f={f} at={T.death} />
      <Arrow
        from={{ x: G.x(LOW), y: G.y(SERIES_REVERSAL[LOW]) }}
        to={{ x: G.x(CROSS.up), y: G.y(SERIES_REVERSAL[CROSS.up]) }}
        f={f}
        at={T.lag + sec(1)}
        width={theme.layout.stroke.band}
        opacity={box.dim}
      />

      <TitleChip text="Golden & Death Cross" f={f} at={T.chart} />

      <LabelChip
        text="Golden Cross"
        x={G.x(CROSS.up)}
        y={G.y(F[CROSS.up] ?? 0)}
        f={f}
        at={T.golden + 8}
        anchor="above"
        gap={34}
        opacity={f >= T.death ? 0 : box.dim}
      />
      <LabelChip
        text="Death Cross"
        x={G.x(CROSS.down)}
        y={G.y(F[CROSS.down] ?? 0)}
        f={f}
        at={T.death + 8}
        anchor="below"
        gap={34}
        opacity={f >= T.lag ? 0 : box.dim}
      />
      <LabelChip
        text="Moving Average is Lagging"
        x={G.x(Math.round(SERIES_REVERSAL.length * 0.5))}
        y={G.y(S[Math.round(SERIES_REVERSAL.length * 0.5)] ?? 0)}
        f={f}
        at={T.lagging}
        anchor="below"
        gap={34}
        opacity={f >= T.modeC ? 0 : box.dim}
      />

      <TextBlock
        mode="A"
        localFrame={f}
        from={T.lag}
        until={T.lagEnd}
        x={theme.layout.panelB.x}
        y={theme.layout.chartA.y + 110}
        lines={[
          { text: "PRICE MOVED FIRST", size: "h2", color: "indigo" },
          { text: "↓", size: "h2", color: "muted" },
          { text: "CROSS CAME LATER", size: "h2", color: "text" },
        ]}
      />

      {/* COMPLIANCE: struck misconception, never a statement */}
      <TextBlock
        mode="C"
        localFrame={f}
        from={T.block}
        until={650}
        lines={[
          { text: "CROSS = ENTRY SIGNAL", size: "h2", color: "muted", struck: T.strike },
          { text: "CROSS = TREND CONFIRMATION", size: "h1", color: "indigo" },
          { text: "Confirmation, Not a Trigger", size: "label", color: "muted" },
        ]}
      />
    </SafeArea>
  );
};
