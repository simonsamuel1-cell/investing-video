/**
 * Scene 20 — Mistake 5: nego blind spot (5010, dur 216). The trader's view is
 * only the normal CandlestickChart (quiet); a hidden Nego BrokerTable is revealed
 * behind it with large crosses (10 M @ Rp 1,300) the chart never showed. Mismatch
 * badge (sentence case). Title (callback Sc12).
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, CandlestickChart, BrokerTable, IllustrationTag } from "../components";
import { theme } from "../theme";
import { tween, textReveal, fadeIn, genCandles } from "../helpers";

const { colors, font, type, radius } = theme;

const LEVELS = Array.from({ length: 36 }, (_, i) => 0.5 + Math.sin(i * 0.5) * 0.04);
const CANDLES = genCandles(LEVELS, 2020);

const NEGO = [
  { cells: { vol: "10 M", price: "Rp 1,300", type: "Cross" } },
  { cells: { vol: "6.2 M", price: "Rp 1,295", type: "Cross" } },
];
const COLS = [
  { key: "vol", label: "Vol", flex: 1 },
  { key: "price", label: "Price", align: "right" as const, flex: 1 },
  { key: "type", label: "Type", align: "right" as const, flex: 1 },
];

export const Scene20 = () => {
  const f = useCurrentFrame();
  const prog = tween(f, [10, 110], [0, 1]);
  const revealX = tween(f, [120, 170], [1180, 980]);

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 110, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(f, 8, 18) }}>
        The flow you can't see
      </div>

      {/* hidden nego table behind */}
      <div style={{ position: "absolute", left: revealX, top: 300, width: 700, border: `2px dashed ${colors.indigo}`, borderRadius: radius.lg, padding: 18, height: 320, boxSizing: "border-box", opacity: fadeIn(f, 120, 18) }}>
        <div style={{ fontSize: type.subhead, fontWeight: font.weights.extrabold, color: colors.indigoDeep, marginBottom: 10 }}>Nego — Hidden Crosses</div>
        <BrokerTable left={0} top={70} width={660} columns={COLS} rows={NEGO} rowH={64} op={fadeIn(f, 140, 18)} />
      </div>

      {/* normal chart in front */}
      <div style={{ position: "absolute", left: 96, top: 280, width: 760, height: 420, background: colors.cardWhite, border: `2px solid ${colors.divider}`, borderRadius: radius.lg, padding: 22, boxSizing: "border-box" }}>
        <div style={{ fontSize: type.descriptor, fontWeight: font.weights.bold, color: colors.slate, marginBottom: 8 }}>Normal Screen</div>
        <CandlestickChart width={716} height={330} candles={CANDLES} progress={prog} />
      </div>

      <div style={{ position: "absolute", left: 96, top: 740, width: 1500, fontSize: type.descriptor, fontWeight: font.weights.medium, color: colors.slate, opacity: fadeIn(f, 160, 18) }}>
        On-screen story isn't the off-screen flow.
      </div>

      <div style={{ position: "absolute", left: 96, top: 840, fontSize: type.subhead, fontWeight: font.weights.extrabold, color: colors.text }}>
        5 · Forgetting The Nego Market
      </div>

      <IllustrationTag left={1620} top={250} />
    </SafeArea>
  );
};
