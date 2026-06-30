/**
 * Scene 21 — The Honest Caveat (5232, dur 368). DISCLAIMER beat (key compliance
 * mitigant). Five mistake slots recede (~0–60); a calm card "Better Odds, Not A
 * Guarantee" centers (~f80); a probability gauge nudges from low toward higher
 * but is capped well short of 100% (indigo fill, cyan track); a small
 * "Heavy Buying → Sell-Off Still Possible" mini-sequence (~f200). No red.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { fadeIn, fadeOut, tween, textReveal } from "../helpers";

const { colors, font, type, radius } = theme;

// semicircle gauge geometry (local to a 760×420 svg)
const R = 240;
const CXp = 380;
const CYp = 340;
const polar = (frac: number) => {
  const a = Math.PI * (1 - frac); // 0→π from right to left along the top
  return { x: CXp + R * Math.cos(a), y: CYp - R * Math.sin(a) };
};
const arcPath = (frac: number) => {
  const s = polar(0);
  const e = polar(frac);
  // never exceeds a semicircle (180°), so large-arc-flag is always 0; sweep 1
  // walks left → top → right along the upper arc.
  return `M ${s.x} ${s.y} A ${R} ${R} 0 0 1 ${e.x} ${e.y}`;
};

export const Scene21 = () => {
  const f = useCurrentFrame();
  const slotsOut = fadeOut(f, 0, 60);
  const fill = tween(f, [90, 200], [0.12, 0.62]); // capped well short of 1
  const needle = polar(fill);

  return (
    <SafeArea>
      {/* receding mistake slots */}
      <div style={{ position: "absolute", left: 96, top: 200, width: 1728, display: "flex", justifyContent: "center", gap: 18, opacity: slotsOut }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} style={{ width: 120, height: 80, borderRadius: radius.md, border: `2px solid ${colors.cyan}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: type.subhead, fontWeight: font.weights.extrabold, color: colors.cyanDeep }}>{n}</div>
        ))}
      </div>

      {/* calm statement card */}
      <div style={{ position: "absolute", left: 760, top: 250, width: 800, height: 200, background: colors.card, border: `2px solid ${colors.indigo}`, borderRadius: radius.lg, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24, ...textReveal(f, 80, 20) }}>
        <span style={{ fontSize: type.subhead, fontWeight: font.weights.extrabold, color: colors.text }}>Better Odds, Not A Guarantee</span>
      </div>

      {/* probability gauge */}
      <svg width={760} height={420} viewBox="0 0 760 420" style={{ position: "absolute", left: 150, top: 500, overflow: "visible", opacity: fadeIn(f, 90, 18) }}>
        <path d={arcPath(1)} fill="none" stroke={colors.cyanTint} strokeWidth={26} strokeLinecap="round" />
        <path d={arcPath(fill)} fill="none" stroke={colors.indigo} strokeWidth={26} strokeLinecap="round" />
        <line x1={CXp} y1={CYp} x2={needle.x} y2={needle.y} stroke={colors.indigoDeep} strokeWidth={6} strokeLinecap="round" />
        <circle cx={CXp} cy={CYp} r={14} fill={colors.indigoDeep} />
        <text x={CXp} y={CYp + 56} textAnchor="middle" fill={colors.slate} fontSize={type.chip} fontWeight={font.weights.bold} fontFamily={font.family}>Capped Short Of Certainty</text>
      </svg>

      {/* mini caveat sequence */}
      <div style={{ position: "absolute", left: 1080, top: 620, width: 640, opacity: fadeIn(f, 200, 18) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: type.descriptor, fontWeight: font.weights.bold }}>
          <span style={{ color: colors.indigoDeep }}>Heavy Buying</span>
          <span style={{ color: colors.slateMute }}>→</span>
          <span style={{ color: colors.slate }}>Sell-Off Still Possible</span>
        </div>
      </div>
    </SafeArea>
  );
};
