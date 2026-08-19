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
import { QuoteBox } from "../components/QuoteBox";
import { LabelChip } from "../components/LabelChip";
import { theme } from "../theme";
import { sec, sma, ema, seeded, clamp01, textReveal, progressInOut } from "../helpers";
import { toBars, domainOf } from "../series";
import { SMA_EMA, fromAnchors } from "../data/shots";
import { CUTS, cutIn, cutOut, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const SCENE_FROM = 1839;
/**
 * The group's clock is GLOBAL − 1839. `at` does that conversion once, so the
 * frames Simon specified can be written as the global ones they were given in.
 */
const at = (global: number) => global - SCENE_FROM;
const DRAW = sec(3);
const T = {
  price: sec(0.6),
  /** One line at a time — the second arrives onto a chart that already has the
      first, which is the only way "faster" and "steadier" mean anything. */
  sma: at(1966),
  ema: at(2053),
  /**
   * The closing box. It REPLACES the one-line caption that used to sit under
   * the chart: the box straddles y = 850 and the caption sat at 880, so with
   * both on screen the caption would be printed through the box's own frame.
   * The box says the same thing at length, so the caption is the one that goes.
   */
  quote: at(2173),
  /**
   * Both pills arrive here, grey — the same pattern CG-A uses: the options are
   * on the board first, and only then does one of them light.
   */
  pillsOn: at(1869),
  /** Each pill lights while the voice-over is on its own average. */
  smaOn: at(1971),
  emaOn: at(2060),
  /** Both lines clear off the card before the scene hands over. */
  clear: 437,
  clearOver: 30,
};
const PERIOD = 16;
/**
 * The same band CG-A is read on. The card is continuous across 1839 now, and
 * an axis that jumps to a different decade on an unchanged card reads as a
 * glitch rather than as a new chart.
 */
const BAND = { lo: 800, hi: 1000 };
const TICKS = [800, 850, 900, 950, 1000];
/**
 * ZERO. The gutter existed to keep a price label off the data — with the
 * labels gone the chart has no reason to sit 150px left of centre, so it takes
 * the card's full width and is centred in it again.
 */
const AXIS_GUTTER = 0;
/**
 * The pills sit BESIDE the heading, on its own line — the same row, metrics and
 * chip design CG-A gives MA20 and MA200, because they are the same control
 * doing the same job one scene later. `titleW` is the width of "Moving Average"
 * at the title size plus the gap after it, measured off a render.
 */
const PILL = { gap: 12, titleW: 412, padX: 20, padY: 8 };
// ═══════════════════════════════════════════════════════════════════════════

/**
 * The candles, traced from Simon's chart — see `data/shots.ts`. Built at the
 * traced levels and mapped afterwards, closes and OHLC through the SAME affine
 * map: `toBars` sizes a wick in absolute units, so rescaling before it runs
 * would leave those wicks at full size against a different range.
 */
const RAW = fromAnchors(SMA_EMA, 112, 4401, 0.005);
const RAW_BARS = toBars(RAW, 4402);
const RANGE = {
  lo: Math.min(...RAW_BARS.map((b) => b.l)),
  hi: Math.max(...RAW_BARS.map((b) => b.h)),
};
const rescale = (v: number) =>
  BAND.lo + ((v - RANGE.lo) / (RANGE.hi - RANGE.lo)) * (BAND.hi - BAND.lo);
const SERIES = RAW.map(rescale);
const BARS = RAW_BARS.map((b) => ({ o: rescale(b.o), h: rescale(b.h), l: rescale(b.l), c: rescale(b.c) }));

const DOMAIN = domainOf(BARS);
const G = gridOf(SERIES, DOMAIN, CHART, 0.12, AXIS_GUTTER);

/**
 * The window is a SLICE of a longer history, so neither average begins inside
 * the frame: both are computed over the visible bars plus a run of prior ones
 * and cropped back. Without that, two lines of the same period would still
 * start together — and this scene's whole claim is that they DON'T behave the
 * same, which is impossible to read while either is missing.
 */
const PRIOR = (() => {
  const rnd = seeded(4403);
  const out: number[] = [];
  let p = SERIES[0];
  for (let i = 0; i < PERIOD * 3; i++) {
    p -= (rnd() - 0.45) * 2 * 4;
    out.unshift(p);
  }
  return out;
})();
const WITH_HISTORY = [...PRIOR, ...SERIES];
/** SAME array, both averages. The method is the only variable. */
const SMA = sma(WITH_HISTORY, PERIOD).slice(PRIOR.length);
const EMA = ema(WITH_HISTORY, PERIOD).slice(PRIOR.length);

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
  for (let i = PERIOD; i < SERIES.length; i++) {
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
  /** The two averages, and the labels that name them, leave together. */
  const lines = 1 - progressInOut(f, T.clear, T.clearOver);
  /** One at a time, cross-fading: SMA hands the highlight to EMA. */
  const litSma = clamp01((f - T.smaOn) / 10) * (1 - clamp01((f - T.emaOn) / 10));
  const litEma = clamp01((f - T.emaOn) / 10);

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
        {/* THE WHITE CARD, drawn on its own and NEVER faded.
            It is the one thing besides the heading that survives the boundary:
            the previous scene's contents dissolved off it and these are drawn
            onto the same surface, so the card never blinks. That is why ChartFrame runs with
            `surface={false}` here — otherwise it would draw a second card and
            fade it out from under this one. */}
        <div
          style={{
            position: "absolute",
            left: CHART.x,
            top: CHART.y,
            width: CHART.w,
            height: CHART.h,
            borderRadius: theme.shape.cardRadius,
            background: theme.color.surface,
            border: `${theme.shape.hairline}px solid ${theme.color.hairline}`,
          }}
        />
        <ChartFrame
          closes={SERIES}
          bars={BARS}
          grid={G}
          f={f}
          drawFrom={T.price}
          drawDur={sec(2.4)}
          ticks={TICKS}
          tickLabels={false}
          surface={false}
        />
        <MALine values={SMA} grid={G} f={f} drawFrom={T.sma} drawDur={DRAW} variant="slow" opacity={lines} />
        <MALine values={EMA} grid={G} f={f} drawFrom={T.ema} drawDur={DRAW} variant="fast" opacity={lines} />

        {/* the box covers just the turn — the two lines disagreeing about when */}

        {/* the two line names are the second text element, and they are one pair */}
        <LabelChip
          text="SMA"
          x={G.x(APART)}
          y={clearAbove(G, APART, 4, [SMA, EMA], BARS)}
          f={f}
          at={T.sma + DRAW - 20}
          anchor="above"
          gap={28}
          size={theme.text.tag.size}
          weight={theme.text.tag.weight}
          opacity={lines}
        />
        <LabelChip
          text="EMA"
          x={G.x(APART)}
          y={clearBelow(G, APART, 4, [SMA, EMA], BARS)}
          f={f}
          at={T.ema + DRAW - 20}
          anchor="below"
          gap={28}
          tone={theme.color.cyan}
          size={theme.text.tag.size}
          weight={theme.text.tag.weight}
          opacity={lines}
        />

        {/* the two averages, as pills — same chip as CG-A's MA20 / MA200 */}
        {f >= T.pillsOn && (
          <div
            style={{
              position: "absolute",
              left: theme.stage.titleChip.x + PILL.titleW,
              top: theme.stage.titleChip.y,
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              gap: PILL.gap,
              opacity: lines,
            }}
          >
            {[
              { label: "SMA", lit: litSma },
              { label: "EMA", lit: litEma },
            ].map((pill, i) => {
              const r = textReveal(f, T.pillsOn + i * 8);
              return (
              <div
                key={pill.label}
                style={{
                  transform: `translateY(${r.dy}px)`,
                  opacity: r.opacity,
                  padding: `${PILL.padY}px ${PILL.padX}px`,
                  borderRadius: theme.shape.chipRadius,
                  background: pill.lit > 0.5 ? theme.color.indigo : theme.color.indigoPale,
                  boxShadow: pill.lit > 0.01 ? `0 0 ${(34 * pill.lit).toFixed(0)}px ${theme.color.glow}` : undefined,
                  fontFamily: theme.text.family,
                  fontSize: theme.text.tag.size,
                  fontWeight: theme.text.tag.weight,
                  color: pill.lit > 0.5 ? theme.color.onIndigo : theme.color.textMuted,
                }}
              >
                {pill.label}
              </div>
              );
            })}
          </div>
        )}

        {/* the two claims, plain — no marks here. The pills above are already
            lighting SMA and EMA in turn, and a highlight on both sentences at
            once would say two things are being singled out when nothing is. */}
        <QuoteBox
          f={f}
          at={T.quote}
          w={962}
          h={140}
          lines={[
            { segments: [{ text: "SMA bobotnya sama rata, EMA menekankan harga terbaru." }] },
            { segments: [{ text: "Jadi EMA lebih cepat, tapi false signal-nya juga lebih banyak." }] },
          ]}
        />
      </div>
    </SafeArea>
  );
};
