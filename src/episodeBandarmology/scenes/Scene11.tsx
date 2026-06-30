/**
 * Scene 11 — Broker Flow + Trade Flow — worked example #2 (2502, dur 327).
 * Header "Public Data Tracks". Left: BrokerTable "Broker Flow" sorted by net buy,
 * top row Broker 01 highlighted, two Callouts (the broker tell + the low-avg
 * tell). Right: TradeFlow with large prints (ties back to Sc3's big bid). Three
 * StatCards reveal as the VO names each source. Indigo/cyan + neutral, no red/green.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, BrokerTable, TradeFlow, StatCard, Callout, IllustrationTag } from "../components";
import { theme } from "../theme";
import { textReveal, fadeIn } from "../helpers";
import { BROKER_SUMMARY } from "../stockA";

const { colors, font, type } = theme;

const COLS = [
  { key: "broker", label: "Broker", flex: 1.4 },
  { key: "net", label: "Net Lot", align: "right" as const, flex: 1 },
  { key: "avg", label: "Avg", align: "right" as const, flex: 1 },
  { key: "value", label: "Value", align: "right" as const, flex: 1 },
];

const PRINTS = [
  { time: "10:14:02", price: "1,180", lot: "48,500", buyer: "YP", seller: "CC", big: true },
  { time: "10:13:51", price: "1,182", lot: "3,200", buyer: "YP", seller: "PD" },
  { time: "10:13:40", price: "1,181", lot: "12,900", buyer: "YP", seller: "KK", big: true },
  { time: "10:13:22", price: "1,184", lot: "1,400", buyer: "NI", seller: "YP" },
  { time: "10:13:05", price: "1,182", lot: "9,800", buyer: "YP", seller: "CC", big: true },
];

export const Scene11 = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 96, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(f, 8, 18) }}>
        Public Data Tracks
      </div>

      <BrokerTable left={96} top={210} width={840} title="Broker Flow" columns={COLS} rows={BROKER_SUMMARY.slice(0, 5)} rowH={58} op={fadeIn(f, 20, 18)} revealCount={Math.floor(fadeIn(f, 20, 60) * 5 + 0.5)} />
      <TradeFlow left={988} top={210} width={680} title="Trade Flow" rows={PRINTS} rowH={54} op={fadeIn(f, 60, 18)} revealCount={Math.floor(fadeIn(f, 60, 70) * 5 + 0.5)} />

      <Callout ax={520} ay={300} dx={-40} dy={-150} width={460} body="One broker is doing most of the net buying." op={fadeIn(f, 120, 16)} variant="indigo" />
      <Callout ax={700} ay={300} dx={120} dy={250} width={420} body="Their average price sits low — they're accumulating cheap." op={fadeIn(f, 180, 16)} variant="cyan" />

      {/* public-data stat cards */}
      <StatCard left={96} top={730} width={510} height={170} label="Foreign Flow" value="+Rp 84 Bn" sub="Net buy, 10 days" op={fadeIn(f, 90, 18)} />
      <StatCard left={628} top={730} width={510} height={170} label="Insider Trades" value="3 filings" sub="Directors buying" op={fadeIn(f, 150, 18)} />
      <StatCard left={1160} top={730} width={510} height={170} label="Shareholders" value="18,420 → 14,905" sub="Concentrating" op={fadeIn(f, 210, 18)} />

      <IllustrationTag left={1620} top={170} />
    </SafeArea>
  );
};
