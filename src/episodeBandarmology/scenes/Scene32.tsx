/**
 * Scene 32 — Story changes (8498, dur 167). A centered caption swap (sentence
 * case): "Someone is quietly buying" dissolves to "Someone is making their move."
 * Paired with the chart transitioning a flat cost-area → a volume-driven lift
 * (callback Sc30), with indigo emphasis on the lift region. textReveal both.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, CandlestickChart } from "../components";
import { theme } from "../theme";
import { tween, fadeIn, fadeOut, genCandles } from "../helpers";

const { colors, font, type } = theme;

const CW = 1400;
const CH = 360;
const N = 56;
const LEVELS = Array.from({ length: N }, (_, i) => {
  const x = i / (N - 1);
  return x < 0.6 ? 0.4 + Math.sin(x * 22) * 0.02 : 0.4 + (x - 0.6) / 0.4 * 0.34;
});
const CANDLES = genCandles(LEVELS, 3232);
const VOL = Array.from({ length: N }, (_, i) => (i / (N - 1) > 0.58 ? 0.9 : 0.25));

export const Scene32 = () => {
  const f = useCurrentFrame();
  const prog = tween(f, [10, 150], [0, 1]);
  const firstOp = fadeOut(f, 70, 18);
  const secondOp = fadeIn(f, 80, 18);

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 240, width: 1728, textAlign: "center", height: 80 }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: "100%", fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.slate, opacity: firstOp }}>Someone is quietly buying</div>
        <div style={{ position: "absolute", left: 0, top: 0, width: "100%", fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.indigo, opacity: secondOp }}>Someone is making their move</div>
      </div>

      <div style={{ position: "absolute", left: 260, top: 420, width: CW, height: CH }}>
        <CandlestickChart width={CW} height={CH} candles={CANDLES} progress={prog} volume={VOL} />
        {/* indigo emphasis on the lift region */}
        <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: secondOp }}>
          <rect x={0.6 * CW} y={0} width={0.4 * CW} height={CH * 0.72} fill="none" stroke={colors.indigo} strokeWidth={2} strokeDasharray="8 8" rx={8} />
        </svg>
      </div>
    </SafeArea>
  );
};
