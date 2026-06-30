/**
 * Scene 01 — Order book: retail price ladder (0, dur 207). An OrderBook (STOCK A)
 * sits center-left; a retail order ticket slides in from the right (~f90): Qty 100
 * · "Retail Price" Rp 1,250, highlighting the ask row it fills (cyan). Bid/ask
 * rows neutral, NOT green/red. Header sentence case. "Illustration" tag.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, OrderBook, Card, IllustrationTag } from "../components";
import { theme } from "../theme";
import { tween, textReveal, fadeIn } from "../helpers";
import { ASKS, BIDS } from "../stockA";

const { colors, font, type } = theme;

const asks = ASKS.map((a, i) => ({ ...a, highlight: i === 4 }));
const bids = BIDS.map((b) => ({ ...b, highlight: false }));

export const Scene01 = () => {
  const f = useCurrentFrame();
  const ticketX = tween(f, [90, 130], [1920, 1180]);

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 96, width: 1272, fontSize: type.subhead, fontWeight: font.weights.bold, color: colors.text, ...textReveal(f, 8, 18) }}>
        Most of us walk in and buy a few lots at the going price.
      </div>

      <OrderBook left={150} top={210} width={680} bids={bids} asks={asks} last="Rp 1,205" op={fadeIn(f, 10, 18)} />

      {/* retail order ticket */}
      <div style={{ position: "absolute", left: ticketX, top: 360, opacity: fadeIn(f, 90, 16) }}>
        <Card width={560} title="Order Ticket">
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: type.descriptor }}>
            <span style={{ color: colors.slate }}>Qty</span>
            <span style={{ fontWeight: font.weights.bold, fontVariantNumeric: "tabular-nums" }}>100</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: type.descriptor }}>
            <span style={{ color: colors.slate }}>Retail Price</span>
            <span style={{ fontWeight: font.weights.extrabold, color: colors.cyanDeep, fontVariantNumeric: "tabular-nums" }}>Rp 1,250</span>
          </div>
        </Card>
      </div>

      <IllustrationTag left={1620} top={910} />
    </SafeArea>
  );
};
