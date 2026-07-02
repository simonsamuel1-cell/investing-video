/**
 * Scene 15 — Broker Summary annotated — worked example #3 + 5-mistakes roadmap
 * (3797, dur 157). A realistic BrokerTable "Broker Summary" (STOCK A, brokers
 * 01–09) sorted by net lot. All three tells annotated (sequential Callouts):
 * dominant net buyer, low avg price, and the cross-link back to Sc3's resting bid.
 * Then a translucent surface line sweeps the top rows and five numbered "Five
 * Classic Mistakes" slots resolve on the right — the roadmap for Sc16–20.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, BrokerTable, Callout, Chip } from "../components";
import { theme } from "../theme";
import { textReveal, fadeIn, tween } from "../helpers";
import { BROKER_SUMMARY } from "../stockA";

const { colors, font, type, radius } = theme;

const COLS = [
  { key: "broker", label: "Broker", flex: 1.3 },
  { key: "net", label: "Net Lot", align: "right" as const, flex: 1 },
  { key: "avg", label: "Avg Price", align: "right" as const, flex: 1 },
  { key: "value", label: "Value", align: "right" as const, flex: 1 },
  { key: "pct", label: "% of Volume", align: "right" as const, flex: 1.1 },
];

const MISTAKES = ["One Day", "Rank vs Value", "Concentration", "Average Cost", "Nego Blind Spot"];

export const Scene15 = () => {
  const f = useCurrentFrame();
  const sweep = tween(f, [60, 120], [0, 1]);

  return (
    <SafeArea>
      <BrokerTable left={96} top={170} width={1000} title="Broker Summary" columns={COLS} rows={BROKER_SUMMARY} rowH={52} op={fadeIn(f, 0, 16)} />

      {/* translucent surface line sweeping the top rows */}
      <div style={{ position: "absolute", left: 96, top: 266 + sweep * 160, width: 1000, height: 3, background: colors.cyan, opacity: 0.45 * sweep }} />

      {/* three tells — boxes stacked in the right column, clear of table + roadmap */}
      <Callout ax={700} ay={300} dx={440} dy={-90} width={470} body="One broker is doing most of the net buying." op={fadeIn(f, 20, 14)} variant="indigo" />
      <Callout ax={620} ay={320} dx={510} dy={60} width={470} body="Their average price is low — they loaded up cheap." op={fadeIn(f, 50, 14)} variant="cyan" />
      {f >= 90 && <Chip label="Placed The Rp 1,180 Bid In Scene 3" variant="outline" left={96} top={774} delay={90} />}

      {/* five-mistakes roadmap */}
      <div style={{ position: "absolute", left: 1180, top: 520, width: 640 }}>
        <div style={{ fontSize: type.subhead, fontWeight: font.weights.extrabold, color: colors.text, marginBottom: 14, ...textReveal(f, 70, 16) }}>Five Classic Mistakes</div>
        {MISTAKES.map((m, i) => (
          <div key={m} style={{ height: 56, marginBottom: 8, borderRadius: radius.md, border: `2px solid ${colors.cyan}`, display: "flex", alignItems: "center", gap: 18, paddingLeft: 22, opacity: fadeIn(f, 90 + i * 10, 14) }}>
            <span style={{ fontSize: type.subhead, fontWeight: font.weights.extrabold, color: colors.cyanDeep }}>{i + 1}</span>
            <span style={{ fontSize: type.descriptor, fontWeight: font.weights.bold, color: colors.text }}>{m}</span>
          </div>
        ))}
      </div>

    </SafeArea>
  );
};
