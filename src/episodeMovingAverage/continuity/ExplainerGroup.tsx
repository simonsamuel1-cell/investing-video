/**
 * CG-A — Scenes 02 + 03 as ONE spanning Sequence (global 607 → 1765).
 *
 * The chart mounts once, here, and never unmounts. The price line drawn in
 * Scene 02 is the same object Scene 03 keeps annotating — a remount would
 * redraw the series the viewer just watched appear, and quietly undo the one
 * thing these two scenes prove together.
 *
 * SCENE 02 HAS NO ARITHMETIC. No sliding window, no accumulating dots, no
 * averaging callout. A smooth line appearing through the noise, and the noise
 * then receding, IS the idea.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartFrame, gridOf } from "../components/ChartFrame";
import { MALine } from "../components/MALine";
import { LabelChip } from "../components/LabelChip";
import { TitleChip } from "../components/TitleChip";
import { TextBlock, assertBlocks } from "../components/TextBlock";
import { theme } from "../theme";
import { sec, sma, mulberry32, layoutMode, clamp01, progress } from "../helpers";
import { SERIES, domainOf } from "../series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** Scene 03 begins here, in the group's own local frames. */
const SC03 = 499;
const T = {
  title: sec(0.0),
  price: sec(2.4),
  ma: sec(5.0),
  quiet: sec(11.8),
  block1: sec(13.5),
  block2: sec(14.9),
  // ── Scene 03 ──
  clear: SC03,
  fast: SC03 + sec(2.5),
  slow: SC03 + sec(9.5),
  modeB: SC03 + sec(15.9),
  panel: SC03 + sec(16.4),
  pulse: SC03 + sec(19.4),
};
const FAST_P = 20;
const SLOW_P = 200;
const TICKS = [4400, 4800, 5200, 5600, 6000, 6400];
// ═══════════════════════════════════════════════════════════════════════════

/**
 * THE WINDOW IS A SLICE OF A LONGER HISTORY.
 *
 * A 200-period average cannot exist inside a 140-bar window — by the time the
 * first visible bar prints, MA200 has had its two hundred sessions for a long
 * while. So both averages are computed over the visible bars PLUS a seeded run
 * of prior ones, and only the visible part is drawn. The prior bars are never
 * shown; they exist so the arithmetic on screen is the arithmetic it claims.
 */
const PRIOR = (() => {
  const rnd = mulberry32(2301);
  const out: number[] = [];
  let p = SERIES[0];
  for (let i = 0; i < SLOW_P + 10; i++) {
    p -= (rnd() - 0.46) * 2 * 18;
    out.unshift(p);
  }
  return out;
})();
const WITH_HISTORY = [...PRIOR, ...SERIES];
const maOf = (period: number) => sma(WITH_HISTORY, period).slice(PRIOR.length);
const MA_FAST = maOf(FAST_P);
const MA_SLOW = maOf(SLOW_P);
/** Scene 02's single line — the one that appears through the noise. */
const MA_MID = maOf(40);

const DOMAIN = domainOf([...SERIES, ...MA_SLOW]);
const LABEL_AT = SERIES.length - 16;

assertBlocks("ExplainerGroup", [
  { from: T.block1, until: T.block2 },
  { from: T.block2, until: SC03 },
  { from: T.panel, until: 1158 },
]);

export const ExplainerGroup = () => {
  const f = useCurrentFrame();
  const box = layoutMode(f, [
    { at: 0, mode: "A" },
    { at: T.modeB, mode: "B" },
  ]);
  const G = gridOf(SERIES, DOMAIN, box, 0.12, 150);

  /** Scene 02 quietens the price; Scene 03 keeps it quiet. */
  const price =
    f >= T.clear ? 0.4 : f >= T.quiet ? 1 - 0.75 * clamp01((f - T.quiet) / 24) : 1;
  const midOut = f >= T.clear ? 1 - progress(f, T.clear, sec(2.2)) : 1;
  /** Both lines thicken once, together — "trader sering melihat keduanya". */
  const pulse = f >= T.pulse ? Math.sin(Math.PI * clamp01((f - T.pulse) / 30)) : 0;

  return (
    <SafeArea>
      <ChartFrame
        closes={SERIES}
        bars={[]}
        grid={G}
        mode="line"
        f={f}
        drawFrom={T.price}
        drawDur={sec(2.3)}
        ticks={TICKS}
        tickLabels
        opacity={price}
      />

      {/* Scene 02's line — smooth, calm, and given the full six seconds */}
      <MALine
        values={MA_MID}
        grid={G}
        f={f}
        drawFrom={T.ma}
        drawDur={sec(6.1)}
        variant="slow"
        opacity={midOut}
      />

      {/* Scene 03's pair */}
      <MALine
        values={MA_FAST}
        grid={G}
        f={f}
        drawFrom={T.fast}
        drawDur={sec(6.6)}
        variant="fast"
        width={theme.layout.stroke.ma + pulse * 1.5}
      />
      <MALine
        values={MA_SLOW}
        grid={G}
        f={f}
        drawFrom={T.slow}
        drawDur={sec(5.7)}
        variant="slow"
        width={theme.layout.stroke.ma + pulse * 1.5}
      />

      <TitleChip text="Moving Average" f={f} at={T.title} />

      <LabelChip
        text="MA20 — Faster • Closer to Price"
        x={G.x(LABEL_AT)}
        y={G.y(MA_FAST[LABEL_AT] ?? SERIES[LABEL_AT])}
        f={f}
        at={T.fast + sec(3.4)}
        anchor="above"
        gap={30}
        tone={theme.colors.cyan}
        opacity={f >= T.modeB ? 1 - progress(f, T.modeB, 14) : 1}
      />
      <LabelChip
        text="MA200 — Slower • Big Picture"
        x={G.x(LABEL_AT)}
        y={G.y(MA_SLOW[LABEL_AT] ?? SERIES[LABEL_AT])}
        f={f}
        at={T.slow + sec(3.2)}
        anchor="below"
        gap={30}
        opacity={f >= T.modeB ? 1 - progress(f, T.modeB, 14) : 1}
      />

      {/* Scene 02's two blocks, one replacing the other in place */}
      <TextBlock
        mode="A"
        localFrame={f}
        from={T.block1}
        until={T.block2}
        x={theme.layout.panelB.x}
        y={theme.layout.chartA.y + 140}
        lines={[
          { text: "PRICE:   ↑ ↓ ↑ ↓ ↑ ↓", size: "label", color: "muted" },
          { text: "MOVING AVERAGE:   ↗", size: "label", color: "indigo" },
        ]}
      />
      <TextBlock
        mode="A"
        localFrame={f}
        from={T.block2}
        until={SC03}
        x={theme.layout.panelB.x}
        y={theme.layout.chartA.y + 140}
        lines={[
          { text: "MOVING AVERAGE", size: "h2", color: "indigo" },
          { text: "Smooths Price → Reveals Trend", size: "label", color: "muted" },
        ]}
      />

      {/* Scene 03's Mode-B panel */}
      <TextBlock
        mode="B"
        localFrame={f}
        from={T.panel}
        until={1158}
        lines={[
          { text: "MA20 →", size: "h2", color: "cyan" },
          { text: "Fast Reaction / Near-Term", size: "label", color: "muted" },
          { text: "MA200 →", size: "h2", color: "indigo" },
          { text: "Slow Reaction / Big Picture", size: "label", color: "muted" },
        ]}
      />
    </SafeArea>
  );
};
