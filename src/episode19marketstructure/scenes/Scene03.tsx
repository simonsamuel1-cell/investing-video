/**
 * SC03 — Definition: peaks and troughs (from 928, dur 522).
 *
 * The candles dissolve into the line they were always describing. Both are the
 * same numbers — the line is drawn through the CLOSES of the SC01/SC02 candles
 * on that chart's own scale — so the dissolve is a fact about one series rather
 * than two drawings that happen to line up.
 *
 * One reading resolved here: the spec asks for a cross-fade at L0 and a
 * trim-path re-draw at L58. Drawing it twice would stutter, so the line traces
 * itself across both beats and completes on the second one.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, ChartCard, Layer } from "../components/SafeArea";
import { CandleChart, candleGeom } from "../components/CandleChart";
import { PivotLabel } from "../components/PivotLabel";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { fadeOut, progress } from "../helpers";
import { AMBIGUOUS, AMBIGUOUS_CANDLES, AMBIGUOUS_TICKS } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  dissolve: 0,
  line: 58, // "bentuk yang ditinggalkan harga"
  notThis: 180, // "Bukan indikator" / "bukan juga berita"
  strike: 226,
  pivots: 266, // "puncak dan lembahnya"
  q1: 371, // "terus naik"
  q2: 422, // "terus turun"
  q3: 451, // "area yang sama"
};
const PIVOT_STEP = 11;
const BOX = { x: theme.frame.plot.x, y: theme.frame.plot.y + 60, w: theme.frame.plot.w, h: theme.frame.plot.h - 130 };
const QUESTION_X = [500, 960, 1420];
const NOT_THIS_X = [740, 1080];
// ═══════════════════════════════════════════════════════════════════════════

const WIN: [number, number] = [0, AMBIGUOUS_CANDLES.length - 1];
const G = candleGeom(AMBIGUOUS_CANDLES, WIN, BOX);
const CLOSES = AMBIGUOUS_CANDLES.map((d, i) => ({ x: G.cx(i), y: G.scale(d.c) }));
const LINE = CLOSES.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
const LINE_LEN = CLOSES.reduce((acc, p, i) => (i === 0 ? 0 : acc + Math.hypot(p.x - CLOSES[i - 1].x, p.y - CLOSES[i - 1].y)), 0);

/**
 * Each structural pivot, resolved to the candle that actually carries it — the
 * local extreme within a few bars. The dot then sits ON the drawn line.
 */
const PIVOT_BARS = AMBIGUOUS.pivots.map((pv, k) => {
  const peak = k % 2 === 1;
  const guess = Math.round(pv.t * (AMBIGUOUS_CANDLES.length - 1));
  let best = guess;
  for (let i = Math.max(0, guess - 3); i <= Math.min(AMBIGUOUS_CANDLES.length - 1, guess + 3); i++) {
    const better = peak ? AMBIGUOUS_CANDLES[i].c > AMBIGUOUS_CANDLES[best].c : AMBIGUOUS_CANDLES[i].c < AMBIGUOUS_CANDLES[best].c;
    if (better) best = i;
  }
  return { bar: best, peak };
});

export const Scene03 = () => {
  const f = useCurrentFrame();
  const candles = fadeOut(f, T.dissolve, 50);
  const draw = progress(f, T.dissolve, T.line + 60);
  const strike = f >= T.strike ? progress(f, T.strike, 14) : 0;
  const leave = (offset: number) => (f >= T.strike + offset + 20 ? fadeOut(f, T.strike + offset + 20, 16) : 1);

  return (
    <SafeArea>
      <ChartCard>
        {candles > 0.001 && (
          <CandleChart data={AMBIGUOUS_CANDLES} window={WIN} box={BOX} opacity={candles} tickValues={AMBIGUOUS_TICKS} />
        )}

        {/* the shape price leaves behind */}
        {draw > 0.001 && (
          <Layer>
            <path
              d={LINE}
              fill="none"
              stroke={theme.colors.ink}
              strokeWidth={theme.stroke.line}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={LINE_LEN}
              strokeDashoffset={LINE_LEN * (1 - draw)}
            />
          </Layer>
        )}

        {/* peaks indigo, troughs cyan — the pairing holds for the whole episode.
            The SECOND trough carries the name: pivot 0 sits on the left edge
            and a chip centred there would cross the safe margin. */}
        {PIVOT_BARS.map((pv, i) => (
          <PivotLabel
            key={i}
            x={G.cx(pv.bar)}
            y={G.scale(AMBIGUOUS_CANDLES[pv.bar].c)}
            label={i === 1 ? "Puncak" : i === 2 ? "Lembah" : undefined}
            variant={pv.peak ? "indigo" : "cyan"}
            side={pv.peak ? "above" : "below"}
            startFrame={T.pivots + i * PIVOT_STEP}
          />
        ))}
      </ChartCard>

      {/* not this, and not this */}
      <Chip label="Indikator" x={NOT_THIS_X[0]} y={theme.frame.plot.y + 24} variant="slate" startFrame={T.notThis} strike={strike} opacity={leave(0)} />
      <Chip
        label="Berita"
        x={NOT_THIS_X[1]}
        y={theme.frame.plot.y + 24}
        variant="slate"
        startFrame={T.notThis + 26}
        strike={f >= T.strike + 26 ? progress(f, T.strike + 26, 14) : 0}
        opacity={leave(26)}
      />

      {/* SC01's three questions, now anchored to real pivots */}
      <Chip label="Terus Naik?" x={QUESTION_X[0]} y={theme.frame.captionY} variant="indigo" startFrame={T.q1} />
      <Chip label="Terus Turun?" x={QUESTION_X[1]} y={theme.frame.captionY} variant="indigo" startFrame={T.q2} />
      <Chip label="Area Sama?" x={QUESTION_X[2]} y={theme.frame.captionY} variant="cyan" startFrame={T.q3} />
    </SafeArea>
  );
};
