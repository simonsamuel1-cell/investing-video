/**
 * Scene 17 — Mistake 2: Rank Without Value (4246, dur 290). A generic net-buy
 * ranking list (Broker A/B/C) with #1 highlighted; a second column "Value
 * Deployed" reveals where #1's bar is tiny and a lower rank's value bar is large
 * (~f130). Lesson: rank ≠ size. Label "2 · Rank Without Value".
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { fadeIn, tween, textReveal } from "../helpers";

const { colors, font, type, radius } = theme;

const ROWS = [
  { broker: "Broker A", rank: 1, value: 0.18 },
  { broker: "Broker B", rank: 2, value: 0.42 },
  { broker: "Broker C", rank: 3, value: 0.9 },
];

export const Scene17 = () => {
  const f = useCurrentFrame();
  const valReveal = tween(f, [130, 200], [0, 1]);

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 110, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, ...textReveal(f, 8, 18) }}>
        Rank Is Not Size
      </div>

      {/* column headers */}
      <div style={{ position: "absolute", left: 200, top: 250, width: 1450, display: "flex", color: colors.slateMute, fontSize: type.chip, fontWeight: font.weights.bold }}>
        <span style={{ width: 360 }}>Net-Buy Rank</span>
        <span style={{ opacity: fadeIn(f, 130, 16) }}>Value Deployed</span>
      </div>

      {ROWS.map((r, i) => (
        <div key={r.broker} style={{ position: "absolute", left: 200, top: 320 + i * 150, width: 1450, height: 120, display: "flex", alignItems: "center", opacity: fadeIn(f, 20 + i * 18, 16) }}>
          <div style={{ width: 360, display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ width: 64, height: 64, borderRadius: radius.pill, background: r.rank === 1 ? colors.indigo : colors.divider, color: r.rank === 1 ? colors.white : colors.slateMute, fontSize: type.subhead, fontWeight: font.weights.extrabold, display: "flex", alignItems: "center", justifyContent: "center" }}>{r.rank}</span>
            <span style={{ fontSize: type.subhead, fontWeight: font.weights.bold }}>{r.broker}</span>
          </div>
          <div style={{ flex: 1, height: 44 }}>
            <div style={{ height: "100%", width: `${r.value * valReveal * 100}%`, background: r.value > 0.8 ? colors.cyan : colors.cyanTint, borderRadius: 8 }} />
          </div>
        </div>
      ))}

      <div style={{ position: "absolute", left: 96, top: 800, ...textReveal(f, 8, 18) }}>
        <div style={{ fontSize: type.subhead, fontWeight: font.weights.extrabold }}>2 · Rank Without Value</div>
      </div>
    </SafeArea>
  );
};
