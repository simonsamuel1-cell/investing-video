/**
 * SC03 — Definition: peaks and troughs (from 928, dur 522).
 *
 * The candles dissolve into the line they were always describing. Both come
 * from ONE curve — the line runs through the closes of the SC01 candles, on
 * that chart's own scale — so the dissolve is a fact about a single series
 * rather than two drawings that were made to resemble each other.
 *
 * One reading resolved here: the spec asks for a cross-fade at L0 and a
 * trim-path re-draw at L58. Drawing it twice would stutter, so the line traces
 * itself across both beats and completes on the second.
 *
 * FRAME 928 IS FRAME 927. The scene opens on exactly what SC02 ended on — the
 * same candles in the same box, the same gridlines, the same header — so the
 * scene boundary is invisible and only then does anything start to move. The
 * geometry and the header are imported rather than re-typed, so they cannot
 * drift apart later.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { CandleChart, barGrid } from "../components/CandleChart";
import { PivotLabel } from "../components/PivotLabel";
import { Chip } from "../components/Chip";
import { TitleBlock, TITLE_REST_CY } from "../components/TitleBlock";
import { theme } from "../theme";
import { fadeOut, progress, progressInOut } from "../helpers";
import { breathScale, breathPoint, BREATH_ORIGIN } from "../transitions/Breath";
import { majorTurns } from "../data/shape";
import { HOOK } from "../data/shapes";
import { BARS } from "./Scene01";
import { CHART_BOX, CHART_TICKS } from "./Scene02";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  dissolve: 0,
  line: 58, // "bentuk yang ditinggalkan harga"
  notThis: 180, // "Bukan indikator" / "bukan juga berita"
  strike: 226,
  turns: 266, // "puncak dan lembahnya"
  q1: 371, // "terus naik"
  q2: 422, // "terus turun"
  q3: 451, // "area yang sama"
  exit: 490, // global 1418 — the line starts winding itself back up
};
/** This scene's `from` in the Composition — needed to read the shared breath. */
const SCENE_FROM = 928;
/**
 * THE HANDOFF INTO SC04.
 *
 * The line does not fade; it UN-DRAWS, right to left, back into the single
 * point it grew out of. Everything named on it clears at the same time, so what
 * survives the cut is one dot on an unchanged card — and SC04's line grows out
 * of that same dot. The element is genuinely shared, not matched by eye.
 *
 * Ends on 520, two frames before the scene does, so the seed is unmistakably
 * still and alone when the cut lands.
 */
const EXIT_OVER = 30;
const TURN_STEP = 11;
/**
 * How far a turn has to stand clear of its neighbours to be worth naming. The
 * series has ~57 turns; at this threshold about eight survive, which is the
 * number a viewer would point at unprompted.
 */
const MIN_MOVE = 130;
/** However many survive, only the first few are worth landing on screen. */
const MAX_MARKS = 9;
/** SC02's box, unchanged — this is what makes 928 identical to 927. */
const BOX = CHART_BOX;
const QUESTION_X = [500, 960, 1420];
/** The questions sit ABOVE the chart, inside the card. */
const QUESTION_Y = BOX.y - 26;
/**
 * "Indikator" and "Berita" sit OFF the card entirely, in the strip the title
 * vacates as it leaves. They are things the scene is ruling out, so keeping
 * them off the white surface says so before the strike does.
 */
const NOT_THIS_X = [740, 1080];
const NOT_THIS_Y = theme.stage.title.y;
/**
 * The title leaves the moment the scene starts — but frame 928 still has to be
 * frame 927, so the exit begins AT 0 rather than before it. It rises as it
 * goes, which is the direction it arrived from in SC02.
 */
const TITLE_OUT = { over: 30, rise: 26 };
// ═══════════════════════════════════════════════════════════════════════════

const G = barGrid(BARS, BOX);
const CLOSES = BARS.map((b, i) => ({ x: G.x(i), y: G.scale(b.c) }));
const PATH = CLOSES.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
const LENGTH = CLOSES.reduce((a, p, i) => (i === 0 ? 0 : a + Math.hypot(p.x - CLOSES[i - 1].x, p.y - CLOSES[i - 1].y)), 0);

/**
 * Each turn of the curve, resolved to the candle that actually carries it — the
 * local extreme within a few bars. The dot then sits ON the drawn line rather
 * than near it.
 */
const TURN_BARS = majorTurns(HOOK, MIN_MOVE)
  .map((i) => HOOK.turns[i])
  .map((t) => {
    const peak = t.kind === "peak";
    const guess = Math.round(t.t * (BARS.length - 1));
    let best = guess;
    for (let i = Math.max(0, guess - 3); i <= Math.min(BARS.length - 1, guess + 3); i++) {
      if (peak ? BARS[i].c > BARS[best].c : BARS[i].c < BARS[best].c) best = i;
    }
    return { bar: best, peak };
  })
  .slice(0, MAX_MARKS);

const FIRST_PEAK = TURN_BARS.findIndex((t) => t.peak);
const FIRST_TROUGH = TURN_BARS.findIndex((t) => !t.peak);

/** The point the line grows out of — and the one SC04 picks up. */
export const HANDOFF_FROM = CLOSES[0];

export const Scene03 = () => {
  const f = useCurrentFrame();
  const g = f + SCENE_FROM;
  const s = breathScale(g);

  const dissolving = fadeOut(f, T.dissolve, 50);
  // the exit rewinds the same trim path the entrance drew
  const gone = f >= T.exit ? progressInOut(f, T.exit, EXIT_OVER) : 0;
  const drawn = progress(f, T.dissolve, T.line + 60) * (1 - gone);
  const stay = 1 - gone;
  const strike = (offset: number) => (f >= T.strike + offset ? progress(f, T.strike + offset, 14) : 0);
  const leave = (offset: number) => (f >= T.strike + offset + 20 ? fadeOut(f, T.strike + offset + 20, 16) : 1);

  const seed = breathPoint(HANDOFF_FROM, s);

  // the header hands the top strip over to whatever this scene puts there
  const titleOut = progressInOut(f, 0, TITLE_OUT.over);

  return (
    <Stage>
      {/* the breath: card, candles and line move as one object */}
      <div style={{ position: "absolute", inset: 0, transform: `scale(${s})`, transformOrigin: BREATH_ORIGIN }}>
        <Card>
          {dissolving > 0.001 && <CandleChart bars={BARS} box={BOX} opacity={dissolving} ticks={CHART_TICKS} tickLabels={false} />}

          {/* the shape price leaves behind */}
          {drawn > 0.001 && (
            <Layer>
              <path
                d={PATH}
                fill="none"
                stroke={theme.color.ink}
                strokeWidth={theme.shape.line}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={LENGTH}
                strokeDashoffset={LENGTH * (1 - drawn)}
              />
            </Layer>
          )}
        </Card>
      </div>

      {/* Peaks indigo, troughs cyan — the pairing holds for the whole
          episode. The names go to the first of each KIND, not to the first
          two markers: which comes first depends on the shape, and naming by
          position would sooner or later call a trough a peak.

          They live OUTSIDE the breathing group and have their coordinates run
          through it instead, so the dots stay on the line while the two names
          keep their type size. */}
      {TURN_BARS.map((t, i) => {
        const p = breathPoint({ x: G.x(t.bar), y: G.scale(BARS[t.bar].c) }, s);
        return (
          <PivotLabel
            key={i}
            x={p.x}
            y={p.y}
            label={i === FIRST_PEAK ? "Puncak" : i === FIRST_TROUGH ? "Lembah" : undefined}
            tone={t.peak ? "indigo" : "cyan"}
            side={t.peak ? "above" : "below"}
            at={T.turns + i * TURN_STEP}
            opacity={stay}
          />
        );
      })}

      {/* what the line winds back into, and what SC04 starts from */}
      {gone > 0.001 && (
        <Layer opacity={gone}>
          <circle cx={seed.x} cy={seed.y} r={9} fill={theme.color.indigo} />
        </Layer>
      )}

      {/* the header SC02 built, leaving from the frame this scene opens on */}
      {titleOut < 0.999 && <TitleBlock cy={TITLE_REST_CY - TITLE_OUT.rise * titleOut} opacity={1 - titleOut} />}

      {/* not this, and not this */}
      <Chip
        label="Indikator"
        x={NOT_THIS_X[0]}
        y={NOT_THIS_Y}
        tone="slate"
        at={T.notThis}
        strike={strike(0)}
        strikeInk={theme.color.indigo}
        opacity={leave(0) * stay}
      />
      <Chip
        label="Berita"
        x={NOT_THIS_X[1]}
        y={NOT_THIS_Y}
        tone="slate"
        at={T.notThis + 26}
        strike={strike(26)}
        strikeInk={theme.color.indigo}
        opacity={leave(26) * stay}
      />

      {/* SC01's three questions, now anchored to real turning points. These
          three are the episode's only pills: they are objects sitting on the
          card, not annotations pointing into it. */}
      <Chip label="Terus naik?" x={QUESTION_X[0]} y={QUESTION_Y} tone="indigo" at={T.q1} opacity={stay} pill />
      <Chip label="Terus turun?" x={QUESTION_X[1]} y={QUESTION_Y} tone="indigo" at={T.q2} opacity={stay} pill />
      <Chip label="Area sama?" x={QUESTION_X[2]} y={QUESTION_Y} tone="indigo" at={T.q3} opacity={stay} pill />
    </Stage>
  );
};
