/**
 * Scene06 — from 2345, duration 808 frames (26.93s @30fps).
 * One continuous 46-candle chart (downtrend → sideways range) + MagnifierLens.
 * Two identical long-lower-wick candles: index 15 at the trough (Meaningful)
 * and index 33 mid-range (Less Significant). Lens glides between them, chip
 * cross-fades mid-glide; chart dims and the candle+location lesson types on.
 * Compliance: theme tokens only (no raw hex/sizes/easings); SafeArea margins
 * 96/96/54/108 respected; bottom 108px empty; top-150px content ends x ≤ 1368;
 * mulberry32(46) deterministic; fictional data — IllustrationTag + Ticker.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import {
  sec,
  fadeIn,
  fadeOut,
  progress,
  textReveal,
  priceScale,
  mulberry32,
} from "../helpers";
import type { OHLC } from "../helpers";
import { SafeArea } from "../components/SafeArea";
import { Candle } from "../components/Candle";
import { PricePanel, Ticker } from "../components/PricePanel";
import { Chip } from "../components/Chip";
import { MagnifierLens } from "../components/MagnifierLens";
import { IllustrationTag } from "../components/IllustrationTag";

// ═══ EDIT ═══
const CHART_X = 96; // chart drawing area (Rp axis extends panel to x 1632)
const CHART_W = 1412;
const CHART_TOP = 200;
const CHART_BOTTOM = 760;
const LENS_W = 320;
const LENS_H = 300;
const MAG = 1.35;
const CHIP_GAP = 70; // chip top edge above the lens top edge
const LINE1_Y = 392; // display line top (center ≈ y 440)
const LINE2_Y = 556; // secondary line top (center ≈ y 580)
const TICKER_X = 130;
const TICKER_Y = 140;
const T = {
  chartIn: 0.0, // chart fades in fully formed
  lensIn: 2.6, // lens at Anchor 1 (index 15) + "Meaningful" chip
  glide: 8.5, // lens glides Anchor 1 → Anchor 2 over 1.6s
  glideDur: 1.6,
  chipSwap: 9.3, // chip cross-fades mid-glide
  lensOut: 22.0, // lens fades out; chart dims to 20%
  line1: 22.8, // "Candle + location = the full read."
  line2: 24.2, // "Candle alone = half."
};
// ═══════════

/** 46 candles: 0–15 downtrend 1520→~1198 (trough index 15 fixed), 16–45
 *  sideways 1240–1330 (index 33 fixed). All non-fixed lower wicks ≤ 18 so the
 *  two long-lower-wick candles stand out. Deterministic via mulberry32(46). */
const buildSeries = (): OHLC[] => {
  const rand = mulberry32(46);
  const out: OHLC[] = [];
  // 0–14 downtrend: bodies drawn 14–40, rescaled to land near 1198.
  const bodies = Array.from({ length: 15 }, () => 14 + rand() * 26);
  const k = 322 / bodies.reduce((a, b) => a + b, 0);
  let open = 1520;
  for (let i = 0; i < 15; i++) {
    const body = Math.min(40, Math.max(14, bodies[i] * k));
    const close = open - body;
    const high = open + rand() * 10;
    const low = close - (3 + rand() * 12); // lower wick ≤ 15
    out.push({ open, high, low, close });
    open = close;
  }
  // 15 — trough candle, FIXED long lower wick.
  out.push({ open: 1198, high: 1206, low: 1122, close: 1204 });
  // 16–45 sideways range 1240–1330; index 33 FIXED (same shape, shifted up).
  let prev = 1204;
  for (let i = 16; i < 46; i++) {
    if (i === 33) {
      out.push({ open: 1268, high: 1276, low: 1192, close: 1274 });
      prev = 1274;
      continue;
    }
    const o = prev;
    const c = i === 16 ? 1244 + rand() * 24 : 1246 + rand() * 78;
    const hi = Math.max(o, c) + rand() * 8;
    const lo = Math.min(o, c) - (4 + rand() * 12); // lower wick ≤ 16
    out.push({ open: o, high: hi, low: lo, close: c });
    prev = c;
  }
  return out;
};

const SERIES = buildSeries();
const MIN_P = Math.min(...SERIES.map((d) => d.low));
const MAX_P = Math.max(...SERIES.map((d) => d.high));
const scale = priceScale(MIN_P, MAX_P, CHART_TOP, CHART_BOTTOM);
const SLOT = CHART_W / SERIES.length;
const BODY_W = Math.min(34, SLOT * 0.56);
const cx = (i: number) => CHART_X + SLOT * (i + 0.5);

// Lens anchors — centered on each fixed candle's high/low midpoint.
const anchor = (i: number) => ({
  x: cx(i),
  y: scale((SERIES[i].high + SERIES[i].low) / 2),
});
const A1 = anchor(15);
const A2 = anchor(33);

/** Chart + candles JSX — rendered once in the scene and once inside the lens. */
const ChartLayer = ({ opacity = 1 }: { opacity?: number }) => (
  <div style={{ position: "absolute", left: 0, top: 0, opacity }}>
    <PricePanel
      x={CHART_X}
      y={CHART_TOP}
      width={CHART_W}
      height={CHART_BOTTOM - CHART_TOP}
      min={MIN_P}
      max={MAX_P}
      scale={scale}
      ticks={4}
    />
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      width={theme.canvas.width}
      height={theme.canvas.height}
    >
      {SERIES.map((d, i) => (
        <Candle
          key={i}
          x={cx(i)}
          width={BODY_W}
          open={d.open}
          high={d.high}
          low={d.low}
          close={d.close}
          scale={scale}
        />
      ))}
    </svg>
  </div>
);

export const Scene06 = () => {
  const f = useCurrentFrame();

  const chartOp =
    fadeIn(f, sec(T.chartIn)) * (1 - 0.8 * progress(f, sec(T.lensOut), 14));

  const g = progress(f, sec(T.glide), sec(T.glideDur));
  const lensCX = A1.x + (A2.x - A1.x) * g;
  const lensCY = A1.y + (A2.y - A1.y) * g;
  const lensOp = fadeIn(f, sec(T.lensIn)) * fadeOut(f, sec(T.lensOut), 14);
  const lensVisible = f >= sec(T.lensIn) && f <= sec(T.lensOut) + 16;
  const chipY = lensCY - LENS_H / 2 - CHIP_GAP;

  const l1 = textReveal(f, sec(T.line1));
  const l2 = textReveal(f, sec(T.line2));

  return (
    <SafeArea>
      <ChartLayer opacity={chartOp} />

      {lensVisible && (
        <MagnifierLens
          centerX={lensCX}
          centerY={lensCY}
          width={LENS_W}
          height={LENS_H}
          scale={MAG}
          focusX={lensCX}
          focusY={lensCY}
          opacity={lensOp}
        >
          <ChartLayer />
        </MagnifierLens>
      )}

      {/* chip attached to the lens top edge — cross-fades mid-glide */}
      <Chip
        label="Meaningful"
        x={lensCX}
        y={chipY}
        variant="indigo"
        startFrame={sec(T.lensIn)}
        opacity={fadeOut(f, sec(T.chipSwap))}
      />
      <Chip
        label="Less Significant"
        x={lensCX}
        y={chipY}
        variant="muted"
        startFrame={sec(T.chipSwap)}
        opacity={fadeOut(f, sec(T.lensOut), 14)}
      />

      {/* lesson type */}
      {f >= sec(T.line1) && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: LINE1_Y,
            width: theme.canvas.width,
            textAlign: "center",
            fontSize: theme.type.display.size,
            fontWeight: theme.type.display.weight,
            color: theme.colors.ink,
            opacity: l1.opacity,
            transform: `translateY(${l1.y}px)`,
          }}
        >
          Candle + location = the full read.
        </div>
      )}
      {f >= sec(T.line2) && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: LINE2_Y,
            width: theme.canvas.width,
            textAlign: "center",
            fontSize: theme.type.header.size,
            fontWeight: theme.type.label.weight,
            color: theme.colors.slate,
            opacity: l2.opacity,
            transform: `translateY(${l2.y}px)`,
          }}
        >
          Candle alone = half.
        </div>
      )}

      <Ticker x={TICKER_X} y={TICKER_Y} />
      <IllustrationTag />
    </SafeArea>
  );
};
