/**
 * Scene10 — from 5079, duration 978 frames.
 * Bullish Engulfing (two-day SessionView): day 1 sells off into a red candle,
 * marker at day 1's open (1386, "Day 1 Open"), clock resets, day 2 rallies and
 * crosses back above the open — day 1's candle dims and "Erased" pops above it.
 * Caption "The previous session's selling, covered.", then the ContextStrip
 * reveals six descending red candles, support at 1281, the pair docks, and the
 * chips "After Red Series" / "Near Support" land.
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
const TICKER_X = 130; // "SAHAM A" top-left of the intraday panel area
const TICKER_Y = 176;
const MARKER_PRICE = 1386; // day 1's open — the level day 2 must reclaim
const ERASED_RISE = 90; // px the "Erased" chip sits above day 1's high
const CAPTION_Y = 840; // sentence-case caption (before the ContextStrip)
const T = {
  header: 0.0, // title + signal chip reveal
  viewIn: 1.2, // SessionView fades in
  day1From: 1.2, // day 1 playback starts
  day1Dur: 3.2, // → red candle resolves at 4.4s
  marker: 5.0, // dashed line at 1386 + "Day 1 Open" chip
  reset: 6.5, // clock playhead wipes back to 09:00
  day2From: 6.5, // day 2 playback starts
  day2Dur: 4.5, // → closes at 11.0s
  cross: 9.6, // live close crosses 1386 → day 1 dims + "Erased"
  close: 11.0, // day 2 closes → intraday half dims
  caption: 14.5, // caption reveals
  captionOut: 21.5, // caption fades out
  strip: 21.5, // ContextStrip reveals
  line: 22.3, // support line draws
  dock: 24.0, // the pair docks
  dockDur: 0.8,
  chip1: 25.4, // "After Red Series"
  chip2: 26.2, // "Near Support"
};
// ═══════════

const DAY1_PATH: SessionPoint[] = [
  { t: 0, price: 1386 },
  { t: 0.1, price: 1394 },
  { t: 0.3, price: 1362 },
  { t: 0.55, price: 1334 },
  { t: 0.8, price: 1312 },
  { t: 0.9, price: 1298 },
  { t: 1, price: 1306 },
];

const DAY2_PATH: SessionPoint[] = [
  { t: 0, price: 1288 },
  { t: 0.08, price: 1281 },
  { t: 0.2, price: 1304 },
  { t: 0.4, price: 1338 },
  { t: 0.6, price: 1366 },
  { t: 0.8, price: 1390 },
  { t: 0.94, price: 1412 },
  { t: 1, price: 1402 },
];

const DAY1_HIGH = 1394; // "Erased" chip anchors above this level

// six red candles descending into the pattern
const CONTEXT_DATA: OHLC[] = [
  { open: 1580, high: 1588, low: 1524, close: 1531 },
  { open: 1528, high: 1536, low: 1478, close: 1484 },
  { open: 1481, high: 1489, low: 1436, close: 1442 },
  { open: 1439, high: 1447, low: 1398, close: 1404 },
  { open: 1401, high: 1409, low: 1362, close: 1368 },
  { open: 1365, high: 1373, low: 1328, close: 1334 },
];

const DOCK_CANDLES: OHLC[] = [
  { open: 1386, high: 1394, low: 1298, close: 1306 },
  { open: 1288, high: 1412, low: 1281, close: 1402 },
];

export const Scene10 = () => {
  const f = useCurrentFrame();

  const viewOpacity = fadeIn(f, sec(T.viewIn));
  const day1Progress = clampProgress(f, sec(T.day1From), sec(T.day1Dur));
  const day2Progress = clampProgress(f, sec(T.day2From), sec(T.day2Dur));
  const dimStrength = progress(f, sec(T.cross), 12);

  // same geometry SessionView uses — for placing the "Erased" chip
  const innerW = VIEW_W - 148; // width − axisW(120) − gap(28)
  const leftW = innerW * 0.62;
  const rightX = VIEW_X + leftW + 28;
  const rightW = innerW - leftW;
  const c1x = rightX + rightW * 0.34; // day-1 candle center ≈ 1164 — well clear
  const scale = sessionScale([DAY1_PATH, DAY2_PATH], VIEW_Y, VIEW_Y + VIEW_H - 72, [MARKER_PRICE]);
  const erasedY = scale(DAY1_HIGH) - ERASED_RISE; // ≈ 191 — ≥24px from the "Day 1 Open" chip at x 104

  const cap = textReveal(f, sec(T.caption));
  const captionOpacity = cap.opacity * fadeOut(f, sec(T.captionOut));

  return (
    <SafeArea>
      <CaseStudyLayout title="Bullish Engulfing" signalChip={{ label: "Bullish", variant: "indigo" }} headerFrame={sec(T.header)}>
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

        <Chip label="Erased" x={c1x} y={erasedY} variant="indigo" startFrame={sec(T.cross)} anchor="center" />

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
          The previous session&rsquo;s selling, covered.
        </div>

        <ContextStrip
          data={CONTEXT_DATA}
          refLine={{ price: 1281, label: "Support", position: "below" }}
          dockCandles={DOCK_CANDLES}
          dockProgress={progress(f, sec(T.dock), sec(T.dockDur))}
          chips={[
            { label: "After Red Series", variant: "indigo", startFrame: sec(T.chip1) },
            { label: "Near Support", variant: "indigo", startFrame: sec(T.chip2) },
          ]}
          revealFrame={sec(T.strip)}
          lineFrame={sec(T.line)}
        />
      </CaseStudyLayout>

      <IllustrationTag />
    </SafeArea>
  );
};
