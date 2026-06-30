/**
 * Scene 33 — For Short-Term Traders (8670, dur 350). ⚠️ STRONGEST compliance
 * flag. Visuals are about RISK DISCIPLINE, not entry encouragement. Lead with the
 * caveat half "Signals Can Fail" (~f0–120). Three discipline chips: Size Carefully
 * · Know Your Exit · Manage Risk (cyan). NO "enter here" arrow, NO instrument with
 * an entry marker. The "more efficient" clause stays audio-only.
 *
 * Recommend reviewing against the OJK advice-line before lock.
 */
import { useCurrentFrame, useVideoConfig } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { fadeIn, textReveal, popIn } from "../helpers";

const { colors, font, type, radius } = theme;

const DISCIPLINE = [
  { label: "Size Carefully", at: 150 },
  { label: "Know Your Exit", at: 200 },
  { label: "Manage Risk", at: 250 },
];

export const Scene33 = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SafeArea>
      {/* caveat half leads */}
      <div style={{ position: "absolute", left: 96, top: 280, width: 1728, textAlign: "center", fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.indigoDeep, ...textReveal(f, 8, 20) }}>
        Signals Can Fail
      </div>
      <div style={{ position: "absolute", left: 96, top: 380, width: 1728, textAlign: "center", fontSize: type.subhead, fontWeight: font.weights.medium, color: colors.slate, opacity: fadeIn(f, 60, 18) }}>
        For Short-Term Traders, Discipline Comes First
      </div>

      {/* discipline chips */}
      <div style={{ position: "absolute", left: 96, top: 520, width: 1728, display: "flex", justifyContent: "center", gap: 40 }}>
        {DISCIPLINE.map((d) => (
          <div key={d.label} style={{ transform: `scale(${popIn(f, fps, d.at, true)})`, padding: "22px 40px", borderRadius: radius.pill, background: colors.cyanTint, border: `2px solid ${colors.cyan}`, color: colors.cyanDeep, fontSize: type.subhead, fontWeight: font.weights.bold, opacity: fadeIn(f, d.at, 12) }}>{d.label}</div>
        ))}
      </div>
    </SafeArea>
  );
};
