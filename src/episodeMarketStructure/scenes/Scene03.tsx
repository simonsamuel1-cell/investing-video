/**
 * SC03 — Definition: peaks and troughs (from 928, dur 522) — INDEPENDENT.
 *
 * The candles dissolve into the line they were always describing. Both are the
 * same numbers: the line is drawn through the CLOSES of the SC01/SC02 candles,
 * on that chart's own scale, so the dissolve is a fact about one series rather
 * than two drawings that happen to line up.
 *
 * One reading resolved here: the doc asks for a cross-fade at L0 and a
 * trim-path re-draw at L58. Drawing it twice would be a stutter, so the line
 * traces itself across both beats and completes on the second one.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartCard } from "../components/ChartCard";
import { CandlestickChart, chartGeom } from "../components/CandlestickChart";
import { PivotMarker } from "../components/PivotMarker";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { usePalette } from "../palette";
import { fadeOut, progress } from "../helpers";
import { AMBIGUOUS, AMBIGUOUS_CANDLES } from "../data/structures";
import { CARD, PLOT, CAPTION_Y } from "../layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  dissolve: 0, // "Market structure adalah"
  line: 58, // "bentuk yang ditinggalkan harga"
  notThis: 180, // "Bukan indikator" / "bukan juga berita"
  strike: 226,
  pivots: 266, // "puncak dan lembahnya"
  q1: 371, // "terus naik"
  q2: 422, // "terus turun"
  q3: 451, // "area yang sama"
};
const PIVOT_STEP = 11; // frames between one pivot landing and the next
const BOX = { x: PLOT.x, y: PLOT.y + 60, w: PLOT.w, h: PLOT.h - 130 };
const WIN: [number, number] = [0, AMBIGUOUS_CANDLES.length - 1];
const QUESTION_X = [500, 960, 1420];
// ═══════════════════════════════════════════════════════════════════════════

const G = chartGeom(AMBIGUOUS_CANDLES, WIN, BOX);
const CLOSES = AMBIGUOUS_CANDLES.map((d, i) => ({ x: G.cx(i), y: G.scale(d.c) }));
const LINE = CLOSES.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
const LINE_LEN = CLOSES.reduce((acc, p, i) => (i === 0 ? 0 : acc + Math.hypot(p.x - CLOSES[i - 1].x, p.y - CLOSES[i - 1].y)), 0);

/**
 * Each structural pivot, resolved to the candle that actually carries it: the
 * local extreme within a few bars of the pivot's position. The dot then sits ON
 * the drawn line instead of near it.
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

/** A chip that is struck through as it leaves — "not this, and not this". */
const StruckChip = ({ label, x, y, f, inFrame, strikeFrame }: { label: string; x: number; y: number; f: number; inFrame: number; strikeFrame: number }) => {
  const pal = usePalette();
  if (f < inFrame) return null;
  const appear = progress(f, inFrame, 12);
  const strike = f >= strikeFrame ? progress(f, strikeFrame, 14) : 0;
  const leave = f >= strikeFrame + 20 ? fadeOut(f, strikeFrame + 20, 16) : 1;
  const w = label.length * 20 + 40;

  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", opacity: appear * leave }}>
      <div
        style={{
          padding: "8px 20px",
          borderRadius: theme.radius.chip,
          border: `${theme.stroke.hair}px solid ${pal.slate}`,
          color: pal.slate,
          fontFamily: theme.type.family,
          fontSize: theme.type.chip.size,
          fontWeight: theme.type.chip.weight,
          whiteSpace: "nowrap",
          position: "relative",
        }}
      >
        {label}
        <div
          style={{
            position: "absolute",
            left: 16,
            top: "50%",
            width: (w - 32) * strike,
            height: 2,
            background: pal.slate,
          }}
        />
      </div>
    </div>
  );
};

export const Scene03 = () => {
  const pal = usePalette();
  const f = useCurrentFrame();

  const candles = fadeOut(f, T.dissolve, 50);
  const draw = progress(f, T.dissolve, T.line + 60);

  return (
    <SafeArea>
      <ChartCard box={CARD}>
        {candles > 0.001 && (
          <CandlestickChart data={AMBIGUOUS_CANDLES} window={WIN} box={BOX} dimOpacity={candles} axesOpacity={1} ticks={4} />
        )}

        {/* the shape price leaves behind */}
        {draw > 0.001 && (
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
            <path
              d={LINE}
              fill="none"
              stroke={pal.ink}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={LINE_LEN}
              strokeDashoffset={LINE_LEN * (1 - draw)}
            />
          </svg>
        )}

        {/* peaks indigo, troughs cyan — the pairing holds for the whole episode */}
        {PIVOT_BARS.map((pv, i) => (
          <PivotMarker
            key={i}
            x={G.cx(pv.bar)}
            y={G.scale(AMBIGUOUS_CANDLES[pv.bar].c)}
            label={i === 1 ? "Puncak" : i === 0 ? "Lembah" : undefined}
            variant={pv.peak ? "indigo" : "cyan"}
            side={pv.peak ? "above" : "below"}
            startFrame={T.pivots + i * PIVOT_STEP}
          />
        ))}
      </ChartCard>

      <StruckChip label="Indikator" x={740} y={PLOT.y + 24} f={f} inFrame={T.notThis} strikeFrame={T.strike} />
      <StruckChip label="Berita" x={1080} y={PLOT.y + 24} f={f} inFrame={T.notThis + 26} strikeFrame={T.strike + 26} />

      {/* SC01's three questions, now anchored to real pivots */}
      <Chip label="Terus Naik?" x={QUESTION_X[0]} y={CAPTION_Y} variant="indigo" startFrame={T.q1} />
      <Chip label="Terus Turun?" x={QUESTION_X[1]} y={CAPTION_Y} variant="indigo" startFrame={T.q2} />
      <Chip label="Area Sama?" x={QUESTION_X[2]} y={CAPTION_Y} variant="cyan" startFrame={T.q3} />
    </SafeArea>
  );
};
