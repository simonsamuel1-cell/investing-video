/**
 * TradingChart — Scene 1's fictional "$ABCD" chart, styled like a real charting
 * tool (TradingView look, per Simon 25 Jun). A candlestick main pane (with MA5,
 * MA20 lines + Parabolic-SAR dots) plus three oscillator sub-panels (RSI, MACD,
 * Stoch RSI) that each fade in independently via `reveal`. Pure deterministic
 * shapes — the ticker is fictional ($ABCD) and the axis values are illustrative,
 * so nothing here is real market data. Uses the off-brand TV palette by design.
 */
import { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, TYPE, WEIGHT, RADII, BORDER, TV } from "../theme";
import { genCandles, genSeries, movingAvg, polyPoints } from "../helpers";

export interface ChartReveal {
  ma5: number;
  ma20: number;
  rsi: number;
  macd: number;
  stoch: number;
  psar: number;
}

const CARD = { x: 370, w: 1180 } as const;
const MAIN = { y: 92, h: 472 } as const;
const HEADER_H = 56;
const AXIS_W = 76;
const PANE_PAD = 16;
const N = 64;

// candle pane (inside the main card, left of the price axis)
const PANE = {
  x: CARD.x + PANE_PAD,
  y: MAIN.y + HEADER_H,
  w: CARD.w - AXIS_W - PANE_PAD,
  h: MAIN.h - HEADER_H - PANE_PAD,
} as const;

// three oscillator sub-panels below the main card
const SUB_H = 92;
const SUB = {
  rsi: 580,
  macd: 684,
  stoch: 788,
} as const;

// Map a normalised price 0..1 → a fictional axis value (disguises the source).
const AX_LO = 1200;
const AX_HI = 2400;
const axVal = (p: number) => Math.round((AX_LO + p * (AX_HI - AX_LO)) / 50) * 50;

const Card = ({
  x,
  y,
  w,
  h,
  opacity = 1,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  opacity?: number;
  children: React.ReactNode;
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      opacity,
      borderRadius: RADII.card,
      background: COLORS.surface,
      border: `${BORDER.thin}px solid ${COLORS.hairline}`,
      boxShadow: "0 12px 30px rgba(27,29,34,0.06)",
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

const SubLabel = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      position: "absolute",
      left: 16,
      top: 8,
      fontSize: TYPE.micro,
      fontWeight: WEIGHT.semibold,
      color: COLORS.slate,
      display: "flex",
      gap: 10,
      alignItems: "center",
    }}
  >
    {children}
  </div>
);

// ─── oscillator plot helpers (local SVG, normalised series) ──────────────────
const oscPts = (seed: number, w: number, h: number, vol: number, pad = 8) =>
  polyPoints(genSeries(N, seed, { vol }), w, h, pad);

export const TradingChart = ({
  candleProgress,
  reveal,
  dy = 0,
}: {
  candleProgress: number;
  reveal: ChartReveal;
  dy?: number; // vertical offset — Scene 2 slides the chart to centre
}) => {
  const candles = useMemo(() => genCandles(N, 71), []);
  const closes = useMemo(() => candles.map((c) => c.c), [candles]);
  const ma5 = useMemo(() => movingAvg(closes, 5), [closes]);
  const ma20 = useMemo(() => movingAvg(closes, 20), [closes]);

  const slot = PANE.w / N;
  const bodyW = slot * 0.62;
  const cx = (i: number) => PANE.x + (i + 0.5) * slot;
  const py = (p: number) => PANE.y + (1 - p) * PANE.h;
  const shown = candleProgress * N;

  // Parabolic-SAR: dots flip below price in an up-leg, above in a down-leg.
  const psar = candles.map((c, i) => {
    const ref = i >= 2 ? closes[i] - closes[i - 2] : 0;
    const up = ref >= 0;
    return { x: cx(i), y: up ? py(c.lo) + 14 : py(c.hi) - 14, up };
  });
  // Buy/Sell flip markers where the leg direction changes.
  const flips: { x: number; y: number; buy: boolean }[] = [];
  for (let i = 3; i < candles.length; i++) {
    if (psar[i].up !== psar[i - 1].up) {
      flips.push({ x: cx(i), y: psar[i].up ? py(candles[i].lo) + 30 : py(candles[i].hi) - 30, buy: psar[i].up });
    }
  }

  // price axis gridlines
  const grid = [0, 0.25, 0.5, 0.75, 1];

  return (
    <AbsoluteFill style={{ transform: `translateY(${dy}px)` }}>
      {/* main candle pane */}
      <Card x={CARD.x} y={MAIN.y} w={CARD.w} h={MAIN.h}>
        {/* header */}
        <div style={{ position: "absolute", left: 20, top: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: TYPE.body, fontWeight: WEIGHT.bold, color: COLORS.text }}>$ABCD</span>
          <span style={{ fontSize: TYPE.label, fontWeight: WEIGHT.medium, color: COLORS.slate }}>· 1D</span>
          <span style={{ fontSize: TYPE.label, fontWeight: WEIGHT.semibold, color: TV.candleUp }}>+1.09%</span>
        </div>
      </Card>

      {/* candle pane SVG (overlaid on the card, above its border) */}
      <svg
        style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, pointerEvents: "none" }}
      >
        {/* gridlines + axis labels */}
        {grid.map((g, k) => {
          const y = PANE.y + (1 - g) * PANE.h;
          return (
            <g key={k}>
              <line x1={PANE.x} y1={y} x2={PANE.x + PANE.w} y2={y} stroke={TV.grid} strokeWidth={1} />
              <text x={PANE.x + PANE.w + 12} y={y + 5} fontSize={TYPE.micro} fill={TV.axis} fontWeight={WEIGHT.medium}>
                {axVal(g).toLocaleString("en-US")}
              </text>
            </g>
          );
        })}

        {/* candles */}
        {candles.map((c, i) => {
          const op = Math.max(0, Math.min(1, shown - i));
          if (op <= 0) return null;
          const col = c.up ? TV.candleUp : TV.candleDown;
          const bodyTop = py(Math.max(c.o, c.c));
          const bodyH = Math.max(2, Math.abs(py(c.o) - py(c.c)));
          return (
            <g key={i} opacity={op}>
              <line x1={cx(i)} y1={py(c.hi)} x2={cx(i)} y2={py(c.lo)} stroke={col} strokeWidth={1.4} />
              <rect x={cx(i) - bodyW / 2} y={bodyTop} width={bodyW} height={bodyH} fill={col} rx={1} />
            </g>
          );
        })}

        {/* MA5 / MA20 */}
        <g transform={`translate(${PANE.x} ${PANE.y})`} opacity={reveal.ma5}>
          <polyline points={polyPoints(ma5, PANE.w, PANE.h, 0)} fill="none" stroke={TV.ma5} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
        </g>
        <g transform={`translate(${PANE.x} ${PANE.y})`} opacity={reveal.ma20}>
          <polyline points={polyPoints(ma20, PANE.w, PANE.h, 0)} fill="none" stroke={TV.ma20} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
        </g>

        {/* Parabolic SAR dots + Buy/Sell flips */}
        <g opacity={reveal.psar}>
          {psar.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={2.6} fill={d.up ? TV.psarUp : TV.psarDown} />
          ))}
          {flips.map((f, i) => (
            <g key={`f${i}`}>
              <rect x={f.x - 20} y={f.y - 13} width={40} height={22} rx={5} fill={f.buy ? TV.buy : TV.sell} />
              <text x={f.x} y={f.y + 3} fontSize={13} fill={COLORS.white} fontWeight={WEIGHT.bold} textAnchor="middle">
                {f.buy ? "Buy" : "Sell"}
              </text>
            </g>
          ))}
        </g>
      </svg>

      {/* RSI sub-panel */}
      <Card x={CARD.x} y={SUB.rsi} w={CARD.w} h={SUB_H} opacity={reveal.rsi}>
        <SubLabel>
          <span style={{ color: COLORS.text }}>RSI</span>
          <span style={{ color: COLORS.slate, fontWeight: WEIGHT.regular }}>10 close</span>
        </SubLabel>
        <svg width={CARD.w} height={SUB_H} style={{ position: "absolute", left: 0, top: 0 }}>
          <rect x={16} y={30} width={CARD.w - AXIS_W - 16} height={SUB_H - 40} fill={TV.rsiBand} />
          <polyline points={oscPts(81, CARD.w - AXIS_W - 32, SUB_H - 40, 0.14)} transform={`translate(16 30)`} fill="none" stroke={TV.rsi} strokeWidth={2} strokeLinejoin="round" />
          <polyline points={oscPts(82, CARD.w - AXIS_W - 32, SUB_H - 40, 0.07)} transform={`translate(16 30)`} fill="none" stroke={TV.rsiSignal} strokeWidth={2} strokeLinejoin="round" />
        </svg>
      </Card>

      {/* MACD sub-panel */}
      <Card x={CARD.x} y={SUB.macd} w={CARD.w} h={SUB_H} opacity={reveal.macd}>
        <SubLabel>
          <span style={{ color: COLORS.text }}>MACD</span>
          <span style={{ color: COLORS.slate, fontWeight: WEIGHT.regular }}>13 34 9</span>
        </SubLabel>
        <svg width={CARD.w} height={SUB_H} style={{ position: "absolute", left: 0, top: 0 }}>
          {(() => {
            const w = CARD.w - AXIS_W - 32;
            const h = SUB_H - 40;
            const mid = 30 + h / 2;
            const hist = genSeries(N, 83, { vol: 0.18 });
            return (
              <g transform="translate(16 0)">
                <line x1={0} y1={mid} x2={w} y2={mid} stroke={TV.grid} strokeWidth={1} />
                {hist.filter((_, i) => i % 2 === 0).map((v, k, arr) => {
                  const x = (k / (arr.length - 1)) * w;
                  const top = mid - (v - 0.5) * h;
                  return <rect key={k} x={x - 4} y={Math.min(mid, top)} width={8} height={Math.abs(mid - top)} rx={1} fill={v >= 0.5 ? TV.candleUp : TV.candleDown} opacity={0.55} />;
                })}
                <polyline points={polyPoints(genSeries(N, 84, { vol: 0.1 }), w, h, 0)} transform="translate(0 30)" fill="none" stroke={TV.macdLine} strokeWidth={2} />
                <polyline points={polyPoints(genSeries(N, 85, { vol: 0.05 }), w, h, 0)} transform="translate(0 30)" fill="none" stroke={TV.macdSignal} strokeWidth={2} />
              </g>
            );
          })()}
        </svg>
      </Card>

      {/* Stoch RSI sub-panel */}
      <Card x={CARD.x} y={SUB.stoch} w={CARD.w} h={SUB_H} opacity={reveal.stoch}>
        <SubLabel>
          <span style={{ color: COLORS.text }}>Stoch RSI</span>
          <span style={{ color: COLORS.slate, fontWeight: WEIGHT.regular }}>7 7 10 10</span>
        </SubLabel>
        <svg width={CARD.w} height={SUB_H} style={{ position: "absolute", left: 0, top: 0 }}>
          <rect x={16} y={30} width={CARD.w - AXIS_W - 16} height={SUB_H - 40} fill={TV.stochBand} />
          <polyline points={oscPts(86, CARD.w - AXIS_W - 32, SUB_H - 40, 0.2)} transform={`translate(16 30)`} fill="none" stroke={TV.stochK} strokeWidth={2} strokeLinejoin="round" />
          <polyline points={oscPts(87, CARD.w - AXIS_W - 32, SUB_H - 40, 0.12)} transform={`translate(16 30)`} fill="none" stroke={TV.stochD} strokeWidth={2} strokeLinejoin="round" />
        </svg>
      </Card>
    </AbsoluteFill>
  );
};
