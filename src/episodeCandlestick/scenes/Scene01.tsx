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
import { useCurrentFrame } from "remotion";
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
import { Cut } from "../cut";

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
const LEVELS = [1200, 1300, 1400];

const APP_X = (i: number) =>
  PLOT.x + 14 + ((PLOT.w - 28) * i) / (N_CANDLES - 1);
const APP_BODY = ((PLOT.w - 28) / N_CANDLES) * 0.6;
const appY = priceScale(P_MIN, P_MAX, PLOT.y, PLOT.y + PLOT.h);
/** Indonesian grouping, as the panel it copies: 1.441, +3,18%. */
const idNum = (n: number) => Math.round(n).toLocaleString("de-DE");
const LAST = SERIES[N_CANDLES - 1].close;
const PREV = SERIES[N_CANDLES - 2].close;
const CHANGE = ((LAST - PREV) / PREV) * 100;
const CHANGE_TXT = `${CHANGE >= 0 ? "+" : "−"}${Math.abs(CHANGE).toFixed(2).replace(".", ",")}%`;

const APP_A = {
  x: APP_X(FOCUS_IDX) - FOCUS_W_SINGLE / 2,
  y: appY(focusCandle.high) - FOCUS_PAD_Y,
  w: FOCUS_W_SINGLE,
  h: appY(focusCandle.low) - appY(focusCandle.high) + FOCUS_PAD_Y * 2,
};
const APP_STEP = (PLOT.w - 28) / (N_CANDLES - 1);
const APP_B = {
  x: APP_X(SEQ_FIRST) - APP_STEP / 2,
  y: appY(seqHigh) - FOCUS_PAD_Y,
  w: APP_STEP * (SEQ_LAST - SEQ_FIRST + 1),
  h: appY(seqLow) - appY(seqHigh) + FOCUS_PAD_Y * 2,
};

const Scene01App = () => {
  const f = useCurrentFrame();
  const A = theme.appPanel;
  const font = theme.type.family;

  const chartOpacity = fadeIn(f, sec(T.chartIn), 12);
  const m = progress(f, sec(T.move), sec(T.moveDur));
  const rect = {
    x: lerp(APP_A.x, APP_B.x, m),
    y: lerp(APP_A.y, APP_B.y, m),
    w: lerp(APP_A.w, APP_B.w, m),
    h: lerp(APP_A.h, APP_B.h, m),
  };
  const dimStrength = progress(f, sec(T.focus), 12) * (1 - m);
  const strokeOpacity = fadeIn(f, sec(T.focus), 10);
  const up = LAST >= PREV;

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
          {LEVELS.map((v) => (
            <g key={v}>
              <line
                x1={PLOT.x}
                y1={appY(v)}
                x2={PLOT.x + PLOT.w}
                y2={appY(v)}
                stroke={A.gridline}
                strokeWidth={A.border1}
                strokeDasharray="2 8"
              />
              <text
                x={AXIS_CX}
                y={appY(v) + 10}
                textAnchor="middle"
                fontFamily={font}
                fontSize={A.type.size}
                fontWeight={A.type.axis}
                fill={A.textMuted}
              >
                {idNum(v)}
              </text>
            </g>
          ))}
          {SERIES.map((c, i) => {
            const x = APP_X(i);
            const bull = c.close >= c.open;
            const ink = bull
              ? theme.colors.candleGreen
              : theme.colors.candleRed;
            const top = Math.min(appY(c.open), appY(c.close));
            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={appY(c.high)}
                  x2={x}
                  y2={appY(c.low)}
                  stroke={ink}
                  strokeWidth={A.wick}
                />
                <rect
                  x={x - APP_BODY / 2}
                  y={top}
                  width={APP_BODY}
                  height={Math.max(2, Math.abs(appY(c.close) - appY(c.open)))}
                  rx={2}
                  fill={ink}
                />
              </g>
            );
          })}
          {/* the last-price line; its readout is the pill on the axis */}
          <line
            x1={PLOT.x}
            y1={appY(LAST)}
            x2={PLOT.x + PLOT.w}
            y2={appY(LAST)}
            stroke={A.text}
            strokeWidth={A.border1}
            strokeDasharray="8 8"
          />
          {MONTHS.map((t, i) => (
            <text
              key={t}
              x={PLOT.x + 14 + ((PLOT.w - 28) * i) / (MONTHS.length - 1)}
              y={PLOT.y + PLOT.h + 34}
              textAnchor="middle"
              fontFamily={font}
              fontSize={A.type.size}
              fontWeight={A.type.axis}
              fill={A.textMuted}
            >
              {t}
            </text>
          ))}
        </svg>
        <div
          style={{
            position: "absolute",
            left: AXIS_CX,
            top: appY(LAST) - 22,
            transform: "translateX(-50%)",
            background: A.text,
            color: A.surface,
            fontFamily: font,
            fontSize: A.type.size,
            fontWeight: A.type.weight,
            borderRadius: A.radius.sm,
            padding: "6px 16px",
          }}
        >
          {idNum(LAST)}
        </div>
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
        x={APP_A.x + APP_A.w + CHIP_GAP_X}
        y={APP_A.y - CHIP_RISE}
        anchor="left"
        startFrame={sec(T.chipA)}
        opacity={fadeOut(f, sec(T.move), 10)}
      />
      <Chip
        label="The Sequence"
        x={APP_B.x}
        y={APP_B.y - CHIP_RISE}
        anchor="left"
        startFrame={sec(T.move)}
      />
    </SafeArea>
  );
};

/** SC01 — the English cut as it was; the Indonesian cut in TA07's panel. */
export const Scene01 = () =>
  useContext(Cut) === "indo" ? <Scene01App /> : <Scene01Classic />;
