/**
 * Scene 19 — Mistake 4: ignoring avg cost (4784, dur 214). The same chart twice:
 * left has no avg-cost line + "?" (can't judge); right adds the avg-cost line
 * (Rp 1,180) → "+2% — still near cost", with a stretched counter-example
 * "+41% — extended". Neutral gauge. Title (callback Sc14).
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, CandlestickChart, IllustrationTag } from "../components";
import { theme } from "../theme";
import { tween, textReveal, fadeIn, genCandles } from "../helpers";

const { colors, font, type } = theme;

const LEVELS = Array.from({ length: 40 }, (_, i) => 0.4 + (i / 39) * 0.12 + Math.sin(i * 0.5) * 0.03);
const CANDLES = genCandles(LEVELS, 1919);
const AVG = 0.44;

export const Scene19 = () => {
  const f = useCurrentFrame();
  const prog = tween(f, [10, 90], [0, 1]);
  const lineOp = fadeIn(f, 110, 14);

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 110, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(f, 8, 18) }}>
        Don't ignore average cost
      </div>

      {/* left: no avg line */}
      <div style={{ position: "absolute", left: 96, top: 300, width: 760, height: 420 }}>
        <CandlestickChart width={760} height={420} candles={CANDLES} progress={prog} />
        <svg width={760} height={420} viewBox="0 0 760 420" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <text x={620} y={120} textAnchor="middle" fill={colors.slateMute} fontSize={72} fontWeight={font.weights.extrabold} fontFamily={font.family} opacity={fadeIn(f, 40, 14) * (1 - lineOp)}>?</text>
        </svg>
        <div style={{ textAlign: "center", fontSize: type.descriptor, fontWeight: font.weights.bold, color: colors.slate, marginTop: 8 }}>No avg cost — can't judge</div>
      </div>

      {/* right: avg line added */}
      <div style={{ position: "absolute", left: 940, top: 300, width: 760, height: 420 }}>
        <CandlestickChart width={760} height={420} candles={CANDLES} progress={prog} refLines={lineOp > 0.02 ? [{ y: AVG, label: "Avg Cost Rp 1,180" }] : []} />
        <div style={{ position: "absolute", left: 20, top: 0, opacity: lineOp, display: "flex", gap: 14 }}>
          <span style={{ padding: "8px 18px", borderRadius: 8, background: colors.cyanTint, color: colors.cyanDeep, fontSize: type.chip, fontWeight: font.weights.bold }}>+2% — still near cost</span>
          <span style={{ padding: "8px 18px", borderRadius: 8, background: colors.divider, color: colors.slate, fontSize: type.chip, fontWeight: font.weights.bold }}>vs +41% — extended</span>
        </div>
        <div style={{ textAlign: "center", fontSize: type.descriptor, fontWeight: font.weights.bold, color: colors.indigoDeep, marginTop: 8 }}>With avg cost — readable</div>
      </div>

      <div style={{ position: "absolute", left: 96, top: 840, fontSize: type.subhead, fontWeight: font.weights.extrabold, color: colors.text }}>
        4 · Ignoring Average Cost
      </div>

      <IllustrationTag left={1620} top={270} />
    </SafeArea>
  );
};
