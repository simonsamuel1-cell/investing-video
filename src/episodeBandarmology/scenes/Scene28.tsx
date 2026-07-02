/**
 * Scene 28 — Verify: volume dry-up squeeze (7342, dur 261). A CandlestickChart
 * compresses into a narrow channel (two converging dashed bounds) while the volume
 * histogram shrinks (slate bars). Tag "Quiet Squeeze"; metric chip "Range 1.8% ·
 * Vol −62%". Candle bodies carry candle colors; bounds/labels brand.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, CandlestickChart, Chip } from "../components";
import { theme } from "../theme";
import { tween, textReveal, fadeIn, genCandles } from "../helpers";

const { colors, font, type } = theme;

const CW = 1500;
const CH = 460;
const CX = 210;
const CY = 300;

const LEVELS = Array.from({ length: 60 }, (_, i) => {
  const x = i / 59;
  return 0.55 + Math.sin(x * 26) * 0.2 * (1 - x * 0.82);
});
const CANDLES = genCandles(LEVELS, 2828, 0.03);
const VOL = Array.from({ length: 60 }, (_, i) => 0.8 * (1 - (i / 59) * 0.82));

export const Scene28 = () => {
  const f = useCurrentFrame();
  const prog = tween(f, [10, 150], [0, 1]);
  const boundsOp = fadeIn(f, 90, 18);
  const priceH = CH * 0.72;

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 210, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(f, 8, 18) }}>
        Volume Dry-Up
      </div>

      <div style={{ position: "absolute", left: CX, top: CY, width: CW, height: CH }}>
        <CandlestickChart width={CW} height={CH} candles={CANDLES} progress={prog} volume={VOL} />
        <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: boundsOp }}>
          <line x1={0} y1={0.14 * priceH} x2={CW} y2={0.4 * priceH} stroke={colors.indigoDeep} strokeWidth={2} strokeDasharray="10 8" />
          <line x1={0} y1={0.86 * priceH} x2={CW} y2={0.6 * priceH} stroke={colors.indigoDeep} strokeWidth={2} strokeDasharray="10 8" />
          <text x={CW - 10} y={0.42 * priceH} textAnchor="end" fill={colors.cyanDeep} fontSize={type.chip} fontWeight={font.weights.bold} fontFamily={font.family}>Quiet Squeeze</text>
        </svg>
      </div>

      <div style={{ position: "absolute", left: CX, top: CY + CH + 50 }}>
        <Chip label="Range 1.8% · Vol −62%" variant="cyan" delay={150} />
      </div>

    </SafeArea>
  );
};
