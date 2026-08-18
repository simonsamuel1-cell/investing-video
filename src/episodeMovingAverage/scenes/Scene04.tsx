/**
 * SC04 — SMA vs EMA (from 1839, dur 467).
 *
 * ONE CHART, ONE CLEAR REVERSAL. Not two panels: both averages are computed
 * from the SAME array, so the only thing that differs on screen is when each
 * one turns. Two side-by-side charts would make the comparison decorative.
 *
 * The EMA turning first and the SMA following is the entire distinction. No
 * weight bars, no bobot diagram — that graphic explains a formula the VO never
 * states.
 *
 * ⚠ BLOCKED PENDING A VO CHECK. The raw SRT captured "SMA lebih menekankan
 * harga terbaru"; the script and the CORRECTED SRT both say EMA, and this scene
 * is built on the corrected wording. If the recording actually says SMA, the
 * two labels here are inverted and that is a re-record, not a code fix.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartFrame, gridOf, clearAbove, clearBelow, CHART } from "../components/ChartFrame";
import { MALine } from "../components/MALine";
import { LabelChip } from "../components/LabelChip";
import { TitleChip } from "../components/TitleChip";
import { HighlightBox } from "../components/HighlightBox";
import { theme } from "../theme";
import { sec, sma, ema, textReveal } from "../helpers";
import { SERIES_REVERSAL, BARS_REVERSAL, domainOf } from "../series";
import { CUTS, cutIn, cutOut, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const SCENE_FROM = 1839;
const T = { title: sec(0.2), price: sec(0.6), mas: sec(3.0), turn: sec(8.0), caption: sec(13.0) };
const PERIOD = 16;
const TICKS = [4600, 5000, 5400, 5800];
/** Room on the right for the price axis, so no label lands on the data. */
const AXIS_GUTTER = 150;
// ═══════════════════════════════════════════════════════════════════════════

const DOMAIN = domainOf(BARS_REVERSAL);
const G = gridOf(SERIES_REVERSAL, DOMAIN, CHART, 0.12, AXIS_GUTTER);
/** SAME array, both averages. The method is the only variable. */
const SMA = sma(SERIES_REVERSAL, PERIOD);
const EMA = ema(SERIES_REVERSAL, PERIOD);

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
/**
 * Where the two lines are furthest apart — the only place two labels can sit
 * without one covering the other. At the right end they converge and stack.
 */
const APART = (() => {
  let best = TURN.sma;
  let gap = 0;
  for (let i = PERIOD; i < SERIES_REVERSAL.length; i++) {
    const a = SMA[i];
    const b = EMA[i];
    if (a === null || b === null) continue;
    if (Math.abs(a - b) > gap) {
      gap = Math.abs(a - b);
      best = i;
    }
  }
  return best;
})();

export const Scene04 = () => {
  const f = useCurrentFrame();
  const g = f + SCENE_FROM;
  const dx = cutIn(g, CUTS.toTypes);
  const dy = cutOut(g, CUTS.toReading);
  const blur = Math.max(cutBlur(g, CUTS.toTypes), cutBlur(g, CUTS.toReading));
  const cap = textReveal(f, T.caption);

  return (
    <SafeArea>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${dx}px, ${dy}px)`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        <ChartFrame
          closes={SERIES_REVERSAL}
          bars={BARS_REVERSAL}
          grid={G}
          f={f}
          drawFrom={T.price}
          drawDur={sec(2.4)}
          ticks={TICKS}
          opacity={0.45}
        />
        <MALine values={SMA} grid={G} f={f} drawFrom={T.mas} drawDur={sec(4)} variant="slow" />
        <MALine values={EMA} grid={G} f={f} drawFrom={T.mas} drawDur={sec(4)} variant="fast" />

        {/* the box covers just the turn — the two lines disagreeing about when */}
        <HighlightBox
          x1={G.x(TURN.ema) - 40}
          x2={G.x(TURN.sma) + 40}
          y1={CHART.y + 40}
          y2={CHART.y + CHART.h - 40}
          f={f}
          at={T.turn}
        />

        <TitleChip text="SMA vs EMA" f={f} at={T.title} />

        {/* the two line names are the second text element, and they are one pair */}
        <LabelChip
          text="SMA"
          x={G.x(APART)}
          y={clearAbove(G, APART, 4, [SMA, EMA], BARS_REVERSAL)}
          f={f}
          at={T.mas + sec(2.6)}
          anchor="above"
          gap={28}
          size={theme.text.labelSm.size}
          weight={theme.text.labelSm.weight}
        />
        <LabelChip
          text="EMA"
          x={G.x(APART)}
          y={clearBelow(G, APART, 4, [SMA, EMA], BARS_REVERSAL)}
          f={f}
          at={T.mas + sec(2.6)}
          anchor="below"
          gap={28}
          tone={theme.color.cyan}
          size={theme.text.labelSm.size}
          weight={theme.text.labelSm.weight}
        />

        {f >= T.caption && (
          <div
            style={{
              position: "absolute",
              left: theme.canvas.width / 2,
              top: theme.stage.captionY + cap.dy,
              transform: "translate(-50%, -50%)",
              fontFamily: theme.text.family,
              fontSize: theme.text.label.size,
              fontWeight: theme.text.label.weight,
              color: theme.color.ink,
              opacity: cap.opacity,
              whiteSpace: "nowrap",
            }}
          >
            EMA Faster, SMA Steadier
          </div>
        )}
      </div>
    </SafeArea>
  );
};
