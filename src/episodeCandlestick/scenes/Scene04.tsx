/**
 * Scene04 — from 1074, duration 483 frames.
 * Two session runs on cross-faded SessionViews + a candle tray. Run 1 (long
 * lower wick, "Demand Showed Up") docks into tray slot 1; Run 2 (doji, "No
 * Winner") docks into slot 2. The cleared canvas then reveals the line
 * "Same tool, different story — read the path, not the shape." and a "Wait"
 * chip.
 * Compliance: theme tokens only (no raw hex/sizes/easings), safe margins
 * 96/96/54/108, bottom 108px empty, tray ends before the logo zone (x ≤ 1200),
 * deterministic (no Math.random), textReveal for type, animated SVG gated on
 * frame ≥ start, IllustrationTag + Ticker mounted.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { sec, fadeIn, fadeOut, clampProgress, progress, textReveal, priceScale } from "../helpers";
import type { SessionPoint } from "../helpers";
import { SafeArea } from "../components/SafeArea";
import { SessionView } from "../components/SessionView";
import { Candle } from "../components/Candle";
import { Chip } from "../components/Chip";
import { IllustrationTag } from "../components/IllustrationTag";
import { Ticker } from "../components/PricePanel";

// ═══ EDIT ═══
const VIEW_X = 96; // SessionView left
const VIEW_Y = 260; // SessionView top
const VIEW_W = 1536;
const VIEW_H = 480;
const TRAY_X = 96; // tray strip: x 96 → 1200, y 84 → 216
const TRAY_Y = 84;
const TRAY_W = 1104;
const TRAY_H = 132;
const TRAY_PAD = 18; // inner vertical padding for the mini candles
const SLOT1_CANDLE_X = 180; // slot 1: mini candle center + label left edge
const SLOT1_LABEL_X = 216;
const SLOT2_CANDLE_X = 640; // slot 2
const SLOT2_LABEL_X = 676;
const MINI_CANDLE_W = 22;
const TICKER_X = 130; // inside the session panel area, ≥24px below the tray
const TICKER_Y = 240;
const DOCK_CHIP_Y = 650; // result chips sit under the finished daily candle
const LINE_Y = 470; // closing sentence, centered on the cleared canvas
const WAIT_CHIP_Y = 560; // "Wait" chip beneath the line
const T = {
  view1In: 0.0, // first SessionView fades in
  run1From: 0.6, // run 1 plays…
  run1Dur: 3.4, // …over 3.4s
  run1PingT: 0.4, // ping at the session low
  close1: 4.0, // close + "Demand Showed Up"
  dock1: 5.2, // candle docks into tray slot 1; view 1 fades out
  view2In: 6.0, // second SessionView fades in (0.4s)
  run2From: 6.4, // run 2 plays…
  run2Dur: 3.6, // …over 3.6s
  close2: 10.0, // close + "No Winner"
  dock2: 11.0, // docks into tray slot 2; view 2 fades out
  line: 12.0, // sentence reveals
  wait: 14.0, // "Wait" chip pops
};
// ═══════════

// Mirrors SessionView internals (axisW 120 / gap 28 / splitRatio 0.62) so the
// result chips land centered under the live daily candle.
const AXIS_W = 120;
const PANEL_GAP = 28;
const INNER_W = VIEW_W - AXIS_W - PANEL_GAP;
const LEFT_W = INNER_W * 0.62;
const CANDLE_CX = VIEW_X + LEFT_W + PANEL_GAP + (INNER_W - LEFT_W) / 2;

const RUN1: SessionPoint[] = [
  { t: 0, price: 1302 },
  { t: 0.15, price: 1266 },
  { t: 0.3, price: 1224 },
  { t: 0.4, price: 1198 },
  { t: 0.52, price: 1231 },
  { t: 0.68, price: 1265 },
  { t: 0.85, price: 1292 },
  { t: 1, price: 1308 },
];
const RUN1_OHLC = { open: 1302, high: 1308, low: 1198, close: 1308 };

const RUN2: SessionPoint[] = [
  { t: 0, price: 1284 },
  { t: 0.12, price: 1322 },
  { t: 0.25, price: 1352 },
  { t: 0.38, price: 1298 },
  { t: 0.5, price: 1238 },
  { t: 0.62, price: 1216 },
  { t: 0.75, price: 1268 },
  { t: 0.88, price: 1305 },
  { t: 1, price: 1287 },
];
const RUN2_OHLC = { open: 1284, high: 1352, low: 1216, close: 1287 };

/** Mini candle + 36px Title Case label sliding into a tray slot. */
const TraySlot = ({
  f,
  startFrame,
  candleX,
  labelX,
  label,
  ohlc,
}: {
  f: number;
  startFrame: number;
  candleX: number;
  labelX: number;
  label: string;
  ohlc: { open: number; high: number; low: number; close: number };
}) => {
  if (f < startFrame) return null; // gate animated SVG on local start
  const p = progress(f, startFrame, 14);
  const slide = (1 - p) * 26;
  const miniScale = priceScale(ohlc.low, ohlc.high, TRAY_Y + TRAY_PAD, TRAY_Y + TRAY_H - TRAY_PAD, 0.04);
  return (
    <>
      <svg
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
        width={theme.canvas.width}
        height={theme.canvas.height}
      >
        <g opacity={p} transform={`translate(${slide} 0)`}>
          <Candle
            x={candleX}
            width={MINI_CANDLE_W}
            open={ohlc.open}
            high={ohlc.high}
            low={ohlc.low}
            close={ohlc.close}
            scale={miniScale}
          />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: labelX,
          top: TRAY_Y + TRAY_H / 2 - theme.type.label.size / 2 - 4,
          transform: `translateX(${slide}px)`,
          fontSize: theme.type.label.size,
          fontWeight: theme.type.label.weight,
          color: theme.colors.slate,
          opacity: p,
        }}
      >
        {label}
      </div>
    </>
  );
};

export const Scene04 = () => {
  const f = useCurrentFrame();

  const view1Op = fadeIn(f, sec(T.view1In)) * fadeOut(f, sec(T.dock1));
  const view2Op = fadeIn(f, sec(T.view2In), sec(0.4)) * fadeOut(f, sec(T.dock2));
  const run1Playback = clampProgress(f, sec(T.run1From), sec(T.run1Dur));
  const run2Playback = clampProgress(f, sec(T.run2From), sec(T.run2Dur));
  const ping1StartFrame = sec(T.run1From + T.run1PingT * T.run1Dur); // ≈1.96s

  const trayOp = fadeIn(f, sec(T.view1In));
  const tickerOp = Math.max(view1Op, view2Op);
  const line = textReveal(f, sec(T.line));

  return (
    <SafeArea>
      {/* candle tray — slim white card strip, ends before the logo zone */}
      <div
        style={{
          position: "absolute",
          left: TRAY_X,
          top: TRAY_Y,
          width: TRAY_W,
          height: TRAY_H,
          background: theme.colors.neutralFill,
          border: `${theme.stroke.hairline}px solid ${theme.colors.neutralLine}`,
          borderRadius: theme.radius.panel,
          opacity: trayOp,
        }}
      />
      <TraySlot
        f={f}
        startFrame={sec(T.dock1)}
        candleX={SLOT1_CANDLE_X}
        labelX={SLOT1_LABEL_X}
        label="Demand Showed Up"
        ohlc={RUN1_OHLC}
      />
      <TraySlot
        f={f}
        startFrame={sec(T.dock2)}
        candleX={SLOT2_CANDLE_X}
        labelX={SLOT2_LABEL_X}
        label="No Winner"
        ohlc={RUN2_OHLC}
      />

      {tickerOp > 0.001 && (
        <div style={{ position: "absolute", left: 0, top: 0, opacity: tickerOp }}>
          <Ticker x={TICKER_X} y={TICKER_Y} />
        </div>
      )}

      {/* run 1 — long lower wick */}
      {view1Op > 0.001 && (
        <>
          <SessionView
            path={RUN1}
            progress={run1Playback}
            x={VIEW_X}
            y={VIEW_Y}
            width={VIEW_W}
            height={VIEW_H}
            pingT={T.run1PingT}
            pingStartFrame={ping1StartFrame}
            closeFrame={sec(T.close1)}
            opacity={view1Op}
          />
          <Chip
            label="Demand Showed Up"
            x={CANDLE_CX}
            y={DOCK_CHIP_Y}
            variant="indigo"
            startFrame={sec(T.close1)}
            opacity={view1Op}
          />
        </>
      )}

      {/* run 2 — doji, long wicks both sides */}
      {view2Op > 0.001 && f >= sec(T.view2In) && (
        <>
          <SessionView
            path={RUN2}
            progress={run2Playback}
            x={VIEW_X}
            y={VIEW_Y}
            width={VIEW_W}
            height={VIEW_H}
            closeFrame={sec(T.close2)}
            opacity={view2Op}
          />
          <Chip
            label="No Winner"
            x={CANDLE_CX}
            y={DOCK_CHIP_Y}
            variant="muted"
            startFrame={sec(T.close2)}
            opacity={view2Op}
          />
        </>
      )}

      {/* closing line + Wait chip on the cleared canvas */}
      <div
        style={{
          position: "absolute",
          left: theme.layout.safeLeft,
          top: LINE_Y,
          width: theme.layout.activeWidth,
          textAlign: "center",
          fontSize: theme.type.body.size,
          fontWeight: theme.type.body.weight,
          color: theme.colors.ink,
          opacity: line.opacity,
          transform: `translateY(${line.y}px)`,
        }}
      >
        Same tool, different story — read the path, not the shape.
      </div>
      <Chip label="Wait" x={theme.canvas.width / 2} y={WAIT_CHIP_Y} variant="indigo" startFrame={sec(T.wait)} />

      <IllustrationTag />
    </SafeArea>
  );
};
