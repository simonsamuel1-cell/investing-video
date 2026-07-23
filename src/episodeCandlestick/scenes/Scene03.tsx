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
import { sec, fadeIn, clampProgress } from "../helpers";
import type { SessionPoint } from "../helpers";
import { SafeArea } from "../components/SafeArea";
import { SessionView } from "../components/SessionView";
import { IllustrationTag } from "../components/IllustrationTag";
import { Ticker } from "../components/PricePanel";

// ═══ EDIT ═══
const VIEW_X = 96; // SessionView left
const VIEW_Y = 200; // SessionView top
const VIEW_W = 1536; // full active width
const VIEW_H = 520;
const SPLIT = 0.62; // intraday : candle panel ratio
const TICKER_X = 130; // "SAHAM A" top-left of the chart panel
const TICKER_Y = 100; // kept ≥24px clear of the marker chip below
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

export const Scene03 = () => {
  const f = useCurrentFrame();

  const viewOpacity = fadeIn(f, sec(T.viewIn));
  const playback = clampProgress(f, sec(T.playFrom), sec(T.playDur));
  const pingStartFrame = sec(T.playFrom + T.pingT * T.playDur); // ≈3.4s

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 0, top: 0, opacity: viewOpacity }}>
        <Ticker x={TICKER_X} y={TICKER_Y} />
      </div>

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
        markerChipLabel="Sellers Were Here"
        markerStartFrame={sec(T.marker)}
        opacity={viewOpacity}
      />

      <IllustrationTag />
    </SafeArea>
  );
};
