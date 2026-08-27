/**
 * CG-C — the quiz. `from 6762 · dur 1626`
 *
 * ⚠ EVERYTHING THIS SCENE USED TO DRAW IS GONE, at Simon's direction: the
 * bounce mark, the squeeze call-out, the reveal mask, the countdown, the two
 * question blocks and the answer panel. It is being rebuilt from the chart up,
 * and right now it holds two things — the heading arriving from SC11, and
 * GGRM.
 *
 * ═══ THE HEADING CROSSES THE SEAM ═══
 *
 * SC11 ends on 6761 with "Quiz Time" big and centred. This opens on 6762 and
 * walks the same words to the heading rail. Both sides render `QuizTitle`, so
 * the frame either side of the boundary is the same picture by construction
 * rather than by two numbers that happen to agree.
 *
 * ═══ AND THE CHART IS GGRM, FOR REAL ═══
 *
 * `data/ggrm.json` shipped empty for the whole build with a [NEEDS DATA] guard
 * on it, because this is the one named, dated and priced instrument in the
 * episode and a generated candle labelled GGRM would be a fabricated record.
 * That guard is now SATISFIED, not bypassed: Simon supplied a TradingView
 * screenshot of GGRM and every bar below is read from it — see the `source`,
 * `readMethod` and `accuracy` fields in the file itself.
 *
 * ⚠ THE PURPLE LINE IS READ, NOT COMPUTED. TradingView draws SMA 100 across
 * the whole window because it has the hundred sessions before it; this window
 * does not, so a computed line would begin three-quarters of the way in. The
 * line in the picture is the honest source, and it is drawn INDIGO here at
 * Simon's direction — purple is not in this episode's palette.
 *
 * ═══ AND IT IS SC01's WINDOW, NOT A CHART OF ITS OWN ═══
 *
 * Simon: "pahami bentuk, ukuran, isi konten dari scene 1, lalu duplikat saja".
 * So this draws SC01's broker panel — the same box, the same header, the same
 * timeframe pills and indicator chips, the same left price axis with its
 * dotted rules and its dark last-price tag, the same month row.
 *
 * ⚠ THE GEOMETRY IS IMPORTED, not copied. `PANEL`, `PLOT`, `HEAD`, `UI`, `BTN`
 * and `AXIS_CX` come from SC01 itself. Two sets of numbers that started out
 * equal do not stay equal, and the whole point is that these are the same
 * window twice.
 *
 * What is NOT duplicated, and why:
 *   THE WATCHLIST   six other tickers beside a GGRM question is six things to
 *                   read that the question is not about. SC01's panel spends
 *                   its first seconds without it too, so this is a state that
 *                   window genuinely has.
 *   "Ilustrasi"     SC01 carries that tag because its candles are invented
 *                   from anchors. These are not. Wearing it here would say the
 *                   opposite of what the file spent a page establishing.
 *
 * ⚠ NOT YET: the chart is meant to grow later, into the framing of Simon's
 * second screenshot. Deliberately absent — he asked for the small state first.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { QuizTitle } from "../components/QuizTitle";
import {
  PANEL,
  PLOT,
  HEAD,
  UI,
  BTN,
  AXIS_CX,
} from "../scenes/Scene01";
import { theme } from "../theme";
import { sec, fmtRp, bollinger, progress, progressInOut } from "../helpers";
import raw from "../data/ggrm.json";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** Where this group is mounted, so Simon's beats can be quoted as globals. */
const FROM = 6762;
const at = (global: number) => global - FROM;
const T = {
  /**
   * The heading settles over its first 25 frames. It starts at `t = 0` — the
   * exact state SC11 leaves on 6761 — so the seam is a continuation and not a
   * cut, and 6762 is the first frame of the move rather than a jump into it.
   */
  settle: 0,
  settleOver: 25,
  /** GGRM arrives. */
  chart: at(6800),
  chartOver: sec(1.6),
  /**
   * ═══ THE STRETCH (6905) ═══
   *
   * The window pulls in to the last thirty-six bars, the same gesture as
   * spreading a TradingView chart apart: the RIGHT edge is pinned and the left
   * runs off out of frame, so the tape does not slide — it opens.
   *
   * It lands between "Ini chart GGRM pada Juli 2026" (ends 6873) and "Harga
   * turun ke moving average yang lebih lambat dan menanjak" (6920). The whole
   * six months establish where we are; the stretch then puts the viewer close
   * enough to see the thing the next sentence is about — bars 112 to 118 dip
   * below the purple line and bar 119 takes it back.
   */
  stretch: at(6905),
  stretchOver: 30,
  /**
   * The bounce, ringed, with the line that reads it — under "lalu memantul"
   * (7053–7085). It arrives ahead of that sentence so the words land on a mark
   * already made, and both leave together at 7089.
   */
  mark: at(6983),
  markOut: at(7089),
  markOver: 16,
  /**
   * ═══ THE ANSWER (7090) ═══
   *
   * Bollinger Bands arrive, the tape runs on into August, and the window
   * travels right to take it in. One beat, three parts, because they are one
   * thing: the quiz asked what happened after the bounce, and this is it.
   */
  answer: at(7090),
  answerOver: 40,
};
/** How many bars the stretch leaves on screen. */
const WINDOW = 36;
/**
 * The price levels, in thousands — GGRM's own round numbers, not a step
 * generated from the range. The tape runs 12.630 to 17.970, so a 400 step
 * would put fourteen rules across a 490px plot; at a thousand they land about
 * 90px apart, which is a grid you read a price off rather than a hatch you
 * look through. Levels the chart does not reach are dropped.
 */
const TICKS = [13000, 14000, 15000, 16000, 17000, 18000];
/**
 * ⚠ THIS PLOT IS WIDER THAN SC01's. Simon pointed at the gap: SC01 leaves 56px
 * of panel to the right of its plot, and with no watchlist open that is just
 * empty card. Here the tape runs on until 20px short of the panel's own edge.
 *
 * Everything else — the left axis column at 150, the 14px inner padding, the
 * y mapping — is SC01's, untouched. Only the right edge moved.
 */
/**
 * ═══ THE PANEL'S OWN LAYOUT, AFTER SIMON'S CUTS ═══
 *
 * SC01 stacks its header over two rows — name, then a big price — and puts the
 * timeframe pills above the indicator chips on the right. Both of those are
 * gone here: the price sits on the NAME row and the timeframes are cut, so the
 * whole top of the panel is one line instead of two.
 *
 * That frees 96px, and the plot takes all of it: it starts at 104 rather than
 * SC01's 200 and keeps the same BOTTOM, so the months land exactly where they
 * did and only the top moves. This is the one place this panel's geometry
 * departs from SC01's, and it departs because SC01's chrome is not all here.
 *
 * 104 leaves 12px between the header row and the plot's own top edge — which
 * is not as tight as it sounds, because the tape does not start there: the
 * 0.06 drop in `pyIn` and the range's own padding put the first ink about 60px
 * lower. Going further up would start eating into the header, not into space.
 */
const AXIS_COL = PLOT.x - PANEL.x;
const PLOT_TOP = 104;
const PLOT_H = 586;
const RIGHT_GAP = 20;
/* `lx(N-1)` works out to PLOT_W + 136 — the axis column at 150, the 14px inner
   padding, less the 28 the padding takes off the span. Solving that for a last
   bar `RIGHT_GAP` short of the panel's edge is the line below; deriving it any
   other way is how it came out NARROWER than SC01's on the first attempt. */
const PLOT_W = PANEL.w - RIGHT_GAP - 136;
// ═══════════════════════════════════════════════════════════════════════════

type GgrmBar = { o: number; h: number; l: number; c: number; ma100: number };
type Month = { bar: number; label: string };
const GGRM = raw as {
  ticker: string;
  name: string;
  bars: GgrmBar[];
  months: Month[];
  extension?: unknown;
};

/**
 * ⚠ THE GUARD STAYS. It is satisfied today and it still has to be here: if the
 * file is ever emptied or replaced with a short export, this scene draws
 * nothing rather than drawing a chart that is not GGRM.
 */
const MIN_BARS = 120;
const READY = GGRM.bars.length >= MIN_BARS;

/**
 * ⚠ TWO LENGTHS. `ASK` is the tape the quiz is set on — everything up to the
 * bounce, which is where Simon's first screenshot ends. `BARS` is that plus
 * the thirty bars of August that answer it, and nothing may draw those before
 * 7090: showing the answer while the question is on screen is the one thing
 * this scene cannot do.
 */
const BARS = GGRM.bars;
const ASK = GGRM.bars.length - (GGRM.extension ? 30 : 0);
const N = BARS.length;
/**
 * ⚠ THE HEADER READS THE QUESTION'S LAST BAR, not the tape's. Quoting the
 * August close in the header would answer the quiz in the panel's own title
 * while the chart is still asking it.
 */
const LAST = ASK ? BARS[ASK - 1].c : 0;
/** Yesterday against today, for the header's change chip. */
const CHANGE =
  ASK > 1 ? (BARS[ASK - 1].c - BARS[ASK - 2].c) / BARS[ASK - 2].c : 0;
/**
 * ⚠ THE BANDS ARE COMPUTED, unlike the average, which is read.
 *
 * Neither screenshot draws them — both have BB switched off in the legend — so
 * there is no line to trace. BB(20, 2) needs twenty closes and this tape has a
 * hundred and sixty-seven, so it can simply be calculated; and calculated is
 * better than traced when the input is already exact.
 */
const BB = bollinger(
  GGRM.bars.map((b) => b.c),
  20,
  2,
);

/**
 * ═══ SC01's PLOT MAPPING, TO THE LETTER ═══
 *
 * Panel-relative, because everything inside the panel is: `lx` is SC01's own
 * `lx`, generalised from its 105 bars to any count, and `py` is the `y` that
 * `makeChart` builds — the same 0.8 squeeze and 0.06 drop, which exist so a
 * label hanging under the lowest bar still clears the month row.
 */
const spanOf = (bars: GgrmBar[]): [number, number] =>
  bars.length
    ? [
        Math.min(...bars.map((b) => b.l), ...bars.map((b) => b.ma100)),
        Math.max(...bars.map((b) => b.h), ...bars.map((b) => b.ma100)),
      ]
    : [0, 1];
/** The question's own tape — the wide view never shows the answer. */
const [LO, HI] = spanOf(BARS.slice(0, ASK));
/**
 * ⚠ AND THE SPAN THE STRETCH LANDS ON. A chart pulled in to thirty-six bars
 * refits its price axis to them — otherwise the tape keeps the whole tape's
 * range and sits in the middle third of a plot with an empty floor under it
 * and a level label pointing at nothing.
 *
 * The two spans are INTERPOLATED across the stretch rather than recomputed
 * from whatever is on screen at that frame. Recomputing looks the same until
 * the tape's own low leaves the window, and then everything jumps.
 */
const [WIN_LO, WIN_HI] = spanOf(BARS.slice(Math.max(0, ASK - WINDOW), ASK));
/**
 * ⚠ AND WHERE THE ANSWER LANDS: the last `WINDOW` bars of the FULL tape, the
 * bands included. August takes GGRM to 20.694 — 2.700 above anything the
 * question shows — so a span that did not know about it would draw the rally
 * straight out of the top of the panel.
 */
const [ANS_LO, ANS_HI] = (() => {
  const [a, b] = spanOf(BARS.slice(Math.max(0, N - WINDOW)));
  const lo = BB.lower.slice(N - WINDOW).filter((v): v is number => v !== null);
  const hi = BB.upper.slice(N - WINDOW).filter((v): v is number => v !== null);
  return [Math.min(a, ...lo), Math.max(b, ...hi)];
})();
/**
 * Bar index to panel x, through the window.
 *
 * `from` is the first bar on screen — 0 for the whole tape, and up to
 * `N - WINDOW` when the stretch has finished. The last bar is fixed at the
 * right whatever `from` is, which is what makes this a stretch and not a pan.
 */
const lxFrom = (i: number, from: number, to: number) =>
  AXIS_COL + 14 + ((PLOT_W - 28) * (i - from)) / (to - from);
/**
 * How much of the plot's height the tape is allowed to use.
 *
 * `wide` is SC01's own 0.8 — its charts leave the bottom fifth clear because a
 * swing label hanging under the lowest bar has to miss the month row. The
 * stretch has no such labels and Simon wanted it to reach further down, so it
 * takes the height as well as the width: 0.92 leaves 20px under the tape and
 * still 44px between that and the months.
 */
const FILL = { wide: 0.8, close: 0.92 };
const pyIn = (v: number, lo: number, hi: number, fill: number) =>
  PLOT_TOP + PLOT_H * (1 - (v - lo) / (hi - lo)) * fill + PLOT_H * 0.06;
const bodyW = (from: number, to: number) =>
  ((PLOT_W - 28) / (to - from + 1)) * 0.6;

/**
 * ═══ THE BOUNCE — FOUND, NOT PLACED ═══
 *
 * The LAST run of bars whose low breaks under the average, the bar that takes
 * the level back, and the lowest point in between.
 *
 * `recover` is the first bar after the dip that CLOSES above where the decline
 * started, not merely the first green one: the claim is that the average held,
 * and a bar closing lower than the one that began the fall has not shown that.
 *
 * ⚠ THE RING IS THE DIP ITSELF — the bars that actually broke under the line,
 * and nothing else. It used to carry two bars of approach and the whole
 * recovery with it and came out the size of a third of the plot; Simon: bring
 * it down to the lowest candles. The recovery is still SAID, by the line that
 * runs out of the ring to the bar that answered it.
 */
const DIP = (() => {
  let to = -1;
  for (let i = N - 1; i >= 0; i--)
    if (BARS[i].l < BARS[i].ma100) {
      to = i;
      break;
    }
  if (to < 0) return null;
  let from = to;
  while (from > 0 && BARS[from - 1].l < BARS[from - 1].ma100) from--;
  let lowAt = from;
  for (let i = from; i <= to; i++) if (BARS[i].l < BARS[lowAt].l) lowAt = i;
  const before = BARS[Math.max(0, from - 1)].c;
  let recover = to;
  for (let i = to + 1; i < N; i++)
    if (BARS[i].c >= before) {
      recover = i;
      break;
    }
  return { from, to, lowAt, recover };
})();
/** How far the ring stands off the bars it encloses. */
const RING_PAD = 26;

/** The month row's two real anchors — see where they are drawn. */
const MONTH_0 = GGRM.months.length ? GGRM.months[0].bar : 0;
const MONTH_N = GGRM.months.length
  ? GGRM.months[GGRM.months.length - 1].bar
  : 0;

const font = theme.type.family;
const C = theme.colors;

export const GgrmGroup = () => {
  const f = useCurrentFrame();
  const on = progressInOut(f, T.chart, theme.motion.revealF);
  /** How much of the tape has printed. */
  const shown = progress(f, T.chart, T.chartOver);
  const pull = progressInOut(f, T.stretch, T.stretchOver);
  /**
   * ═══ THE WINDOW ═══
   *
   * Both ends move, and they move for different reasons. `to` travels right
   * across the answer because the tape gains thirty bars; `from` follows it
   * so the count on screen stays put — which is what makes 7090 read as the
   * chart running ON rather than as a zoom out.
   */
  const ans = progressInOut(f, T.answer, T.answerOver);
  /* the question's bars print at 6800; the answer's are added at 7090 */
  const upto = Math.min(
    N,
    Math.ceil(ASK * shown) + Math.round((N - ASK) * ans),
  );
  const to = ASK - 1 + (N - ASK) * ans;
  const from = (to - (WINDOW - 1)) * pull;
  const lx = (i: number) => lxFrom(i, from, to);
  const BODY_W = bodyW(from, to);
  const lo = LO + (WIN_LO - LO) * pull + (ANS_LO - WIN_LO) * ans * pull;
  const hi = HI + (WIN_HI - HI) * pull + (ANS_HI - WIN_HI) * ans * pull;
  /* the stretch pulls DOWN as well as apart — see FILL */
  const fill = FILL.wide + (FILL.close - FILL.wide) * pull;
  const py = (v: number) => pyIn(v, lo, hi, fill);
  /** A mark's arrival, and its leaving. */
  const mark = (frame: number) => progress(f, frame, T.markOver);
  const mark2 = (frame: number) => progress(f, frame, T.markOver);

  return (
    <SafeArea>
      {READY && f >= T.chart && (
        <div style={{ opacity: on }}>
          {/* ── the window ── */}
          <div
            style={{
              position: "absolute",
              left: PANEL.x,
              top: PANEL.y,
              width: PANEL.w,
              height: PANEL.h,
              borderRadius: theme.layout.radius.lg,
              background: C.surface,
              border: `${theme.layout.border.thin}px solid ${C.border}`,
            }}
          />

          {/* everything below is PANEL-RELATIVE, as it is in SC01 */}
          <div
            style={{
              position: "absolute",
              left: PANEL.x,
              top: PANEL.y,
              width: PANEL.w,
              height: PANEL.h,
            }}
          >
            {/* ── the header ── */}
            <div
              style={{
                position: "absolute",
                left: HEAD.x,
                top: 36,
                display: "flex",
                alignItems: "center",
                gap: HEAD.gap,
              }}
            >
              <div
                style={{
                  width: HEAD.avatar,
                  height: HEAD.avatar,
                  borderRadius: HEAD.avatar / 2,
                  background: C.indigo,
                  color: C.surface,
                  fontFamily: font,
                  fontSize: UI.size,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {GGRM.ticker[0]}
              </div>
              <span
                style={{
                  fontFamily: font,
                  fontSize: UI.name,
                  fontWeight: UI.weight,
                  color: C.text,
                }}
              >
                {GGRM.ticker}
              </span>
              <span
                style={{
                  fontFamily: font,
                  fontSize: UI.size,
                  fontWeight: UI.weight,
                  color: C.textMuted,
                }}
              >
                {GGRM.name}
              </span>
              {/* ⚠ THE PRICE SITS ON THIS ROW NOW, at the NAME's size but its
                  own weight. Simon's call, and it is what collapses SC01's two
                  header rows into one — 800 against the name's 600 is what
                  still makes it read as the number and not as more label. */}
              <span
                style={{
                  fontFamily: font,
                  fontSize: UI.size,
                  fontWeight: 800,
                  color: C.text,
                }}
              >
                {fmtRp(LAST)}
              </span>
              <span
                style={{
                  fontFamily: font,
                  fontSize: UI.size,
                  fontWeight: UI.weight,
                  color: CHANGE >= 0 ? C.candleGreen : C.candleRed,
                  background:
                    CHANGE >= 0
                      ? "rgba(34, 181, 115, 0.12)"
                      : "rgba(229, 71, 93, 0.12)",
                  borderRadius: theme.layout.radius.sm,
                  padding: "6px 16px",
                }}
              >
                {`${CHANGE >= 0 ? "+" : "−"}${Math.abs(CHANGE * 100)
                  .toFixed(2)
                  .replace(".", ",")}%`}
              </span>
              {/* NO "Ilustrasi" tag — see the header note */}
            </div>

            {/* NO SECOND HEADER ROW and NO TIMEFRAME PILLS. The price moved
                up beside the name, and Simon cut 5m/15m/1H/1D/1W — five
                controls nobody in this scene is going to touch. What they
                leave behind is 70px, and the plot takes it: see PLOT_TOP. */}

            {/* ── the indicator chips ──
                Moving Average is LIT and Bollinger Bands is not, because that
                is what the chart draws. A chip that says an indicator is on
                while the plot has none is the panel lying about itself. */}
            <div
              style={{
                position: "absolute",
                right: 40,
                /* up on the header line — the timeframes that used to sit
                   above them are gone */
                top: 40,
                display: "flex",
                gap: BTN.gap,
              }}
            >
              {[
                /* named for what the line IS. Simon: the chart draws a
                   hundred-bar simple average and calling it "Moving Average"
                   in a scene that has spent five minutes on the difference is
                   the one place vagueness costs something. */
                { label: "SMA100", lit: true },
                { label: "Bollinger Bands", lit: ans > 0.5 },
              ].map((b) => (
                <span
                  key={b.label}
                  style={{
                    fontFamily: font,
                    /* ⚠ NAME-SIZED, not BTN.size. Simon: these two are the
                       only controls left, and at 20px against a 30px header
                       they read as fine print rather than as the switches the
                       scene is about to talk about. */
                    fontSize: UI.size,
                    fontWeight: UI.weight,
                    color: b.lit ? C.surface : C.textMuted,
                    background: b.lit ? C.indigo : C.surface,
                    border: `${theme.layout.border.thin}px solid ${b.lit ? C.indigo : C.border}`,
                    borderRadius: theme.layout.radius.sm,
                    padding: `${BTN.padY}px ${BTN.padX}px`,
                  }}
                >
                  {b.label}
                </span>
              ))}
            </div>

            {/* ── the chart ── */}
            <svg
              style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
              width={PANEL.w}
              height={PANEL.h}
            >
              {TICKS.filter((v) => v >= lo && v <= hi).map((v) => (
                <g key={v}>
                  <line
                    x1={AXIS_COL}
                    y1={py(v)}
                    x2={AXIS_COL + PLOT_W}
                    y2={py(v)}
                    stroke={C.gridline}
                    strokeWidth={theme.layout.border.thin}
                    strokeDasharray="2 8"
                  />
                  <text
                    x={AXIS_CX}
                    y={py(v) + 10}
                    textAnchor="middle"
                    fontFamily={font}
                    fontSize={UI.size}
                    fontWeight={UI.axis}
                    fill={C.textMuted}
                  >
                    {fmtRp(v)}
                  </text>
                </g>
              ))}

              {/* ⚠ CLIPPED TO THE PLOT. Once the window pulls in, the bars
                  left of it are still drawn — at negative x, straight through
                  the price axis. The clip is what makes them leave the frame
                  instead of the column. */}
              <defs>
                <clipPath id="ggrmPlot">
                  <rect
                    x={AXIS_COL}
                    y={0}
                    width={PLOT_W}
                    height={PANEL.h}
                  />
                </clipPath>
              </defs>
              <g clipPath="url(#ggrmPlot)">
              {/* ── BOLLINGER BANDS ──
                  The envelope and its fill, in the episode's cyan. They belong
                  to the ANSWER: the question is about what a moving average
                  told you, and a channel drawn over it while the quiz is open
                  is a second indicator nobody asked about. */}
              {ans > 0.001 && (
                <g opacity={ans}>
                  <path
                    d={
                      BARS.slice(0, upto)
                        .map((_, i) =>
                          BB.upper[i] === null
                            ? ""
                            : `${i === 0 || BB.upper[i - 1] === null ? "M" : "L"}${lx(i).toFixed(1)},${py(BB.upper[i] as number).toFixed(1)}`,
                        )
                        .join(" ") +
                      " " +
                      BARS.slice(0, upto)
                        .map((_, i) => upto - 1 - i)
                        .map((i) =>
                          BB.lower[i] === null
                            ? ""
                            : `L${lx(i).toFixed(1)},${py(BB.lower[i] as number).toFixed(1)}`,
                        )
                        .join(" ") +
                      " Z"
                    }
                    fill={C.cyan}
                    fillOpacity={0.12}
                    stroke="none"
                  />
                  {[BB.upper, BB.lower].map((band, k) => (
                    <path
                      key={k}
                      d={BARS.slice(0, upto)
                        .map((_, i) =>
                          band[i] === null
                            ? ""
                            : `${i === 0 || band[i - 1] === null ? "M" : "L"}${lx(i).toFixed(1)},${py(band[i] as number).toFixed(1)}`,
                        )
                        .join(" ")}
                      fill="none"
                      stroke={C.cyan}
                      strokeWidth={theme.layout.stroke.band}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}
                </g>
              )}

              {/* THE AVERAGE IS BEHIND THE CANDLES — an indicator is something
                  the price moves through, not something laid over it. */}
              <path
                d={BARS.slice(0, upto)
                  .map(
                    (b, i) =>
                      `${i === 0 ? "M" : "L"}${lx(i).toFixed(1)},${py(b.ma100).toFixed(1)}`,
                  )
                  .join(" ")}
                fill="none"
                stroke={C.indigo}
                strokeWidth={theme.layout.stroke.ma}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {BARS.slice(0, upto).map((b, i) => {
                const x = lx(i);
                const top = Math.min(py(b.o), py(b.c));
                const h = Math.max(1.5, Math.abs(py(b.c) - py(b.o)));
                /* one bar, one colour — see ChartFrame */
                const fill = b.c >= b.o ? C.candleGreen : C.candleRed;
                return (
                  <g key={i}>
                    <line
                      x1={x}
                      y1={py(b.h)}
                      x2={x}
                      y2={py(b.l)}
                      stroke={fill}
                      strokeWidth={theme.layout.stroke.wick}
                    />
                    <rect
                      x={x - BODY_W / 2}
                      y={top}
                      width={BODY_W}
                      height={h}
                      fill={fill}
                    />
                  </g>
                );
              })}


                {/*
                  ── THE BOUNCE ──
                  A ring on the dip, and a line from its LOWEST POINT out to
                  the lower body of the LAST bar on the tape. The line is the
                  reading: it is the slope the average handed back, drawn from
                  the price that tested it to where price has got to since.

                  ⚠ CYAN, both of them. Simon's call, and it keeps them clear
                  of the average they are about — that line is indigo, and a
                  mark in the same hue as the thing it marks reads as part of
                  it.

                  Both live INSIDE the clip, with the tape — they are marks on
                  bars, so if the window ever runs past them they leave with the
                  bars they are about.
                */}
                {DIP &&
                  (() => {
                    const a2 = mark(T.mark) * (1 - mark2(T.markOut));
                    if (a2 <= 0.001) return null;
                    const x1 = lx(DIP.from);
                    const x2 = lx(DIP.to);
                    let top = Infinity;
                    let bot = -Infinity;
                    for (let i = DIP.from; i <= DIP.to; i++) {
                      top = Math.min(top, py(BARS[i].h));
                      bot = Math.max(bot, py(BARS[i].l));
                    }
                    const r = Math.max(
                      (x2 - x1) / 2 + RING_PAD,
                      (bot - top) / 2 + RING_PAD,
                    );
                    /* the last bar on the tape, not the one that recovered —
                       Simon: pull the line out to the rightmost candle */
                    const end = BARS[N - 1];
                    return (
                      <g opacity={a2}>
                        <circle
                          cx={(x1 + x2) / 2}
                          cy={(top + bot) / 2}
                          r={r}
                          fill="none"
                          stroke={C.cyan}
                          strokeWidth={theme.layout.stroke.band}
                        />
                        <line
                          x1={lx(DIP.lowAt)}
                          y1={py(BARS[DIP.lowAt].l)}
                          x2={lx(N - 1)}
                          y2={py(Math.min(end.o, end.c))}
                          stroke={C.cyan}
                          strokeWidth={theme.layout.stroke.band}
                          strokeLinecap="round"
                        />
                      </g>
                    );
                  })()}
              </g>

              {/* THE LAST-PRICE RULE is back at Simon's second thought. The
                  axis PILL is not: the number it carried is the big one in the
                  header, and the line's job is to mark the level, not to read
                  it out. It is drawn OUTSIDE the clip because it is a level
                  across the whole plot, not a piece of tape. */}
              <line
                x1={AXIS_COL}
                y1={py(LAST)}
                x2={AXIS_COL + PLOT_W}
                y2={py(LAST)}
                stroke={C.text}
                strokeWidth={theme.layout.border.thin}
                strokeDasharray="8 8"
              />

              {/*
                ── the months ──
                EVENLY SPACED, and it costs almost nothing. Their true bars —
                17, 37, 55, 72, 93, 109, 129 — are 16 to 21 apart, because IDX
                months have different numbers of trading days, and Simon could
                see the row was ragged.
                
                So the FIRST and LAST keep their read positions and the five
                between them are distributed evenly. The largest a label moves
                is 1.3 bars, about 15px — a third of a week on a six-month
                chart. Spacing them evenly across the whole plot instead would
                have thrown them out by far more.
              */}
              {GGRM.months.map((m, k) => {
                const bar =
                  MONTH_0 +
                  ((MONTH_N - MONTH_0) * k) / (GGRM.months.length - 1);
                /* a month the window has run past has no place on its axis */
                if (bar < from) return null;
                return (
                <text
                  key={m.label}
                  x={lx(bar)}
                  y={PLOT_TOP + PLOT_H + 34}
                  textAnchor="middle"
                  fontFamily={font}
                  fontSize={UI.size}
                  fontWeight={UI.axis}
                  fill={C.textMuted}
                >
                  {m.label}
                </text>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* the heading, arriving from SC11 — see the header note */}
      <QuizTitle
        f={f}
        /* -999, not 0: its reveal already ran in SC11. Reading it from 0 here
           would fade the words up a second time on the seam. */
        at={-999}
        t={progressInOut(f, T.settle, T.settleOver)}
      />
    </SafeArea>
  );
};
