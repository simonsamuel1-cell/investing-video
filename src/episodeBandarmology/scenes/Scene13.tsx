/**
 * Scene 13 — Four questions checklist (3098, dur 339; zero gap from Sc12). A Card
 * checklist, four rows in sequence (textReveal, no overlap), each with an indigo
 * numeral and a small data widget: who is buying (broker chip) · how much (lot
 * figure) · what price (avg-cost tag) · has quiet buying become a real move
 * (mini up-tick sparkline). Rows sentence case. Reused (narrowed) in Sc24.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { fadeIn, textReveal } from "../helpers";

const { colors, font, type, radius } = theme;

const SPARK = [0.2, 0.25, 0.22, 0.3, 0.45, 0.6, 0.8];

const Widget = ({ kind }: { kind: string }) => {
  if (kind === "broker")
    return <span style={{ padding: "8px 18px", borderRadius: radius.pill, background: colors.indigo, color: colors.white, fontSize: type.chip, fontWeight: font.weights.bold }}>Broker 01</span>;
  if (kind === "lot")
    return <span style={{ fontSize: type.subhead, fontWeight: font.weights.extrabold, color: colors.text, fontVariantNumeric: "tabular-nums" }}>+9,420 lot</span>;
  if (kind === "avg")
    return <span style={{ padding: "8px 18px", borderRadius: radius.sm, background: colors.cyanTint, color: colors.cyanDeep, fontSize: type.chip, fontWeight: font.weights.bold }}>Avg Rp 1,182</span>;
  return (
    <svg width={140} height={48} viewBox="0 0 140 48">
      <path d={SPARK.map((v, i) => `${i === 0 ? "M" : "L"} ${(i / (SPARK.length - 1)) * 140} ${(1 - v) * 48}`).join(" ")} fill="none" stroke={colors.cyan} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const QS = [
  { q: "Who is buying?", kind: "broker", at: 20 },
  { q: "How much?", kind: "lot", at: 100 },
  { q: "What price did they pay?", kind: "avg", at: 190 },
  { q: "Has quiet buying become a real move?", kind: "spark", at: 280 },
];

export const Scene13 = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 110, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(f, 8, 18) }}>
        Four questions
      </div>

      {QS.map((item, i) => (
        <div key={i} style={{ position: "absolute", left: 200, top: 270 + i * 150, width: 1450, height: 120, display: "flex", alignItems: "center", gap: 28, ...textReveal(f, item.at, 18) }}>
          <span style={{ flex: "0 0 auto", width: 72, height: 72, borderRadius: radius.pill, background: colors.indigoTint, color: colors.indigo, fontSize: type.subhead, fontWeight: font.weights.extrabold, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
          <span style={{ fontSize: type.subhead, fontWeight: font.weights.bold, color: colors.text }}>{item.q}</span>
          <span style={{ marginLeft: "auto", opacity: fadeIn(f, item.at + 12, 14) }}>
            <Widget kind={item.kind} />
          </span>
        </div>
      ))}
    </SafeArea>
  );
};
