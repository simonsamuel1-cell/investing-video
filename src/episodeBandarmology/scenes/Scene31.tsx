/**
 * Scene 31 — Market Radar (8205, dur 274). [NEEDS DATA]. Header "Market Radar".
 * A radar/sweep motif (cyan sweep on an indigo grid) pings three aggression
 * chips: Big Orders · Fast Orders · Push To New Highs. The PhoneFrame (owned by
 * WorkflowStage) shows the Market Radar capture centered; this scene arranges the
 * radar motif + chips around it.
 *
 * TODO[NEEDS DATA]: real Market Radar capture lives in WorkflowStage's PhoneFrame
 * placeholder; swap there + add on-screen data date.
 */
import { useCurrentFrame, useVideoConfig } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { fadeIn, tween, textReveal, popIn } from "../helpers";

const { colors, font, type, radius } = theme;

const PINGS = [
  { label: "Big Orders", at: 60 },
  { label: "Fast Orders", at: 110 },
  { label: "Push To New Highs", at: 160 },
];

export const Scene31 = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sweep = tween(f, [0, 274], [0, 360 * 3]); // continuous rotation

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 210, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, ...textReveal(f, 8, 18) }}>
        Market Radar
      </div>

      {/* radar motif (left of the centered phone) */}
      <svg width={420} height={420} viewBox="-210 -210 420 420" style={{ position: "absolute", left: 150, top: 360, opacity: fadeIn(f, 10, 18) }}>
        {[60, 120, 180].map((r) => (
          <circle key={r} cx={0} cy={0} r={r} fill="none" stroke={colors.indigoTint} strokeWidth={2} />
        ))}
        <line x1={-180} y1={0} x2={180} y2={0} stroke={colors.indigoTint} strokeWidth={2} />
        <line x1={0} y1={-180} x2={0} y2={180} stroke={colors.indigoTint} strokeWidth={2} />
        <g transform={`rotate(${sweep})`}>
          <path d="M 0 0 L 180 0 A 180 180 0 0 1 140 110 Z" fill={colors.cyan} opacity={0.28} />
          <line x1={0} y1={0} x2={180} y2={0} stroke={colors.cyanDeep} strokeWidth={3} />
        </g>
      </svg>

      {/* aggression ping chips (right of the centered phone) */}
      <div style={{ position: "absolute", left: 1180, top: 400, width: 540, display: "flex", flexDirection: "column", gap: 26 }}>
        {PINGS.map((p) => (
          <div key={p.label} style={{ transform: `scale(${popIn(f, fps, p.at, true)})`, transformOrigin: "left center", padding: "16px 28px", borderRadius: radius.pill, background: colors.cyanTint, border: `2px solid ${colors.cyan}`, color: colors.cyanDeep, fontSize: type.descriptor, fontWeight: font.weights.bold, opacity: fadeIn(f, p.at, 12) }}>{p.label}</div>
        ))}
      </div>
    </SafeArea>
  );
};
