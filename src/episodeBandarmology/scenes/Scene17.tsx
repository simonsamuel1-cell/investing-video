/**
 * Scene 17 — Mistake 2: rank vs value (4246, dur 290). A BrokerTable (Rank ·
 * Broker · Net Lot · Value), #1 highlighted by rank; then the Value column reads
 * out and the table re-sorts by value (~f130): rank #1's value is small
 * (Rp 0.4 Bn) while rank #4 deployed Rp 9.8 Bn. Caption + title.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, BrokerTable, IllustrationTag } from "../components";
import { theme } from "../theme";
import { textReveal, fadeIn, tween } from "../helpers";

const { colors, font, type } = theme;

const COLS = [
  { key: "rank", label: "Rank", flex: 0.7 },
  { key: "broker", label: "Broker", flex: 1.4 },
  { key: "net", label: "Net Lot", align: "right" as const, flex: 1 },
  { key: "value", label: "Value", align: "right" as const, flex: 1 },
];

// base order by rank; value leader is row index 3
const ROWS = [
  { cells: { rank: "1", broker: "Broker 05", net: "+640", value: "Rp 0.4 Bn" } },
  { cells: { rank: "2", broker: "Broker 02", net: "+520", value: "Rp 1.2 Bn" } },
  { cells: { rank: "3", broker: "Broker 07", net: "+480", value: "Rp 2.1 Bn" } },
  { cells: { rank: "4", broker: "Broker 01", net: "+410", value: "Rp 9.8 Bn" }, highlight: true },
  { cells: { rank: "5", broker: "Broker 03", net: "+360", value: "Rp 0.7 Bn" } },
];
const VALUE_ORDER = [3, 2, 1, 4, 0]; // by value desc

export const Scene17 = () => {
  const f = useCurrentFrame();
  const t = tween(f, [130, 200], [0, 1]);

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 110, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(f, 8, 18) }}>
        Rank is not size
      </div>

      <BrokerTable left={300} top={250} width={1320} columns={COLS} rows={ROWS} rowH={80} sort={{ order: VALUE_ORDER, t }} op={fadeIn(f, 10, 18)} />

      <div style={{ position: "absolute", left: 300, top: 760, width: 1320, fontSize: type.descriptor, fontWeight: font.weights.medium, color: colors.slate, opacity: fadeIn(f, 200, 18) }}>
        Topping the list with a small position isn't conviction.
      </div>

      <div style={{ position: "absolute", left: 96, top: 850, fontSize: type.subhead, fontWeight: font.weights.extrabold, color: colors.text }}>
        2 · Rank Without Value
      </div>

      <IllustrationTag left={1620} top={220} />
    </SafeArea>
  );
};
