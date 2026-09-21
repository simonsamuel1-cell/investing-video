/**
 * BbriChart — shared geometry + candle renderer for the real-BBRI scenes
 * (SC14A/B/C) so the chart is identical and never repositions across the cut.
 * SC14A drives the live 9-Jun build itself; SC14B/C use the static/revealing
 * renderer here. Candle bodies carry green/red; axis stays neutral.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { progress, priceScale, fmtRp } from "../helpers";
import { BBRI } from "../data/bbri-placeholder";
import { Candle } from "./Candle";

export const CHART = { x: 194, y: 260, w: 1456, h: 600 };
export const SLOT = (CHART.w - 80) / 20;
export const bcx = (i: number) => CHART.x + 40 + SLOT * (i + 0.5);
export const BODY_W = Math.min(34, SLOT * 0.6);
export const bbriScale = priceScale(Math.min(...BBRI.map((d) => d.low)), Math.max(...BBRI.map((d) => d.high)), CHART.y + 20, CHART.y + CHART.h - 20, 0.08);

export const BbriAxis = ({ prices }: { prices: number[] }) => (
  <>
    {prices.map((p, k) => (
      <text key={k} x={CHART.x + CHART.w + 8} y={bbriScale(p) + 8} fontFamily={theme.type.family} fontSize={24} fill={theme.colors.slate}>
        {fmtRp(p)}
      </text>
    ))}
  </>
);

/** Static candles [0..staticUpto], plus [revealStart..revealEnd] revealing from `revealFrom`. */
export const BbriCandles = ({ staticUpto, revealFrom, revealStart, revealEnd, revealStagger = 5 }: { staticUpto: number; revealFrom?: number; revealStart?: number; revealEnd?: number; revealStagger?: number }) => {
  const f = useCurrentFrame();
  return (
    <>
      {BBRI.map((c, i) => {
        if (i <= staticUpto) return <Candle key={i} x={bcx(i)} width={BODY_W} open={c.open} high={c.high} low={c.low} close={c.close} scale={bbriScale} />;
        if (revealFrom !== undefined && revealStart !== undefined && revealEnd !== undefined && i >= revealStart && i <= revealEnd) {
          const start = revealFrom + (i - revealStart) * revealStagger;
          if (f < start) return null;
          const p = progress(f, start, 10);
          return <Candle key={i} x={bcx(i)} width={BODY_W} open={c.open} high={c.high} low={c.low} close={c.close} scale={bbriScale} buildProgress={p} wickProgress={p} />;
        }
        return null;
      })}
    </>
  );
};
