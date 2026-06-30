/**
 * TradeFlow — running time-and-sales list (Time · Price · Lot · Buyer→Seller).
 * Large prints are highlighted (cyan tint). Reveal rows by `revealCount`.
 */
import { theme } from "../theme";

const { colors, font, type, radius } = theme;

export type Print = { time: string; price: string; lot: string; buyer: string; seller: string; big?: boolean };

export const TradeFlow = ({
  left,
  top,
  width,
  title,
  rows,
  rowH = 56,
  revealCount,
  op = 1,
}: {
  left: number;
  top: number;
  width: number;
  title?: string;
  rows: Print[];
  rowH?: number;
  revealCount?: number;
  op?: number;
}) => {
  const shown = revealCount ?? rows.length;
  return (
    <div style={{ position: "absolute", left, top, width, opacity: op, background: colors.cardWhite, border: `2px solid ${colors.divider}`, borderRadius: radius.lg, overflow: "hidden" }}>
      {title && <div style={{ padding: "18px 18px 8px", fontSize: type.subhead, fontWeight: font.weights.extrabold, color: colors.text }}>{title}</div>}
      <div style={{ display: "flex", height: 48, alignItems: "center", background: colors.indigoSoft, fontSize: type.chip, fontWeight: font.weights.bold, color: colors.slate }}>
        <div style={{ width: "20%", padding: "0 18px" }}>Time</div>
        <div style={{ width: "24%", textAlign: "right", padding: "0 18px" }}>Price</div>
        <div style={{ width: "24%", textAlign: "right", padding: "0 18px" }}>Lot</div>
        <div style={{ width: "32%", textAlign: "right", padding: "0 18px" }}>Buyer→Seller</div>
      </div>
      {rows.map((r, i) =>
        i < shown ? (
          <div key={i} style={{ display: "flex", height: rowH, alignItems: "center", background: r.big ? colors.cyanTint : "transparent", borderBottom: `1px solid ${colors.divider}`, fontVariantNumeric: "tabular-nums" }}>
            <div style={{ width: "20%", padding: "0 18px", fontSize: type.chip, color: colors.slateMute }}>{r.time}</div>
            <div style={{ width: "24%", textAlign: "right", padding: "0 18px", fontSize: type.descriptor, fontWeight: font.weights.bold, color: colors.text }}>{r.price}</div>
            <div style={{ width: "24%", textAlign: "right", padding: "0 18px", fontSize: type.descriptor, fontWeight: r.big ? font.weights.bold : font.weights.medium, color: r.big ? colors.cyanDeep : colors.slate }}>{r.lot}</div>
            <div style={{ width: "32%", textAlign: "right", padding: "0 18px", fontSize: type.chip, color: colors.slate }}>{r.buyer}→{r.seller}</div>
          </div>
        ) : null,
      )}
    </div>
  );
};
