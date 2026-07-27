/**
 * ClosingChart — continuity group, <Sequence from={8367} durationInFrames={629}>
 * (619 spec frames + 10 extended hold; all gates use >= so the last state holds).
 * ONE persistent 50-candle full-arc chart (down → Hammer → Bullish Engulfing →
 * recovery → Shooting Star → distribution → Bearish Engulfing → drift), with
 * three gated overlay windows in group-local frames:
 *   SC14 (0–344)   — wipe-in, Support/Resistance lines, four indigo rings with
 *                    numbered pings on the studied patterns;
 *   SC15 (344–540) — FocusFrame: Hammer alone ("Sentence") → six candles
 *                    ("Paragraph") → full chart ("Full Story");
 *   SC16 (540–629) — chart dims to 15%, "Learn to read." / "Not to recognize."
 *                    word by word + indigo rule.
 * The chart never remounts. Compliance: fictional $ABCD, illustrative data
 * only — no arrows, entry markers, or price targets.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { sec, fadeIn, fadeOut, progress, textReveal, mulberry32, priceScale, type OHLC } from "../helpers";
import { SafeArea } from "../components/SafeArea";
import { CandleSeries } from "../components/CandleSeries";
import { Ticker } from "../components/PricePanel";
import { ReferenceLine } from "../components/ReferenceLine";
import { FocusFrame } from "../components/FocusFrame";
import { Chip } from "../components/Chip";
import { IllustrationTag } from "../components/IllustrationTag";

// ═══ EDIT ═══
const CHART_LEFT = 150; // chart box, px (matches SC01 — group shifted +20px right)
const CHART_RIGHT = 1650;
const CHART_TOP = 200;
const CHART_BOTTOM = 780;
const N_CANDLES = 50;
const SUPPORT = 1200; // Rp levels
const RESISTANCE = 1610;
const TICKER_Y = 120; // matches SC01
const HAMMER_IDX = 14; // Hammer index — SC15 FocusFrame target
const PARA_FIRST = 12; // SC15 "Paragraph" candle range (inclusive)
const PARA_LAST = 17;
const FOCUS_W_SINGLE = 90; // "Sentence" frame width
const FOCUS_PAD_Y = 30;
const CHIP_X = 880; // fixed chip position (cross-fades in place)
const CHIP_Y = 196;
const LINE1_Y = 460; // SC16 line centers
const LINE2_Y = 590;
const WORD_GAP = 28;
const RULE_W = 560; // indigo rule beneath line 2
const RULE_Y = 676;
// Rebased for the two-window group (SC15 0–193, SC16 193–277). The old SC14
// window (candle-by-candle wipe + four pattern rings/pings) is CUT — the chart
// now renders fully formed and fades in over 0.3s at group start.
const T = {
  fadeIn: 0.0, // chart (+ support/resistance) fades in fully formed, 0.3s
  focus: 0.3, // FocusFrame on the Hammer
  chipA: 0.3, // "Sentence"
  toParagraph: 2.2, // frame widens to indices 12–17 → "Paragraph"
  paragraphDur: 0.7,
  toFull: 4.2, // frame expands to the panel → "Full Story"
  fullDur: 0.8,
  dimChart: 6.53, // SC16: chart to 15%, chip clears
  line1: 6.83, // "Learn to read." word by word
  line2: 7.83, // "Not to recognize."
  wordStagger: 0.25,
  rule: 8.63, // indigo rule draws
  ruleDur: 0.6,
};
// ═══════════

const buildSeries = (): OHLC[] => {
  const rng = mulberry32(20260722);
  const list: OHLC[] = [];
  const wick = () => 4 + rng() * 14;
  // 0–13 downtrend 1620 → 1210
  let prevClose = 1620;
  for (let i = 0; i < 14; i++) {
    const open = i === 0 ? 1620 : prevClose + (rng() - 0.5) * 10;
    const close = i === 13 ? 1210 : 1620 + ((1210 - 1620) * (i + 1)) / 14 + (rng() - 0.5) * 26;
    list.push({ open, high: Math.max(open, close) + wick(), low: Math.min(open, close) - wick(), close });
    prevClose = close;
  }
  // 14 Hammer
  list.push({ open: 1216, high: 1224, low: 1108, close: 1220 });
  // 15–16 basing, small bodies ~1210–1250
  for (let i = 0; i < 2; i++) {
    const mid = 1222 + rng() * 20;
    const body = 8 + rng() * 14;
    const up = rng() > 0.5;
    const open = up ? mid - body / 2 : mid + body / 2;
    const close = up ? mid + body / 2 : mid - body / 2;
    list.push({ open, high: Math.max(open, close) + 3 + rng() * 8, low: Math.min(open, close) - (3 + rng() * 8), close });
  }
  // 17–18 Bullish Engulfing pair
  list.push({ open: 1238, high: 1246, low: 1192, close: 1198 });
  list.push({ open: 1188, high: 1292, low: 1182, close: 1284 });
  // 19–36 recovery 1284 → 1580
  prevClose = 1284;
  for (let i = 0; i < 18; i++) {
    const open = prevClose + (rng() - 0.5) * 10;
    const close = i === 17 ? 1580 : 1284 + ((1580 - 1284) * (i + 1)) / 18 + (rng() - 0.5) * 26;
    list.push({ open, high: Math.max(open, close) + wick(), low: Math.min(open, close) - wick(), close });
    prevClose = close;
  }
  // 37 Shooting Star
  list.push({ open: 1582, high: 1668, low: 1576, close: 1590 });
  // 38–43 distribution oscillating 1540–1600
  for (let i = 0; i < 6; i++) {
    const mid = 1550 + rng() * 34;
    const body = 10 + rng() * 18;
    const up = rng() > 0.5;
    const open = up ? mid - body / 2 : mid + body / 2;
    const close = up ? mid + body / 2 : mid - body / 2;
    list.push({ open, high: Math.max(open, close) + 3 + rng() * 8, low: Math.min(open, close) - (3 + rng() * 8), close });
  }
  // 44–45 Bearish Engulfing pair
  list.push({ open: 1528, high: 1592, low: 1520, close: 1586 });
  list.push({ open: 1602, high: 1610, low: 1498, close: 1508 });
  // 46–49 drift down 1508 → 1440
  prevClose = 1508;
  for (let i = 0; i < 4; i++) {
    const open = prevClose + (rng() - 0.5) * 8;
    const close = 1508 + ((1440 - 1508) * (i + 1)) / 4 + (rng() - 0.5) * 16;
    list.push({ open, high: Math.max(open, close) + 3 + rng() * 10, low: Math.min(open, close) - (3 + rng() * 10), close });
    prevClose = close;
  }
  return list;
};

const SERIES = buildSeries();
const P_MIN = Math.min(...SERIES.map((c) => c.low));
const P_MAX = Math.max(...SERIES.map((c) => c.high));
const SLOT = (CHART_RIGHT - CHART_LEFT) / N_CANDLES;
const cxOf = (i: number) => CHART_LEFT + SLOT * (i + 0.5);
const yOf = priceScale(P_MIN, P_MAX, CHART_TOP, CHART_BOTTOM, 0.05); // matches CandleSeries pad

const spanRect = (i0: number, i1: number, padX: number, padY: number) => {
  const seg = SERIES.slice(i0, i1 + 1);
  const hi = Math.max(...seg.map((c) => c.high));
  const lo = Math.min(...seg.map((c) => c.low));
  return {
    x: CHART_LEFT + SLOT * i0 + padX,
    y: yOf(hi) - padY,
    w: SLOT * (i1 - i0 + 1) - padX * 2,
    h: yOf(lo) - yOf(hi) + padY * 2,
  };
};

// SC15 focus targets
const hammer = SERIES[HAMMER_IDX];
const RECT_A = {
  x: cxOf(HAMMER_IDX) - FOCUS_W_SINGLE / 2,
  y: yOf(hammer.high) - FOCUS_PAD_Y,
  w: FOCUS_W_SINGLE,
  h: yOf(hammer.low) - yOf(hammer.high) + FOCUS_PAD_Y * 2,
};
const RECT_B = spanRect(PARA_FIRST, PARA_LAST, 0, FOCUS_PAD_Y);
const RECT_FULL = {
  // the PricePanel chrome bounds — the stroke fades as it meets this edge
  x: CHART_LEFT - 24,
  y: CHART_TOP - 24,
  w: CHART_RIGHT - CHART_LEFT + 48,
  h: CHART_BOTTOM - CHART_TOP + 48,
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpRect = (a: typeof RECT_A, b: typeof RECT_A, t: number) => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
});

const WordLine = ({ text, y, start }: { text: string; y: number; start: number }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: y,
        width: theme.canvas.width,
        display: "flex",
        justifyContent: "center",
        gap: WORD_GAP,
        transform: "translateY(-50%)",
      }}
    >
      {text.split(" ").map((w, i) => {
        const r = textReveal(f, start + sec(T.wordStagger) * i);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontSize: theme.type.display.size,
              fontWeight: theme.type.display.weight,
              opacity: r.opacity,
              transform: `translateY(${r.y}px)`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const ClosingChart = () => {
  const f = useCurrentFrame();

  // SC15 focus travel: A (Hammer) → B (12–17) → full panel
  const m1 = progress(f, sec(T.toParagraph), sec(T.paragraphDur));
  const m2 = progress(f, sec(T.toFull), sec(T.fullDur));
  const rect = lerpRect(lerpRect(RECT_A, RECT_B, m1), RECT_FULL, m2);
  const dimStrength = progress(f, sec(T.focus), 12) * (1 - m2);
  const strokeOpacity = fadeIn(f, sec(T.focus), 10) * (1 - m2);

  const chartOp = fadeIn(f, sec(T.fadeIn), sec(0.3)) * (1 - 0.85 * progress(f, sec(T.dimChart), 10)); // fully formed → SC16 15%

  return (
    <SafeArea>
      {/* The one chart — never remounts. */}
      <div style={{ position: "absolute", left: 0, top: 0, opacity: chartOp }}>
        <CandleSeries
          data={SERIES}
          x={CHART_LEFT}
          y={CHART_TOP}
          width={CHART_RIGHT - CHART_LEFT}
          height={CHART_BOTTOM - CHART_TOP}
          scaleOverride={yOf}
        />
        <Ticker x={CHART_LEFT} y={TICKER_Y} />
        <ReferenceLine y={yOf(SUPPORT)} x1={CHART_LEFT} x2={CHART_RIGHT} label="Support" anchor="left" drawProgress={1} labelOpacity={1} />
        <ReferenceLine y={yOf(RESISTANCE)} x1={CHART_LEFT} x2={CHART_RIGHT} label="Resistance" anchor="left" labelPosition="above" drawProgress={1} labelOpacity={1} />
      </div>

      {/* SC15 — the FocusFrame. */}
      {f >= sec(T.focus) && (
        <FocusFrame rect={rect} dimOpacity={0.15} dimStrength={dimStrength} strokeOpacity={strokeOpacity} />
      )}
      <Chip label="Sentence" x={CHIP_X} y={CHIP_Y} startFrame={sec(T.chipA)} opacity={fadeOut(f, sec(T.toParagraph), 8)} />
      <Chip label="Paragraph" x={CHIP_X} y={CHIP_Y} startFrame={sec(T.toParagraph)} opacity={fadeOut(f, sec(T.toFull), 8)} />
      <Chip label="Full Story" x={CHIP_X} y={CHIP_Y} startFrame={sec(T.toFull)} opacity={fadeOut(f, sec(T.dimChart), 8)} />

      {/* SC16 — closing lines + indigo rule. */}
      <WordLine text="Learn to read." y={LINE1_Y} start={sec(T.line1)} />
      <WordLine text="Not to recognize." y={LINE2_Y} start={sec(T.line2)} />
      {f >= sec(T.rule) && (
        <svg
          style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
          width={theme.canvas.width}
          height={theme.canvas.height}
        >
          <line
            x1={(theme.canvas.width - RULE_W) / 2}
            y1={RULE_Y}
            x2={(theme.canvas.width - RULE_W) / 2 + RULE_W * progress(f, sec(T.rule), sec(T.ruleDur))}
            y2={RULE_Y}
            stroke={theme.colors.indigo}
            strokeWidth={theme.stroke.standard}
          />
        </svg>
      )}

      <IllustrationTag />
    </SafeArea>
  );
};
