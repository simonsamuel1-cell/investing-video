/**
 * Scene 27 — Verify: Insider + Foreign (7058, dur 271). Two stacked clue cards:
 * "Insider Buying" (building icon, people leaning the same way) and "Foreign
 * Buying — Large Caps" (globe → inflow arrows into a big-cap block). The "tends
 * to" qualifier is a SOFT/probabilistic treatment (dashed, lower-opacity
 * certainty), not a guarantee.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, Card } from "../components";
import { theme } from "../theme";
import { fadeIn, textReveal } from "../helpers";

const { colors, font, type } = theme;

export const Scene27 = () => {
  const f = useCurrentFrame();

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 210, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, ...textReveal(f, 8, 18) }}>
        Two More Clues
      </div>

      {/* Insider Buying */}
      <div style={{ opacity: fadeIn(f, 20, 18) }}>
        <Card left={150} top={330} width={1450} height={200} title="Insider Buying">
          <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <svg width={90} height={90} viewBox="-45 -45 90 90" stroke={colors.indigo} strokeWidth={5} fill="none">
              <rect x={-30} y={-34} width={60} height={68} rx={6} />
              <line x1={-12} y1={-16} x2={-12} y2={20} />
              <line x1={12} y1={-16} x2={12} y2={20} />
            </svg>
            <span style={{ fontSize: type.descriptor, color: colors.slate, fontWeight: font.weights.medium }}>People Inside Leaning The Same Direction</span>
            {/* soft 'tends to' certainty */}
            <span style={{ marginLeft: "auto", padding: "10px 20px", borderRadius: 999, border: `2px dashed ${colors.cyan}`, color: colors.cyanDeep, fontSize: type.chip, fontWeight: font.weights.bold, opacity: 0.7 }}>Tends To</span>
          </div>
        </Card>
      </div>

      {/* Foreign Buying — Large Caps */}
      <div style={{ opacity: fadeIn(f, 110, 18) }}>
        <Card left={150} top={560} width={1450} height={200} title="Foreign Buying — Large Caps">
          <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <svg width={90} height={90} viewBox="-45 -45 90 90" stroke={colors.indigo} strokeWidth={5} fill="none">
              <circle cx={0} cy={0} r={36} />
              <path d="M -36 0 L 36 0 M 0 -36 L 0 36 M -26 -22 Q 0 -8 26 -22 M -26 22 Q 0 8 26 22" />
            </svg>
            <span style={{ fontSize: type.descriptor, color: colors.slate, fontWeight: font.weights.medium }}>Inflows Into A Big-Cap Block</span>
            <span style={{ marginLeft: "auto", padding: "10px 20px", borderRadius: 999, border: `2px dashed ${colors.cyan}`, color: colors.cyanDeep, fontSize: type.chip, fontWeight: font.weights.bold, opacity: 0.7 }}>Tends To</span>
          </div>
        </Card>
      </div>
    </SafeArea>
  );
};
