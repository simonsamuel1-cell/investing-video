/**
 * ReferenceCard — left-panel content (docs/layout-4980.md left panel 194,220,389×315).
 * The pattern's candles centered, with a Title Case caption inside the panel
 * beneath them. Single wipe reveal, then STATIC — the only motion allowed on the
 * left panel is the vertical mirror flip (scaleY −1 about the panel centre) and
 * its dim state. All beat-driven work lives in DemoChart (right panel).
 */
import { theme } from "../theme";
import type { OHLC } from "../helpers";
import { priceScale } from "../helpers";
import { Candle } from "./Candle";

export const LEFT_PANEL = { x: 194, y: 220, w: 389, h: 315 };

export const ReferenceCard = ({
  candles,
  caption,
  reveal = 1,
  flip = 0,
  dim = 0,
}: {
  candles: OHLC[];
  caption: string;
  reveal?: number; // 0–1 wipe reveal
  flip?: number; // 0–1 vertical flip progress (1 = fully inverted)
  dim?: number; // 0–1 dim strength (dims to 30%)
}) => {
  const P = LEFT_PANEL;
  const chartTop = P.y + 34;
  const chartBottom = P.y + P.h - 96; // leave room for the caption
  const min = Math.min(...candles.map((c) => c.low));
  const max = Math.max(...candles.map((c) => c.high));
  const scale = priceScale(min, max, chartTop, chartBottom, 0.12);

  const bodyW = 46;
  const gap = 40;
  const totalW = candles.length * bodyW + (candles.length - 1) * gap;
  const startX = P.x + P.w / 2 - totalW / 2 + bodyW / 2;
  const cx = (i: number) => startX + i * (bodyW + gap);

  const scaleY = 1 - 2 * flip; // 1 → −1
  const midY = P.y + P.h / 2;
  const opacity = reveal * (1 - 0.7 * dim);

  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity }}>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
        <g transform={`translate(0 ${midY}) scale(1 ${scaleY}) translate(0 ${-midY})`}>
          {candles.map((c, i) => (
            <Candle key={i} x={cx(i)} width={bodyW} open={c.open} high={c.high} low={c.low} close={c.close} scale={scale} buildProgress={reveal} wickProgress={reveal} />
          ))}
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: P.x,
          top: P.y + P.h - 62,
          width: P.w,
          textAlign: "center",
          fontFamily: theme.type.family,
          fontSize: theme.type.label.size,
          fontWeight: theme.type.label.weight,
          color: theme.colors.ink,
        }}
      >
        {caption}
      </div>
    </div>
  );
};
