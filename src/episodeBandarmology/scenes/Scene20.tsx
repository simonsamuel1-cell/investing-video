/**
 * Scene 20 — Mistake 5: Nego (5010, dur 216). Callback to Scene 12. A trader
 * watches only the "Normal Screen" price line while large nego blocks move unseen
 * behind a dashed offset panel. A faint mismatch indicator: on-screen story ≠
 * off-screen flow. Label "5 · Forgetting The Nego Market".
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { fadeIn, tween, textReveal } from "../helpers";

const { colors, font, type, radius } = theme;

export const Scene20 = () => {
  const f = useCurrentFrame();
  const block = tween(f, [60, 200], [0, 1]);

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 110, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, ...textReveal(f, 8, 18) }}>
        The Flow You Can't See
      </div>

      {/* dashed nego panel (behind) with moving blocks */}
      <div style={{ position: "absolute", left: 760, top: 300, width: 800, height: 360, border: `2px dashed ${colors.indigo}`, background: colors.indigoSoft, borderRadius: radius.lg, opacity: fadeIn(f, 30, 18) }}>
        <div style={{ padding: 22, fontSize: type.chip, fontWeight: font.weights.bold, color: colors.indigoDeep }}>Nego Market</div>
        <div style={{ position: "absolute", left: 40 + block * 600, top: 160, width: 90, height: 90, background: colors.cyan, borderRadius: 10 }} />
      </div>

      {/* normal screen panel (front) with a trader watching */}
      <div style={{ position: "absolute", left: 150, top: 250, width: 560, height: 360, background: colors.card, border: `2px solid ${colors.divider}`, borderRadius: radius.lg, opacity: fadeIn(f, 10, 18), padding: 26 }}>
        <div style={{ fontSize: type.descriptor, fontWeight: font.weights.bold, color: colors.slate, marginBottom: 18 }}>Normal Screen</div>
        <svg width={500} height={200} viewBox="0 0 500 200" stroke={colors.indigo} strokeWidth={3} fill="none">
          <path d="M 10 150 L 90 130 L 170 140 L 260 120 L 340 132 L 490 118" />
        </svg>
      </div>

      <div style={{ position: "absolute", left: 150, top: 700, width: 1400, fontSize: type.descriptor, fontWeight: font.weights.medium, color: colors.slate, opacity: fadeIn(f, 150, 18) }}>
        On-Screen Story ≠ Off-Screen Flow
      </div>

      <div style={{ position: "absolute", left: 96, top: 820, ...textReveal(f, 8, 18) }}>
        <div style={{ fontSize: type.subhead, fontWeight: font.weights.extrabold }}>5 · Forgetting The Nego Market</div>
      </div>
    </SafeArea>
  );
};
