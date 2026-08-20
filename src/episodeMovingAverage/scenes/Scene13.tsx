/**
 * SCENE 13 — Close. `from 8271 · dur 624` · Mode A → C at t=8.8
 *
 * PRICE MOVES FIRST AND THE INDICATORS FOLLOW, and the drawing order has to
 * say so: the price line is given a head start and both overlays begin after
 * it. A follower that is ever ahead of its leader contradicts the only line
 * the scene is making.
 *
 * The final screen holds to the last frame. Do NOT fade to black — the silver
 * background carries out.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartFrame, gridOf } from "../components/ChartFrame";
import { MALine } from "../components/MALine";
import { BollingerBands } from "../components/BollingerBands";
import { TextBlock, assertBlocks } from "../components/TextBlock";
import { sec, sma, bollinger, layoutMode, progressInOut } from "../helpers";
import { SERIES, domainOf } from "../series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  price: sec(0.0),
  /** The overlays start only after price has drawn — see the header note. */
  overlays: sec(1.6),
  block1: sec(0.6),
  block1End: sec(4.9),
  modeC: sec(8.8),
  l1: sec(8.8),
  l2: sec(11.6),
  l3: sec(14.8),
  linesEnd: sec(17.2),
  hier: sec(17.2),
  hierEnd: sec(19.2),
  final: sec(19.2),
};
const PERIOD = 20;
// ═══════════════════════════════════════════════════════════════════════════

const MA = sma(SERIES, PERIOD);
const BB = bollinger(SERIES, PERIOD, 2);
const DOMAIN = domainOf([...SERIES, ...BB.lower, ...BB.upper]);

assertBlocks("Scene13", [
  { from: T.block1, until: T.block1End },
  { from: T.l1, until: T.linesEnd },
  { from: T.hier, until: T.hierEnd },
  { from: T.final, until: 624 },
]);

export const Scene13 = () => {
  const f = useCurrentFrame();
  const box = layoutMode(f, [
    { at: 0, mode: "A" },
    { at: T.modeC, mode: "C" },
  ]);
  const G = gridOf(SERIES, DOMAIN, box);

  return (
    <SafeArea>
      <ChartFrame
        closes={SERIES}
        grid={G}
        mode="line"
        f={f}
        drawFrom={T.price}
        drawDur={sec(3.4)}
        opacity={box.dim * 0.55}
      />
      <MALine
        values={MA}
        grid={G}
        f={f}
        drawFrom={T.overlays}
        drawDur={sec(3.4)}
        variant="slow"
        opacity={box.dim}
      />
      <BollingerBands
        mid={BB.mid}
        upper={BB.upper}
        lower={BB.lower}
        grid={G}
        opacity={progressInOut(f, T.overlays + sec(1), sec(2)) * 0.85 * box.dim}
      />

      <TextBlock
        mode="A"
        localFrame={f}
        from={T.block1}
        until={T.block1End}
        x={1128}
        y={260}
        lines={[
          { text: "PRICE MOVES FIRST", size: "h2", color: "indigo" },
          { text: "↓", size: "label", color: "muted" },
          { text: "INDICATORS FOLLOW", size: "h2", color: "text" },
        ]}
      />

      {/* one element that grows: each line lands on its own voice-over line */}
      <TextBlock
        mode="C"
        localFrame={f}
        from={T.l1}
        until={T.linesEnd}
        lines={[
          { text: "MA → Confirm the Trend", size: "h2", color: "indigo", at: T.l1 },
          { text: "Bollinger Bands → Read Volatility", size: "h2", color: "cyan", at: T.l2 },
          { text: "Price Action First", size: "h2", color: "text", at: T.l3 },
        ]}
      />

      <TextBlock
        mode="C"
        localFrame={f}
        from={T.hier}
        until={T.hierEnd}
        gap={8}
        lines={[
          { text: "PRICE ACTION", size: "h2", color: "indigo" },
          { text: "↓", size: "label", color: "muted" },
          { text: "TREND & KEY LEVELS", size: "h2", color: "text" },
          { text: "↓", size: "label", color: "muted" },
          { text: "INDICATORS", size: "h2", color: "cyan" },
          { text: "↓", size: "label", color: "muted" },
          { text: "CONFIRMATION", size: "h2", color: "indigo" },
        ]}
      />

      {/* the largest type in the episode, held to the last frame */}
      <TextBlock
        mode="C"
        localFrame={f}
        from={T.final}
        until={624}
        y={360}
        lines={[
          { text: "USE INDICATORS TO CONFIRM", size: "display", color: "indigo" },
          { text: "NOT TO DECIDE FOR YOU", size: "display", color: "text" },
        ]}
      />
    </SafeArea>
  );
};
