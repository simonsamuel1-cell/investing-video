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
import { TitleBlock } from "../components/TitleBlock";
import { theme } from "../theme";
import { fadeOut, progress } from "../helpers";
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
};
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
/** The questions sit ABOVE the chart, on the same row the strike-outs use. */
const QUESTION_Y = BOX.y - 26;
const NOT_THIS_X = [740, 1080];
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

export const Scene03 = () => {
  const f = useCurrentFrame();
  const dissolving = fadeOut(f, T.dissolve, 50);
  const drawn = progress(f, T.dissolve, T.line + 60);
  const strike = (offset: number) => (f >= T.strike + offset ? progress(f, T.strike + offset, 14) : 0);
  const leave = (offset: number) => (f >= T.strike + offset + 20 ? fadeOut(f, T.strike + offset + 20, 16) : 1);

  return (
    <Stage>
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

        {/* Peaks indigo, troughs cyan — the pairing holds for the whole
            episode. The names go to the first of each KIND, not to the first
            two markers: which comes first depends on the shape, and naming by
            position would sooner or later call a trough a peak. */}
        {TURN_BARS.map((t, i) => (
          <PivotLabel
            key={i}
            x={G.x(t.bar)}
            y={G.scale(BARS[t.bar].c)}
            label={i === FIRST_PEAK ? "Puncak" : i === FIRST_TROUGH ? "Lembah" : undefined}
            tone={t.peak ? "indigo" : "cyan"}
            side={t.peak ? "above" : "below"}
            at={T.turns + i * TURN_STEP}
          />
        ))}
      </Card>

      {/* the header SC02 built, held exactly where it was left */}
      <TitleBlock />

      {/* not this, and not this */}
      <Chip label="Indikator" x={NOT_THIS_X[0]} y={QUESTION_Y} tone="slate" at={T.notThis} strike={strike(0)} opacity={leave(0)} />
      <Chip label="Berita" x={NOT_THIS_X[1]} y={QUESTION_Y} tone="slate" at={T.notThis + 26} strike={strike(26)} opacity={leave(26)} />

      {/* SC01's three questions, now anchored to real turning points */}
      <Chip label="Terus naik?" x={QUESTION_X[0]} y={QUESTION_Y} tone="indigo" at={T.q1} />
      <Chip label="Terus turun?" x={QUESTION_X[1]} y={QUESTION_Y} tone="indigo" at={T.q2} />
      <Chip label="Area sama?" x={QUESTION_X[2]} y={QUESTION_Y} tone="indigo" at={T.q3} />
    </Stage>
  );
};
