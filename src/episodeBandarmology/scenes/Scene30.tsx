/**
 * Scene 30 — Step 3 Monitor: trigger sequence (7839, dur 352). ⚠️ Pattern-
 * descriptive, NO buy arrow / entry marker. A CandlestickChart sequence:
 * (1) "Cost Area" band drawn, (2) price holds flat near it, (3) volume spikes
 * (slate → cyan, "Vol +210%"), (4) price lifts away. Steps annotated as observed
 * events. Candle bodies allowed; no green elsewhere.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, CandlestickChart, IllustrationTag } from "../components";
import { theme } from "../theme";
import { tween, textReveal, fadeIn, genCandles } from "../helpers";

const { colors, font, type, radius } = theme;

const CW = 1500;
const CH = 440;
const CX = 210;
const CY = 300;
const N = 60;

const LEVELS = Array.from({ length: N }, (_, i) => {
  const x = i / (N - 1);
  return x < 0.7 ? 0.42 + Math.sin(x * 24) * 0.02 : 0.42 + (x - 0.7) / 0.3 * 0.34;
});
const CANDLES = genCandles(LEVELS, 3030);
const VOL = Array.from({ length: N }, (_, i) => (i / (N - 1) > 0.68 ? 0.95 : 0.25));
const VOL_COLORS = Array.from({ length: N }, (_, i) => (i / (N - 1) > 0.68 ? "green" : "slate")) as ("green" | "slate")[];

const STEPS = [
  { n: 1, label: "Cost Area", x: 0.04, at: 20 },
  { n: 2, label: "Holds flat near cost", x: 0.34, at: 90 },
  { n: 3, label: "Vol +210%", x: 0.7, at: 200 },
  { n: 4, label: "Lifts away", x: 0.9, at: 260 },
];

export const Scene30 = () => {
  const f = useCurrentFrame();
  const prog = tween(f, [10, 240], [0, 1]);

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 210, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(f, 8, 18) }}>
        The pattern to watch
      </div>

      <div style={{ position: "absolute", left: CX, top: CY, width: CW, height: CH }}>
        <CandlestickChart width={CW} height={CH} candles={CANDLES} progress={prog} volume={VOL} volumeColors={VOL_COLORS} refLines={[{ y: 0.42, label: "Cost Area" }]} />
      </div>

      {/* numbered observed-event tags */}
      {STEPS.map((s) => (
        <div key={s.n} style={{ position: "absolute", left: CX + s.x * CW, top: CY + CH + 30, display: "flex", alignItems: "center", gap: 12, opacity: fadeIn(f, s.at, 16) }}>
          <span style={{ width: 44, height: 44, borderRadius: radius.pill, background: colors.indigo, color: colors.white, fontSize: type.chip, fontWeight: font.weights.extrabold, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.n}</span>
          <span style={{ fontSize: type.chip, fontWeight: font.weights.bold, color: colors.slate }}>{s.label}</span>
        </div>
      ))}

      <IllustrationTag left={1620} top={270} />
    </SafeArea>
  );
};
