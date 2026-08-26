/**
 * SCENE 11 — Cara Baca Indikator. `dur 646` · full width, no panel
 *
 * THE ORDER OF ARRIVAL IS THE TEACHING, and since the right-hand panel was
 * cut it is the ONLY thing making the case. Your own markings are drawn on the
 * chart FIRST; the indicators arrive afterwards and are seen to agree with what
 * is already there. Reverse the order and the scene argues the opposite — so
 * `mark1/2/3` must stay ahead of `layer2/3`, whatever else moves.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartFrame, gridOf, Layer } from "../components/ChartFrame";
import { MALine } from "../components/MALine";
import { BollingerBands } from "../components/BollingerBands";
import { TitleChip } from "../components/TitleChip";
import { theme } from "../theme";
import { sec, sma, bollinger, progress, progressInOut } from "../helpers";
import { domainOf } from "../series";
import { BMRI_TAPE } from "./Scene01";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** Where this scene is mounted, so Simon's beats can be quoted as globals. */
const FROM = 6116;
const at = (global: number) => global - FROM;
const T = {
  title: sec(0.0),
  chart: sec(0.4),
  /**
   * ═══ YOUR OWN READING, ONE CLAUSE AT A TIME ═══
   *
   * "Fondasinya tetap price action: trend, pattern, support dan resistance
   * yang kamu baca lebih dulu" — 6150 to 6361. Each mark lands on the word
   * that names it, and all four are on the chart before a single indicator
   * arrives at 6425. That order is the scene's whole argument.
   */
  trend: at(6214),
  pattern: at(6237),
  support: at(6262),
  resistance: at(6287),
  layer2: sec(10.3),
  layer3: sec(12.5),
};
const PERIOD = 20;
/** How far either side a bar must be the extreme to count as a swing. */
const SWING = 4;
/** ONE entrance for all four of your marks: a fade, this long. */
const MARK_IN = 16;

/**
 * ═══ THE FOUR LABELS — ONE ROW, UNDER THE CHART ═══
 *
 * A pill in the mark's OWN colour with white text. The colour is the whole of
 * the pairing now that the pills no longer touch their marks, and it has to
 * be: two of the four are red lines that height alone could not tell apart.
 *
 * ⚠ THEY LEFT THE CHART. Hung on their own marks they sat at four different
 * heights among the candles, and there is no band inside this plot that is
 * clear across its width — the tape falls from the top left to the bottom
 * middle and climbs back, so anything level crosses it somewhere. The strip
 * BETWEEN the chart's baseline at 850 and the subtitle reserve at 972 is the
 * only place four pills can be level and touch nothing.
 *
 * ONE FLEX ROW, and all four are always mounted — invisible ones included.
 * Centring a row that gains a member would shove the others sideways every
 * time one arrived; mounting them all and fading each on its own beat keeps
 * the row still.
 *
 * The order is the narration's: "trend, pattern, support dan resistance". So
 * the row fills left to right exactly as the sentence names them.
 */
const PILL = { padX: 16, padY: 8, size: 26, gap: 40, top: 888 };
const LABELS = [
  { key: "trend", text: "Trend" },
  { key: "pattern", text: "Pattern" },
  { key: "support", text: "Support" },
  { key: "resistance", text: "Resistance" },
] as const;

/**
 * ═══ ⚠ MOVING A MARK BY HAND ═══
 *
 * Every mark below is SEARCHED FOR in BMRI's own tape. Fill one of these in
 * and the search is bypassed for that one only; leave it `null` and the search
 * decides. Nothing else in the scene needs touching.
 *
 * ALL NUMBERS ARE BAR INDICES, 0 … 104, left to right. Not pixels and not
 * prices: a bar index survives the chart being re-scaled, re-framed or moved,
 * and a pixel does not.
 *
 *   trendEnd WHERE THE TRENDLINE STOPS, on its own, because that is the one
 *            thing most likely to want nudging. It only LENGTHENS or SHORTENS
 *            the line — the slope is whatever the two anchors below give it,
 *            so this cannot bend it and cannot make it wrong.
 *            Found now: 92, the last swing high.
 *
 *   trend    { a, b } — the line's two anchors, drawn through the HIGHS of
 *            those bars. This is the ANGLE. Setting it pins the whole search.
 *            Found now: { a: 5, b: 58 } — touching 5.024, 4.720 and 4.537.
 *
 *   zig      the structure zigzag, in bar order. `high: true` puts the point
 *            on that bar's HIGH, `false` on its LOW. They must alternate.
 *            Found now: 5H 15L 23H 30L 37H 52L 58H 68L 81H 87L 92H 97L.
 *
 *   support      one bar index — the line is drawn at that bar's LOW.
 *            Found now: 52, the lowest low on the tape.
 *
 *   resistance   one bar index — the line is drawn at that bar's HIGH.
 *            Found now: 5, the highest high on the tape.
 *
 * Example — put the trendline on the second high instead, and lift support to
 * the later swing:
 *
 *   const HAND: Hand = { trendEnd: 104, trend: { a: 23, b: 81 }, zig: null,
 *                        support: 68, resistance: null };
 */
type Hand = {
  trendEnd: number | null;
  trend: { a: number; b: number } | null;
  zig: { i: number; high: boolean }[] | null;
  support: number | null;
  resistance: number | null;
};
const HAND: Hand = {
  /** ⚠ THE TRENDLINE'S RIGHT-HAND END. A bar index, 0 … 104. */
  trendEnd: 104,
  /**
   * Simon's angle: lift the line onto the LATE peak at bar 81 rather than the
   * one at 58 the search chose. It is still a clean line — nothing pokes
   * through it between bar 5 and bar 81 — but it is a TWO-touch line now, so
   * it floats above the highs at 23, 37 and 58 instead of riding them.
   * That is the trade for reaching the peak he pointed at.
   */
  trend: { a: 5, b: 81 },
  zig: null,
  support: null,
  resistance: null,
};
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ⚠ SC01's BMRI TAPE, not a series of this scene's own. Simon's call, and it
 * is the argument: indicators sit on top of a reading you already made, and
 * the chart the viewer already spent half a minute on is the one to make it on.
 */
const SERIES = BMRI_TAPE.closes;
const BARS = BMRI_TAPE.bars;
const BB = bollinger(SERIES, PERIOD, 2);
const MA = sma(SERIES, PERIOD);
const DOMAIN = domainOf([...BB.lower, ...BB.upper], BARS);

/**
 * ═══ YOUR THREE MARKS — FOUND ON THIS TAPE, NOT PLACED ON IT ═══
 *
 * They used to be four bar indices typed in by hand, which was fine while the
 * series was this scene's own. On BMRI's tape those numbers point at nothing,
 * and hand-picking four new ones would only hide the same problem until the
 * next time the data moves.
 *
 * So each is searched for, and each answers one clause of the narration —
 * "trend, pattern, support dan resistance yang kamu baca lebih dulu":
 *
 *   TREND   two swing highs, the second lower than the first, with NO bar
 *           poking through the line between them. That last rule is what makes
 *           it a trendline rather than any two points: a line the price has
 *           already crossed was never resistance.
 *   BREAK   the first close ABOVE that line once it is established. The line
 *           has to be broken to be worth drawing, so a candidate trendline
 *           that is never broken is discarded outright.
 *   LEVEL   the price the tape touches most, counted in CLUSTERS rather than
 *           in bars. Fifteen touches in one huddle is one visit; the same
 *           fifteen spread over seven separate returns is a level.
 */
const swingsOf = (high: boolean) => {
  const out: { i: number; v: number }[] = [];
  for (let i = SWING; i < BARS.length - SWING; i++) {
    const v = high ? BARS[i].h : BARS[i].l;
    let ok = true;
    for (let j = i - SWING; j <= i + SWING && ok; j++) {
      if (j === i) continue;
      const w = high ? BARS[j].h : BARS[j].l;
      if (high ? w > v : w < v) ok = false;
    }
    if (ok) out.push({ i, v });
  }
  return out;
};

/**
 * TREND — a straight line from the high, through a lower high, to a lower high.
 *
 * It STARTS AT THE TAPE'S HIGHEST SWING HIGH, because that is where a downtrend
 * line starts and because it is what Simon described: "dari high ke lower high
 * ke lower high". Two more rules make it a trendline rather than any two points
 * that happen to descend:
 *
 *   CLEAN     no bar between the anchors may poke through it. A line the price
 *             has already crossed was never resistance.
 *   THREE     it must be TOUCHED at least three times. Two points define any
 *             line; the third is what makes it a claim about the market.
 *
 * On this tape exactly one line satisfies all three, and it touches bars 5, 37
 * and 58 — 5.024, then 4.720, then 4.537. High, lower high, lower high.
 */
const TOUCH_TOL = 25;
const TREND = (() => {
  const highs = swingsOf(true);
  if (HAND.trend) {
    const { a, b } = HAND.trend;
    const m = (BARS[b].h - BARS[a].h) / (b - a);
    return {
      a,
      b,
      end: HAND.trendEnd ?? b,
      at: (i: number) => BARS[a].h + m * (i - a),
      n: 2,
    };
  }
  if (!highs.length) return null;
  const top = highs.reduce((a, b) => (b.v > a.v ? b : a));
  let best: { a: number; b: number; at: (i: number) => number; n: number } | null =
    null;
  for (const B of highs) {
    if (B.i <= top.i || B.v >= top.v) continue;
    const m = (B.v - top.v) / (B.i - top.i);
    const line = (i: number) => top.v + m * (i - top.i);
    let clean = true;
    for (let i = top.i; i <= B.i && clean; i++) if (BARS[i].h > line(i) + 8) clean = false;
    if (!clean) continue;
    const n = highs.filter(
      (h) => h.i >= top.i && h.i <= B.i && Math.abs(h.v - line(h.i)) <= TOUCH_TOL,
    ).length;
    if (n < 3) continue;
    /* more touches first, then the longer line */
    if (!best || n > best.n || (n === best.n && B.i - top.i > best.b - best.a))
      best = { a: top.i, b: B.i, at: line, n };
  }
  if (!best) return null;
  /**
   * AND IT IS CARRIED OUT TO THE LAST PEAK. Simon's call. The line is FOUND
   * from its three touches, which end at bar 58 — a little past halfway — and
   * a trendline that stops there looks cut off rather than finished.
   *
   * ⚠ IT KEEPS ITS SLOPE. The line is extended to the last swing high's frame,
   * not re-anchored ON it: re-anchoring would tilt it, and a line drawn to bar
   * 92 has bars poking through it, which is the one thing a trendline may not
   * have. So the last peak sits a little ABOVE the line where it ends, and
   * that is the truth of this tape — the downtrend held until near the end.
   */
  const last = highs[highs.length - 1].i;
  return { ...best, end: HAND.trendEnd ?? Math.max(best.b, last) };
})();

/**
 * PATTERN — the structure zigzag, the same shape SC01 traces on its charts.
 *
 * Alternating swing highs and lows, in bar order. Where two of a kind arrive in
 * a row the EXTREME one survives: a zigzag that visits two highs without a low
 * between them is not a zigzag, and keeping the lower of two highs would draw
 * the structure wrong.
 */
const ZIG = (() => {
  if (HAND.zig) return HAND.zig.map((z) => ({ ...z, v: 0 }));
  const all = [
    ...swingsOf(true).map((s) => ({ ...s, high: true })),
    ...swingsOf(false).map((s) => ({ ...s, high: false })),
  ].sort((a, b) => a.i - b.i);
  const out: { i: number; v: number; high: boolean }[] = [];
  for (const s of all) {
    const last = out[out.length - 1];
    if (!last || last.high !== s.high) out.push(s);
    else if (s.high ? s.v > last.v : s.v < last.v) out[out.length - 1] = s;
  }
  return out;
})();

/** SUPPORT and RESISTANCE — the lowest low and the highest high, no search. */
const SUPPORT =
  HAND.support === null
    ? Math.min(...BARS.map((b) => b.l))
    : BARS[HAND.support].l;
const RESISTANCE =
  HAND.resistance === null
    ? Math.max(...BARS.map((b) => b.h))
    : BARS[HAND.resistance].h;

/* NO `assertBlocks` — the scene renders no TextBlock at all now. */

export const Scene11 = () => {
  const f = useCurrentFrame();
  /* FULL WIDTH. `chartA` is the safe area itself — 96 to 1824 — so the tape
     reaches both margins and crosses neither. It was `chartB`, half a frame
     wide, only because a text panel used to sit beside it. */
  const box = theme.layout.chartA;
  const G = gridOf(SERIES, DOMAIN, box);

  return (
    <SafeArea>
      <ChartFrame
        closes={SERIES}
        bars={BARS}
        grid={G}
        mode="candle"
        f={f}
        drawFrom={T.chart}
        drawDur={sec(3.2)}
      />

      {/* ── layer 1: your own reading, first and alone ── */}

      {/* TREND — one straight line, on the descending highs. ORANGE, Simon's
          call: your own reading is drawn in it and the indicators arrive after
          in indigo and cyan, so the two layers never share a hue. */}
      {TREND && f >= T.trend && (
        <Layer opacity={progress(f, T.trend, MARK_IN)}>
          <line
            x1={G.x(TREND.a)}
            y1={G.y(TREND.at(TREND.a))}
            x2={G.x(TREND.end)}
            y2={G.y(TREND.at(TREND.end))}
            stroke={theme.colors.maOrange}
            strokeWidth={theme.layout.stroke.band}
            strokeLinecap="round"
          />
        </Layer>
      )}

      {/* PATTERN — the structure zigzag. It used to draw itself along its own
          length, the way SC01's charts do; Simon's call is a plain fade, and it
          is the right one HERE: four marks arriving in a row want one entrance
          between them, and the one that took a second and a half to travel
          made the other three look like they had merely blinked on. */}
      {f >= T.pattern && (
        <Layer opacity={progress(f, T.pattern, MARK_IN)}>
          <path
            d={ZIG.map(
              (z, i) =>
                `${i === 0 ? "M" : "L"}${G.x(z.i).toFixed(1)},` +
                `${G.y(z.high ? BARS[z.i].h : BARS[z.i].l).toFixed(1)}`,
            ).join(" ")}
            fill="none"
            stroke={theme.colors.indigo}
            strokeWidth={theme.layout.stroke.ma}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Layer>
      )}

      {/* SUPPORT and RESISTANCE — the lowest low and the highest high, each
          run right across: a level is a place, not an event. RED, the episode's
          one annotation red — see `crossRed` in the theme. */}
      {[
        { at: T.support, v: SUPPORT },
        { at: T.resistance, v: RESISTANCE },
      ].map((l) =>
        f < l.at ? null : (
          <Layer key={l.v} opacity={progress(f, l.at, MARK_IN)}>
            <line
              x1={box.x + 20}
              y1={G.y(l.v)}
              x2={box.x + box.w - 20}
              y2={G.y(l.v)}
              stroke={theme.colors.crossRed}
              strokeWidth={theme.layout.stroke.band}
              strokeDasharray="10 8"
            />
          </Layer>
        ),
      )}

      {/* ── the four labels, level, under the chart ── */}
      <div
        style={{
          position: "absolute",
          left: theme.layout.safeLeft,
          right: theme.layout.safeRight,
          top: PILL.top,
          display: "flex",
          justifyContent: "center",
          gap: PILL.gap,
        }}
      >
        {LABELS.map((l) => {
          const at =
            l.key === "trend"
              ? T.trend
              : l.key === "pattern"
                ? T.pattern
                : l.key === "support"
                  ? T.support
                  : T.resistance;
          const fill =
            l.key === "trend"
              ? theme.colors.maOrange
              : l.key === "pattern"
                ? theme.colors.indigo
                : theme.colors.crossRed;
          return (
            <div
              key={l.key}
              style={{
                /* MOUNTED EVEN WHEN INVISIBLE — see the note on PILL */
                opacity: progress(f, at, MARK_IN),
                background: fill,
                color: theme.colors.surface,
                borderRadius: theme.layout.radius.sm,
                padding: `${PILL.padY}px ${PILL.padX}px`,
                fontFamily: theme.type.family,
                fontSize: PILL.size,
                fontWeight: theme.type.label.weight,
                whiteSpace: "nowrap",
              }}
            >
              {l.text}
            </div>
          );
        })}
      </div>

      {/* ── layer 2 and 3: the indicators, agreeing with what is already there ── */}
      <MALine values={MA} grid={G} f={f} drawFrom={T.layer2} drawDur={sec(2)} variant="slow" />
      <BollingerBands
        mid={BB.mid}
        upper={BB.upper}
        lower={BB.lower}
        grid={G}
        opacity={progressInOut(f, T.layer3, sec(1.8)) * 0.9}
      />

      <TitleChip text="Cara Baca Indikator" f={f} at={T.title} />

      {/*
        ⚠ NOTHING IN THE RIGHT PANEL ANY MORE. Three blocks stood there — the
        1/2/3 hierarchy, the PRICE ACTION → CONFIRMATION → CONTEXT flow, and
        the closing pair. All three are gone at Simon's direction, and the
        chart takes the full width they were making room for.

        ⚠ COMPLIANCE. The last of them struck "INDICATOR = DECISION MAKER",
        and it was one of only two struck misconceptions left in the episode.
        The other is in CG-C. This scene now makes its case entirely by the
        ORDER OF ARRIVAL — your own marks are drawn first and the indicators
        arrive afterwards, agreeing with what is already there — which is the
        argument it was always built on, but it is no longer said in words.
      */}
    </SafeArea>
  );
};
