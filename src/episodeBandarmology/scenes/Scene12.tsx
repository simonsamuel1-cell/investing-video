/**
 * Scene 12 — Nego market table (2849, dur 249). Left: a small live CandlestickChart
 * ticking. Right: a dashed-border "Nego / Negotiated Deals" BrokerTable set apart
 * (Vol · Price · Type, all Cross). A connector shows deals happening beside the
 * visible price. Chip "Nego Market" (verbatim). Sentence-case note.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, CandlestickChart, BrokerTable, Chip, IllustrationTag } from "../components";
import { theme } from "../theme";
import { tween, textReveal, fadeIn, genCandles } from "../helpers";

const { colors, font, type, radius } = theme;

const LEVELS = Array.from({ length: 40 }, (_, i) => 0.45 + Math.sin(i * 0.4) * 0.06 + (i / 39) * 0.04);
const CANDLES = genCandles(LEVELS, 1212);

const NEGO = [
  { cells: { vol: "10 M", price: "Rp 1,300", type: "Cross" } },
  { cells: { vol: "7.5 M", price: "Rp 1,290", type: "Cross" } },
];
const COLS = [
  { key: "vol", label: "Vol", flex: 1 },
  { key: "price", label: "Price", align: "right" as const, flex: 1 },
  { key: "type", label: "Type", align: "right" as const, flex: 1 },
];

export const Scene12 = () => {
  const f = useCurrentFrame();
  const prog = tween(f, [10, 120], [0, 1]);

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 96, width: 1272, fontSize: type.subhead, fontWeight: font.weights.bold, color: colors.text, ...textReveal(f, 8, 18) }}>
        Big deals arranged off the normal screen still leave a record.
      </div>

      {/* normal screen */}
      <div style={{ position: "absolute", left: 96, top: 280, width: 800, height: 480, background: colors.cardWhite, border: `2px solid ${colors.divider}`, borderRadius: radius.lg, padding: 24, boxSizing: "border-box", opacity: fadeIn(f, 10, 18) }}>
        <div style={{ fontSize: type.descriptor, fontWeight: font.weights.bold, color: colors.slate, marginBottom: 10 }}>Normal Screen</div>
        <CandlestickChart width={740} height={380} candles={CANDLES} progress={prog} />
      </div>

      {/* nego deals table */}
      <div style={{ position: "absolute", left: 980, top: 300, width: 700, height: 420, border: `2px dashed ${colors.indigo}`, borderRadius: radius.lg, padding: 18, boxSizing: "border-box", opacity: fadeIn(f, 60, 18) }}>
        <div style={{ fontSize: type.subhead, fontWeight: font.weights.extrabold, color: colors.indigoDeep, marginBottom: 12 }}>Nego / Negotiated Deals</div>
        <BrokerTable left={0} top={70} width={660} columns={COLS} rows={NEGO} rowH={64} op={fadeIn(f, 80, 18)} />
        <div style={{ position: "absolute", left: 18, top: 300, width: 660 }}>
          <Chip label="Nego Market" variant="indigo" bounce delay={120} />
        </div>
      </div>

      <IllustrationTag left={1620} top={250} />
    </SafeArea>
  );
};
