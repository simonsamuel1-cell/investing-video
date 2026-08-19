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
import { ChartFrame, gridOf, CHART } from "../components/ChartFrame";
import { QuoteBox } from "../components/QuoteBox";
import { MALine } from "../components/MALine";
import { theme } from "../theme";
import { sec, sma, seeded, fadeOut, clamp01, textReveal, progressInOut } from "../helpers";
import { toBars, domainOf } from "../series";
import { EXPLAINER, fromAnchors } from "../data/shots";
import { CUTS, cutIn, cutOut, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const GROUP_FROM = 659;
/**
 * The group is MOUNTED at 718, not at 659 — SC01 holds the last 59 frames so
 * its pills can take the centre of the frame.
 *
 * Every time below is still written against 659, because every one of them is
 * locked to the voice-over and the voice-over did not move. The clock is
 * offset once, in the component, instead of subtracting 59 from each entry and
 * losing the relationship to the recording.
 */
const LATE = 59;
/** Scene 03 begins here, in the group's own local frames. */
const SC03 = 487;
/**
 * The group's clock is GLOBAL − 659: it is mounted at 718 and opens 59 frames
 * into its own timeline (see LATE). `at` does that conversion once, so the
 * frames below can be written as the global ones they were specified in.
 */
const at = (global: number) => global - 659;
const T = {
  title: sec(0.2),
  price: sec(2.0),
  ma: sec(7.0),
  quiet: sec(12.0), // the noise recedes and the direction is read
  // ── Scene 03 ──
  clear: at(1131), // the average goes, and the two pills take over
  fast: at(1240), // MA20 is selected
  slow: at(1407), // MA200 is selected, and MA20 goes back to grey
  pulse: SC03 + sec(18.0),
};
/**
 * The pills sit BESIDE the title, on its own line. `titleW` is the width of
 * "Moving Average" at the title size PLUS the gap after it — measured off a
 * render, because the words are set in a webfont and there is nothing to ask
 * at build time. They hang off the end of it, so the row reads as one heading
 * with its two options.
 *
 * They are in the top 150px, so they must end before x = 1368; at this size
 * the pair finishes near x = 950 and the logo zone stays clear.
 */
const PILL = { gap: 12, titleW: 412, padX: 20, padY: 8 };
/**
 * The closing line, in a box that STRADDLES the card's bottom border — half on
 * the white, half on the ground. Sitting on the edge is what makes it read as
 * an overlay on the chart rather than as another label inside it.
 */
const QUOTE = {
  at: at(1584),
  y: CHART.y + CHART.h,
  /**
   * FIXED SIZE, not padding around the words.
   *
   * The frame is a dashed rule with a solid block on each corner, and both the
   * dash rhythm and the blocks have to land on known coordinates. A box that
   * sized itself to its text would have to be measured at render time, and the
   * dashes would re-space every time the sentence changed. The sentence here
   * is fixed, so the box is too.
   */
  w: 910,
  h: 78,
  /**
   * ONE MARK PER SENTENCE, not per word. Each claim is highlighted in the
   * colour of the line it is about — cyan is the fast average, indigo the slow
   * one, everywhere in the episode — so the box never has to say which is
   * which.
   *
   * The highlight is a TINT, not the full colour: #4D4D4D on solid indigo is
   * unreadable, and the whole point of marking a sentence is that it is the
   * one you read first.
   */
  short: "Pendek untuk gerak dekat.",
  long: "Panjang untuk arus utama.",
};
/** The line each pill names glows while the voice-over describes it. */
const GLOW = {
  short: { from: at(1587), to: at(1646) },
  long: { from: at(1660), to: at(1724) },
};
/** The period is underlined while the VO explains what the number means. */
const RULE = { from: at(1150), to: at(1238), over: 10 };
const TICKS = [800, 850, 900, 950, 1000];
const MID = 22;
const FAST = 20;
const SLOW = 70;
/** Room on the right for the price axis, so no label lands on the data. */
const AXIS_GUTTER = 150;
// ═══════════════════════════════════════════════════════════════════════════

/**
 * The chart these two scenes are taught on, traced from Simon's screenshot —
 * see `data/shots.ts` for what the trace does and does not claim. It replaces
 * the synthetic series that used to be here: a real market's noise is what the
 * smoothing has to prove itself against, and an invented one can be tidied
 * until the point makes itself.
 *
 * The three averages are recomputed FROM it, so the lines are genuinely the
 * averages of this chart rather than curves laid over it.
 */
/**
 * ONLY THE AXIS CHANGES SCALE, NEVER THE PICTURE.
 *
 * The bars are built at the traced chart's own levels and mapped afterwards,
 * closes and OHLC through the SAME affine map. Two things matter here:
 *
 *   · `toBars` sizes a wick in ABSOLUTE units — six to twenty-two of them — so
 *     rescaling the closes before it runs leaves those wicks at full size
 *     against a smaller range, and the chart turns into spikes. It has to run
 *     on the raw levels.
 *   · the map is affine, a stretch and a shift, so every proportion on screen
 *     survives it untouched. The candles sit exactly where they sat; only the
 *     numbers beside them change.
 */
const BAND = { lo: 800, hi: 1000 };
const RAW = fromAnchors(EXPLAINER, 105, 2201, 0.006);
const RAW_BARS = toBars(RAW, 2202);
const RANGE = {
  lo: Math.min(...RAW_BARS.map((b) => b.l)),
  hi: Math.max(...RAW_BARS.map((b) => b.h)),
};
const rescale = (v: number) =>
  BAND.lo + ((v - RANGE.lo) / (RANGE.hi - RANGE.lo)) * (BAND.hi - BAND.lo);

const SERIES = RAW.map(rescale);
const BARS = RAW_BARS.map((b) => ({
  o: rescale(b.o),
  h: rescale(b.h),
  l: rescale(b.l),
  c: rescale(b.c),
}));

const DOMAIN = domainOf(BARS);
const G = gridOf(SERIES, DOMAIN, CHART, 0.12, AXIS_GUTTER);
/**
 * ═══ THE WINDOW IS A SLICE, NOT THE WHOLE HISTORY ═══
 *
 * This chart is three years of trading; what is on screen is the last stretch
 * of it. So neither average can begin in the middle of the frame — by the time
 * the first visible bar prints, a 200-day average has had its two hundred days
 * for a long while.
 *
 * The averages are therefore computed over the visible bars PLUS a run of
 * prior ones, and only the visible part is drawn. Two things follow, and both
 * are the point:
 *
 *   · every average is full-window everywhere on screen — no warm-up, no
 *     line starting two thirds across;
 *   · the two lines do NOT set off together. An expanding window would have
 *     made them identical until bar 20, because at bar 5 a "200-day" average
 *     and a 20-day one both contain the same five days. Real history is what
 *     separates them.
 *
 * The prior bars are seeded and are never drawn — they exist only so the
 * arithmetic on screen is the arithmetic it claims to be.
 */
const PRIOR = (() => {
  const rnd = seeded(2301);
  const out: number[] = [];
  let p = SERIES[0];
  for (let i = 0; i < SLOW + 8; i++) {
    p -= (rnd() - 0.42) * 2 * 5;
    out.unshift(p);
  }
  return out;
})();
const WITH_HISTORY = [...PRIOR, ...SERIES];
/** The average over the full history, cropped back to the visible window. */
const maOf = (period: number) => sma(WITH_HISTORY, period).slice(PRIOR.length);

const MA_MID = maOf(MID);
const MA_FAST = maOf(FAST);
const MA_SLOW = maOf(SLOW);

export const ExplainerGroup = () => {
  /* see LATE — the group opens 59 frames into its own timeline */
  const f = useCurrentFrame() + LATE;
  const g = f + GROUP_FROM;
  /**
   * THE TWO CUTS ARE HELD APART.
   *
   * Everything the group draws rides both: it arrives on `toAverage` at 718
   * and leaves on `toTypes` at 1839. The TITLE only rides the first. It comes
   * in with the scene, then stays put while the chart, the averages and the
   * pills are swept out from under it — so the heading is the one thing the
   * boundary does not move, and the frame hands over on a word rather than on
   * a wipe.
   */
  /**
   * The run does not cut out — it CLEARS. Over the last 30 frames everything
   * drawn on the card fades away, and only the heading and the card itself are
   * left for Scene 04 to carry on with.
   */
  const clear = 1 - progressInOut(f, at(1809), 30);
  const dyIn = cutIn(g, CUTS.toAverage);
  const blurIn = cutBlur(g, CUTS.toAverage);
  const dy = dyIn + cutOut(g, CUTS.toTypes);
  const blur = Math.max(blurIn, cutBlur(g, CUTS.toTypes));

  /** Scene 02 quietens the price; Scene 03 keeps it quiet. */
  /**
   * The price quietens while the average is being read off it, and comes back
   * to FULL STRENGTH once the pills take over: from there the scene is about
   * which average, and the chart underneath is the thing being averaged, not a
   * backdrop.
   */
  const price =
    f >= T.clear
      ? 0.25 + 0.75 * clamp01((f - T.clear) / 14)
      : f >= T.quiet
        ? 1 - 0.75 * clamp01((f - T.quiet) / 24)
        : 1;
  const midOut = f >= T.clear ? fadeOut(f, T.clear, sec(1.4)) : 1;
  /** Both lines thicken once, together — "banyak trader memakai keduanya". */
  const pulse = f >= T.pulse ? Math.sin(Math.PI * clamp01((f - T.pulse) / 30)) : 0;
  /**
   * A beat that fades IN and OUT rather than switching. Every highlight in
   * this scene runs through it, so none of them can pop.
   */
  const beat = (from: number, to: number, over = 10) =>
    clamp01((f - from) / over) * (1 - clamp01((f - (to - over)) / over));
  /** The two pills, and the two lines they name. */
  const litFast = beat(T.fast, T.slow);
  const litSlow = clamp01((f - T.slow) / 10);
  const glowFast = beat(GLOW.short.from, GLOW.short.to);
  const glowSlow = beat(GLOW.long.from, GLOW.long.to);
  /** The average lights up while the noise recedes, and goes out with it. */
  const lit = f >= T.quiet ? clamp01((f - T.quiet) / 20) * midOut : 0;

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
        {/* THE WHITE CARD, drawn on its own and NEVER faded.
            It is the one thing besides the heading that survives the boundary:
            CG-A's contents dissolve off it and SC04's are drawn onto the same
            surface, so the card never blinks. That is why ChartFrame runs with
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
        <div style={{ opacity: clear }}>
        <ChartFrame
          closes={SERIES}
          bars={BARS}
          grid={G}
          f={f}
          drawFrom={T.price}
          drawDur={sec(5)}
          ticks={TICKS}
          opacity={price}
          surface={false}
        />

        {/* Scene 02's line — smooth, calm, and unhurried.

            Through the quiet beat it LIGHTS UP and thickens a little, which is
            the job the arrow used to do: it said "this is the direction", and
            the line saying it about itself needs no second object. */}
        <MALine
          values={MA_MID}
          grid={G}
          f={f}
          drawFrom={T.ma}
          drawDur={150}
          variant="slow"
          tone={theme.color.average}
          glow={lit}
          width={theme.shape.ma + lit * 1.6}
          opacity={midOut}
        />

        {/* Scene 03's pair */}
        <MALine values={MA_FAST} grid={G} f={f} drawFrom={T.fast} drawDur={sec(5)} variant="fast" glow={glowFast} width={theme.shape.ma + pulse * 1.5 + glowFast * 1.2} />
        <MALine values={MA_SLOW} grid={G} f={f} drawFrom={T.slow} drawDur={sec(6)} variant="slow" glow={glowSlow} width={theme.shape.ma + pulse * 1.5 + glowSlow * 1.2} />


        {/* ── the two averages, as pills ─────────────────────────────
            They replace the "Short = Fast" / "Long = Big Picture" chips that
            used to sit on the chart: those named the same two lines, and with
            the title already on screen the frame would carry five pieces of
            type at once. */}
        {f >= T.clear && (
          <div
            style={{
              position: "absolute",
              left: theme.stage.titleChip.x + PILL.titleW,
              top: theme.stage.titleChip.y,
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              gap: PILL.gap,
            }}
          >
            {[
              { head: "MA", num: "20", lit: litFast },
              { head: "MA", num: "200", lit: litSlow },
            ].map((pill, i) => {
              const r = textReveal(f, T.clear + i * 8);
              const lit = pill.lit;
              /* the rule sweeps out from the left of the number and retracts
                 the same way — it is pointing AT the digits, so it should not
                 simply appear under them */
              const rule =
                f < RULE.from
                  ? 0
                  : f < RULE.to
                    ? clamp01((f - RULE.from) / RULE.over)
                    : 1 - clamp01((f - RULE.to) / RULE.over);
              return (
                <div
                  key={pill.num}
                  style={{
                    transform: `translateY(${r.dy}px)`,
                    opacity: r.opacity,
                    padding: `${PILL.padY}px ${PILL.padX}px`,
                    borderRadius: theme.shape.chipRadius,
                    /* the same pill SC01's timeframe row uses: a pale indigo
                       chip that fills solid when it is the live one. The halo
                       rides the same 0 → 1, so the whole selection fades in
                       and out together instead of switching. */
                    background: lit > 0.5 ? theme.color.indigo : theme.color.indigoPale,
                    boxShadow: lit > 0.01 ? `0 0 ${(34 * lit).toFixed(0)}px ${theme.color.glow}` : undefined,
                    fontFamily: theme.text.family,
                    fontSize: theme.text.tag.size,
                    fontWeight: theme.text.tag.weight,
                    color: lit > 0.5 ? theme.color.onIndigo : theme.color.textMuted,
                  }}
                >
                  {pill.head}
                  <span style={{ position: "relative" }}>
                    {pill.num}
                    {rule > 0.001 && (
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          bottom: -8,
                          height: theme.shape.rule,
                          width: `${(rule * 100).toFixed(1)}%`,
                          background: lit > 0.5 ? theme.color.onIndigo : theme.color.indigo,
                        }}
                      />
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* the closing line — one grey sentence per claim, each marked in the
            colour of the line it belongs to. See QuoteBox. */}
        <QuoteBox
          f={f}
          at={QUOTE.at}
          w={QUOTE.w}
          h={QUOTE.h}
          lines={[
            {
              segments: [
                { text: QUOTE.short, tone: theme.color.cyan40 },
                { text: "  " },
                { text: QUOTE.long, tone: theme.color.indigo40 },
              ],
            },
          ]}
        />
        </div>
      </div>
    </SafeArea>
  );
};
