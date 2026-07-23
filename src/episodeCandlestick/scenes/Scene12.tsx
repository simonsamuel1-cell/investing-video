/**
 * Scene12 — from 6926, duration 840 frames.
 * Bearish Engulfing (two-day SessionView mirror): day 1 rallies into a green
 * candle, marker at day 1's open (1296, "Day 1 Open"), clock resets, day 2
 * sells off and crosses below the open — day 1's candle dims and "Reversed"
 * pops above it. Caption "Everything buyers gained, given back.", then the
 * ContextStrip reveals six rising green candles, resistance at 1410, the pair
 * docks, and the chips "Top Of Uptrend" / "Near Resistance" land.
 * Compliance: theme tokens only (no raw hex/sizes/easings), safe margins
 * 96/96/54/108, bottom 108px empty, deterministic (no Math.random),
 * IllustrationTag + Ticker mounted, textReveal for type, clampProgress drives
 * session playback.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { sec, fadeIn, fadeOut, textReveal, progress, clampProgress } from "../helpers";
import type { OHLC, SessionPoint } from "../helpers";
import { SafeArea } from "../components/SafeArea";
import { CaseStudyLayout } from "../components/CaseStudyLayout";
import { SessionView, sessionScale } from "../components/SessionView";
import { ContextStrip } from "../components/ContextStrip";
import { Chip } from "../components/Chip";
import { IllustrationTag } from "../components/IllustrationTag";
import { Ticker } from "../components/PricePanel";

// ═══ EDIT ═══
const VIEW_X = 96; // SessionView left
const VIEW_Y = 210; // SessionView top (under the CaseStudyLayout header)
const VIEW_W = 1536; // full active width
const VIEW_H = 430;
const TICKER_X = 130; // "$ABCD" top-left of the intraday panel area
const TICKER_Y = 176;
const MARKER_PRICE = 1296; // day 1's open — the level day 2 breaks below
const REVERSED_RISE = 90; // px the "Reversed" chip sits above day 1's high
const CAPTION_Y = 840; // sentence-case caption (before the ContextStrip)
const T = {
  header: 0.0, // title + signal chip reveal
  viewIn: 1.2, // SessionView fades in
  day1From: 1.2, // day 1 playback starts
  day1Dur: 3.0, // → green candle resolves at 4.2s
  marker: 4.6, // dashed line at 1296 + "Day 1 Open" chip
  reset: 5.8, // clock playhead wipes back to 09:00
  day2From: 5.8, // day 2 playback starts
  day2Dur: 4.2, // → closes at 10.0s
  cross: 8.6, // live close crosses below 1296 → day 1 dims + "Reversed"
  close: 10.0, // day 2 closes → intraday half dims
  caption: 13.0, // caption reveals
  captionOut: 18.0, // caption fades out
  strip: 18.0, // ContextStrip reveals
  line: 18.8, // resistance line draws
  dock: 19.8, // the pair docks
  dockDur: 0.8,
  chip1: 21.2, // "Top Of Uptrend"
  chip2: 22.0, // "Near Resistance"
};
// ═══════════

const DAY1_PATH: SessionPoint[] = [
  { t: 0, price: 1296 },
  { t: 0.1, price: 1288 },
  { t: 0.3, price: 1322 },
  { t: 0.55, price: 1352 },
  { t: 0.8, price: 1376 },
  { t: 0.92, price: 1392 },
  { t: 1, price: 1384 },
];

const DAY2_PATH: SessionPoint[] = [
  { t: 0, price: 1402 },
  { t: 0.06, price: 1410 },
  { t: 0.2, price: 1378 },
  { t: 0.4, price: 1344 },
  { t: 0.6, price: 1312 },
  { t: 0.8, price: 1288 },
  { t: 0.9, price: 1272 },
  { t: 1, price: 1281 },
];

const DAY1_HIGH = 1392; // "Reversed" chip anchors above this level

// six green candles rising into the pattern
const CONTEXT_DATA: OHLC[] = [
  { open: 1042, high: 1092, low: 1036, close: 1084 },
  { open: 1087, high: 1138, low: 1080, close: 1130 },
  { open: 1133, high: 1186, low: 1126, close: 1178 },
  { open: 1181, high: 1228, low: 1174, close: 1220 },
  { open: 1223, high: 1268, low: 1216, close: 1260 },
  { open: 1263, high: 1302, low: 1256, close: 1296 },
];

const DOCK_CANDLES: OHLC[] = [
  { open: 1296, high: 1392, low: 1288, close: 1384 },
  { open: 1402, high: 1410, low: 1272, close: 1281 },
];

export const Scene12 = () => {
  const f = useCurrentFrame();

  const viewOpacity = fadeIn(f, sec(T.viewIn));
  const day1Progress = clampProgress(f, sec(T.day1From), sec(T.day1Dur));
  const day2Progress = clampProgress(f, sec(T.day2From), sec(T.day2Dur));
  const dimStrength = progress(f, sec(T.cross), 12);

  // same geometry SessionView uses — for placing the "Reversed" chip
  const innerW = VIEW_W - 148; // width − axisW(120) − gap(28)
  const leftW = innerW * 0.62;
  const rightX = VIEW_X + leftW + 28;
  const rightW = innerW - leftW;
  const c1x = rightX + rightW * 0.34; // day-1 candle center ≈ 1164 — well clear
  const scale = sessionScale([DAY1_PATH, DAY2_PATH], VIEW_Y, VIEW_Y + VIEW_H - 72, [MARKER_PRICE]);
  const reversedY = scale(DAY1_HIGH) - REVERSED_RISE; // ≈ 189 — ≥24px from the "Day 1 Open" chip at x 104

  const cap = textReveal(f, sec(T.caption));
  const captionOpacity = cap.opacity * fadeOut(f, sec(T.captionOut));

  return (
    <SafeArea>
      <CaseStudyLayout title="Bearish Engulfing" signalChip={{ label: "Bearish", variant: "neutral" }} headerFrame={sec(T.header)}>
        <div style={{ position: "absolute", left: 0, top: 0, opacity: viewOpacity }}>
          <Ticker x={TICKER_X} y={TICKER_Y} />
        </div>

        <SessionView
          path={DAY1_PATH}
          progress={day1Progress}
          day2Path={DAY2_PATH}
          day2Progress={day2Progress}
          resetFrame={sec(T.reset)}
          day1DimStrength={dimStrength}
          x={VIEW_X}
          y={VIEW_Y}
          width={VIEW_W}
          height={VIEW_H}
          closeFrame={sec(T.close)}
          markerPrice={MARKER_PRICE}
          markerChipLabel="Day 1 Open"
          markerStartFrame={sec(T.marker)}
          opacity={viewOpacity}
        />

        <Chip label="Reversed" x={c1x} y={reversedY} variant="indigo" startFrame={sec(T.cross)} anchor="center" />

        <div
          style={{
            position: "absolute",
            left: theme.layout.safeLeft,
            top: CAPTION_Y,
            width: theme.layout.activeWidth,
            textAlign: "center",
            fontSize: theme.type.body.size,
            fontWeight: theme.type.body.weight,
            color: theme.colors.ink,
            opacity: captionOpacity,
            transform: `translateY(${cap.y}px)`,
          }}
        >
          Everything buyers gained, given back.
        </div>

        <ContextStrip
          data={CONTEXT_DATA}
          refLine={{ price: 1410, label: "Resistance", position: "above" }}
          dockCandles={DOCK_CANDLES}
          dockProgress={progress(f, sec(T.dock), sec(T.dockDur))}
          chips={[
            { label: "Top Of Uptrend", variant: "indigo", startFrame: sec(T.chip1) },
            { label: "Near Resistance", variant: "indigo", startFrame: sec(T.chip2) },
          ]}
          revealFrame={sec(T.strip)}
          lineFrame={sec(T.line)}
        />
      </CaseStudyLayout>

      <IllustrationTag />
    </SafeArea>
  );
};
