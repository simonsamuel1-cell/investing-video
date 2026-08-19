/**
 * CG-A — Scenes 02 + 03 as ONE spanning Sequence (global 659 → 1839).
 *
 * The chart mounts once, here, and never unmounts. The price line drawn in
 * Scene 02 is the same object Scene 03 keeps annotating — a remount would
 * redraw the series the viewer just watched appear, and quietly undo the one
 * thing these two scenes prove together.
 *
 * SCENE 02 HAS NO ARITHMETIC. No sliding window, no accumulating dots, no
 * "rata-rata 5 hari" callout. A smooth line appearing through the noise, and
 * the noise then receding, IS the idea — explaining the sum on top of it would
 * be teaching a formula the VO never mentions.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartFrame, gridOf, clearAbove, clearBelow, CHART } from "../components/ChartFrame";
import { MALine } from "../components/MALine";
import { LabelChip } from "../components/LabelChip";
import { TitleChip } from "../components/TitleChip";
import { Arrow } from "../components/Arrow";
import { theme } from "../theme";
import { sec, sma, fadeOut, clamp01 } from "../helpers";
import { SERIES, BARS, domainOf } from "../series";
import { CUTS, cutIn, cutOut, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const GROUP_FROM = 659;
/** Scene 03 begins here, in the group's own local frames. */
const SC03 = 487;
const T = {
  title: sec(0.2),
  price: sec(2.0),
  ma: sec(7.0),
  quiet: sec(12.0), // the noise recedes and the direction is read
  // ── Scene 03 ──
  clear: SC03 + sec(0.2), // the first MA goes, the price steps back
  fast: SC03 + sec(4.0),
  slow: SC03 + sec(11.0),
  pulse: SC03 + sec(18.0),
};
const TICKS = [4400, 4800, 5200, 5600, 6000, 6400];
const MID = 22;
const FAST = 20;
const SLOW = 70;
/** Room on the right for the price axis, so no label lands on the data. */
const AXIS_GUTTER = 150;
// ═══════════════════════════════════════════════════════════════════════════

const DOMAIN = domainOf(BARS);
const G = gridOf(SERIES, DOMAIN, CHART, 0.12, AXIS_GUTTER);
const MA_MID = sma(SERIES, MID);
const MA_FAST = sma(SERIES, FAST);
const MA_SLOW = sma(SERIES, SLOW);
/** Far enough from the right edge that a 12-bar-wide label still fits. */
const LABEL_AT = SERIES.length - 14;
/**
 * The far end of Scene 02's arrow, clamped INTO the series. It used to be a
 * literal 122, from when this series was 140 bars long; at 100 bars that index
 * is undefined, `G.y(undefined)` is NaN, and the arrow silently never drew.
 */
const ARROW_TO = Math.min(SERIES.length - 1, 122);

export const ExplainerGroup = () => {
  const f = useCurrentFrame();
  const g = f + GROUP_FROM;
  const dy = cutIn(g, CUTS.toAverage) + cutOut(g, CUTS.toTypes);
  const blur = Math.max(cutBlur(g, CUTS.toAverage), cutBlur(g, CUTS.toTypes));

  /** Scene 02 quietens the price; Scene 03 keeps it quiet. */
  const price =
    f >= T.clear ? 0.4 : f >= T.quiet ? 1 - 0.75 * clamp01((f - T.quiet) / 24) : 1;
  const midOut = f >= T.clear ? fadeOut(f, T.clear, sec(1.4)) : 1;
  /** Both lines thicken once, together — "banyak trader memakai keduanya". */
  const pulse = f >= T.pulse ? Math.sin(Math.PI * clamp01((f - T.pulse) / 30)) : 0;

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
        <ChartFrame
          closes={SERIES}
          bars={BARS}
          grid={G}
          f={f}
          drawFrom={T.price}
          drawDur={sec(5)}
          ticks={TICKS}
          opacity={price}
        />

        {/* Scene 02's line — smooth, calm, and unhurried */}
        <MALine
          values={MA_MID}
          grid={G}
          f={f}
          drawFrom={T.ma}
          drawDur={150}
          variant="slow"
          opacity={midOut}
        />

        {/* Scene 03's pair */}
        <MALine values={MA_FAST} grid={G} f={f} drawFrom={T.fast} drawDur={sec(5)} variant="fast" width={theme.shape.ma + pulse * 1.5} />
        <MALine values={MA_SLOW} grid={G} f={f} drawFrom={T.slow} drawDur={sec(6)} variant="slow" width={theme.shape.ma + pulse * 1.5} />

        {/* the direction the smoothing was for — Scene 02's only annotation */}
        {f >= T.quiet && f < T.clear && (
          <Arrow
            from={{ x: G.x(78), y: G.y(MA_MID[78] ?? SERIES[78]) }}
            to={{ x: G.x(ARROW_TO), y: G.y(MA_MID[ARROW_TO] ?? SERIES[ARROW_TO]) }}
            f={f}
            at={T.quiet}
            opacity={midOut}
          />
        )}

        <TitleChip text="Moving Average" f={f} at={T.title} />

        {/* one label at a time — the title is already the second text element */}
        {/* one above everything drawn, one below it — they cannot meet either */}
        <LabelChip
          text="Short = Fast"
          x={G.x(LABEL_AT)}
          y={clearAbove(G, LABEL_AT, 12, [MA_FAST, MA_SLOW], BARS)}
          f={f}
          at={T.fast + sec(3)}
          anchor="above"
          gap={30}
          tone={theme.color.cyan}
          opacity={f >= T.slow ? fadeOut(f, T.slow + sec(4), 14) : 1}
        />
        <LabelChip
          text="Long = Big Picture"
          x={G.x(LABEL_AT)}
          y={clearBelow(G, LABEL_AT, 12, [MA_FAST, MA_SLOW], BARS)}
          f={f}
          at={T.slow + sec(5)}
          anchor="below"
          gap={30}
        />
      </div>
    </SafeArea>
  );
};
