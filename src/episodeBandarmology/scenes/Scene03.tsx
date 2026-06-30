/**
 * Scene 03 — BANDARMOLOGY on the Order Book — worked example #1 (571, dur 175).
 * "Bandarmology" (96px indigo, textReveal) resolves upper-left; a realistic
 * OrderBook (STOCK A, Last Rp 1,205) fills the rest. The big-resting-bid tell is
 * annotated: the Rp 1,180 · 48,500 lot bid is highlighted (cyan) with a Callout,
 * plus a forward-link chip to broker data. Bid/ask neutral. "bandarmology" verbatim.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, OrderBook, Callout, Chip, IllustrationTag } from "../components";
import { theme } from "../theme";
import { textReveal, fadeIn } from "../helpers";
import { ASKS, BIDS } from "../stockA";

const { colors, font, type } = theme;

export const Scene03 = () => {
  const f = useCurrentFrame();

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 96, width: 700, fontSize: type.display, fontWeight: font.weights.extrabold, color: colors.indigo, letterSpacing: -1, ...textReveal(f, 8, 20) }}>
        Bandarmology
      </div>
      <div style={{ position: "absolute", left: 96, top: 220, width: 760, fontSize: type.descriptor, fontWeight: font.weights.medium, color: colors.slate, ...textReveal(f, 40, 18) }}>
        Bandarmology is reading the footprints big players leave — starting in the order book.
      </div>

      <OrderBook left={96} top={324} width={680} rowH={48} bids={BIDS} asks={ASKS} last="Rp 1,205" op={fadeIn(f, 20, 18)} />

      {/* big resting bid tell — the 1,180 row (4th bid) sits low in the book */}
      <Callout ax={776} ay={836} dx={120} dy={-40} width={520} body="A large resting bid sits well below the last price." op={fadeIn(f, 70, 16)} variant="cyan" />

      {f >= 120 && <Chip label="Who Placed It Shows In Broker Data" variant="outline" left={900} top={620} delay={120} />}

      <IllustrationTag left={1620} top={910} />
    </SafeArea>
  );
};
