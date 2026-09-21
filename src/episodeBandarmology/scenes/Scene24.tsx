/**
 * Scene 24 — Screen: three checks (6173, dur 363). Checklist (callback Sc13,
 * narrowed to three), each row sentence case + a data widget: continuous buying
 * (concentration % chip) · price near cost (avg-cost +%) · still holding (steady
 * net-position). Cyan tick per confirm. (Phone hidden this scene; full area free.)
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { fadeIn, textReveal } from "../helpers";

const { colors, font, type, radius } = theme;

const CHECKS = [
  { q: "Is one player buying continuously and holding a lot?", widget: "46% of volume", at: 20 },
  { q: "Is price still close to what they paid?", widget: "+2% vs avg", at: 110 },
  { q: "Are they still holding, with no selling?", widget: "Net steady", at: 200 },
];

export const Scene24 = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 210, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(f, 8, 18) }}>
        Three checks
      </div>

      {CHECKS.map((c, i) => (
        <div key={i} style={{ position: "absolute", left: 150, top: 340 + i * 160, width: 1500, height: 120, display: "flex", alignItems: "center", gap: 28, ...textReveal(f, c.at, 18) }}>
          <span style={{ flex: "0 0 auto", width: 72, height: 72, borderRadius: radius.pill, background: colors.indigoTint, color: colors.indigo, fontSize: type.subhead, fontWeight: font.weights.extrabold, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
          <span style={{ fontSize: type.subhead, fontWeight: font.weights.bold, color: colors.text }}>{c.q}</span>
          <span style={{ marginLeft: "auto", padding: "10px 22px", borderRadius: radius.sm, background: colors.cyanTint, color: colors.cyanDeep, fontSize: type.chip, fontWeight: font.weights.bold, opacity: fadeIn(f, c.at + 10, 14) }}>{c.widget}</span>
          <svg width={48} height={48} viewBox="0 0 48 48" style={{ opacity: fadeIn(f, c.at + 18, 14) }} stroke={colors.cyan} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 8 26 L 20 38 L 42 10" />
          </svg>
        </div>
      ))}
    </SafeArea>
  );
};
