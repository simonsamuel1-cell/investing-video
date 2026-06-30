/**
 * Scene 24 — Three Checks (6173, dur 363). Checklist (callback to Scene 13,
 * narrowed to three; textReveal, no overlap): Continuous Buying + Holding A Lot? /
 * Price Still Near Their Cost? / Still Holding, No Selling? Small indigo icons.
 * (Phone is hidden this scene, so the full area is free.)
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { fadeIn, textReveal } from "../helpers";

const { colors, font, type, radius } = theme;

const CHECKS = [
  { label: "Continuous Buying + Holding A Lot?", icon: <g><circle cx={-18} cy={0} r={12} /><circle cx={14} cy={0} r={16} /></g>, at: 20 },
  { label: "Price Still Near Their Cost?", icon: <path d="M -30 10 L 30 10 M -30 -14 L 30 -14" />, at: 110 },
  { label: "Still Holding, No Selling?", icon: <path d="M -24 -22 L -24 22 L 24 22" />, at: 200 },
];

export const Scene24 = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 210, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, ...textReveal(f, 8, 18) }}>
        Three Checks
      </div>

      {CHECKS.map((c, i) => (
        <div key={i} style={{ position: "absolute", left: 200, top: 340 + i * 160, width: 1450, height: 120, display: "flex", alignItems: "center", gap: 28, ...textReveal(f, c.at, 18) }}>
          <span style={{ flex: "0 0 auto", width: 90, height: 90, borderRadius: radius.md, background: colors.indigoTint, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={60} height={60} viewBox="-30 -30 60 60" stroke={colors.indigo} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round">{c.icon}</svg>
          </span>
          <span style={{ fontSize: type.subhead, fontWeight: font.weights.bold, color: colors.text }}>{c.label}</span>
          <svg width={48} height={48} viewBox="0 0 48 48" style={{ marginLeft: "auto", opacity: fadeIn(f, c.at + 14, 14) }} stroke={colors.cyan} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 8 26 L 20 38 L 42 10" />
          </svg>
        </div>
      ))}
    </SafeArea>
  );
};
