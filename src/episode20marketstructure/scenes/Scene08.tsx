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
import { plot, candles } from "../data/shape";
import { CUTS, cutOut, cutIn, cutBlur } from "../transitions/CameraCut";
import { STAIR_BOX, pathOf } from "../data/staircaseView";
import { DESCENT } from "../data/shapes";
import { BARS } from "./Scene01";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  convert: 0, // the line becomes candles, left to right
  one: 4, // "Pegang satu"
  words: 20, // global 3528 — "prinsip sederhana:"
  dim: 16, // the chart steps back behind the principle
  bigOut: 50, // clears exactly on 3566
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
const BIG = { one: 210, word: 96 };
/** One shared style for both sentence lines, so they cannot drift apart. */
const LINE_STYLE = {
  position: "absolute" as const,
  left: theme.canvas.width / 2,
  transform: "translate(-50%, -50%)",
  textAlign: "center" as const,
  whiteSpace: "nowrap" as const,
  fontSize: theme.text.body.size,
  fontWeight: theme.text.body.weight,
};
// ═══════════════════════════════════════════════════════════════════════════

const P = plot(DESCENT, BOX, { pad: 0.12 });
/** The descent as candles — same curve, same box, the other notation. */
const DESC_BARS = candles(DESCENT, 64, 41, 0.012);
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

  // ── the line hands over to the candles ──
  const convert = progress(f, T.convert, CONVERT_OVER);
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
          transform: `translate(${dx}px, ${dy}px)`,
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

          {before && (
            <CandleChart
              bars={DESC_BARS}
              box={BOX}
              reveal={convert}
              axis={false}
              opacity={chartOpacity}
            />
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
                at={T.guess}
                strike={strike}
                strikeInk={theme.color.indigo}
              />
              <Chip
                label="Kenali perubahan"
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
