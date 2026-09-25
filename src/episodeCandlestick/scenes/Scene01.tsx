/**
 * Scene01 — from 0, duration 240 frames.
 * Full 40-candle daily chart fades in fully formed; a FocusFrame isolates one
 * session (index 22) with the chip "One Session", then eases out to enclose the
 * 18–25 sequence while the dim releases and the chip cross-fades to
 * "The Sequence".
 * Compliance: fictional $ABCD, illustrative data only — no arrows, entry
 * markers, or price targets.
 */
import { useContext } from "react";
import {
  Freeze,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from "remotion";
import { theme } from "../theme";
import {
  sec,
  fadeIn,
  fadeOut,
  progress,
  mulberry32,
  priceScale,
  type OHLC,
} from "../helpers";
import { SafeArea } from "../components/SafeArea";
import { Candle } from "../components/Candle";
import { PricePanel, Ticker } from "../components/PricePanel";
import { FocusFrame } from "../components/FocusFrame";
import { Chip } from "../components/Chip";
import { IllustrationTag } from "../components/IllustrationTag";
import { Cut, IndoClock } from "../cut";

// ═══ EDIT ═══
const CHART_LEFT = 150; // chart box, px (whole group shifted +20px right)
const CHART_RIGHT = 1650;
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
    const mid =
      DRIFT_LO +
      ((DRIFT_HI - DRIFT_LO) * i) / (N_CANDLES - 1) +
      (rng() - 0.5) * 40;
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

/** The English cut's SC01, exactly as it was. */
const Scene01Classic = () => {
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
      <div
        style={{ position: "absolute", left: 0, top: 0, opacity: chartOpacity }}
      >
        <PricePanel
          x={CHART_LEFT}
          y={CHART_TOP}
          width={CHART_RIGHT - CHART_LEFT}
          height={CHART_BOTTOM - CHART_TOP}
          min={P_MIN}
          max={P_MAX}
          scale={yOf}
        />
        <Ticker x={CHART_LEFT} y={TICKER_Y} />
        <svg
          style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
          width={theme.canvas.width}
          height={theme.canvas.height}
        >
          {SERIES.map((c, i) => (
            <Candle
              key={i}
              x={cx(i)}
              width={CANDLE_W}
              open={c.open}
              high={c.high}
              low={c.low}
              close={c.close}
              scale={yOf}
            />
          ))}
        </svg>
      </div>

      {f >= sec(T.focus) && (
        <FocusFrame
          rect={rect}
          dimOpacity={0.15}
          dimStrength={dimStrength}
          strokeOpacity={strokeOpacity}
        />
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
        x={RECT_B.x}
        y={RECT_B.y - CHIP_RISE}
        anchor="left"
        startFrame={sec(T.move)}
      />
    </SafeArea>
  );
};

/**
 * ═══ SC01 IN THE INDONESIAN CUT: TA07's BROKER PANEL ═══
 *
 * Simon: "Ubah tampilan candlestick chart yang di awal jadi seperti di
 * TA07-MAdanBB frame 0". Same candles, same beats (the "One Session" frame,
 * the move to "The Sequence") — drawn in TA07's opening panel: header with the
 * ticker, the price and the day's change, the timeframe pills, the chart on a
 * wash, the price column on the left, the dashed last-price line with its pill,
 * and the month row. Geometry and values are TA07's (theme.appPanel).
 *
 * ⚠ NO "Ilustrasi" CHIP, though TA07 has one: that word never goes on screen
 * (Simon's standing rule; 019 keeps its literal only as a frozen migration).
 * ⚠ NO COMPANY NAME: $ABCD is fictional, and a name for it would be invented.
 *
 * ═══ AND IT GOES ON UNDER THE FIRST PASSAGE ═══ (output frames of the cut)
 *
 *    92  "background abu abu nya fade out, lalu 'One Session' juga hilangkan
 *        fade out." The dim leaves, then the chip.
 *   170  "Kotak highlightnya membesar di 170." One Session's frame opens out
 *        to the Sequence, and "The Sequence" pops.
 *   284  "Previewnya membesar ke bagian yang di-highlight 'Sequence'." The
 *        chart zooms into the Sequence box — one factor on both axes ("jangan
 *        stretch"), re-laid out every frame — and "The Sequence" fades as it
 *        does ("Saat 285 membesar, 'The Sequence' fade out"). Then every candle
 *        but the 5th in the box goes hollow: 50%, no fill, a grey border dashed
 *        in 20px lengths ("no fill, bordernya garis putus putus, panjang
 *        garisnya 20 px").
 *   450  "Candlenya satu per satu kembali ke style sebelumnya, tapi yang di
 *        dalam kotak sequence ini aja." Left to right, one at a time.
 *   538  the roadmap folds whatever this is showing.
 *
 * ⚠ EVERY BEAT OF THIS SCENE RUNS ON THE CUT'S OUTPUT FRAME. The cut re-times
 * SC01 (holds on still frames, then SC01's frame 227 held under the passage),
 * so Simon's frame numbers are output frames; `Scene01` freezes this whole
 * component at the output frame (IndoClock), which makes useCurrentFrame()
 * inside it — the FocusFrame's, the chips' — read those numbers directly.
 */
const PANEL = { x: 96, y: 150, w: 1728, h: 750 };
const PLOT = {
  x: PANEL.x + 150,
  y: PANEL.y + 200,
  w: PANEL.w - 150 - 56,
  h: 490,
};
const HEAD = { x: 40, avatar: 52, gap: 16 };
const AXIS_CX = PANEL.x + 84;
const FRAMES = ["5m", "15m", "1H", "1D", "1W"];
const MONTHS = ["Jul", "Agu", "Sep"];
/** The hundreds always; the fifties join them as the zoom opens the scale up. */
const LEVELS = [1200, 1250, 1300, 1350, 1400];

// ═══ EDIT — every beat, in the cut's OUTPUT frames ═══
const BEAT = {
  chartIn: 0,
  focus: 36, // the One Session frame draws and the rest dims (where it always fell)
  chipA: 42, // "One Session"
  dimOut: 92, // "92 background abu abu nya fade out"
  dimOutDur: 12,
  chipAOut: 104, // "lalu 'One Session' juga hilangkan fade out"
  chipAOutDur: 10,
  grow: 170, // "Kotak highlightnya membesar di 170"
  growDur: 27,
  seqOut: 285, // "Saat 285 membesar, 'The Sequence' fade out"
  seqOutDur: 10,
};
const ZOOM = { at: 284, dur: 40 };
const HOLLOW = {
  at: ZOOM.at + ZOOM.dur + 4,
  dur: 12,
  opacity: 0.5,
  border: 2.5,
  /** "panjang garisnya 20 px" — and a gap half that. */
  dash: "20 10",
};
const RESTORE = { at: 450, step: 8, dur: 10 };
/** "buat candle ke-1, ke-5, ke-8 jadi merah" — in the Sequence box. */
const RED_IN_BOX = [1, 5, 8];
/** The one candle that never goes hollow: the 5th in the box. */
const KEEP_IN_BOX = 5;
/**
 * Where the Sequence box may sit once zoomed, in canvas px: below the room its
 * chip needs over the wash, above the month row. The zoom is as large as fits.
 */
const ZOOM_BOX = { top: 420, bottom: 840 };
// ═══════════════════════════════════════════════════════════════════════════

const BOX = Array.from(
  { length: SEQ_LAST - SEQ_FIRST + 1 },
  (_, k) => SEQ_FIRST + k,
);
const KEEP = BOX[KEEP_IN_BOX - 1];
/** This cut's candles: the three in the box turned red — same range, open and close swapped. */
const APP_SERIES: OHLC[] = SERIES.map((c, i) =>
  RED_IN_BOX.some((n) => BOX[n - 1] === i) && c.close > c.open
    ? { ...c, open: c.close, close: c.open }
    : c,
);

/** Indonesian grouping, as the panel it copies: 1.441, +3,18%. */
const idNum = (n: number) => Math.round(n).toLocaleString("de-DE");
const LAST = APP_SERIES[N_CANDLES - 1].close;
const PREV = APP_SERIES[N_CANDLES - 2].close;
const CHANGE = ((LAST - PREV) / PREV) * 100;
const CHANGE_TXT = `${CHANGE >= 0 ? "+" : "−"}${Math.abs(CHANGE).toFixed(2).replace(".", ",")}%`;

/**
 * THE MAPPING, AS A FUNCTION OF THE ZOOM. At z = 0 it is the panel as first
 * drawn (all 40 candles, the full range with 6% air).
 *
 * ⚠ ONE FACTOR FOR BOTH AXES — Simon: "Membesarnya jangan stretch". The first
 * version narrowed the candle window and the price range separately (3.4x
 * across, 1.8x up) and every candle came out wide and squat. Now px-per-candle
 * and px-per-rupiah grow by the SAME factor, so each candle keeps its shape:
 * the zoom is a camera moving in, re-laid out every frame, never a CSS scale.
 * The factor is the largest at which the box fits ZOOM_BOX (and 90% of the
 * plot's width), and it grows geometrically, so the move closes at an even
 * rate; the box's centre travels in step with it to the middle of that room.
 */
const PAD = (P_MAX - P_MIN) * 0.06;
const HI0 = P_MAX + PAD;
const PX_PRICE0 = PLOT.h / (P_MAX - P_MIN + 2 * PAD);
const STEP0 = (PLOT.w - 28) / (N_CANDLES - 1);
const X0 = (i: number) => PLOT.x + 14 + STEP0 * i;
const Y0 = (p: number) => PLOT.y + (HI0 - p) * PX_PRICE0;
/** The box's own centre, in candles and in rupiah (its padding is symmetric). */
const FOCUS = { i: (SEQ_FIRST + SEQ_LAST) / 2, p: (seqHigh + seqLow) / 2 };
const ZOOM_MAX = Math.min(
  (ZOOM_BOX.bottom - ZOOM_BOX.top - FOCUS_PAD_Y * 2) /
    ((seqHigh - seqLow) * PX_PRICE0),
  (PLOT.w * 0.9) / (STEP0 * (SEQ_LAST - SEQ_FIRST + 1)),
);
const FROM = { x: X0(FOCUS.i), y: Y0(FOCUS.p) };
const TO = { x: PLOT.x + PLOT.w / 2, y: (ZOOM_BOX.top + ZOOM_BOX.bottom) / 2 };
const mapAt = (z: number) => {
  const s = Math.pow(ZOOM_MAX, z);
  /** How far the camera has closed, in the zoom's own terms (0 → 1). */
  const q = (1 - 1 / s) / (1 - 1 / ZOOM_MAX);
  const cx = lerp(FROM.x, TO.x, q);
  const cy = lerp(FROM.y, TO.y, q);
  const step = STEP0 * s;
  const X = (i: number) => cx + (i - FOCUS.i) * step;
  const Y = (p: number) => cy - (p - FOCUS.p) * PX_PRICE0 * s;
  return { X, Y, step, s, body: ((PLOT.w - 28) / N_CANDLES) * 0.6 * s };
};

/** Fades a label out as it nears the plot's edge rather than cutting it. */
const inside = (v: number, lo: number, hi: number, feather = 24) =>
  Math.max(0, Math.min(1, (v - lo) / feather, (hi - v) / feather));

const Scene01App = () => {
  /** The cut's OUTPUT frame: `Scene01` freezes this component at it. */
  const f = useCurrentFrame();
  const A = theme.appPanel;
  const font = theme.type.family;
  const ease = (a: number, d: number) =>
    interpolate(f, [a, a + d], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: theme.motion.easy,
    });

  const z = ease(ZOOM.at, ZOOM.dur);
  const { X, Y, step, body, s } = mapAt(z);
  const hollow = ease(HOLLOW.at, HOLLOW.dur);
  const restoreOrder = BOX.filter((i) => i !== KEEP);
  const hollowOf = (i: number) => {
    if (i === KEEP) return 0;
    const k = restoreOrder.indexOf(i);
    const back = k < 0 ? 0 : ease(RESTORE.at + k * RESTORE.step, RESTORE.dur);
    return hollow * (1 - back);
  };

  const rectA = {
    x: X(FOCUS_IDX) - FOCUS_W_SINGLE / 2,
    y: Y(focusCandle.high) - FOCUS_PAD_Y,
    w: FOCUS_W_SINGLE,
    h: Y(focusCandle.low) - Y(focusCandle.high) + FOCUS_PAD_Y * 2,
  };
  const rectB = {
    x: X(SEQ_FIRST) - step / 2,
    y: Y(seqHigh) - FOCUS_PAD_Y,
    w: step * BOX.length,
    h: Y(seqLow) - Y(seqHigh) + FOCUS_PAD_Y * 2,
  };

  const chartOpacity = fadeIn(f, BEAT.chartIn, 12);
  const m = progress(f, BEAT.grow, BEAT.growDur);
  const rect = {
    x: lerp(rectA.x, rectB.x, m),
    y: lerp(rectA.y, rectB.y, m),
    w: lerp(rectA.w, rectB.w, m),
    h: lerp(rectA.h, rectB.h, m),
  };
  const dimStrength =
    progress(f, BEAT.focus, 12) * fadeOut(f, BEAT.dimOut, BEAT.dimOutDur);
  const strokeOpacity = fadeIn(f, BEAT.focus, 10);
  const up = LAST >= PREV;
  const lastY = Y(LAST);
  const lastIn = inside(lastY, PLOT.y, PLOT.y + PLOT.h);
  const wick = A.wick * s;

  return (
    <SafeArea>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: theme.canvas.width,
          height: theme.canvas.height,
          opacity: chartOpacity,
        }}
      >
        {/* ── the panel, and the chart's wash under its header ── */}
        <div
          style={{
            position: "absolute",
            left: PANEL.x,
            top: PANEL.y,
            width: PANEL.w,
            height: PANEL.h,
            borderRadius: A.radius.lg,
            background: A.surface,
            border: `${A.border1}px solid ${A.border}`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 168,
              width: PANEL.w,
              height: PANEL.h - 168,
              background: `linear-gradient(180deg, ${A.indigo12} 0%, ${A.cyan12} 46%, ${A.surface} 100%)`,
            }}
          />
          {/* header: avatar, ticker */}
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
                background: theme.colors.indigo,
                color: A.surface,
                fontFamily: font,
                fontSize: A.type.size,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              A
            </div>
            <span
              style={{
                fontFamily: font,
                fontSize: A.type.name,
                fontWeight: A.type.weight,
                color: A.text,
              }}
            >
              ABCD
            </span>
          </div>
          {/* the price and the day's change, left edge on the ticker */}
          <div
            style={{
              position: "absolute",
              left: HEAD.x + HEAD.avatar + HEAD.gap,
              top: 92,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <span
              style={{
                fontFamily: font,
                fontSize: A.type.price,
                fontWeight: 800,
                color: A.text,
                lineHeight: 1,
              }}
            >
              {idNum(LAST)}
            </span>
            <span
              style={{
                fontFamily: font,
                fontSize: A.type.size,
                fontWeight: A.type.weight,
                color: up ? A.up : A.down,
                background: up ? A.upTint : A.downTint,
                borderRadius: A.radius.sm,
                padding: "6px 16px",
              }}
            >
              {CHANGE_TXT}
            </span>
          </div>
          {/* timeframe pills — a daily chart, so 1D is live */}
          <div
            style={{
              position: "absolute",
              right: 40,
              top: 40,
              display: "flex",
              gap: 8,
            }}
          >
            {FRAMES.map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: font,
                  fontSize: A.type.size,
                  fontWeight: A.type.weight,
                  color: t === "1D" ? A.surface : A.textMuted,
                  background: t === "1D" ? theme.colors.indigo : A.indigo12,
                  borderRadius: A.radius.sm,
                  padding: "8px 20px",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── the chart ── */}
        <svg
          style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
          width={theme.canvas.width}
          height={theme.canvas.height}
        >
          <defs>
            {/* the plot: candles, gridlines and the last-price line stay inside it as the zoom opens */}
            <clipPath id="sc01-plot">
              <rect
                x={PLOT.x}
                y={PANEL.y + 168}
                width={PLOT.w}
                height={PLOT.y + PLOT.h + 8 - (PANEL.y + 168)}
              />
            </clipPath>
          </defs>
          {LEVELS.map((v) => {
            const y = Y(v);
            const o =
              (v % 100 === 0 ? 1 : z) * inside(y, PLOT.y, PLOT.y + PLOT.h);
            if (o <= 0.001) return null;
            return (
              <g key={v} opacity={o}>
                <line
                  x1={PLOT.x}
                  y1={y}
                  x2={PLOT.x + PLOT.w}
                  y2={y}
                  stroke={A.gridline}
                  strokeWidth={A.border1}
                  strokeDasharray="2 8"
                />
                <text
                  x={AXIS_CX}
                  y={y + 10}
                  textAnchor="middle"
                  fontFamily={font}
                  fontSize={A.type.size}
                  fontWeight={A.type.axis}
                  fill={A.textMuted}
                >
                  {idNum(v)}
                </text>
              </g>
            );
          })}
          <g clipPath="url(#sc01-plot)">
            {APP_SERIES.map((c, i) => {
              const x = X(i);
              if (x < PLOT.x - step || x > PLOT.x + PLOT.w + step) return null;
              const ink =
                c.close >= c.open
                  ? theme.colors.candleGreen
                  : theme.colors.candleRed;
              const h = hollowOf(i);
              const line =
                h > 0
                  ? interpolateColors(
                      h,
                      [0, 1],
                      [ink, theme.colors.neutralMuted],
                    )
                  : ink;
              const top = Math.min(Y(c.open), Y(c.close));
              const bodyH = Math.max(2, Math.abs(Y(c.close) - Y(c.open)));
              /* ⚠ THE WICK STOPS AT THE BODY. With no fill a wick drawn high to
                 low would run straight through the hollow candle; behind a
                 filled body the two halves look exactly like one line. */
              return (
                <g key={i} opacity={1 - (1 - HOLLOW.opacity) * h}>
                  <line
                    x1={x}
                    y1={Y(c.high)}
                    x2={x}
                    y2={top}
                    stroke={line}
                    strokeWidth={wick}
                  />
                  <line
                    x1={x}
                    y1={top + bodyH}
                    x2={x}
                    y2={Y(c.low)}
                    stroke={line}
                    strokeWidth={wick}
                  />
                  {/* the colour drains out as the dashed outline comes in */}
                  <rect
                    x={x - body / 2}
                    y={top}
                    width={body}
                    height={bodyH}
                    rx={2 * s}
                    fill={ink}
                    fillOpacity={1 - h}
                  />
                  {h > 0.001 && (
                    <rect
                      x={x - body / 2}
                      y={top}
                      width={body}
                      height={bodyH}
                      rx={2 * s}
                      fill="none"
                      stroke={theme.colors.neutralMuted}
                      strokeOpacity={h}
                      strokeWidth={HOLLOW.border}
                      strokeDasharray={HOLLOW.dash}
                    />
                  )}
                </g>
              );
            })}
            {/* the last-price line; its readout is the pill on the axis.
                ⚠ IT LEAVES WITH ITS PILL — the zoom lifts 1.441 above the plot,
                and the wash above the plot is still inside the clip. */}
            <line
              x1={PLOT.x}
              y1={lastY}
              x2={PLOT.x + PLOT.w}
              y2={lastY}
              opacity={lastIn}
              stroke={A.text}
              strokeWidth={A.border1}
              strokeDasharray="8 8"
            />
          </g>
          {MONTHS.map((t, i) => {
            const x = X((i * (N_CANDLES - 1)) / (MONTHS.length - 1));
            const o = inside(x, PLOT.x - 40, PLOT.x + PLOT.w + 40, 40);
            if (o <= 0.001) return null;
            return (
              <text
                key={t}
                x={x}
                y={PLOT.y + PLOT.h + 34}
                textAnchor="middle"
                fontFamily={font}
                fontSize={A.type.size}
                fontWeight={A.type.axis}
                fill={A.textMuted}
                opacity={o}
              >
                {t}
              </text>
            );
          })}
        </svg>
        {lastIn > 0.001 && (
          <div
            style={{
              position: "absolute",
              left: AXIS_CX,
              top: lastY - 22,
              transform: "translateX(-50%)",
              background: A.text,
              color: A.surface,
              fontFamily: font,
              fontSize: A.type.size,
              fontWeight: A.type.weight,
              borderRadius: A.radius.sm,
              padding: "6px 16px",
              opacity: lastIn,
            }}
          >
            {idNum(LAST)}
          </div>
        )}
      </div>

      {f >= sec(T.focus) && (
        <FocusFrame
          rect={rect}
          dimOpacity={0.15}
          dimStrength={dimStrength}
          strokeOpacity={strokeOpacity}
        />
      )}

      <IllustrationTag />

      <Chip
        label="One Session"
        x={rectA.x + rectA.w + CHIP_GAP_X}
        y={rectA.y - CHIP_RISE}
        anchor="left"
        startFrame={BEAT.chipA}
        opacity={fadeOut(f, BEAT.chipAOut, BEAT.chipAOutDur)}
      />
      <Chip
        label="The Sequence"
        x={rectB.x}
        y={rectB.y - CHIP_RISE}
        anchor="left"
        startFrame={BEAT.grow}
        opacity={fadeOut(f, BEAT.seqOut, BEAT.seqOutDur)}
      />
    </SafeArea>
  );
};

/**
 * SC01 — the English cut as it was; the Indonesian cut in TA07's panel, frozen
 * at the cut's OUTPUT frame so every beat inside reads Simon's numbers.
 * ⚠ Freeze inside SC01's own Sequence sets the frame its children see to
 * exactly `frame`, whatever the offsets around it.
 */
export const Scene01 = () => {
  const cut = useContext(Cut);
  const out = useContext(IndoClock);
  return cut === "indo" ? (
    <Freeze frame={out ?? 0}>
      <Scene01App />
    </Freeze>
  ) : (
    <Scene01Classic />
  );
};
