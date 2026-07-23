/**
 * Scene01 — from 0, duration 240 frames.
 * Full 40-candle daily chart fades in fully formed; a FocusFrame isolates one
 * session (index 22) with the chip "One Session", then eases out to enclose the
 * 18–25 sequence while the dim releases and the chip cross-fades to
 * "The Sequence".
 * Compliance: fictional $ABCD, illustrative data only — no arrows, entry
 * markers, or price targets.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { sec, fadeIn, fadeOut, progress, mulberry32, priceScale, type OHLC } from "../helpers";
import { SafeArea } from "../components/SafeArea";
import { Candle } from "../components/Candle";
import { PricePanel, Ticker } from "../components/PricePanel";
import { FocusFrame } from "../components/FocusFrame";
import { Chip } from "../components/Chip";
import { IllustrationTag } from "../components/IllustrationTag";

// ═══ EDIT ═══
const CHART_LEFT = 130; // chart box, px
const CHART_RIGHT = 1630;
const CHART_TOP = 200;
const CHART_BOTTOM = 780;
const N_CANDLES = 40;
const CANDLE_W = 24;
const FOCUS_IDX = 22; // the isolated session
const SEQ_FIRST = 18; // sequence range (inclusive)
const SEQ_LAST = 25;
const FOCUS_W_SINGLE = 90; // Target A frame width
const FOCUS_PAD_Y = 30; // vertical padding above/below hi–lo span
const CHIP_GAP_X = 14; // chip left edge past the frame's right edge
const CHIP_RISE = 82; // chip top sits this far above the frame top
const TICKER_Y = 120; // matches Scene02/Scene03 ticker position
const T = {
  chartIn: 0.0, // chart fades in fully formed
  focus: 1.0, // FocusFrame draws at Target A, outside dims to 15%
  chipA: 1.2, // "One Session" pops
  move: 3.6, // frame eases to Target B, dim releases, chip cross-fades
  moveDur: 0.9,
  hold: 6.5, // hold to end
};
// ═══════════

const DRIFT_LO = 1180;
const DRIFT_HI = 1420;

const buildSeries = (): OHLC[] => {
  const rng = mulberry32(11);
  const list: OHLC[] = [];
  for (let i = 0; i < N_CANDLES; i++) {
    const mid = DRIFT_LO + ((DRIFT_HI - DRIFT_LO) * i) / (N_CANDLES - 1) + (rng() - 0.5) * 40;
    const body = 8 + rng() * 32; // 8–40
    const up = rng() > 0.45;
    const open = up ? mid - body / 2 : mid + body / 2;
    const close = up ? mid + body / 2 : mid - body / 2;
    const high = Math.max(open, close) + 4 + rng() * 26; // wick 4–30
    const low = Math.min(open, close) - (4 + rng() * 26);
    list.push({ open, high, low, close });
  }
  list[FOCUS_IDX] = { open: 1298, high: 1312, low: 1236, close: 1304 };
  return list;
};

const SERIES = buildSeries();
const P_MIN = Math.min(...SERIES.map((c) => c.low));
const P_MAX = Math.max(...SERIES.map((c) => c.high));
const STEP = (CHART_RIGHT - CHART_LEFT) / N_CANDLES;
const cx = (i: number) => CHART_LEFT + STEP * (i + 0.5);
const yOf = priceScale(P_MIN, P_MAX, CHART_TOP, CHART_BOTTOM);

// Target A — single candle (index 22)
const focusCandle = SERIES[FOCUS_IDX];
const RECT_A = {
  x: cx(FOCUS_IDX) - FOCUS_W_SINGLE / 2,
  y: yOf(focusCandle.high) - FOCUS_PAD_Y,
  w: FOCUS_W_SINGLE,
  h: yOf(focusCandle.low) - yOf(focusCandle.high) + FOCUS_PAD_Y * 2,
};

// Target B — the 18–25 sequence
const seq = SERIES.slice(SEQ_FIRST, SEQ_LAST + 1);
const seqHigh = Math.max(...seq.map((c) => c.high));
const seqLow = Math.min(...seq.map((c) => c.low));
const RECT_B = {
  x: CHART_LEFT + STEP * SEQ_FIRST,
  y: yOf(seqHigh) - FOCUS_PAD_Y,
  w: STEP * (SEQ_LAST - SEQ_FIRST + 1),
  h: yOf(seqLow) - yOf(seqHigh) + FOCUS_PAD_Y * 2,
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const Scene01 = () => {
  const f = useCurrentFrame();

  const chartOpacity = fadeIn(f, sec(T.chartIn), 12);

  // Frame A → B travel
  const m = progress(f, sec(T.move), sec(T.moveDur));
  const rect = {
    x: lerp(RECT_A.x, RECT_B.x, m),
    y: lerp(RECT_A.y, RECT_B.y, m),
    w: lerp(RECT_A.w, RECT_B.w, m),
    h: lerp(RECT_A.h, RECT_B.h, m),
  };

  // Dim on with the frame, released back to 100% during the move
  const dimStrength = progress(f, sec(T.focus), 12) * (1 - m);
  const strokeOpacity = fadeIn(f, sec(T.focus), 10);

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 0, top: 0, opacity: chartOpacity }}>
        <PricePanel
          x={CHART_LEFT}
          y={CHART_TOP}
          width={CHART_RIGHT - CHART_LEFT}
          height={CHART_BOTTOM - CHART_TOP}
          min={P_MIN}
          max={P_MAX}
          scale={yOf}
        />
        <Ticker x={130} y={TICKER_Y} />
        <svg
          style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
          width={theme.canvas.width}
          height={theme.canvas.height}
        >
          {SERIES.map((c, i) => (
            <Candle key={i} x={cx(i)} width={CANDLE_W} open={c.open} high={c.high} low={c.low} close={c.close} scale={yOf} />
          ))}
        </svg>
      </div>

      {f >= sec(T.focus) && (
        <FocusFrame rect={rect} dimOpacity={0.15} dimStrength={dimStrength} strokeOpacity={strokeOpacity} />
      )}

      <IllustrationTag />

      <Chip
        label="One Session"
        x={RECT_A.x + RECT_A.w + CHIP_GAP_X}
        y={RECT_A.y - CHIP_RISE}
        anchor="left"
        startFrame={sec(T.chipA)}
        opacity={fadeOut(f, sec(T.move), 10)}
      />
      <Chip
        label="The Sequence"
        x={RECT_B.x + RECT_B.w + CHIP_GAP_X}
        y={RECT_B.y - CHIP_RISE}
        anchor="left"
        startFrame={sec(T.move)}
      />
    </SafeArea>
  );
};
