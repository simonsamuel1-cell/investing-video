/**
 * Scene 21 — Honest caveat: gauge + counter-example (5232, dur 368). DISCLAIMER.
 * The five mistake slots recede (~0–60); a Gauge fills low→higher but is capped
 * ~70% (indigo on cyan track), labeled "Better Odds, Not A Guarantee". Beside it a
 * small CandlestickChart shows heavy net-buy → then a sell-off anyway; tag
 * (sentence case). Candle red is allowed in the down-move.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, Gauge, CandlestickChart, IllustrationTag } from "../components";
import { theme } from "../theme";
import { tween, fadeOut, fadeIn, textReveal, genCandles } from "../helpers";

const { colors, font, type, radius } = theme;

// rise then sell-off
const LEVELS = Array.from({ length: 36 }, (_, i) => {
  const x = i / 35;
  return x < 0.6 ? 0.35 + x * 0.7 : 0.77 - (x - 0.6) * 1.1;
});
const CANDLES = genCandles(LEVELS, 2121);

export const Scene21 = () => {
  const f = useCurrentFrame();
  const slotsOut = fadeOut(f, 0, 60);
  const val = tween(f, [90, 220], [0.12, 0.7]);
  const prog = tween(f, [120, 250], [0, 1]);

  return (
    <SafeArea>
      {/* receding mistake slots */}
      <div style={{ position: "absolute", left: 96, top: 200, width: 1728, display: "flex", justifyContent: "center", gap: 18, opacity: slotsOut }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} style={{ width: 120, height: 80, borderRadius: radius.md, border: `2px solid ${colors.cyan}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: type.subhead, fontWeight: font.weights.extrabold, color: colors.cyanDeep }}>{n}</div>
        ))}
      </div>

      {/* gauge */}
      <div style={{ position: "absolute", left: 96, top: 340, width: 800, opacity: fadeIn(f, 70, 18) }}>
        <Gauge left={0} top={0} width={760} value={val} cap={0.7} label="Better Odds, Not A Guarantee" />
      </div>

      {/* counter-example chart */}
      <div style={{ position: "absolute", left: 980, top: 300, width: 700, height: 440, background: colors.cardWhite, border: `2px solid ${colors.divider}`, borderRadius: radius.lg, padding: 22, boxSizing: "border-box", opacity: fadeIn(f, 110, 18) }}>
        <div style={{ fontSize: type.descriptor, fontWeight: font.weights.bold, color: colors.slate, marginBottom: 8 }}>Heavy net-buy, then…</div>
        <CandlestickChart width={656} height={340} candles={CANDLES} progress={prog} />
      </div>

      <div style={{ position: "absolute", left: 96, top: 640, width: 800, fontSize: type.descriptor, fontWeight: font.weights.medium, color: colors.slate, ...textReveal(f, 240, 18) }}>
        Even a clean read can still be followed by a sell-off.
      </div>

      <IllustrationTag left={1620} top={270} />
    </SafeArea>
  );
};
