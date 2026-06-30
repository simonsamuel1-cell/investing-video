/**
 * Scene 02 — Big order vs small order (224, dur 334). Same OrderBook; two order
 * tickets side by side with proportional volume bars + labeled numbers: Retail
 * Qty 100 · Rp 0.13 Mn vs Super-Wholesaler Qty 5,000,000 · Rp 6.25 Bn. A cyan
 * row-highlight sweeps (~f150) to the large resting bid deep in the book.
 * Chip "Super-Wholesaler". Numerics right-aligned.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, OrderBook, Chip, IllustrationTag } from "../components";
import { theme } from "../theme";
import { textReveal, fadeIn } from "../helpers";
import { ASKS, BIDS } from "../stockA";

const { colors, font, type, radius } = theme;

const TICKETS = [
  { label: "Retail", qty: "100", value: "Rp 0.13 Mn", bar: 0.04 },
  { label: "Super-Wholesaler", qty: "5,000,000", value: "Rp 6.25 Bn", bar: 1 },
];

export const Scene02 = () => {
  const f = useCurrentFrame();
  const swept = f >= 150;
  const bids = BIDS.map((b) => ({ ...b, highlight: swept && b.price === "1,180" }));
  const asks = ASKS.map((a) => ({ ...a, highlight: false }));

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 96, width: 1272, fontSize: type.subhead, fontWeight: font.weights.bold, color: colors.text, ...textReveal(f, 8, 18) }}>
        Some buyers move in sizes the rest of us never do.
      </div>

      <OrderBook left={150} top={210} width={680} bids={bids} asks={asks} last="Rp 1,205" op={fadeIn(f, 10, 18)} />

      {/* two proportional tickets */}
      <div style={{ position: "absolute", left: 920, top: 280, width: 720, display: "flex", flexDirection: "column", gap: 40 }}>
        {TICKETS.map((t, i) => (
          <div key={t.label} style={{ opacity: fadeIn(f, 30 + i * 30, 18) }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: type.descriptor, fontWeight: font.weights.bold, marginBottom: 12 }}>
              <span>{t.label}</span>
              <span style={{ color: colors.slate, fontVariantNumeric: "tabular-nums" }}>Qty {t.qty} · {t.value}</span>
            </div>
            <div style={{ height: 56, borderRadius: radius.md, background: colors.divider, overflow: "hidden" }}>
              <div style={{ width: `${Math.max(0.02, t.bar) * 100}%`, height: "100%", background: i === 1 ? colors.indigo : colors.cyan, borderRadius: radius.md }} />
            </div>
          </div>
        ))}
        <div style={{ marginTop: 10 }}>
          <Chip label="Super-Wholesaler" variant="indigo" bounce delay={200} />
        </div>
      </div>

      <IllustrationTag left={1620} top={910} />
    </SafeArea>
  );
};
