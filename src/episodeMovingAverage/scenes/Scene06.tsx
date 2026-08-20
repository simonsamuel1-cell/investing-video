/**
 * SCENE 06 — Dynamic support & resistance. `from 2903 · dur 587` · Mode A
 *
 * Two phases of one idea: price comes back onto a rising average and holds,
 * then rallies into a falling one and is turned away.
 *
 * The label is anchored to the MA LINE ITSELF, so it rides upward as the line
 * slopes. That is what shows "the level moves" — a caption saying so would be
 * a second text element doing the same job worse.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartFrame, gridOf } from "../components/ChartFrame";
import { MALine } from "../components/MALine";
import { LabelChip } from "../components/LabelChip";
import { TitleChip } from "../components/TitleChip";
import { Ping } from "../components/Ping";
import { TextBlock, assertBlocks } from "../components/TextBlock";
import { theme } from "../theme";
import { sec, sma, clamp01 } from "../helpers";
import { SERIES_UPTREND, toBars, domainOf } from "../series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  title: sec(0.0),
  up: sec(0.4),
  block1: sec(4.4),
  down: sec(10.4),
  block2: sec(10.8),
  close: sec(15.0),
};
const FADE = 20;
const PERIOD = 20;
/** Bars price comes back onto the line on — one Ping each. */
const TOUCH_UP = [42, 78];
const TOUCH_DOWN = [40, 76];
const RIDE_AT = 96;
// ═══════════════════════════════════════════════════════════════════════════

const UP = SERIES_UPTREND;
const DOWN = [...SERIES_UPTREND].reverse();
const UP_BARS = toBars(UP, 3106);
const DOWN_BARS = toBars(DOWN, 3107);
const UMA = sma(UP, PERIOD);
/** Lifted just enough to sit ON the highs, so price rallies INTO it and stops. */
const DMA = sma(DOWN, PERIOD).map((v) => (v === null ? null : v + 34));

assertBlocks("Scene06", [
  { from: T.block1, until: T.block2 },
  { from: T.block2, until: T.close },
  { from: T.close, until: 587 },
]);

export const Scene06 = () => {
  const f = useCurrentFrame();
  const box = theme.layout.chartA;
  const down = clamp01((f - T.down) / FADE);
  const UG = gridOf(UP, domainOf(UMA, UP_BARS), box);
  const DG = gridOf(DOWN, domainOf(DMA, DOWN_BARS), box);

  return (
    <SafeArea>
      {down < 0.999 && (
        <div style={{ opacity: 1 - down }}>
          <ChartFrame
            closes={UP}
            bars={UP_BARS}
            grid={UG}
            mode="candle"
            f={f}
            drawFrom={T.up}
            drawDur={sec(4)}
          />
          <MALine values={UMA} grid={UG} f={f} drawFrom={T.up} drawDur={sec(4)} variant="slow" />
          {TOUCH_UP.map((i, k) => (
            <Ping key={i} x={UG.x(i)} y={UG.y(UMA[i] ?? UP[i])} f={f} at={T.block1 + k * sec(2.4)} />
          ))}
          {/* anchored to the LINE, so it rides upward as the line slopes */}
          <LabelChip
            text="Dynamic Support"
            x={UG.x(RIDE_AT)}
            y={UG.y(UMA[RIDE_AT] ?? UP[RIDE_AT])}
            f={f}
            at={T.block1 + sec(1)}
            anchor="below"
            gap={30}
            opacity={1 - down}
          />
        </div>
      )}

      {down > 0.001 && (
        <div style={{ opacity: down }}>
          <ChartFrame
            closes={DOWN}
            bars={DOWN_BARS}
            grid={DG}
            mode="candle"
            f={f}
            drawFrom={T.down}
            drawDur={sec(3.4)}
          />
          <MALine values={DMA} grid={DG} f={f} drawFrom={T.down} drawDur={sec(3.4)} variant="slow" />
          {TOUCH_DOWN.map((i, k) => (
            <Ping key={i} x={DG.x(i)} y={DG.y(DMA[i] ?? DOWN[i])} f={f} at={T.block2 + k * sec(1.8)} />
          ))}
          <LabelChip
            text="Dynamic Resistance"
            x={DG.x(RIDE_AT)}
            y={DG.y(DMA[RIDE_AT] ?? DOWN[RIDE_AT])}
            f={f}
            at={T.block2 + sec(1)}
            anchor="above"
            gap={30}
            opacity={down}
          />
        </div>
      )}

      <TitleChip text="Dynamic S/R" f={f} at={T.title} />

      <TextBlock
        mode="A"
        localFrame={f}
        from={T.block1}
        until={T.block2}
        x={theme.layout.panelB.x}
        y={theme.layout.chartA.y + 100}
        lines={[
          { text: "DYNAMIC SUPPORT", size: "h2", color: "indigo" },
          { text: "Test → Bounce ↑", size: "label", color: "muted" },
        ]}
      />
      <TextBlock
        mode="A"
        localFrame={f}
        from={T.block2}
        until={T.close}
        x={theme.layout.panelB.x}
        y={theme.layout.chartA.y + 100}
        lines={[
          { text: "DYNAMIC RESISTANCE", size: "h2", color: "indigo" },
          { text: "Test → Reject ↓", size: "label", color: "muted" },
        ]}
      />
      <TextBlock
        mode="A"
        localFrame={f}
        from={T.close}
        until={587}
        x={theme.layout.chartA.x + 64}
        y={theme.layout.chartA.y + theme.layout.chartA.h - 110}
        lines={[
          { text: "Support / Resistance That Moves with Price", size: "h2", color: "indigo" },
        ]}
      />
    </SafeArea>
  );
};
