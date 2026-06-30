/**
 * Scene 14 — Avg cost vs price (distance %) (3453, dur 336). A CandlestickChart
 * with a dashed "Avg Cost Rp 1,180" line and a "Last Rp 1,205" marker. A vertical
 * distance bracket "+2.1% above avg cost" animates in (~f120), with a neutral
 * "Early"…"Late" spectrum strip. A gauge, not a signal. Figures fictional.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, CandlestickChart, IllustrationTag } from "../components";
import { theme } from "../theme";
import { tween, textReveal, fadeIn, genCandles } from "../helpers";

const { colors, font, type } = theme;

const CW = 1500;
const CH = 480;
const CX = 210;
const CY = 280;
const AVG = 0.42;
const LAST = 0.52;

const LEVELS = Array.from({ length: 48 }, (_, i) => {
  const x = i / 47;
  return 0.38 + x * 0.16 + Math.sin(x * 9) * 0.03;
});
const CANDLES = genCandles(LEVELS, 1414);

export const Scene14 = () => {
  const f = useCurrentFrame();
  const prog = tween(f, [10, 150], [0, 1]);
  const bracket = fadeIn(f, 120, 18);
  const priceH = CH * 1; // no volume panel here
  const avgY = (1 - AVG) * priceH;
  const lastY = (1 - LAST) * priceH;

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 110, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(f, 8, 18) }}>
        Average cost vs price
      </div>

      <div style={{ position: "absolute", left: CX, top: CY, width: CW, height: CH }}>
        <CandlestickChart width={CW} height={CH} candles={CANDLES} progress={prog} refLines={[{ y: AVG, label: "Avg Cost Rp 1,180" }]} />
        <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: bracket }}>
          {/* last marker */}
          <line x1={0} y1={lastY} x2={CW} y2={lastY} stroke={colors.slate} strokeWidth={2} strokeDasharray="4 6" />
          <text x={CW - 8} y={lastY - 10} textAnchor="end" fill={colors.text} fontSize={type.chip} fontWeight={font.weights.bold} fontFamily={font.family}>Last Rp 1,205</text>
          {/* distance bracket */}
          <line x1={CW - 60} y1={lastY} x2={CW - 60} y2={avgY} stroke={colors.indigoDeep} strokeWidth={3} />
          <line x1={CW - 80} y1={lastY} x2={CW - 40} y2={lastY} stroke={colors.indigoDeep} strokeWidth={3} />
          <line x1={CW - 80} y1={avgY} x2={CW - 40} y2={avgY} stroke={colors.indigoDeep} strokeWidth={3} />
          <rect x={CW - 320} y={(lastY + avgY) / 2 - 26} width={230} height={52} rx={8} fill={colors.indigo} />
          <text x={CW - 205} y={(lastY + avgY) / 2 + 8} textAnchor="middle" fill={colors.white} fontSize={type.chip} fontWeight={font.weights.bold} fontFamily={font.family}>+2.1% above avg cost</text>
        </svg>
      </div>

      {/* neutral Early…Late spectrum */}
      <div style={{ position: "absolute", left: CX, top: CY + CH + 28, width: CW, height: 44 }}>
        <div style={{ width: "100%", height: 16, borderRadius: 8, background: `linear-gradient(90deg, ${colors.cyanTint}, ${colors.slateFaint})` }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: type.chip, fontWeight: font.weights.bold, color: colors.slate }}>
          <span>Early</span>
          <span>Late</span>
        </div>
      </div>

      <IllustrationTag left={1620} top={250} />
    </SafeArea>
  );
};
