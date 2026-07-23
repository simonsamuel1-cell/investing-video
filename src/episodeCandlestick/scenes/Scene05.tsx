/**
 * Scene05 — from 1557, duration 788 frames (26.27s @30fps).
 * Split view: daily panel left (candles 1–3 formed, candle 4 driven LIVE by the
 * intraday session path) + IntradayPanel session replay right. Trend guide over
 * the falling highs, "Sellers In Control" chip, synced ping at the session low
 * (1108) on BOTH panels, cyan lower-wick highlight, dashed ReferenceLine under
 * the four-candle low, closing caption.
 * Compliance: theme tokens only (no raw hex/sizes/easings); SafeArea margins
 * 96/96/54/108 respected; bottom 108px empty; top-150px content ends x ≤ 1368;
 * deterministic (no Math.random); fictional data — IllustrationTag + Ticker.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import {
  sec,
  fadeIn,
  progress,
  clampProgress,
  textReveal,
  priceScale,
} from "../helpers";
import type { OHLC, SessionPoint } from "../helpers";
import { SafeArea } from "../components/SafeArea";
import { Candle } from "../components/Candle";
import { LiveCandle } from "../components/LiveCandle";
import { PricePanel, Ticker } from "../components/PricePanel";
import { ReferenceLine } from "../components/ReferenceLine";
import { Chip } from "../components/Chip";
import { Ping } from "../components/Ping";
import { IllustrationTag } from "../components/IllustrationTag";
import { IntradayPanel, sessionScale } from "../components/SessionView";

// ═══ EDIT ═══
const DAILY_X = 96; // daily chart drawing area (Rp axis extends panel to x 1010)
const DAILY_W = 790;
const DAILY_TOP = 200;
const DAILY_BOTTOM = 780;
const SESSION_X = 1060; // intraday session panel (trace area)
const SESSION_W = 572;
const SESSION_Y = 200;
const SESSION_H = 580; // includes the ~60px clock strip
const CANDLE_W = 64;
const TICK_W = 32; // open-tick line width at candle 4's slot
const CHIP_X = 1030; // "Sellers In Control" — centered between the panels
const CHIP_Y = 104;
const CAPTION_Y = 840;
const TICKER_X = 130;
const TICKER_Y = 140;
const REF_OFFSET = 12; // reference line sits just below the four-candle low
const T = {
  panelIn: 0.0, // daily panel fades in
  candles: 0.5, // candles 1–3 wipe in, 0.6s apart
  candleGap: 0.6,
  guide: 2.6, // trend guide over the highs + chip
  sessionIn: 6.0, // session panel fades in; open tick appears
  sessionPlay: 6.4, // session trace + LIVE candle 4 (same clampProgress)
  sessionDur: 4.6,
  ping: 8.4, // pingT 0.5 → price 1108, both panels
  close: 11.0, // session closes → intraday dims to 25%
  wick: 12.0, // candle 4's wick strokes cyan
  refLine: 19.0,
  caption: 20.2,
};
// ═══════════

const DAILY: OHLC[] = [
  { open: 1420, high: 1428, low: 1352, close: 1361 },
  { open: 1358, high: 1366, low: 1288, close: 1296 },
  { open: 1294, high: 1301, low: 1232, close: 1241 },
];

// Candle 4's intraday session path — open 1238, high 1246, low 1108, close 1235.
const SESSION_PATH: SessionPoint[] = [
  { t: 0, price: 1238 },
  { t: 0.04, price: 1246 },
  { t: 0.12, price: 1214 },
  { t: 0.28, price: 1176 },
  { t: 0.42, price: 1132 },
  { t: 0.5, price: 1108 },
  { t: 0.6, price: 1146 },
  { t: 0.72, price: 1182 },
  { t: 0.85, price: 1212 },
  { t: 1, price: 1235 },
];

const DAILY_MIN = 1108;
const DAILY_MAX = 1428;
const dScale = priceScale(DAILY_MIN, DAILY_MAX, DAILY_TOP, DAILY_BOTTOM);
const sScale = sessionScale([SESSION_PATH], SESSION_Y, SESSION_Y + SESSION_H - 72);

const SLOT = DAILY_W / 4;
const cx = (i: number) => DAILY_X + SLOT * (i + 0.5);

// Trend guide over candles 1–3 highs (2px indigo, 40% opacity).
const GUIDE_PTS = DAILY.map((d, i) => ({ x: cx(i), y: dScale(d.high) }));
const GUIDE_LEN = GUIDE_PTS.slice(1).reduce(
  (len, p, i) => len + Math.hypot(p.x - GUIDE_PTS[i].x, p.y - GUIDE_PTS[i].y),
  0,
);

export const Scene05 = () => {
  const f = useCurrentFrame();

  const dailyOp = fadeIn(f, sec(T.panelIn));
  const sessionProg = clampProgress(f, sec(T.sessionPlay), sec(T.sessionDur));
  const sessionOp =
    fadeIn(f, sec(T.sessionIn)) * (1 - 0.75 * progress(f, sec(T.close), 14));
  const guideDraw = progress(f, sec(T.guide), 24);
  const cap = textReveal(f, sec(T.caption));

  return (
    <SafeArea>
      {/* ── daily panel (left) ── */}
      <div style={{ position: "absolute", left: 0, top: 0, opacity: dailyOp }}>
        <PricePanel
          x={DAILY_X}
          y={DAILY_TOP}
          width={DAILY_W}
          height={DAILY_BOTTOM - DAILY_TOP}
          min={DAILY_MIN}
          max={DAILY_MAX}
          scale={dScale}
          ticks={4}
        />
        <svg
          style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
          width={theme.canvas.width}
          height={theme.canvas.height}
        >
          {/* candles 1–3 — bottom-up scaleY wipe, 0.6s apart */}
          {DAILY.map((d, i) => {
            const start = sec(T.candles + i * T.candleGap);
            if (f < start) return null;
            const q = progress(f, start, 12);
            const x = cx(i);
            const yLo = dScale(d.low);
            return (
              <g
                key={i}
                opacity={q}
                transform={`translate(${x} ${yLo}) scale(1 ${q}) translate(${-x} ${-yLo})`}
              >
                <Candle
                  x={x}
                  width={CANDLE_W}
                  open={d.open}
                  high={d.high}
                  low={d.low}
                  close={d.close}
                  scale={dScale}
                />
              </g>
            );
          })}
          {/* thin indigo trend guide over the falling highs */}
          {f >= sec(T.guide) && (
            <polyline
              points={GUIDE_PTS.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke={theme.colors.indigo}
              strokeWidth={theme.stroke.standard}
              opacity={0.4}
              strokeDasharray={GUIDE_LEN}
              strokeDashoffset={GUIDE_LEN * (1 - guideDraw)}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {/* candle 4 open tick at Rp 1,238 */}
          {f >= sec(T.sessionIn) && (
            <line
              x1={cx(3) - TICK_W / 2}
              y1={dScale(SESSION_PATH[0].price)}
              x2={cx(3) + TICK_W / 2}
              y2={dScale(SESSION_PATH[0].price)}
              stroke={theme.colors.slate}
              strokeWidth={theme.stroke.standard}
              opacity={fadeIn(f, sec(T.sessionIn))}
            />
          )}
          {/* candle 4 — LIVE from the session path, same clampProgress as the trace */}
          {sessionProg > 0.001 && (
            <LiveCandle
              path={SESSION_PATH}
              progress={sessionProg}
              x={cx(3)}
              width={CANDLE_W}
              scale={dScale}
              wickStroke={f >= sec(T.wick) ? theme.colors.cyan : undefined}
            />
          )}
        </svg>
      </div>

      {/* ── intraday session panel (right) ── */}
      {f >= sec(T.sessionIn) && (
        <IntradayPanel
          path={SESSION_PATH}
          progress={sessionProg}
          x={SESSION_X}
          y={SESSION_Y}
          width={SESSION_W}
          height={SESSION_H}
          scale={sScale}
          opacity={sessionOp}
        />
      )}

      {/* chip above the daily panel, between the panels */}
      <Chip
        label="Sellers In Control"
        x={CHIP_X}
        y={CHIP_Y}
        variant="indigo"
        startFrame={sec(T.guide)}
      />

      {/* synced ping at the session low (1108) on BOTH panels */}
      <Ping cx={cx(3)} cy={dScale(1108)} startFrame={sec(T.ping)} />
      <Ping
        cx={SESSION_X + SESSION_W * 0.5}
        cy={sScale(1108)}
        startFrame={sec(T.ping)}
      />

      {/* dashed reference line under the four-candle low */}
      <ReferenceLine
        y={dScale(1108) + REF_OFFSET}
        x1={DAILY_X}
        x2={DAILY_X + DAILY_W}
        drawProgress={progress(f, sec(T.refLine), 18)}
      />

      {/* caption */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: CAPTION_Y,
          width: theme.canvas.width,
          textAlign: "center",
          fontSize: theme.type.body.size,
          fontWeight: theme.type.body.weight,
          color: theme.colors.ink,
          opacity: cap.opacity,
          transform: `translateY(${cap.y}px)`,
        }}
      >
        Demand is starting to outweigh supply.
      </div>

      <Ticker x={TICKER_X} y={TICKER_Y} />
      <IllustrationTag />
    </SafeArea>
  );
};
