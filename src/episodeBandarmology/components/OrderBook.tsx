/**
 * OrderBook — market-depth panel. Ask rows on top, a Last Price strip, Bid rows
 * below. Columns: Price · Lot · # orders. Cumulative depth bars sit behind each
 * side. Bid/ask rows are NEUTRAL intensity (indigo/cyan tint) — NOT green/red
 * (§0.4). A row can be highlighted (cyan) for the "tells".
 */
import { theme } from "../theme";

const { colors, font, type, radius } = theme;

export type BookRow = { price: string; lot: number; orders: number; highlight?: boolean };

const fmt = (n: number) => n.toLocaleString("en-US");

export const OrderBook = ({
  left,
  top,
  width,
  rowH = 56,
  bids,
  asks,
  last,
  op = 1,
}: {
  left: number;
  top: number;
  width: number;
  rowH?: number;
  bids: BookRow[];
  asks: BookRow[];
  last: string;
  op?: number;
}) => {
  const maxLot = Math.max(...bids.map((b) => b.lot), ...asks.map((a) => a.lot));
  const colP = width * 0.4;
  const colL = width * 0.34;

  const Row = ({ r, side }: { r: BookRow; side: "bid" | "ask" }) => {
    const depth = (r.lot / maxLot) * width;
    const tint = side === "bid" ? colors.indigoTint : colors.cyanTint;
    return (
      <div style={{ position: "relative", height: rowH, display: "flex", alignItems: "center", borderBottom: `1px solid ${colors.divider}` }}>
        <div style={{ position: "absolute", right: 0, top: 0, height: "100%", width: depth, background: r.highlight ? colors.cyan : tint, opacity: r.highlight ? 0.5 : 1, borderRadius: 4 }} />
        <div style={{ position: "relative", width: colP, paddingLeft: 20, fontSize: type.descriptor, fontWeight: font.weights.bold, color: colors.text }}>{r.price}</div>
        <div style={{ position: "relative", width: colL, textAlign: "right", fontSize: type.descriptor, fontWeight: font.weights.medium, color: colors.slate, fontVariantNumeric: "tabular-nums" }}>{fmt(r.lot)}</div>
        <div style={{ position: "relative", flex: 1, textAlign: "right", paddingRight: 20, fontSize: type.chip, color: colors.slateMute, fontVariantNumeric: "tabular-nums" }}>{r.orders}</div>
      </div>
    );
  };

  return (
    <div style={{ position: "absolute", left, top, width, opacity: op, background: colors.cardWhite, border: `2px solid ${colors.divider}`, borderRadius: radius.lg, overflow: "hidden" }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", height: 48, background: colors.indigoSoft, padding: "0 20px", fontSize: type.chip, fontWeight: font.weights.bold, color: colors.slate }}>
        <div style={{ width: colP - 20 }}>Price</div>
        <div style={{ width: colL, textAlign: "right" }}>Lot</div>
        <div style={{ flex: 1, textAlign: "right" }}>Orders</div>
      </div>
      {asks.map((a, i) => (
        <Row key={`a-${i}`} r={a} side="ask" />
      ))}
      {/* last price strip */}
      <div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, background: colors.indigo, color: colors.white, fontSize: type.descriptor, fontWeight: font.weights.extrabold }}>
        <span style={{ fontSize: type.chip, fontWeight: font.weights.medium, opacity: 0.85 }}>Last</span>
        {last}
      </div>
      {bids.map((b, i) => (
        <Row key={`b-${i}`} r={b} side="bid" />
      ))}
    </div>
  );
};
