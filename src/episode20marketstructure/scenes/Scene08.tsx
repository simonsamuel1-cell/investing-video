/**
 * SC08 — One simple principle (from 3508, dur 406).
 *
 * IT CONTINUES SC07. Frame 3508 is the descent SC07 drew, unchanged and with
 * everything written on it already cleared. A sweep then runs left to right
 * turning that line into candles — the same series, told in the other notation,
 * which is the point: the principle holds whichever way you draw price.
 *
 * The chart drops to a fifth while the principle is stated over it, comes back
 * to full when the sentence lands under it, and is finally replaced by the
 * opening chart from the hook — cut short, with two guesses drawn off the end.
 * Those two arrows are the thing the scene rejects: they are struck out, never
 * offered. No entry, no target, no direction claimed.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { CandleChart, barGrid } from "../components/CandleChart";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, fadeOut, textReveal } from "../helpers";
import { plot, candles, type Bar } from "../data/shape";
import { seeded } from "../helpers";
import { CUTS, cutOut, cutIn, cutBlur } from "../transitions/CameraCut";
import { longBreath, LONG_ORIGIN } from "../transitions/Breath";
import { STAIR_BOX, pathOf } from "../data/staircaseView";
import { DESCENT } from "../data/shapes";
import { BARS } from "./Scene01";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  convert: 0, // the line becomes candles, left to right — HALFWAY only
  one: 4, // "Pegang satu"
  words: 20, // global 3528 — "prinsip sederhana:"
  dim: 16, // the chart steps back behind the principle
  bigOut: 50, // clears exactly on 3566
  extend: 56, // global 3564 — the series carries on, hollow, to the card's edge
  restore: 58, // global 3566 — the chart comes back to full
  line1: 68, // global 3576 — "anggap tren masih berlanjut"
  line2: 115, // global 3623 — "sampai chart benar-benar menunjukkan"
  lineOut: 226, // the sentence clears as the camera starts to rise
  guess: 240, // "bukan menebak kapan tren berakhir"
  strike: 276,
  know: 306, // global 3814 — "tetapi mengenali"
};
/** This scene's `from` in the Composition — needed to read the shared cut. */
const SCENE_FROM = 3508;
const BOX = STAIR_BOX;
/** How far the chart steps back while the principle is stated over it. */
const DIMMED = 0.2;
/** Frames the left-to-right conversion takes. */
const CONVERT_OVER = 34;
/**
 * THE HANDOVER ONLY GOES HALFWAY.
 *
 * The candles take over the left half of the descent and stop; the line keeps
 * retiring to the right with nothing following it, so the sweep ends on half a
 * chart and half an empty card. The line is FULLY gone — what is missing on the
 * right is not the old notation still hanging on, it is the series not drawn
 * yet. That empty right half is what the rest of the scene fills.
 *
 * The candle front and the line's edge move together over that first half, so
 * the handover looks like one edge, not two racing each other.
 */
const HALF = 0.5;
/**
 * The unconfirmed continuation, from 3564: the rest of the descent plus enough
 * bars to reach the card's right border, all drawn HOLLOW. Hollow because the
 * narration at this point is an assumption — "anggap tren berlanjut" — and an
 * assumption drawn in candle colour would be claiming it already happened.
 */
const EXTEND_OVER = 46;
/**
 * From 3631 the chart SCROLLS, which is what a chart does when it runs out of
 * room on the right. The white card does not move — only what is drawn on it —
 * so the card stays the frame and the price moves through it.
 */
const SHIFT = { at: 123, over: 34, px: 400 };
/** The hollow bars take their colour: the assumption is now what happened. */
const FILL_OVER = 24;
/**
 * …and the series carries on UP, into the room the scroll opened. `to` is well
 * inside the descent's own high, so the price scale never has to change — a
 * chart that rescales under the viewer moves everything they were reading.
 */
const RISE = { at: 147, over: 80, bars: 16, to: 5700 };
/**
 * The hook's chart, minus its last eleven candles: the series stops before the
 * answer, which is the only honest way to draw a question about what comes next.
 */
const TRIM = 11;
/**
 * The two guesses, drawn off the end of the cut series — and the room they
 * need. The hook's chart is plotted NARROWER than the descent for exactly this
 * reason: a question about what happens next needs empty chart to happen in,
 * and arrows that ran off the card would be answering outside the frame.
 */
const GUESS = { len: 230, rise: 140, gap: 30 };
const HOOK_ROOM = 330;
/**
 * Two lines ABOVE the card, in the strip between the safe top and the white
 * surface. Off the chart entirely, so nothing has to be read through candles —
 * and both lines clear the logo zone's x limit at this width.
 */
const LINE_Y = [100, 156];
/** All four of this scene's lines are set bold — they are statements, not notes. */
const BOLD = theme.text.title.weight;
const BIG = { one: 210, word: 96 };
/** One shared style for both sentence lines, so they cannot drift apart. */
const LINE_STYLE = {
  position: "absolute" as const,
  left: theme.canvas.width / 2,
  transform: "translate(-50%, -50%)",
  textAlign: "center" as const,
  whiteSpace: "nowrap" as const,
  fontSize: theme.text.body.size,
  fontWeight: BOLD,
};
// ═══════════════════════════════════════════════════════════════════════════

const P = plot(DESCENT, BOX, { pad: 0.12 });
/** The descent as candles — same curve, same box, the other notation. */
const DESC_BARS = candles(DESCENT, 64, 41, 0.012);
/**
 * ONE PRICE SCALE FOR THE WHOLE SCENE, taken from the descent alone.
 *
 * Everything drawn after it — the hollow tail, the rise — is measured against
 * this, so bars that are already on screen never move when new ones arrive.
 * `barGrid` would otherwise refit to whatever is in the array, and the viewer
 * would see the chart they are reading slide under the bars being added to it.
 */
const RANGE: [number, number] = [
  Math.min(...DESC_BARS.map((b) => b.l)),
  Math.max(...DESC_BARS.map((b) => b.h)),
];
const SPAN = RANGE[1] - RANGE[0];
/** One bar's width, fixed. Every box below is sized from it, never the reverse. */
const SLOT = BOX.w / DESC_BARS.length;
/**
 * Carries the series on from where it stopped, bar by bar, to a target close.
 *
 * `candles()` needs a whole curve up front, but this continuation has to START
 * on the last close already on screen — so it is generated forward instead,
 * each open inheriting the previous close. Seeded, like everything else here;
 * a render is the same every time.
 */
const carry = (prev: Bar[], count: number, to: number, seed: number): Bar[] => {
  const rnd = seeded(seed);
  const from = prev[prev.length - 1].c;
  const out: Bar[] = [];
  let open = from;
  for (let i = 0; i < count; i++) {
    const close =
      from + (to - from) * ((i + 1) / count) + (rnd() - 0.5) * SPAN * 0.05;
    const up = SPAN * (0.005 + rnd() * 0.012) * (rnd() < 0.16 ? 3.2 : 1);
    const down = SPAN * (0.005 + rnd() * 0.012) * (rnd() < 0.16 ? 3.2 : 1);
    out.push({
      o: open,
      c: close,
      h: Math.max(open, close) + up,
      l: Math.min(open, close) - down,
    });
    open = close;
  }
  return out;
};
/** Exactly enough bars to carry the series from the plot's inset to the card's edge. */
const TAIL_N = Math.round(
  (theme.stage.card.x + theme.stage.card.w - (BOX.x + BOX.w)) / SLOT,
);
const TAIL = carry(DESC_BARS, TAIL_N, DESC_BARS[DESC_BARS.length - 1].c, 77);
const RISE_BARS = carry([...DESC_BARS, ...TAIL], RISE.bars, RISE.to, 93);
const SERIES = [...DESC_BARS, ...TAIL, ...RISE_BARS];
/** Where the hollow bars start: the exact bar the handover stopped on. */
const HOLLOW_FROM = Math.round(DESC_BARS.length * HALF);
/** How many bars the scroll has to reveal past the card's right border. */
const AFTER_HALF = SERIES.length - HOLLOW_FROM;
/** The box the whole series is measured in — `x` slides, the slot never does. */
const seriesBox = (dx: number) => ({
  x: BOX.x - dx,
  y: BOX.y,
  w: SLOT * SERIES.length,
  h: BOX.h,
});
/** The hook's own bars, cut short — the same series SC01 and SC02 drew. */
const HOOK_BARS = BARS.slice(0, BARS.length - TRIM);
const HOOK_TICKS = [4400, 4800, 5200, 5600, 6000];
const HOOK_BOX = { ...BOX, w: BOX.w - HOOK_ROOM };
const HOOK_GRID = barGrid(HOOK_BARS, HOOK_BOX);
const LAST = {
  x: HOOK_GRID.x(HOOK_BARS.length - 1),
  y: HOOK_GRID.scale(HOOK_BARS[HOOK_BARS.length - 1].c),
};

const bigWord = (
  text: string,
  size: number,
  color: string,
  at: number,
  f: number,
  out: number,
) => {
  const r = textReveal(f, at);
  return (
    <div
      style={{
        fontSize: size,
        fontWeight: 800,
        color,
        opacity: r.opacity * out,
        transform: `translateY(${r.dy}px)`,
        lineHeight: 1.05,
      }}
    >
      {text}
    </div>
  );
};

export const Scene08 = () => {
  const f = useCurrentFrame();

  // ── the line hands over to the candles, and only gets halfway ──
  const convert = progress(f, T.convert, CONVERT_OVER);
  /** The candle front stops at the halfway mark; the line keeps going. */
  const front = Math.min(convert, HALF);
  const extended = f >= T.extend ? progress(f, T.extend, EXTEND_OVER) : 0;
  const risen = f >= RISE.at ? progress(f, RISE.at, RISE.over) : 0;
  const shown =
    Math.round(DESC_BARS.length * front) +
    Math.round((AFTER_HALF - RISE.bars) * extended) +
    Math.round(RISE.bars * risen);
  const scroll = f >= SHIFT.at ? SHIFT.px * progress(f, SHIFT.at, SHIFT.over) : 0;
  const hollow = 1 - (f >= SHIFT.at ? progress(f, SHIFT.at, FILL_OVER) : 0);

  const dim = f >= T.dim ? progress(f, T.dim, 20) : 0;
  const restore = f >= T.restore ? progress(f, T.restore, 16) : 0;
  const chartOpacity = 1 - dim * (1 - DIMMED) * (1 - restore);

  const bigOut = f >= T.bigOut ? fadeOut(f, T.bigOut, 8) : 1;
  const sentenceOut = f >= T.lineOut ? fadeOut(f, T.lineOut, 14) : 1;

  /**
   * THE CUT, on global 3746. Everything rises out of frame, the halves swap at
   * the exact midpoint where the move is fastest and the blur peaks, and the
   * new half arrives from below on the same curve. Only one half is ever
   * mounted, so the card is never drawn twice.
   */
  const g = f + SCENE_FROM;
  const before = g < CUTS.toGuess.at;
  const dy = before ? cutOut(g, CUTS.toGuess) : cutIn(g, CUTS.toGuess);
  const blur = cutBlur(g, CUTS.toGuess);
  /** …and the scene leaves sideways, on the same shared curve. */
  const dx = cutOut(g, CUTS.toSideways);
  const exitBlur = cutBlur(g, CUTS.toSideways);

  const guessed = f >= T.guess ? progress(f, T.guess, 22) : 0;
  const strike = f >= T.strike ? progress(f, T.strike, 18) : 0;

  const l1 = textReveal(f, T.line1);
  const l2 = textReveal(f, T.line2);

  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${dx}px, ${dy}px) scale(${longBreath(g)})`,
          transformOrigin: LONG_ORIGIN,
          filter:
            Math.max(blur, exitBlur) > 0.05
              ? `blur(${Math.max(blur, exitBlur)}px)`
              : undefined,
        }}
      >
        <Card>
          {/* SC07's line, retired left to right as the candles take its place */}
          {before && convert < 0.999 && (
            <Layer
              opacity={chartOpacity}
              clip={{
                x: BOX.x + BOX.w * convert,
                y: theme.stage.card.y,
                w: BOX.w * (1 - convert),
                h: theme.stage.card.h,
              }}
            >
              <path
                d={pathOf(P.points)}
                fill="none"
                stroke={theme.color.ink}
                strokeWidth={theme.shape.line}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Layer>
          )}

          {/* the series itself — clipped to the card, because once it scrolls
            the bars behind the left edge are off the surface they are drawn on */}
          {before && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                clipPath: `inset(0px ${theme.canvas.width - (theme.stage.card.x + theme.stage.card.w)}px 0px ${theme.stage.card.x}px)`,
              }}
            >
              <CandleChart
                bars={SERIES}
                box={seriesBox(scroll)}
                range={RANGE}
                /* half a bar back, so `ceil` inside the chart lands on exactly
                   `shown` and float error can never add a phantom candle */
                reveal={Math.max(0, shown - 0.5) / SERIES.length}
                axis={false}
                opacity={chartOpacity}
                hollowFrom={HOLLOW_FROM}
                hollow={hollow}
              />
            </div>
          )}
          {!before && (
            <CandleChart
              bars={HOOK_BARS}
              box={HOOK_BOX}
              ticks={HOOK_TICKS}
              tickLabels={false}
            />
          )}

          {/* the two guesses — offered only to be struck out */}
          {!before && guessed > 0.001 && (
            <Layer opacity={guessed * (1 - strike * 0.65)}>
              {[-1, 1].map((dir) => {
                const x2 = LAST.x + GUESS.len;
                const y2 = LAST.y + dir * GUESS.rise;
                const nx = (x2 - LAST.x) / Math.hypot(x2 - LAST.x, y2 - LAST.y);
                const ny = (y2 - LAST.y) / Math.hypot(x2 - LAST.x, y2 - LAST.y);
                return (
                  <g key={dir}>
                    <line
                      x1={LAST.x + nx * GUESS.gap}
                      y1={LAST.y + ny * GUESS.gap}
                      x2={x2}
                      y2={y2}
                      stroke={theme.color.slate}
                      strokeWidth={theme.shape.rule}
                      strokeDasharray="10 8"
                    />
                    <polygon
                      points={`${x2},${y2} ${x2 - nx * 22 - ny * 10},${y2 - ny * 22 + nx * 10} ${x2 - nx * 22 + ny * 10},${y2 - ny * 22 - nx * 10}`}
                      fill={theme.color.slate}
                    />
                  </g>
                );
              })}
            </Layer>
          )}

          {/* the principle, stated over the chart before it is stated under it */}
          {before && bigOut > 0.001 && (
            <div
              style={{
                position: "absolute",
                left: theme.canvas.width / 2,
                top: theme.stage.card.y + theme.stage.card.h / 2,
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              {bigWord("1", BIG.one, theme.color.indigo, T.one, f, bigOut)}
              {bigWord(
                "Prinsip",
                BIG.word,
                theme.color.ink,
                T.words,
                f,
                bigOut,
              )}
              {bigWord(
                "Sederhana",
                BIG.word,
                theme.color.ink,
                T.words + 6,
                f,
                bigOut,
              )}
            </div>
          )}

          {/* and then above it, where it is read without the chart in the way */}
          {before && sentenceOut > 0.001 && f >= T.line1 && (
            <>
              <div
                style={{
                  ...LINE_STYLE,
                  top: LINE_Y[0],
                  color: theme.color.ink,
                  opacity: sentenceOut * l1.opacity,
                  marginTop: l1.dy,
                }}
              >
                Anggap tren berlanjut sampai
              </div>
              <div
                style={{
                  ...LINE_STYLE,
                  top: LINE_Y[1],
                  color: theme.color.indigo,
                  opacity: sentenceOut * l2.opacity,
                  marginTop: l2.dy,
                }}
              >
                chart membuktikan sebaliknya
              </div>
            </>
          )}

          {/* the job, as a contrast: not guessing — recognising */}
          {!before && (
            <>
              <Chip
                label="Menebak kapan tren berakhir"
                x={theme.canvas.width / 2}
                y={LINE_Y[0]}
                tone="slate"
                weight={BOLD}
                at={T.guess}
                strike={strike}
                strikeInk={theme.color.indigo}
              />
              <Chip
                label="Kenali perubahan"
                weight={BOLD}
                x={theme.canvas.width / 2}
                y={LINE_Y[1]}
                tone="indigo"
                at={T.know}
              />
            </>
          )}
        </Card>
      </div>
    </Stage>
  );
};
