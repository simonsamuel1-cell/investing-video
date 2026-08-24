/**
 * SCENE 05 — How to read it, and the average as a moving level.
 * `from 2324 · dur 1166`
 *
 * SC06 used to start at 2903 with a chart of its own. It does not any more:
 * support and resistance are read off the SAME series this scene has been
 * scrolling, so at 2903 the window simply travels BACK to the uptrend it
 * opened on. Remounting a second chart there would have thrown away the one
 * thing the beat needs — that the viewer already knows this tape.
 *
 * ONE SERIES, THREE READINGS. A climb, the decline that follows it and the
 * range the decline settles into are joined end to end, and the WINDOW travels
 * along them — it is a window onto a chart that keeps running, not three
 * charts being swapped. Each seam is exact: every crop's last anchor is the
 * next one's first, so no gap bar prints at a join.
 *
 * The average is ONE line too. It is drawn once, across the first window —
 * that is the lesson — and after that it only ever lengthens, because it is
 * the same line continuing rather than a new one being introduced.
 *
 * [PLACEHOLDER] The candles are traced by eye from Simon's crops, see
 * `data/shots.ts`. None of those crops carries a symbol header or a price
 * axis, so this chart shows neither ticker nor price labels. The AVERAGE is
 * not traced: it is computed from these closes, because a hand-drawn curve
 * that merely looks like the mean of the bars under it is not one.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { Layer, gridOf, pathOf, lengthOf } from "../components/ChartFrame";
import { TitleChip } from "../components/TitleChip";
import { theme } from "../theme";
import { sma, mulberry32, drawPath, progress, progressInOut, clamp01, textReveal } from "../helpers";
import { toBars, domainOf } from "../series";
import { READ_1, READ_2, READ_3, fromAnchors } from "../data/shots";
import { CUTS, cutInStyle, cutOutStyle } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** Where this scene is mounted, needed to read the cut from global frames. */
const FROM = 2324;
/** Global → local. Every beat below is quoted in Simon's global frames. */
const at = (global: number) => global - FROM;

/**
 * ═══ THE TIMELINE ═══
 *
 * 2324   the rise lands: white card and the first 60 sessions, already there
 * 2389 – 2487   the average is DRAWN through them — price above a rising line
 * 2489 – 2516   the window scrolls 54 sessions left; the climb runs off the
 *        left and the decline runs in from the right
 * 2516 – 2626   the average lengthens across them — price below a falling line
 * 2691 – 2716   the window scrolls 54 more; the range runs in
 * 2716 – 2754   the average lengthens across the range and FLATTENS — there is
 *        nowhere for it to slope
 * 2818   the closing summary opens at the top of the card
 * 2903   the summary and the chips clear, and the window travels BACK to the
 *        opening window — the uptrend, at its right-hand end
 * 3034   the bars that came back and touched the line are ringed, one at a
 *        time  "Dalam uptrend, harga sering pullback ke MA … lalu memantul"
 */
const T = {
  title: 0,
  ma: at(2389),
  maOver: at(2487) - at(2389),
  /** When the summary and the chips leave. */
  clear: at(2903),
  /** The rings on the bars that came back to the line. */
  ring: at(3034),
  ringStep: 16,
  /** The bounce path drawn through them — ring, high, ring, high, ring, high. */
  path: at(3090),
  pathDur: 100,
  /** The same reading, mirrored, on the decline. */
  ringDown: at(3255),
  pathDown: at(3300),
  /** Each scroll, and the growth that follows it. They never overlap. */
  steps: [
    { scroll: at(2489), scrollDur: 27, grow: at(2516), growDur: 110, bars: 54 },
    /**
     * 75. The range leg is fifteen bars LONGER than the window, and the scroll
     * travels the whole of it — so the window lands on the LAST sixty, not the
     * first. Those fifteen bars are why: a 20-period average needs twenty bars
     * to forget the decline behind it, and landing on the first sixty left the
     * line still falling steeply into the left edge. Fifteen bars deeper in,
     * the average has nothing but the range in it, and it is flat all the way
     * across.
     */
    { scroll: at(2691), scrollDur: 25, grow: at(2716), growDur: 38, bars: 75 },
    /**
     * BACK to the start, and no growth: the line is already drawn end to end,
     * so this step moves the window and nothing else. A negative travel is the
     * whole of it — 54 + 75 returned.
     */
    { scroll: at(2903), scrollDur: 34, bars: -(54 + 75) },
    /** Forward again to the decline — the window step 1 already framed. */
    { scroll: at(3213), scrollDur: 34, bars: 54 },
  ] as { scroll: number; scrollDur: number; bars: number; grow?: number; growDur?: number }[],
};
const PERIOD = 20;
/**
 * 60 bars in the window, not 100. The crops are chunky, low-count charts and
 * the count is what gives them that: across this card 60 bars are 28px apart,
 * so a body is 17px wide. At 100 they thin to 10px and stop looking like the
 * reference.
 */
const WINDOW = 60;
/** How long each leg is, in bars. Each scroll travels the NEXT leg's length. */
const LEGS = [60, 54, 75];
/**
 * The card sits DROP px below its layout box, matching CG-A and SC04 to the
 * pixel — the cut lifts the camera, it does not move the furniture. The chart
 * keeps its FULL WIDTH for the whole scene; nothing shrinks it.
 */
const DROP = 30;
const BOX = {
  x: theme.layout.chartA.x,
  y: theme.layout.chartA.y + DROP,
  w: theme.layout.chartA.w,
  h: theme.layout.chartA.h,
};
/**
 * The card is DIVIDED: the tape gets the top, and the bottom is a reserved
 * band the chips live in.
 *
 * The chips were under the card, half on the grey — which put text on a
 * background the chart does not own, and let them cross the candles on the way
 * there. Giving them a band INSIDE the card fixes both at once: they are on
 * white, they are part of the same surface, and the plot simply stops above
 * them so nothing can collide.
 */
const PLOT = { ...BOX, h: 520 };
// ═══════════════════════════════════════════════════════════════════════════

const CLOSES = [
  ...fromAnchors(READ_1, LEGS[0], 8801),
  ...fromAnchors(READ_2, LEGS[1], 8811),
  ...fromAnchors(READ_3, LEGS[2], 8821),
];
const BARS = toBars(CLOSES, 8802);

/**
 * THE WINDOW IS A SLICE OF A LONGER HISTORY. The average is computed over the
 * visible closes PLUS a seeded run of prior ones and only the visible part is
 * drawn, so the line starts at the LEFT EDGE rather than a fifth of the way
 * across. The prior walk is flat, so it cannot drag the line out of the box.
 */
const PRIOR = (() => {
  const rnd = mulberry32(8803);
  const step = CLOSES[0] * 0.004;
  const out: number[] = [];
  let p = CLOSES[0];
  for (let i = 0; i < PERIOD + 10; i++) {
    p += (rnd() - 0.5) * 2 * step;
    out.unshift(p);
  }
  return out;
})();
const MA = sma([...PRIOR, ...CLOSES], PERIOD).slice(PRIOR.length);

/**
 * ONE SCALE, FIXED, over the whole series.
 *
 * It was briefly refitted to each window, the way a real chart does when you
 * scroll it — and that was wrong here. Refitting magnifies the range leg into
 * the full height of the card, and a magnified range is a WAVY average: the
 * flatness the scene is about only exists relative to the trends before it.
 * Held on the trends' own scale, the line through the range is visibly, plainly
 * flat, which is the whole lesson. It also means nothing stretches mid-scroll.
 */
const DOMAIN = domainOf([...CLOSES, ...MA], BARS);

/**
 * The grid is built from the RESTING window — the first 60 bars across the
 * card. `x` is linear and unclamped, so bar 60 and up land off the right edge
 * at the same pitch, and the scroll brings them in.
 */
const G = gridOf(CLOSES.slice(0, WINDOW), DOMAIN, PLOT, 0.12, 0);
const PITCH = G.x(1) - G.x(0);
const BODY_W = Math.max(2, Math.min(20, PITCH * 0.62));

/**
 * ═══ THE CHIPS ═══
 *
 * One reading per beat, in a row UNDER the card — they were inside it, at the
 * top-left, and there they simply sat on the chart they were describing.
 *
 * The row is CENTRED as a group at every count: the first chip arrives in the
 * middle of the frame, and each new one pushes the ones before it left so the
 * whole run stays centred. That is why the widths below are measured constants
 * rather than left to the browser — an absolutely-positioned row can be eased
 * into its new place, and a flex row can only jump to it.
 *
 * MEASURED from a render at this exact size and weight. Re-measure if the
 * text, the size, the padding or the font changes.
 *
 * Dark grey, not indigo: they comment ON the chart rather than being part of
 * it, and indigo is the colour of the average they are describing.
 */
/**
 * A 2 × 2 GRID, straddling the card's bottom border — at 30px the four of them
 * are 1.852px wide in one row, and only 1.728 fits inside the margins.
 *
 * Each ROW is centred on the chips that have arrived, so the entrance is
 * unchanged: the first lands in the middle and the next pushes it left. The
 * block's top is fixed, so the second row opens below the first rather than
 * shunting it upwards.
 */
/** The reserved band: two rows of 57 with 20 between, 8 clear of the card. */
const CHIP = { top: 738, gap: 20, rowStep: 77, size: 30, padX: 16, padY: 8 };
/** Which chips share a row. */
const ROWS = [
  [0, 1],
  [2, 3],
];
/**
 * The closing summary, in the empty top half of the card. It sits INSIDE the
 * chart because it is the answer to what the chart has been showing — the
 * heading outside the card names the lesson, this names the two things to do.
 */
const SUM = { at: at(2818), top: 250, gap: 20, size: 30, padX: 22, padY: 10, step: 8 };
const CHIPS = [
  { at: at(2387), w: 419, text: "Harga di atas MA = uptrend" },
  { at: at(2495), w: 500, text: "Harga di bawah MA = downtrend" },
  { at: at(2594), w: 460, text: "Makin curam = trend menguat" },
  { at: at(2689), w: 413, text: "Datar = market belum jelas" },
];

/**
 * ═══ THE BARS THAT CAME BACK TO THE LINE ═══  ← EDIT THE CIRCLES HERE
 *
 * `rings` are the bars that get a circle. `line` is the trend line's own
 * vertices, in order — a swing zigzag through the candles, so a vertex sits on
 * the bar's HIGH at a peak and its LOW at a trough. The two lists are separate
 * on purpose: a circle marks where price met the average, and the trend line
 * traces the swings between those meetings. They are not obliged to share
 * every point.
 *
 * The alternation is fixed by direction. UP starts at a trough (price pulls
 * back DOWN to the line); DOWN starts at a peak (price rallies UP into it).
 * Both are BAR INDICES into the 189-bar series.
 *
 * Which window each set belongs to:
 *   UP    bars   0 – 59    the climb, framed from 2903
 *   DOWN  bars  54 – 113   the decline, framed from 3213
 * An index outside its own window sits off the edge of the card and is
 * clipped, so keep edits inside those ranges.
 *
 * ⚠ THESE WERE FOUND, NOT PLACED. The rule: a bar qualifies as a ring when its
 * own range CONTAINS the average — low at or under the line, high at or over
 * it — which is where price actually met the line. A circle is drawn centred
 * on the average, so moving one to a bar that does not reach the line still
 * draws a tidy circle ON the line, with no candle inside it. That reads as a
 * touch the tape never made. Check the bar before moving a number.
 *
 * The one deliberate exception is UP's first ring: at bar 1 price only comes
 * NEAR the line, and the run of bounces has to start where the tape starts.
 */
const UP = {
  up: true,
  rings: [1, 29, 47],
  pivots: [25, 45, 55],
};
const DOWN = {
  up: false,
  rings: [67, 85, 92, 101],
  pivots: [77, 89, 97, 113],
};

/** The path through one bounce set, in the grid's coordinates. */
type Bounce = { up: boolean; rings: number[]; pivots: number[] };
/**
 * A ring sits on the bar's own extremity in the direction it reached FOR the
 * line — its high on the way up into a falling average, its low on the way
 * down onto a rising one — not on the average itself.
 *
 * On a bar that genuinely touches, those are the same point, so the true
 * touches do not move. It matters on a bar that only rallies CLOSE: bar 85's
 * high is 6.492 against an average of 6.368, and pinned to the average the
 * vertex sat a third of the rally below the candle that made it.
 */
const ringY = (b: Bounce, i: number) => (b.up ? BARS[i].l : BARS[i].h);
const verticesOf = (b: Bounce, g: ReturnType<typeof gridOf>) =>
  b.rings.flatMap((r, n) => [
    { x: g.x(r), y: g.y(ringY(b, r)) },
    { x: g.x(b.pivots[n]), y: b.up ? g.y(BARS[b.pivots[n]].h) : g.y(BARS[b.pivots[n]].l) },
  ]);
const pathOfBounce = (b: Bounce, g: ReturnType<typeof gridOf>) =>
  verticesOf(b, g)
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
const lenOfBounce = (b: Bounce, g: ReturnType<typeof gridOf>) => {
  const v = verticesOf(b, g);
  let len = 0;
  for (let i = 1; i < v.length; i++) len += Math.hypot(v[i].x - v[i - 1].x, v[i].y - v[i - 1].y);
  return len;
};

export const Scene05 = () => {
  const f = useCurrentFrame();
  const g = f + FROM;
  /**
   * This scene sits BETWEEN two cuts: SC04 rises it in at 2324, and it rises
   * out at 3490. Both are read from the GLOBAL frame, because the other half
   * of each reads the same curve from its own position. The windows never
   * overlap, and away from both each returns a zero offset and no blur.
   */
  const cut = g < CUTS.toCross.at - CUTS.toCross.over
    ? cutInStyle(g, CUTS.toReading)
    : cutOutStyle(g, CUTS.toCross);

  /** Every step contributes its own travel, and its own length of line. */
  const shift =
    PITCH * T.steps.reduce((a, s) => a + s.bars * progressInOut(f, s.scroll, s.scrollDur), 0);
  const upto =
    WINDOW +
    Math.round(
      T.steps.reduce(
        (a, s) =>
          a + (s.grow === undefined ? 0 : s.bars * clamp01((f - s.grow) / (s.growDur ?? 1))),
        0,
      ),
    );
  /** The dash only animates the FIRST draw; after that the line just grows. */
  const drawing = f < (T.steps[0].grow ?? 0);
  const line = MA.slice(0, upto);

  return (
    <SafeArea>
      <div style={{ position: "absolute", inset: 0, ...cut }}>
        {/* the white card every chart in this episode is drawn on */}
        <div
          style={{
            position: "absolute",
            left: BOX.x,
            top: BOX.y,
            width: BOX.w,
            height: BOX.h,
            borderRadius: theme.layout.radius.lg,
            background: theme.colors.surface,
            border: `${theme.layout.border.thin}px solid ${theme.colors.border}`,
          }}
        />

        <Layer>
          <defs>
            {/* everything that scrolls is clipped to the card */}
            <clipPath id="sc05Card">
              <rect
                x={BOX.x}
                y={BOX.y}
                width={BOX.w}
                height={BOX.h}
                rx={theme.layout.radius.lg}
              />
            </clipPath>
          </defs>

          <g clipPath="url(#sc05Card)">
            <g transform={`translate(${-shift.toFixed(1)},0)`}>
              {/* the tape is simply THERE — the cut is its entrance */}
              {BARS.map((b, i) => {
                const x = G.x(i);
                const top = Math.min(G.y(b.o), G.y(b.c));
                const h = Math.max(1.5, Math.abs(G.y(b.c) - G.y(b.o)));
                /* candle bodies are the ONLY place green and red appear */
                const fill = b.c >= b.o ? theme.colors.candleGreen : theme.colors.candleRed;
                return (
                  <g key={i}>
                    <line
                      x1={x}
                      y1={G.y(b.h)}
                      x2={x}
                      y2={G.y(b.l)}
                      stroke={theme.colors.price}
                      strokeWidth={theme.layout.stroke.wick}
                    />
                    <rect x={x - BODY_W / 2} y={top} width={BODY_W} height={h} fill={fill} />
                  </g>
                );
              })}

              {/*
                Two readings of the same rule, one per window: on the climb the
                line is a floor price bounces off, on the decline a ceiling it
                is turned away from. The first set FADES as the window travels
                to the second — six of its bars stay in shot, and a leftover
                ring on them would be read as part of the new reading.
              */}
              {[
                { b: UP, ring: T.ring, path: T.path, fade: T.steps[3].scroll },
                { b: DOWN, ring: T.ringDown, path: T.pathDown, fade: Infinity },
              ].map((set, k) => {
                const o =
                  set.fade === Infinity ? 1 : 1 - progress(f, set.fade, theme.motion.revealF);
                if (f < set.ring || o <= 0.001) return null;
                return (
                  <g key={k} opacity={o}>
                    {f >= set.path && (
                      <path
                        d={pathOfBounce(set.b, G)}
                        fill="none"
                        stroke={theme.colors.indigo}
                        strokeWidth={theme.layout.stroke.ma}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        {...drawPath(f, set.path, T.pathDur, lenOfBounce(set.b, G))}
                      />
                    )}
                    {set.b.rings.map((i, n) => {
                      const a = progress(f, set.ring + n * T.ringStep, theme.motion.revealF);
                      if (a <= 0.001) return null;
                      const cx = G.x(i);
                      /* the circle rides the same point the trend line does,
                         so the two can never come apart */
                      const cy = G.y(ringY(set.b, i));
                      return (
                        <circle
                          key={i}
                          cx={cx}
                          cy={cy}
                          r={38}
                          fill="none"
                          stroke={theme.colors.indigo}
                          strokeWidth={theme.layout.stroke.ma}
                          opacity={a}
                          transform={`translate(${cx} ${cy}) scale(${(0.6 + 0.4 * a).toFixed(3)}) translate(${-cx} ${-cy})`}
                        />
                      );
                    })}
                  </g>
                );
              })}

              {f >= T.ma && (
                <path
                  d={pathOf(line, G)}
                  fill="none"
                  /* ONE average on screen, so it takes the orange — the
                     cyan/indigo binding is for a fast/slow PAIR, where the two
                     have to be told apart. */
                  stroke={theme.colors.maOrange}
                  strokeWidth={theme.layout.stroke.ma}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  {...(drawing ? drawPath(f, T.ma, T.maOver, lengthOf(line, G)) : {})}
                />
              )}
            </g>
          </g>
        </Layer>

        {/* ── the closing summary, at the top of the chart ── */}
        {f >= SUM.at && f < T.clear + theme.motion.revealF && (
          <div
            style={{
              position: "absolute",
              opacity: f >= T.clear ? 1 - progress(f, T.clear, theme.motion.revealF) : 1,
              left: BOX.x,
              top: SUM.top,
              width: BOX.w,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 26,
            }}
          >
            <div
              style={{
                ...textReveal(f, SUM.at),
                fontFamily: theme.type.family,
                fontSize: theme.type.h2.size,
                fontWeight: theme.type.h2.weight,
                color: theme.colors.indigo,
              }}
            >
              Perhatikan
            </div>
            <div style={{ display: "flex", gap: SUM.gap }}>
              {["Posisi harga", "Arah MA"].map((label, i) => (
                <span
                  key={label}
                  style={{
                    ...textReveal(f, SUM.at + (i + 1) * SUM.step),
                    background: theme.colors.indigo,
                    color: theme.colors.surface,
                    border: `${theme.layout.border.thin}px solid ${theme.colors.indigo}`,
                    borderRadius: theme.layout.radius.sm,
                    padding: `${SUM.padY}px ${SUM.padX}px`,
                    fontFamily: theme.type.family,
                    fontSize: SUM.size,
                    fontWeight: theme.type.label.weight,
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── the readings, a 2 × 2 grid in the card's own bottom band ── */}
        {ROWS.map((row, r) =>
          row.map((i, col) => {
            const c = CHIPS[i];
            if (f < c.at) return null;
            /**
             * A chip counts as arriving OVER its own reveal, not the frame it
             * mounts — so the one beside it eases left instead of jumping.
             */
            const grown = row.map((k) =>
              f < CHIPS[k].at ? 0 : progress(f, CHIPS[k].at, theme.motion.revealF),
            );
            const width = row.reduce(
              (a, k, n) => a + grown[n] * (CHIPS[k].w + (n === 0 ? 0 : CHIP.gap)),
              0,
            );
            const before = row
              .slice(0, col)
              .reduce((a, k, n) => a + grown[n] * (CHIPS[k].w + (n === 0 ? 0 : CHIP.gap)), 0);
            const left =
              (theme.layout.width - width) / 2 + before + (col === 0 ? 0 : CHIP.gap * grown[col]);
            const rv = textReveal(f, c.at);
            return (
              <div
                key={c.text}
                style={{
                  position: "absolute",
                  left,
                  top: CHIP.top + r * CHIP.rowStep,
                  width: c.w,
                  boxSizing: "border-box",
                  textAlign: "center",
                  opacity: rv.opacity * (f >= T.clear ? 1 - progress(f, T.clear, theme.motion.revealF) : 1),
                  background: theme.colors.surface,
                  border: `${theme.layout.border.thin}px solid ${theme.colors.ink}`,
                  borderRadius: theme.layout.radius.sm,
                  padding: `${CHIP.padY}px ${CHIP.padX}px`,
                  fontFamily: theme.type.family,
                  fontSize: CHIP.size,
                  fontStyle: "italic",
                  fontWeight: theme.type.label.weight,
                  color: theme.colors.ink,
                  whiteSpace: "nowrap",
                }}
              >
                {c.text}
              </div>
            );
          }),
        )}

        <TitleChip text="Cara Baca Moving Average" f={f} at={T.title} />
      </div>
    </SafeArea>
  );
};
