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
import { Arrow } from "../components/Arrow";
import { QuoteBox } from "../components/QuoteBox";
import { CUTS, cutOutStyle } from "../transitions/CameraCut";
import {
  PANEL,
  PLOT,
  HEAD,
  UI,
  BTN,
  AXIS_CX,
} from "../scenes/Scene01";
import { theme } from "../theme";
import {
  sec,
  fmtRp,
  bollinger,
  progress,
  progressInOut,
  textReveal,
} from "../helpers";
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
  /**
   * ═══ THE COVER LIFTS (7765) ═══
   *
   * The last 23 bars are behind an indigo panel with a question mark on it
   * from the moment they arrive until here.
   */
  /**
   * The last visible bar is ringed at 7183 and the ring goes at 7263 — it has
   * said where the question is asked from by the time the question itself
   * arrives beside the heading, and two marks making the same point is one
   * too many.
   */
  ring: at(7183),
  ringOut: at(7263),
  /** And the question itself, beside the heading (VO 7266–7333). */
  ask: at(7285),
  /**
   * ⚠ THE COUNTDOWN. "Tiga… dua… satu" runs 7468–7544 — and it used to run to
   * 7574, with thirty frames of measured silence at the end of it. Simon had
   * those cut; the VO lost the same second at 251.333s, where it was -91 dB
   * from end to end.
   */
  three: at(7465),
  two: at(7495),
  one: at(7525),
  /**
   * ═══ THE COVER LIFTS (7541) ═══
   * It goes, and the bars behind it print ONE AT A TIME — the answer arrives
   * as the tape did, not as a picture swapped in.
   */
  reveal: at(7541),
  revealOver: 16,
  printOver: 46,
  /**
   * ═══ THE AVERAGE, LIT (7637 → 7733) ═══
   * "Moving average yang menanjak sebelumnya berhasil menjadi support." The
   * line the whole quiz was about is thickened and glowed for exactly the
   * sentence that names it, and returns to its own weight after.
   */
  glow: at(7637),
  glowOut: at(7733),
  glowOver: 20,
  /**
   * ═══ THE BOX, AND WHERE IT GOES (7728 → 7795) ═══
   *
   * ONE box, not two. It opens on the squeeze just before "Setelah squeeze"
   * (7739) and TRAVELS to the expansion under "Bollinger Bands kembali
   * melebar" (7766–7812). A second box appearing elsewhere would be two
   * claims; a box that moves is one claim following the channel.
   */
  box: at(7728),
  boxMove: at(7795),
  boxOver: 24,
  /**
   * ═══ THE CLOSING BEATS ═══
   *
   * 8012  the channel goes, and the box with it — "bullish bias-nya datang
   *       dari trend yang masih terjaga" is about the trend, so the trend's
   *       line is what is left on screen.
   * 8077  the channel comes back and the AVERAGE goes, with the box on the
   *       squeeze again — "Squeeze hanya memberi tahu bahwa pergerakan besar
   *       mungkin segera terjadi" (8086) is entirely about the channel.
   * 8235  both go, and the last twenty bars get an arrow — "arah breakout
   *       sesuai dengan trend yang sudah terbentuk" (8236). Nothing but price
   *       is left for the sentence that says price led.
   */
  boxOut: at(8012),
  bandsBack: at(8077),
  /**
   * ⚠ THE AVERAGE OUTLIVES THE CHANNEL'S RETURN BY NINE FRAMES. Simon asked
   * for it to be lit again 8012–8086, and it cannot glow after it has left —
   * so it goes at 8086, not at 8077 when the channel comes back. For those
   * nine frames both are on, which is the lesser of the two wrongs.
   */
  maOff: at(8086),
  bare: at(8235),
  arrow: at(8235),
  gateOver: 16,
  /** The average is lit a second time, for the sentence about the trend. */
  glow2: at(8012),
  glow2Out: at(8086),
  /** The line the whole episode leaves you with (VO 8325–8580). */
  quote: at(8325),
};
/** How many bars at the right stay under the cover. */
const HIDE = 23;
/** How many bars the stretch leaves on screen. */
const WINDOW = 36;
/**
 * ═══ AND WHAT 7090 DOES, WHICH IS NOT A ZOOM ═══
 *
 * ⚠ THE LEFT EDGE IS PINNED. Simon's test: take the leftmost candle at 7077 —
 * bar 101 — and it must still be in the same place at 7130. So `from` does not
 * move at all across the answer; only `to` does, and the window simply OPENS
 * to the right as the tape gains its thirty bars.
 *
 * That is why the bars get narrower rather than the picture getting bigger:
 * sixty-six bars end up in the width thirty-six had. Every earlier attempt
 * moved both edges and slid the tape sideways, which is exactly what a viewer
 * reads as "somewhere else" instead of "further along".
 */
/* (the count that results is simply N - (ASK - WINDOW); nothing reads it) */
/**
 * The price levels, in thousands — GGRM's own round numbers, not a step
 * generated from the range. The tape runs 12.630 to 17.970, so a 400 step
 * would put fourteen rules across a 490px plot; at a thousand they land about
 * 90px apart, which is a grid you read a price off rather than a hatch you
 * look through. Levels the chart does not reach are dropped.
 */
const TICKS = [
  13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 21000, 22000,
];
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
/* NO `LAST` and no `CHANGE`. The header quotes neither any more, and the
   last-price rule reads the newest drawn bar at the frame it is drawn on. */
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
  const at0 = Math.max(0, ASK - WINDOW);
  const [a, b] = spanOf(BARS.slice(at0));
  const lo = BB.lower.slice(at0).filter((v): v is number => v !== null);
  const hi = BB.upper.slice(at0).filter((v): v is number => v !== null);
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

/**
 * ═══ THE SQUEEZE, AND THE EXPANSION AFTER IT — FOUND, NOT PLACED ═══
 *
 * The channel's width, bar by bar. `SQUEEZE` is the run around the narrowest
 * it gets once the quiz's own tape has ended — bars 137 to 143, between the
 * Jul and Agu labels, which is where Simon pointed. `EXPAND` runs from the end
 * of that to the widest it gets afterwards.
 *
 * Both are read off the SAME series, so they cannot overlap and cannot leave a
 * gap: the second begins on the bar after the first ends.
 */
const WIDTH = BB.upper.map((u, i) =>
  u === null || BB.lower[i] === null ? null : u - (BB.lower[i] as number),
);
const SQUEEZE = (() => {
  let at = ASK;
  let min = Infinity;
  for (let i = ASK; i < N; i++) {
    const w = WIDTH[i];
    if (w !== null && w < min) {
      min = w;
      at = i;
    }
  }
  let a = at;
  let b = at;
  /* 1.2 — the shoulder of the pinch, not just its floor. A box on the single
     narrowest bar is a box on one candle, which is not a squeeze. */
  while (a > 0 && (WIDTH[a - 1] ?? Infinity) <= min * 1.2) a--;
  while (b < N - 1 && (WIDTH[b + 1] ?? Infinity) <= min * 1.2) b++;
  return { from: a, to: b };
})();
const EXPAND = (() => {
  let at = SQUEEZE.to;
  let max = -Infinity;
  for (let i = SQUEEZE.to; i < N; i++) {
    const w = WIDTH[i];
    if (w !== null && w > max) {
      max = w;
      at = i;
    }
  }
  return { from: SQUEEZE.to + 1, to: at };
})();
/** How far the box stands off the stretch it encloses. */
const BOX_PAD = 22;
/** How far the closing arrow is lifted clear of the bars it is drawn about. */
const ARROW_OFF = 50;
/** And how much of its own length it keeps — see where it is drawn. */
const ARROW_LEN = 0.8;
/**
 * The closing line's box. Two lines, so 118 tall.
 *
 * 866 puts its centre on the month row — Simon's call, and covering "Jul" is
 * fine by him. It overhangs the panel's bottom edge by 25px, which is what a
 * `QuoteBox` is for: it straddles a card's border rather than sitting inside
 * it, so it reads as laid over the chart instead of drawn in it.
 *
 * 560 wide, not 900. The longer line is about 420px of 30px italic once its
 * marked run's padding is counted, so 900 left a third of the box empty and
 * the frame read as a banner across the chart rather than as an aside on it.
 *
 * 780 and not lower: at 830 its lower edge reached 889 and covered the month
 * row at 874. There is no room BELOW the panel either — it ends at 900 and the
 * subtitle band starts at 972 — so the box sits inside the plot, over the
 * ground the tape has left empty on that side by August.
 */
const QUOTE_LINE = { w: 560, h: 118, y: 866 };
/**
 * ═══ THE CLOSING ARROW ═══
 *
 * The last twenty bars' own lowest low and highest high, in that order — bars
 * 147 and 157 on this tape. Not the first and last bar of the run: the tape
 * tops out three bars before it ends, and an arrow drawn to the final close
 * would point at a lower price than the move actually reached and read as a
 * weaker trend than the one it is drawn on.
 */
const ARROW = (() => {
  const a0 = Math.max(0, N - 20);
  let lo = a0;
  let hi = a0;
  for (let i = a0; i < N; i++) {
    if (BARS[i].l < BARS[lo].l) lo = i;
    if (BARS[i].h > BARS[hi].h) hi = i;
  }
  return { from: lo, to: hi };
})();

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
  /**
   * ⚠ `upto` is how much tape EXISTS; `end` is how much may be SEEN. The last
   * 23 bars are under the cover until 7765, and every layer — candles, bands,
   * average — reads `end`, so none of them can leak the answer on its own.
   */
  const lift = progressInOut(f, T.reveal, T.revealOver);
  /* the cover fades over `revealOver`; the bars behind it take `printOver` */
  const printed = progress(f, T.reveal, T.printOver);
  const end = Math.min(upto, N - HIDE + Math.round(HIDE * printed));
  /**
   * ═══ WHAT IS SWITCHED ON, AT THIS FRAME ═══
   *
   * A `gate` is a thing's whole life: it comes up at `on` and goes at `off`.
   * Written as switches rather than as a chain of conditions, so a beat can be
   * moved without the ones after it having to be re-reasoned.
   */
  const gate = (on: number, off: number) =>
    progress(f, on, T.gateOver) * (1 - progress(f, off, T.gateOver));
  /* the channel: on with the answer, out at 8012, back at 8077, gone at 8235 */
  const bandOn =
    ans * gate(T.answer, T.boxOut) + gate(T.bandsBack, T.bare);
  /* the average: on from the start, and it leaves when the channel returns */
  const maOn = 1 - progress(f, T.maOff, T.gateOver);
  /** How lit the average is — see T.glow. */
  const lit = (on: number, off: number) =>
    progressInOut(f, on, T.glowOver) *
    (1 - progressInOut(f, off - T.glowOver, T.glowOver));
  /* twice: once for "berhasil menjadi support", once for "trend yang masih
     terjaga" — the same line, named twice, lit both times */
  const glow = Math.max(lit(T.glow, T.glowOut), lit(T.glow2, T.glow2Out));
  /* LEFT PINNED, right opening — see ANS_WINDOW */
  const from = (ASK - WINDOW) * pull;
  const to = ASK - 1 + (N - ASK) * ans;
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

  /* the cut out to the closing card — both sides read the SAME entry, from
     GLOBAL frames, which is the only way it is one move and not two */
  const out = cutOutStyle(f + FROM, CUTS.toClose);

  return (
    <SafeArea>
      <div style={{ position: "absolute", inset: 0, ...out }}>
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
              {/* ⚠ NO PRICE AND NO CHANGE CHIP. Simon cut both — "kurang
                  berguna" — and he is right twice over: the number was the
                  QUESTION's last close and stayed there while the tape ran on
                  into August, so by the answer it was quoting a level nothing
                  had been at for a month. The last-price rule tracks the newest
                  bar instead, which is the readout that was actually wanted. */}
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
              {bandOn > 0.001 && (
                <g opacity={bandOn}>
                  <path
                    d={
                      BARS.slice(0, end)
                        .map((_, i) =>
                          BB.upper[i] === null
                            ? ""
                            : `${i === 0 || BB.upper[i - 1] === null ? "M" : "L"}${lx(i).toFixed(1)},${py(BB.upper[i] as number).toFixed(1)}`,
                        )
                        .join(" ") +
                      " " +
                      BARS.slice(0, end)
                        .map((_, i) => end - 1 - i)
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
                  {/* ⚠ THE MIDDLE BAND. It is the 20-bar average the channel
                      is built around, and the voice names it — "harga masih
                      bertahan sedikit di atas middle band" — so it cannot be
                      the one line of the three that is missing. Dashed, so it
                      is never mistaken for the solid SMA100 under it. */}
                  <path
                    d={BARS.slice(0, end)
                      .map((_, i) =>
                        BB.mid[i] === null
                          ? ""
                          : `${i === 0 || BB.mid[i - 1] === null ? "M" : "L"}${lx(i).toFixed(1)},${py(BB.mid[i] as number).toFixed(1)}`,
                      )
                      .join(" ")}
                    fill="none"
                    stroke={C.cyan}
                    strokeWidth={theme.layout.border.thick}
                    strokeDasharray="10 8"
                  />
                  {[BB.upper, BB.lower].map((band, k) => (
                    <path
                      key={k}
                      d={BARS.slice(0, end)
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
              {(() => {
                const d = BARS.slice(0, end)
                  .map(
                    (b, i) =>
                      `${i === 0 ? "M" : "L"}${lx(i).toFixed(1)},${py(b.ma100).toFixed(1)}`,
                  )
                  .join(" ");
                if (maOn <= 0.001) return null;
                return (
                  <g opacity={maOn}>
                    {/* THE GLOW is the same path under the line, wide and
                        faint. A real blur filter would cost a filter pass on
                        every frame of the group to light one line for three
                        seconds. */}
                    {glow > 0.001 && (
                      <path
                        d={d}
                        fill="none"
                        stroke={C.indigo}
                        strokeWidth={theme.layout.stroke.ma * 6}
                        strokeOpacity={0.18 * glow}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                    <path
                      d={d}
                      fill="none"
                      stroke={C.indigo}
                      strokeWidth={theme.layout.stroke.ma * (1 + 0.9 * glow)}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                );
              })()}

              {BARS.slice(0, end).map((b, i) => {
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

                  ⚠ ORANGE, like every highlight in this group. Simon's call,
                  and it is the only hue left: the average is indigo, the
                  channel is cyan, and a mark in the same colour as the thing
                  it marks reads as part of it rather than as a mark on it.

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
                    const tip = BARS[ASK - 1];
                    return (
                      <g opacity={a2}>
                        <circle
                          cx={(x1 + x2) / 2}
                          cy={(top + bot) / 2}
                          r={r}
                          fill="none"
                          stroke={C.maOrange}
                          strokeWidth={theme.layout.stroke.band}
                        />
                        <line
                          x1={lx(DIP.lowAt)}
                          y1={py(BARS[DIP.lowAt].l)}
                          x2={lx(ASK - 1)}
                          y2={py(Math.min(tip.o, tip.c))}
                          stroke={C.maOrange}
                          strokeWidth={theme.layout.stroke.band}
                          strokeLinecap="round"
                        />
                      </g>
                    );
                  })()}

                {/*
                  ── THE BOX ──
                  One border, no fill, orange. It opens on the squeeze and
                  travels to the expansion; the four edges are interpolated,
                  which is what makes it read as the SAME box following the
                  channel rather than one leaving and another arriving.

                  It encloses the BAND and the CANDLES both — max of the two at
                  every bar — because a box drawn only round the channel would
                  cut through any bar that traded outside it.
                */}
                {(() => {
                    /* the same box, twice: it travels to the expansion, leaves
                       with the channel at 8012, and comes back on the SQUEEZE
                       when the channel does */
                    const live =
                      gate(T.box, T.boxOut) + gate(T.bandsBack, T.bare);
                    if (live <= 0.001) return null;
                    const back = f >= T.bandsBack;
                    const move = back
                      ? 0
                      : progressInOut(f, T.boxMove, T.boxOver);
                    const rect = (a: number, b: number) => {
                      let top = Infinity;
                      let bot = -Infinity;
                      for (let i = a; i <= b; i++) {
                        const u = BB.upper[i];
                        const l = BB.lower[i];
                        top = Math.min(
                          top,
                          py(BARS[i].h),
                          u === null ? Infinity : py(u),
                        );
                        bot = Math.max(
                          bot,
                          py(BARS[i].l),
                          l === null ? -Infinity : py(l),
                        );
                      }
                      return {
                        x1: lx(a) - BOX_PAD,
                        x2: lx(b) + BOX_PAD,
                        y1: top - BOX_PAD,
                        y2: bot + BOX_PAD,
                      };
                    };
                    const A = rect(SQUEEZE.from, SQUEEZE.to);
                    const B = rect(EXPAND.from, EXPAND.to);
                    const mix = (a: number, b: number) => a + (b - a) * move;
                    const x1 = mix(A.x1, B.x1);
                    const y1 = mix(A.y1, B.y1);
                    return (
                      <rect
                        x={x1}
                        y={y1}
                        width={mix(A.x2, B.x2) - x1}
                        height={mix(A.y2, B.y2) - y1}
                        rx={theme.layout.radius.sm}
                        fill="none"
                        stroke={C.maOrange}
                        strokeWidth={theme.layout.stroke.band}
                        opacity={live}
                      />
                    );
                  })()}

                {/*
                  ── THE CLOSING ARROW ──
                  Drawn inside the clip with the tape, because it is about
                  particular bars. Orange, like every mark in this group.
                */}
                {f >= T.arrow &&
                  (() => {
                    /* ⚠ LIFTED OFF THE TAPE. Drawn on the bars' own lows and
                       highs it ran straight through the candles it is about;
                       50px up and 50px left puts it beside the move instead of
                       inside it, and it still spans the same two bars. */
                    const A = {
                      x: lx(ARROW.from) - ARROW_OFF,
                      y: py(BARS[ARROW.from].l) - ARROW_OFF,
                    };
                    /* ⚠ 80% OF ITS OWN LENGTH, shortened from the TOP — the
                       start stays on the low it is drawn from and the head
                       comes down. At full length the head landed on the
                       "Bollinger Bands" chip. */
                    const tip = {
                      x: lx(ARROW.to) - ARROW_OFF,
                      y: py(BARS[ARROW.to].h) - ARROW_OFF,
                    };
                    const B = {
                      x: A.x + (tip.x - A.x) * ARROW_LEN,
                      y: A.y + (tip.y - A.y) * ARROW_LEN,
                    };
                    return (
                      <>
                        {/* the glow: the same arrow, wide and faint, beneath */}
                        <Arrow
                          from={A}
                          to={B}
                          f={f}
                          at={T.arrow}
                          tone={C.maOrange}
                          width={theme.layout.stroke.band * 5}
                          opacity={0.16}
                        />
                        <Arrow
                          from={A}
                          to={B}
                          f={f}
                          at={T.arrow}
                          tone={C.maOrange}
                          width={theme.layout.stroke.band * 2}
                        />
                      </>
                    );
                  })()}

                {/*
                  ══ THE COVER ══
                  An indigo panel over the bars the quiz is about, with the
                  question on it. Drawn AFTER the tape and inside the clip, so
                  it hides whatever is under it without any layer having to
                  know it exists.

                  ⚠ ITS FLOOR IS THE 14.000 LINE, Simon's call — deep enough
                  that the answer is properly hidden, and it clears both the
                  SMA100 (which runs at 15.600 through here, so the line the
                  quiz is about stays visible under the cover and out the other
                  side) and the month row below.

                  GREY, not indigo: indigo is this episode's marking colour and
                  a big indigo panel reads as something being pointed at rather
                  than something withheld.

                  And it COUNTS DOWN. "Tiga… dua… satu" lands on 7465, 7495 and
                  7525 — the same panel, one glyph swapped, so the countdown
                  happens where the answer is about to appear rather than
                  somewhere else on screen.
                */}
                {ans > 0.001 &&
                  lift < 0.999 &&
                  (() => {
                    const i0 = N - HIDE;
                    const x1 = lx(i0) - BODY_W;
                    const x2 = AXIS_COL + PLOT_W;
                    const top = PLOT_TOP + 10;
                    const bot = py(14000);
                    const glyph =
                      f >= T.one
                        ? "1"
                        : f >= T.two
                          ? "2"
                          : f >= T.three
                            ? "3"
                            : "?";
                    return (
                      <g opacity={ans * (1 - lift)}>
                        <rect
                          x={x1}
                          y={top}
                          width={x2 - x1}
                          height={bot - top}
                          rx={theme.layout.radius.md}
                          fill={C.border}
                        />
                        <text
                          x={(x1 + x2) / 2}
                          y={(top + bot) / 2 + 42}
                          textAnchor="middle"
                          fontFamily={font}
                          fontSize={120}
                          fontWeight={theme.type.display.weight}
                          fill={C.ink}
                        >
                          {glyph}
                        </text>
                      </g>
                    );
                  })()}
              </g>

              {/* ── the last bar the question shows, ringed ──
                  It is where the quiz is asked FROM: everything right of it is
                  under the cover. Cyan, like the bounce mark, because both are
                  this scene's own annotation rather than one of its lines. */}
              {f >= T.ring && f < T.ringOut + 16 && (
                <circle
                  cx={lx(N - HIDE - 1)}
                  cy={py(BARS[N - HIDE - 1].c)}
                  r={40}
                  fill="none"
                  stroke={C.maOrange}
                  strokeWidth={theme.layout.stroke.band}
                  opacity={
                    progress(f, T.ring, 16) * (1 - progress(f, T.ringOut, 16))
                  }
                />
              )}

              {/* NO LAST-PRICE RULE. It has been in and out of this scene
                  three times and Simon has cut it for good. The level it
                  marked is read off the price axis, which is right there down
                  the left, and the chart has enough lines on it already —
                  three band lines, the average, the cover, the ring. */}

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

      {/*
        ── THE LINE THE EPISODE LEAVES YOU WITH ──
        "Ingat, indikator tidak pernah memimpin harga" and "Indikator mengikuti
        data yang sudah terjadi, lalu membantu mengonfirmasi atau
        mempertanyakan analisismu" — 8325 to 8580 — condensed to one sentence.
        `menguji` holds both halves of the second: a test can be passed or
        failed, and a line that only said "mengonfirmasi" would promise the
        indicator agrees with you.
      */}
      <QuoteBox
        f={f}
        at={T.quote}
        w={QUOTE_LINE.w}
        h={QUOTE_LINE.h}
        y={QUOTE_LINE.y}
        lines={[
          {
            segments: [
              { text: "Indikator " },
              { text: "tidak memimpin harga", tone: "indigo" },
              { text: "," },
            ],
          },
          { segments: [{ text: "tapi menguji analisismu." }] },
        ]}
      />

      {/* the heading, arriving from SC11 — see the header note */}
      <QuizTitle
        f={f}
        /* -999, not 0: its reveal already ran in SC11. Reading it from 0 here
           would fade the words up a second time on the seam. */
        at={-999}
        t={progressInOut(f, T.settle, T.settleOver)}
        /*
          ── THE QUESTION, 30px BESIDE THE HEADING ──
          Handed to the title rather than positioned against it, so the gap is
          a gap and not a number that happens to look like one. It sits on the
          title rail and not on the chart: the chart is the thing being asked
          about, and a sentence across it would be one more mark to read on a
          picture that already carries a cover and three lines.
        */
        after={
          f < T.ask ? null : (
            <span
              style={{
                fontSize: theme.type.labelSm.size,
                /* the heading's own weight, in the episode's text black —
                   Simon's call. It is a question the viewer is being asked, so
                   it carries the same authority as the title beside it rather
                   than reading as a caption under one. */
                fontWeight: theme.type.h2.weight,
                color: C.text,
                ...textReveal(f, T.ask),
                display: "inline-block",
              }}
            >
              Apakah uptrend masih bertahan? Apa antisipasinya?
            </span>
          )
        }
      />
      </div>
    </SafeArea>
  );
};
