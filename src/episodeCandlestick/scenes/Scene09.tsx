/**
 * Scene09 — The Hammer case study.
 * From frame 4158, duration 921 frames (30.7s).
 * Contents: CaseStudyLayout header ("Hammer" + Bullish chip), SessionView
 * replaying the hammer intraday session (ping at the low, close → cyan lower
 * wick stroke). At 4627 the long lower wick is measured/annotated
 * (Scene02-style bracket + "Long wick"). At 4801 the view collapses: the
 * intraday half + price axis fade out, the candle panel shrinks 30% and slides
 * left, and the crowded downtrend ContextStrip opens tall beside it.
 * Compliance: all tokens from theme.ts, no raw hex/sizes/easing; SafeArea;
 * bottom 108px empty; IllustrationTag + Ticker mounted; deterministic.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { CaseStudyLayout } from "../components/CaseStudyLayout";
import { SessionView, sessionGeom } from "../components/SessionView";
import { ContextStrip } from "../components/ContextStrip";
import { IllustrationTag } from "../components/IllustrationTag";
import { theme } from "../theme";
import {
  sec,
  fadeIn,
  clampProgress,
  progress as easedProgress,
  progress,
  textReveal,
  priceScale,
  mulberry32,
} from "../helpers";
import type { OHLC, SessionPoint } from "../helpers";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
// Layout (px, absolute canvas coords)
const SV_X = 96; // SessionView left
const SV_Y = 240; // SessionView top (benchmark = SC03)
const SV_W = 1536; // SessionView width
const SV_H = 440; // SessionView height → 480px rect
const CTX_GEOM = sessionGeom({ x: SV_X, width: SV_W, panelGap: 20, centered: true, centerNudge: 30 });
// Collapse (4801): shrink the candle panel 30% and align its LEFT edge to the
// left (intraday) panel's left edge; the intraday panel + prices fade away.
const COLLAPSE_SCALE = 0.7;
const COLLAPSE_DX = SV_X - CTX_GEOM.rightX; // move right panel left (panel space)
// Post-collapse candle panel (absolute screen coords).
const MOVED_LEFT = SV_X - 20 + CTX_GEOM.centerOffset; // aligned to left panel's rect left
const MOVED_W = (CTX_GEOM.rightW + 40) * COLLAPSE_SCALE;
const MOVED_RIGHT = MOVED_LEFT + MOVED_W;
const MOVED_TOP = SV_Y - 20;
// ContextStrip — opens to the right of the shrunk candle panel (20px gap); its
// height spans from the top of that panel down to the strip's prior bottom (900).
const CTX_X = MOVED_RIGHT + 20;
const CTX_Y = MOVED_TOP;
const CTX_BOTTOM = 900; // prior strip bottom (was y 710 + height 190)
const CTX_H = CTX_BOTTOM - CTX_Y;
const CTX_RIGHT = 1650; // prior strip right edge
const CTX_W = CTX_RIGHT - CTX_X;
const CTX_GAP = 20; // crowded context candles — 20px between each
const CTX_N = 18; // candle count that fits the narrower strip while staying crowded
// Timings (seconds, scene-local)
const T = {
  header: 0.0, // title + signal chip reveal
  svIn: 1.2, // SessionView fades in
  playFrom: 2.2, // session playback starts
  playDur: 6.0, // session playback duration (ping ≈5.0s at the low)
  close: 8.6, // session close — intraday dims, lower wick strokes cyan
  wickHi: 15.633, // long-wick measure annotation appears (frame 4627)
  wickHiDraw: 0.6, // measure line draws top→bottom
  collapse: 21.433, // view collapses; ContextStrip opens (frame 4801)
  collapseDur: 0.6,
  ctxLine: 22.5, // support line draws
  dock: 23.2, // hammer forms at support (end of the downtrend)
  dockDur: 0.8, // dock slide duration
  buyersText: 25.533, // "Buyers taking control" label above the hammer (frame 4924)
};
// ═══════════════════════════════════════════════════════════════════════════

const PING_T = 0.45; // session-time of the low-of-day ping

// Intraday hammer path → open 1412, high 1428, low 1246, close 1418
const HAMMER_PATH: SessionPoint[] = [
  { t: 0, price: 1412 },
  { t: 0.05, price: 1428 },
  { t: 0.16, price: 1372 },
  { t: 0.3, price: 1310 },
  { t: 0.45, price: 1246 },
  { t: 0.56, price: 1288 },
  { t: 0.72, price: 1348 },
  { t: 0.88, price: 1398 },
  { t: 1, price: 1418 },
];

// Shared vertical scale of the candle panel (matches SessionView's sessionScale).
const HAMMER_MIN = Math.min(...HAMMER_PATH.map((p) => p.price));
const HAMMER_MAX = Math.max(...HAMMER_PATH.map((p) => p.price));
const SV_SCALE = priceScale(HAMMER_MIN, HAMMER_MAX, SV_Y, SV_Y + SV_H - 72, 0.1);
const HAMMER_CX = CTX_GEOM.rightX + CTX_GEOM.rightW * 0.5 + CTX_GEOM.centerOffset;
const WICK_TOP_Y = SV_SCALE(1412); // body bottom (open) — top of the long lower wick
const WICK_LOW_Y = SV_SCALE(1246); // low — bottom of the long lower wick
const MEASURE_X = HAMMER_CX + 55; // measure bracket just right of the candle
const TICK_HALF = 8;

// Dense downtrend context (crowded, 20px gaps) leading into the hammer's support.
const CONTEXT_DATA: OHLC[] = (() => {
  const rnd = mulberry32(9);
  const out: OHLC[] = [];
  let prev = 1620;
  for (let i = 0; i < CTX_N; i++) {
    const drift = 1620 + ((1262 - 1620) * i) / (CTX_N - 1);
    const open = prev;
    const close = Math.round(drift + (rnd() - 0.5) * 22);
    const high = Math.round(Math.max(open, close) + 4 + rnd() * 12);
    const low = Math.round(Math.min(open, close) - (4 + rnd() * 12));
    out.push({ open, high, low, close });
    prev = close;
  }
  return out;
})();

// Finished hammer candle, sized/placed at the downtrend's support level so it
// reads as the reversal candle at the end of the sequence (small green body just
// above support, long lower wick down to it).
const DOCK_CANDLES: OHLC[] = [{ open: 1272, high: 1286, low: 1246, close: 1282 }];

export const Scene09 = () => {
  const f = useCurrentFrame();

  const sessionProgress = clampProgress(f, sec(T.playFrom), sec(T.playDur));
  const dockProgress = easedProgress(f, sec(T.dock), sec(T.dockDur));

  // Collapse choreography (identity before 4801).
  const collapseP = f >= sec(T.collapse) ? easedProgress(f, sec(T.collapse), sec(T.collapseDur)) : 0;
  const intradayOpacity = 1 - collapseP;
  const axisOpacity = 1 - collapseP;
  const rightScale = 1 - collapseP * (1 - COLLAPSE_SCALE);
  const rightDX = collapseP * COLLAPSE_DX;

  // Low-of-day pings fade out as the "Long wick" measure takes over (4627).
  const pingOpacity = 1 - progress(f, sec(T.wickHi), sec(0.4));

  // Long-wick measure annotation (4627 → collapse).
  const showWickHi = f >= sec(T.wickHi) && f < sec(T.collapse);
  const measureP = progress(f, sec(T.wickHi), sec(T.wickHiDraw));
  const measureEnd = WICK_TOP_Y + (WICK_LOW_Y - WICK_TOP_Y) * measureP;
  const wickLabel = textReveal(f, sec(T.wickHi) + 6);

  return (
    <SafeArea>
      <CaseStudyLayout
        title="Hammer"
        signalChip={{ label: "Bullish", variant: "indigo" }}
        headerFrame={sec(T.header)}
      >
        <SessionView
          path={HAMMER_PATH}
          progress={sessionProgress}
          x={SV_X}
          y={SV_Y}
          width={SV_W}
          height={SV_H}
          pingT={PING_T}
          pingStartFrame={sec(T.playFrom + PING_T * T.playDur)}
          closeFrame={sec(T.close)}
          wickStroke={theme.colors.cyan}
          wickStrokeFrame={sec(T.close)}
          lateWickStroke={theme.colors.candleGreen}
          lateWickStrokeFrame={sec(T.wickHi)}
          pingOpacity={pingOpacity}
          opacity={fadeIn(f, sec(T.svIn))}
          centered
          centerNudge={30}
          panelGap={20}
          timeFontSize={30}
          intradayOpacity={intradayOpacity}
          axisOpacity={axisOpacity}
          rightScale={rightScale}
          rightDX={rightDX}
        />

        {/* Long lower-wick measure — Scene02-style bracket + label. */}
        {showWickHi && (
          <>
            <svg
              style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
              width={theme.canvas.width}
              height={theme.canvas.height}
            >
              <g stroke={theme.colors.indigo} strokeWidth={theme.stroke.standard}>
                <line x1={MEASURE_X} y1={WICK_TOP_Y} x2={MEASURE_X} y2={measureEnd} />
                <line x1={MEASURE_X - TICK_HALF} y1={WICK_TOP_Y} x2={MEASURE_X + TICK_HALF} y2={WICK_TOP_Y} />
                <line x1={MEASURE_X - TICK_HALF} y1={measureEnd} x2={MEASURE_X + TICK_HALF} y2={measureEnd} />
              </g>
            </svg>
            <div
              style={{
                position: "absolute",
                left: MEASURE_X + 20,
                top: (WICK_TOP_Y + WICK_LOW_Y) / 2,
                fontSize: theme.type.body.size,
                fontWeight: theme.type.body.weight,
                color: theme.colors.ink,
                whiteSpace: "nowrap",
                opacity: wickLabel.opacity,
                transform: `translateY(calc(-50% + ${wickLabel.y}px))`,
              }}
            >
              Long wick
            </div>
          </>
        )}

        <ContextStrip
          data={CONTEXT_DATA}
          refLine={{ price: 1246, label: "Support", position: "below" }}
          dockCandles={DOCK_CANDLES}
          dockProgress={dockProgress}
          dockInline
          dockLabel={{ lines: ["Buyers taking", "control"], startFrame: sec(T.buyersText) }}
          revealFrame={sec(T.collapse)}
          lineFrame={sec(T.ctxLine)}
          x={CTX_X}
          y={CTX_Y}
          width={CTX_W}
          height={CTX_H}
          candleGap={CTX_GAP}
        />

        <IllustrationTag />
      </CaseStudyLayout>
    </SafeArea>
  );
};
