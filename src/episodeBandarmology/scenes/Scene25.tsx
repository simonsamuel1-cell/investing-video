/**
 * Scene 25 — Big-picture before/after (6552, dur 200). A before→after metric swap
 * on one Card: Before "Nobody In Charge" top broker 11%, scattered → After
 * "Serious Money Building" top broker 46%, net-buy 14 days. Numbers count up with
 * a connecting arrow. Header sentence case.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { tween, textReveal, fadeIn } from "../helpers";

const { colors, font, type, radius } = theme;

export const Scene25 = () => {
  const f = useCurrentFrame();
  const topPct = Math.round(tween(f, [70, 150], [11, 46]));
  const days = Math.round(tween(f, [70, 150], [0, 14]));

  const Panel = ({ left, title, lines, accent }: { left: number; title: string; lines: string[]; accent: string }) => (
    <div style={{ position: "absolute", left, top: 360, width: 620, height: 360, background: colors.cardWhite, border: `2px solid ${accent}`, borderRadius: radius.lg, padding: 32, boxSizing: "border-box" }}>
      <div style={{ fontSize: type.subhead, fontWeight: font.weights.extrabold, color: accent }}>{title}</div>
      {lines.map((l, i) => (
        <div key={i} style={{ fontSize: type.descriptor, fontWeight: font.weights.bold, color: colors.text, marginTop: 22, fontVariantNumeric: "tabular-nums" }}>{l}</div>
      ))}
    </div>
  );

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 210, width: 1272, fontSize: type.subhead, fontWeight: font.weights.bold, color: colors.text, ...textReveal(f, 8, 18) }}>
        Is ownership shifting from nobody in charge to serious money building?
      </div>

      <Panel left={150} title="Before — Nobody In Charge" lines={["Top broker: 11%", "Holding: scattered"]} accent={colors.slate} />
      <div style={{ position: "absolute", left: 800, top: 510, fontSize: 80, color: colors.slateMute, opacity: fadeIn(f, 60, 16) }}>→</div>
      <Panel left={950} title="After — Serious Money Building" lines={[`Top broker: ${topPct}%`, `Net-buy: ${days} days`]} accent={colors.indigo} />
    </SafeArea>
  );
};
