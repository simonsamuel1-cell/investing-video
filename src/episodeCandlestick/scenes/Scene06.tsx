/**
 * Scene06 — from 2345, duration 808 frames (26.93s @30fps).
 * One continuous 46-candle chart (centered) + MagnifierLens. Candles appear
 * one-by-one; a highlight box marks the trough candle (index 15) with a
 * "Reversal signal" label; then the magnifier studies index 15 ("That's
 * meaningful") vs the identical shape at index 33 ("Less significant"); chart
 * dims and the candle+location lesson types on.
 * Frame-locked beats (scene-local): centered chart · candles 0→69 (2414) ·
 * HL box 69→218 (2414–2563) · "Reversal signal" 120→218 (2465–2563) ·
 * lens part 1 285→519 (2630–2864) · part 2 520→658 (2865–3003).
 * Compliance: theme tokens only; SafeArea; bottom 108px empty; mulberry32(46);
 * fictional data — IllustrationTag mounted.
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
import { PricePanel } from "../components/PricePanel";
import { Chip } from "../components/Chip";
import { MagnifierLens } from "../components/MagnifierLens";
import { IllustrationTag } from "../components/IllustrationTag";

// ═══ EDIT ═══
const CHART_X = 189; // chart left — shifted so the chart + price labels center on the canvas
const CHART_W = 1412;
const CHART_TOP = 200;
const CHART_BOTTOM = 760;
const LENS_W = 320;
const LENS_H = 300;
const MAG = 1.35;
const CHIP_GAP = 70; // chip top edge above the lens top edge
const HL_IDX = 15; // the trough candle the highlight box marks
const HL_HALF_W = 22; // highlight box half-width — wraps the single trough candle only
const HL_PAD_Y = 22; // highlight box reach beyond the candle hi–lo span
const REV_LABEL_RISE = 46; // "Reversal signal" sits this far above the box top
const LINE1_Y = 392; // display line top (center ≈ y 440)
const LINE2_Y = 556; // secondary line top (center ≈ y 580)
const T = {
  chartIn: 0.0, // candles appear one-by-one
  candleStagger: 0.05, // ~1.5 frames apart → 46 candles land by ≈2.3s (frame 2414)
  hlBox: 2.3, // highlight box on the trough candle (frame 2414)
  revLabel: 4.0, // "Reversal signal" (frame 2465)
  hlEnd: 7.267, // HL box + label clear (frame 2563)
  lensIn: 9.5, // lens fades in at Anchor 1 (frame 2630) — part 1
  meaningful: 15.8, // "That's meaningful" (frame 2819)
  glide: 17.3, // lens glides Anchor 1 → Anchor 2 (frame 2864/2865)
  glideDur: 0.5,
  significant: 20.3, // "Less significant" (frame 2954)
  lensOut: 21.933, // lens fades out (frame 3003) — part 2 ends
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
  const bodies = Array.from({ length: 15 }, () => 14 + rand() * 26);
  const k = 322 / bodies.reduce((a, b) => a + b, 0);
  let open = 1520;
  for (let i = 0; i < 15; i++) {
    const body = Math.min(40, Math.max(14, bodies[i] * k));
    const close = open - body;
    const high = open + rand() * 10;
    const low = close - (3 + rand() * 12);
    out.push({ open, high, low, close });
    open = close;
  }
  out.push({ open: 1198, high: 1206, low: 1122, close: 1204 });
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
    const lo = Math.min(o, c) - (4 + rand() * 12);
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
const A1 = anchor(HL_IDX);
const A2 = anchor(33);

/**
 * Chart + candles JSX — rendered once in the scene and once inside the lens.
 * When `revealFrom` is set, candles fade in one-by-one from that frame.
 */
const ChartLayer = ({ opacity = 1, revealFrom }: { opacity?: number; revealFrom?: number }) => {
  const f = useCurrentFrame();
  return (
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
        {SERIES.map((d, i) => {
          const op = revealFrom === undefined ? 1 : fadeIn(f, revealFrom + i * sec(T.candleStagger), 6);
          if (op <= 0.001) return null;
          return (
            <g key={i} opacity={op}>
              <Candle x={cx(i)} width={BODY_W} open={d.open} high={d.high} low={d.low} close={d.close} scale={scale} />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

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

  // Highlight box on the trough candle (index 15)
  const hlBoxOp = fadeIn(f, sec(T.hlBox), 8) * fadeOut(f, sec(T.hlEnd), 8);
  const revLabel = textReveal(f, sec(T.revLabel));
  const revLabelOp = revLabel.opacity * fadeOut(f, sec(T.hlEnd), 8);
  const boxTop = scale(SERIES[HL_IDX].high) - HL_PAD_Y;
  const boxH = scale(SERIES[HL_IDX].low) - scale(SERIES[HL_IDX].high) + HL_PAD_Y * 2;

  const l1 = textReveal(f, sec(T.line1));
  const l2 = textReveal(f, sec(T.line2));

  return (
    <SafeArea>
      <ChartLayer opacity={chartOp} revealFrom={sec(T.chartIn)} />

      {/* highlight box on the trough candle + "Reversal signal" */}
      {hlBoxOp > 0.001 && (
        <svg
          style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
          width={theme.canvas.width}
          height={theme.canvas.height}
        >
          <rect
            x={cx(HL_IDX) - HL_HALF_W}
            y={boxTop}
            width={HL_HALF_W * 2}
            height={boxH}
            rx={theme.radius.chip}
            fill="none"
            stroke={theme.colors.indigo}
            strokeWidth={theme.stroke.standard}
            opacity={hlBoxOp}
          />
        </svg>
      )}
      {f >= sec(T.revLabel) && (
        <div
          style={{
            position: "absolute",
            left: cx(HL_IDX),
            top: boxTop - REV_LABEL_RISE,
            transform: `translate(-50%, -100%) translateY(${revLabel.y}px)`,
            fontSize: theme.type.label.size,
            fontWeight: theme.type.label.weight,
            color: theme.colors.indigo,
            whiteSpace: "nowrap",
            opacity: revLabelOp,
          }}
        >
          Reversal signal
        </div>
      )}

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

      {/* chips attached to the lens top edge — timed within each part */}
      <Chip
        label="That's meaningful"
        x={lensCX}
        y={chipY}
        variant="indigo"
        startFrame={sec(T.meaningful)}
        opacity={fadeOut(f, sec(T.glide))}
      />
      <Chip
        label="Less significant"
        x={lensCX}
        y={chipY}
        variant="muted"
        startFrame={sec(T.significant)}
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

      <IllustrationTag />
    </SafeArea>
  );
};
