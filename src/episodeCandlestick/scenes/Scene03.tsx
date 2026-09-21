/**
 * Scene03 — from 614, duration 460 frames.
 * First SessionView: intraday replay (open 1246 → high 1358 → close 1252)
 * forms a small red body with a long upper wick; cyan ping at the session high,
 * session close dims the intraday half, then a dashed marker at 1358 with the
 * chip "Sellers Were Here".
 * Compliance: theme tokens only (no raw hex/sizes/easings), safe margins
 * 96/96/54/108, bottom 108px empty, deterministic (no Math.random),
 * IllustrationTag + Ticker mounted, clampProgress drives session playback.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { sec, fadeIn, clampProgress } from "../helpers";
import type { SessionPoint } from "../helpers";
import { SafeArea } from "../components/SafeArea";
import { SessionView, sessionScale } from "../components/SessionView";
import { Chip } from "../components/Chip";
import { IllustrationTag } from "../components/IllustrationTag";

// ═══ EDIT ═══
const VIEW_X = 96; // SessionView left
const VIEW_Y = 240; // SessionView top (moved down 40px from 200)
const VIEW_W = 1536; // full active width
const VIEW_H = 440; // white panel rect = VIEW_H + 40 = 480px tall
const SPLIT = 0.62; // intraday : candle panel ratio
const PANEL_GAP = 20; // visible gap between the left + right charts (benchmark)
const CENTER_NUDGE = 30; // shift the centered group right by this many px
const TIME_FONT = 30; // clock label size (09:00 / 12:00 / 15:50)
const MARKER_PRICE = 1358; // session high — "Sellers Were Here" level
const T = {
  viewIn: 0.0, // panels + clock fade in
  playFrom: 0.8, // session playback starts
  playDur: 5.2, // progress 0→1
  pingT: 0.5, // session-time of the cyan ping (price 1358)
  close: 6.0, // session closes → intraday dims to 25%
  marker: 7.2, // dashed line + chip
};
// ═══════════

const PATH: SessionPoint[] = [
  { t: 0, price: 1246 },
  { t: 0.12, price: 1268 },
  { t: 0.28, price: 1305 },
  { t: 0.42, price: 1341 },
  { t: 0.5, price: 1358 },
  { t: 0.58, price: 1349 },
  { t: 0.68, price: 1322 },
  { t: 0.8, price: 1288 },
  { t: 0.92, price: 1263 },
  { t: 1, price: 1252 },
];

// marker line y (shared scale) — the "Sellers were here" chip sits above it
const markerY = sessionScale([PATH], VIEW_Y, VIEW_Y + VIEW_H - 72, [MARKER_PRICE])(MARKER_PRICE);

export const Scene03 = () => {
  const f = useCurrentFrame();

  const viewOpacity = fadeIn(f, sec(T.viewIn));
  const playback = clampProgress(f, sec(T.playFrom), sec(T.playDur));
  const pingStartFrame = sec(T.playFrom + T.pingT * T.playDur); // ≈3.4s

  return (
    <SafeArea>
      <SessionView
        path={PATH}
        progress={playback}
        x={VIEW_X}
        y={VIEW_Y}
        width={VIEW_W}
        height={VIEW_H}
        splitRatio={SPLIT}
        pingT={T.pingT}
        pingStartFrame={pingStartFrame}
        closeFrame={sec(T.close)}
        markerPrice={MARKER_PRICE}
        markerStartFrame={sec(T.marker)}
        opacity={viewOpacity}
        centered
        centerNudge={CENTER_NUDGE}
        panelGap={PANEL_GAP}
        timeFontSize={TIME_FONT}
      />

      {/* "Sellers were here" — horizontally centered, 20px above the marker chip's old spot */}
      <Chip
        label="Sellers were here"
        x={theme.canvas.width / 2}
        y={markerY - 94}
        variant="indigo"
        anchor="center"
        startFrame={sec(T.marker) + 8}
      />

      <IllustrationTag />
    </SafeArea>
  );
};
