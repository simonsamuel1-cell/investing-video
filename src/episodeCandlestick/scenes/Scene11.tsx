/**
 * Scene11 — The Shooting Star (bearish mirror of the Hammer).
 * From frame 6057, duration 869 frames (28.97s).
 * Contents: CaseStudyLayout header ("Shooting Star" + Bearish neutral chip),
 * mirror echo — Scene09's hammer intraday path ghosts into the intraday panel
 * at 20% opacity, flips vertically about the panel's midline, fades out — then
 * SessionView replays the shooting-star session (ping at the high, close →
 * cyan upper wick stroke), ContextStrip with 8-candle uptrend, "Resistance"
 * ref line above, star docking, chips "After Uptrend" / "At Resistance".
 * Compliance: all tokens from theme.ts, no raw hex/sizes/easing; SafeArea;
 * bottom 108px empty; IllustrationTag + Ticker mounted; ghost SVG gated on
 * frame >= its local start; deterministic.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { CaseStudyLayout } from "../components/CaseStudyLayout";
import { SessionView, sessionGeom } from "../components/SessionView";
import { ContextStrip } from "../components/ContextStrip";
import { IllustrationTag } from "../components/IllustrationTag";
import { theme } from "../theme";
import { sec, clampProgress, progress as easedProgress, pathPriceAt, priceScale } from "../helpers";
import type { OHLC, SessionPoint } from "../helpers";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
// Layout (px, absolute canvas coords)
const SV_X = 96; // SessionView left
const SV_Y = 240; // SessionView top (benchmark = SC03)
const SV_W = 1536; // SessionView width
const SV_H = 440; // SessionView height → 480px rect
// Benchmark chart design (matches SC03)
const PANEL_GAP = 20; // visible gap between the two panel rects
const CENTER_NUDGE = 30; // shift the centered group right
const TIME_FONT = 30; // clock-label size
// Ghost overlay — intraday panel geometry pulled from the shared helper so it
// tracks the centered group exactly (left panel left edge + width).
const G = sessionGeom({ x: SV_X, width: SV_W, panelGap: PANEL_GAP, centered: true, centerNudge: CENTER_NUDGE });
const GHOST_X = SV_X + G.centerOffset; // intraday area left (centered)
const GHOST_W = G.leftW; // intraday area width
const GHOST_TOP = SV_Y; // trace y-range top
const GHOST_BOT = SV_Y + SV_H - 72; // trace y-range bottom (above clock strip)
const GHOST_OPACITY = 0.2; // ghost polyline opacity
// Timings (seconds, scene-local)
const T = {
  header: 0.0, // title + signal chip reveal
  ghostIn: 1.0, // hammer ghost fades into the intraday panel
  flip: 1.8, // vertical flip (scaleY 1 → −1) starts
  flipDur: 0.8, // flip duration
  ghostFadeStart: 2.8, // ghost fade-out starts
  ghostFadeEnd: 3.2, // ghost fully gone as the real trace starts
  playFrom: 3.2, // session playback starts
  playDur: 5.6, // session playback duration (ping ≈5.7s at the high)
  close: 9.2, // session close — intraday dims, upper wick strokes cyan
  ctxReveal: 14.5, // ContextStrip candles wipe in
  ctxLine: 15.3, // resistance line draws above
  dock: 16.6, // star docks into the end slot
  dockDur: 0.8, // dock slide duration
  chip1: 18.0, // "After Uptrend"
  chip2: 18.8, // "At Resistance"
};
// ═══════════════════════════════════════════════════════════════════════════

const PING_T = 0.45; // session-time of the high-of-day ping

// Scene09's hammer intraday path — the mirror-echo ghost
const HAMMER_GHOST_PATH: SessionPoint[] = [
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

// Intraday shooting-star path → open 1252, high 1436, low 1244, close 1258
const STAR_PATH: SessionPoint[] = [
  { t: 0, price: 1252 },
  { t: 0.05, price: 1244 },
  { t: 0.16, price: 1298 },
  { t: 0.3, price: 1362 },
  { t: 0.45, price: 1436 },
  { t: 0.56, price: 1392 },
  { t: 0.72, price: 1330 },
  { t: 0.88, price: 1281 },
  { t: 1, price: 1258 },
];

// 8-candle uptrend context
const CONTEXT_DATA: OHLC[] = [
  { open: 1082, high: 1128, low: 1076, close: 1120 },
  { open: 1123, high: 1172, low: 1118, close: 1164 },
  { open: 1167, high: 1214, low: 1160, close: 1206 },
  { open: 1209, high: 1256, low: 1202, close: 1248 },
  { open: 1251, high: 1292, low: 1244, close: 1284 },
  { open: 1287, high: 1326, low: 1280, close: 1318 },
  { open: 1321, high: 1358, low: 1314, close: 1350 },
  { open: 1353, high: 1398, low: 1346, close: 1390 },
];

// Finished shooting-star candle docking into the slot
const DOCK_CANDLES: OHLC[] = [{ open: 1252, high: 1436, low: 1244, close: 1258 }];

/** Mirror echo — hammer path ghost that flips vertically, then fades out. */
const GhostEcho = () => {
  const f = useCurrentFrame();
  if (f < sec(T.ghostIn)) return null;

  const prices = HAMMER_GHOST_PATH.map((p) => p.price);
  const gScale = priceScale(Math.min(...prices), Math.max(...prices), GHOST_TOP, GHOST_BOT, 0.1);
  const n = 64;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push(`${GHOST_X + GHOST_W * t},${gScale(pathPriceAt(HAMMER_GHOST_PATH, t))}`);
  }

  const midY = (GHOST_TOP + GHOST_BOT) / 2;
  const flipS = interpolate(f, [sec(T.flip), sec(T.flip) + sec(T.flipDur)], [1, -1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.motion.ease,
  });
  const op = interpolate(
    f,
    [sec(T.ghostIn), sec(T.ghostIn) + 8, sec(T.ghostFadeStart), sec(T.ghostFadeEnd)],
    [0, GHOST_OPACITY, GHOST_OPACITY, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  if (op <= 0.001) return null;

  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      width={theme.canvas.width}
      height={theme.canvas.height}
    >
      <g transform={`translate(0 ${midY}) scale(1 ${flipS}) translate(0 ${-midY})`} opacity={op}>
        <polyline
          points={pts.join(" ")}
          fill="none"
          stroke={theme.colors.indigo}
          strokeWidth={3}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};

export const Scene11 = () => {
  const f = useCurrentFrame();

  const sessionProgress = clampProgress(f, sec(T.playFrom), sec(T.playDur));
  const dockProgress = easedProgress(f, sec(T.dock), sec(T.dockDur));

  return (
    <SafeArea>
      <CaseStudyLayout
        title="Shooting Star"
        signalChip={{ label: "Bearish", variant: "neutral" }}
        headerFrame={sec(T.header)}
      >
        <SessionView
          path={STAR_PATH}
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
          centered
          centerNudge={CENTER_NUDGE}
          panelGap={PANEL_GAP}
          timeFontSize={TIME_FONT}
        />

        <GhostEcho />

        <ContextStrip
          data={CONTEXT_DATA}
          refLine={{ price: 1436, label: "Resistance", position: "above" }}
          dockCandles={DOCK_CANDLES}
          dockProgress={dockProgress}
          chips={[
            { label: "After Uptrend", variant: "indigo", startFrame: sec(T.chip1) },
            { label: "At Resistance", variant: "indigo", startFrame: sec(T.chip2) },
          ]}
          revealFrame={sec(T.ctxReveal)}
          lineFrame={sec(T.ctxLine)}
        />

        <IllustrationTag />
      </CaseStudyLayout>
    </SafeArea>
  );
};
