/**
 * Scene07 — from 3153, duration 504 frames (16.8s).
 * Support built from two touches; third signal = wick rejection.
 * Contents: 24-candle chart (PricePanel + Ticker), TallyStrip (3 slots),
 * Pings 1/2 on the two 1215 lows, ReferenceLine constructed between the
 * touches then extended right, "Support" chip, final candle (index 23)
 * building live with a long lower wick to the line, Ping 3, caption.
 * Compliance: theme-only colors/type/easing, textReveal for type, pop on
 * chips/pings only, mulberry32 determinism, safe area 96/96/54/108 respected,
 * bottom 108px empty, TallyStrip ends at x 1360 ≤ 1368, IllustrationTag mounted.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import {
  sec,
  fadeIn,
  progress,
  textReveal,
  mulberry32,
  priceScale,
  type OHLC,
} from "../helpers";
import { SafeArea } from "../components/SafeArea";
import { Candle } from "../components/Candle";
import { PricePanel, Ticker } from "../components/PricePanel";
import { ReferenceLine } from "../components/ReferenceLine";
import { TallyStrip } from "../components/TallyStrip";
import { Ping } from "../components/Ping";
import { Chip } from "../components/Chip";
import { IllustrationTag } from "../components/IllustrationTag";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
// Layout (px, absolute canvas coords)
const CHART_X0 = 96; // chart left edge
const CHART_X1 = 1632; // chart right edge
const CHART_TOP = 260; // chart top y
const CHART_BOTTOM = 760; // chart bottom y
const N_CANDLES = 24;
const CANDLE_W = 36; // candle body width
const TALLY_XEND = 1360; // right edge of the TallyStrip (≤ 1368 logo rule)
const TALLY_Y = 190; // TallyStrip top
const TICKER_X = 130; // "$ABCD" ticker
const TICKER_Y = 196;
const CHIP_X = 110; // "Support" chip, left-anchored at line's left end
const CHIP_GAP = 18; // chip top offset below the support line
const CAPTION_Y = 840; // caption top (clear of subtitle zone at 972+)
// Price domain
const PRICE_MIN = 1215;
const PRICE_MAX = 1340;
const SUPPORT_PRICE = 1215;
// Timings (seconds, scene-local)
const T = {
  panelIn: 0.0, // chart panel fades in
  wipeStart: 0.5, // candles 0–22 wipe in
  wipeStagger: 0.05, // per-candle stagger
  wipeBodyDur: 0.3, // each body build
  wipeWickDur: 0.25, // each wick extension (starts mid-body)
  ping1: 2.0, // Ping "1" at index 4 low → slot 1 fills
  ping2: 3.0, // Ping "2" at index 13 low → slot 2 fills
  construct: 3.8, // line constructs xa→xb
  constructDur: 0.7,
  extend: 4.5, // line extends xb→chart edge
  extendDur: 0.6,
  chip: 4.6, // "Support" chip pops
  finalBody: 5.6, // index 23 body builds
  finalBodyDur: 0.5,
  finalWick: 6.1, // index 23 lower wick descends to the line
  finalWickDur: 0.5,
  ping3: 6.6, // Ping "3" at index 23 low → slot 3 fills
  caption: 11.5, // "Three signals, one direction."
};
// ═══════════════════════════════════════════════════════════════════════════

const PITCH = (CHART_X1 - CHART_X0) / N_CANDLES; // 64
const cx = (i: number) => CHART_X0 + PITCH * i + PITCH / 2;

/** Deterministic 24-candle ranging series with spec constraints applied. */
const buildSeries = (): OHLC[] => {
  const rnd = mulberry32(24);
  const out: OHLC[] = [];
  let prevClose = 1280;
  for (let i = 0; i < N_CANDLES; i++) {
    const open = prevClose;
    const close = Math.min(1335, Math.max(1228, open + (rnd() - 0.5) * 44));
    const high = Math.min(PRICE_MAX, Math.max(open, close) + rnd() * 14);
    const low = Math.max(PRICE_MIN, Math.min(open, close) - rnd() * 14);
    out.push({ open, high, low, close });
    prevClose = close;
  }
  // Constraint: touch lows at index 4 and 13 hit the support level exactly.
  out[4] = { ...out[4], low: 1215 };
  out[13] = { ...out[13], low: 1215 };
  // Constraint: indices 14–22 stay above 1240 (lows ≥ 1240).
  for (let i = 14; i <= 22; i++) {
    const c = out[i];
    const open = Math.max(c.open, 1246);
    const close = Math.max(c.close, 1246);
    out[i] = {
      open,
      close,
      high: Math.max(c.high, open, close),
      low: Math.max(1240, Math.min(c.low, open, close)),
    };
  }
  // Constraint: final candle fixed — long lower wick down to the line.
  out[23] = { open: 1272, high: 1281, low: 1213, close: 1268 };
  return out;
};

const SERIES = buildSeries();

export const Scene07 = () => {
  const f = useCurrentFrame();
  const scale = priceScale(PRICE_MIN, PRICE_MAX, CHART_TOP, CHART_BOTTOM);
  const lineY = scale(SUPPORT_PRICE);

  const panelOpacity = fadeIn(f, sec(T.panelIn));
  const constructQ = progress(f, sec(T.construct), sec(T.constructDur));
  const extendQ = f >= sec(T.extend) ? progress(f, sec(T.extend), sec(T.extendDur)) : 0;
  const caption = textReveal(f, sec(T.caption));

  return (
    <SafeArea>
      <PricePanel
        x={CHART_X0}
        y={CHART_TOP}
        width={CHART_X1 - CHART_X0}
        height={CHART_BOTTOM - CHART_TOP}
        min={PRICE_MIN}
        max={PRICE_MAX}
        scale={scale}
        opacity={panelOpacity}
      />
      <Ticker x={TICKER_X} y={TICKER_Y} />

      {/* Support line: constructed between the two touches, then extended right. */}
      {f >= sec(T.construct) && (
        <ReferenceLine
          y={lineY}
          x1={CHART_X0}
          x2={CHART_X1}
          constructFrom={{ xa: cx(4), xb: cx(13) }}
          constructProgress={constructQ}
          extendProgress={extendQ}
        />
      )}

      {/* Candles — own full-canvas svg over the panel. */}
      <svg
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
        width={theme.canvas.width}
        height={theme.canvas.height}
      >
        {SERIES.slice(0, 23).map((c, i) => {
          const start = sec(T.wipeStart + i * T.wipeStagger);
          if (f < start) return null;
          return (
            <Candle
              key={i}
              x={cx(i)}
              width={CANDLE_W}
              open={c.open}
              high={c.high}
              low={c.low}
              close={c.close}
              scale={scale}
              buildProgress={progress(f, start, sec(T.wipeBodyDur))}
              wickProgress={progress(f, start + Math.round(sec(T.wipeBodyDur) / 2), sec(T.wipeWickDur))}
            />
          );
        })}
        {/* Index 23 — NOT part of the wipe; body first, then the long lower wick. */}
        {f >= sec(T.finalBody) && (
          <Candle
            x={cx(23)}
            width={CANDLE_W}
            open={SERIES[23].open}
            high={SERIES[23].high}
            low={SERIES[23].low}
            close={SERIES[23].close}
            scale={scale}
            buildProgress={progress(f, sec(T.finalBody), sec(T.finalBodyDur))}
            wickProgress={progress(f, sec(T.finalWick), sec(T.finalWickDur))}
          />
        )}
      </svg>

      {/* Tally — right-aligned, ends at x 1360 (≤ 1368). */}
      <TallyStrip
        xEnd={TALLY_XEND}
        y={TALLY_Y}
        slots={[
          { label: "Touch 1", fillFrame: sec(T.ping1) },
          { label: "Touch 2", fillFrame: sec(T.ping2) },
          { label: "Wick Rejection", fillFrame: sec(T.ping3) },
        ]}
      />

      <Ping cx={cx(4)} cy={scale(SERIES[4].low)} startFrame={sec(T.ping1)} numberLabel="1" />
      <Ping cx={cx(13)} cy={scale(SERIES[13].low)} startFrame={sec(T.ping2)} numberLabel="2" />
      <Ping cx={cx(23)} cy={scale(SERIES[23].low)} startFrame={sec(T.ping3)} numberLabel="3" />

      <Chip label="Support" x={CHIP_X} y={lineY + CHIP_GAP} anchor="left" startFrame={sec(T.chip)} />

      {/* Caption — sentence case, 40px, centered. */}
      <div
        style={{
          position: "absolute",
          left: theme.layout.safeLeft,
          width: theme.layout.activeWidth,
          top: CAPTION_Y,
          textAlign: "center",
          fontSize: theme.type.body.size,
          fontWeight: theme.type.body.weight,
          color: theme.colors.ink,
          opacity: caption.opacity,
          transform: `translateY(${caption.y}px)`,
        }}
      >
        Three signals, one direction.
      </div>

      <IllustrationTag />
    </SafeArea>
  );
};
