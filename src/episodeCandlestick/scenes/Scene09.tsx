/**
 * Scene09 — The Hammer case study.
 * From frame 4158, duration 921 frames (30.7s).
 * Contents: CaseStudyLayout header ("Hammer" + Bullish chip), SessionView
 * replaying the hammer intraday session (ping at the low, close → cyan lower
 * wick stroke), ContextStrip with 8-candle downtrend, "Support" ref line,
 * hammer docking into the end slot, chips "After Downtrend" / "At Support".
 * Compliance: all tokens from theme.ts, no raw hex/sizes/easing; SafeArea;
 * bottom 108px empty; IllustrationTag + Ticker mounted; deterministic.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { CaseStudyLayout } from "../components/CaseStudyLayout";
import { SessionView } from "../components/SessionView";
import { ContextStrip } from "../components/ContextStrip";
import { IllustrationTag } from "../components/IllustrationTag";
import { Ticker } from "../components/PricePanel";
import { theme } from "../theme";
import { sec, fadeIn, clampProgress, progress as easedProgress } from "../helpers";
import type { OHLC, SessionPoint } from "../helpers";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
// Layout (px, absolute canvas coords)
const SV_X = 96; // SessionView left
const SV_Y = 210; // SessionView top
const SV_W = 1536; // SessionView width
const SV_H = 430; // SessionView height (incl. clock strip)
const TICKER_X = 130; // ticker inside intraday panel, top-left
const TICKER_Y = 176; // ≥24px clear of header above and panel content below
// Timings (seconds, scene-local)
const T = {
  header: 0.0, // title + signal chip reveal
  svIn: 1.2, // SessionView fades in
  playFrom: 2.2, // session playback starts
  playDur: 6.0, // session playback duration (ping ≈5.0s at the low)
  close: 8.6, // session close — intraday dims, lower wick strokes cyan
  ctxReveal: 13.5, // ContextStrip candles wipe in
  ctxLine: 15.2, // support line draws
  dock: 16.4, // hammer docks into the end slot
  dockDur: 0.8, // dock slide duration
  chip1: 17.8, // "After Downtrend"
  chip2: 18.6, // "At Support"
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

// 8-candle downtrend context
const CONTEXT_DATA: OHLC[] = [
  { open: 1622, high: 1630, low: 1568, close: 1574 },
  { open: 1571, high: 1580, low: 1512, close: 1520 },
  { open: 1518, high: 1526, low: 1466, close: 1472 },
  { open: 1470, high: 1478, low: 1418, close: 1428 },
  { open: 1425, high: 1434, low: 1382, close: 1390 },
  { open: 1388, high: 1396, low: 1340, close: 1348 },
  { open: 1345, high: 1354, low: 1298, close: 1306 },
  { open: 1303, high: 1312, low: 1252, close: 1260 },
];

// Finished hammer candle docking into the slot
const DOCK_CANDLES: OHLC[] = [{ open: 1412, high: 1428, low: 1246, close: 1418 }];

export const Scene09 = () => {
  const f = useCurrentFrame();

  const sessionProgress = clampProgress(f, sec(T.playFrom), sec(T.playDur));
  const dockProgress = easedProgress(f, sec(T.dock), sec(T.dockDur));

  return (
    <SafeArea>
      <CaseStudyLayout
        title="Hammer"
        signalChip={{ label: "Bullish", variant: "indigo" }}
        headerFrame={sec(T.header)}
      >
        <Ticker x={TICKER_X} y={TICKER_Y} />

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
          opacity={fadeIn(f, sec(T.svIn))}
        />

        <ContextStrip
          data={CONTEXT_DATA}
          refLine={{ price: 1246, label: "Support", position: "below" }}
          dockCandles={DOCK_CANDLES}
          dockProgress={dockProgress}
          chips={[
            { label: "After Downtrend", variant: "indigo", startFrame: sec(T.chip1) },
            { label: "At Support", variant: "indigo", startFrame: sec(T.chip2) },
          ]}
          revealFrame={sec(T.ctxReveal)}
          lineFrame={sec(T.ctxLine)}
        />

        <IllustrationTag />
      </CaseStudyLayout>
    </SafeArea>
  );
};
