/**
 * Scene 31 — Market Radar (8205, dur 274). [NEEDS DATA]. Rail → Monitor. Header
 * "Market Radar". The PhoneFrame (WorkflowStage) shows the Market Radar capture
 * centered; beside it three alert cards light up: Big Orders (4.2 M lot) · Fast
 * Orders (12 prints/sec) · Push To New Highs (New High Rp 1,340). Arranged clear
 * of the centered phone.
 *
 * TODO[NEEDS DATA]: real Market Radar capture lives in WorkflowStage's PhoneFrame
 * placeholder; swap there + add data date.
 */
import { useCurrentFrame, useVideoConfig } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { textReveal, fadeIn, popIn } from "../helpers";

const { colors, font, type, radius } = theme;

const ALERTS = [
  { label: "Big Orders", metric: "Order 4.2 M lot", at: 60 },
  { label: "Fast Orders", metric: "12 prints/sec", at: 110 },
  { label: "Push To New Highs", metric: "New High Rp 1,340", at: 160 },
];

export const Scene31 = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 210, width: 600, fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(f, 8, 18) }}>
        Market Radar
      </div>
      <div style={{ position: "absolute", left: 96, top: 320, width: 600, fontSize: type.descriptor, fontWeight: font.weights.medium, color: colors.slate, ...textReveal(f, 40, 18) }}>
        Live aggression on STOCK A.
      </div>

      {/* alert cards right of the centered phone */}
      <div style={{ position: "absolute", left: 1190, top: 320, width: 530, display: "flex", flexDirection: "column", gap: 24 }}>
        {ALERTS.map((a) => (
          <div key={a.label} style={{ transform: `scale(${popIn(f, fps, a.at, true)})`, transformOrigin: "left center", padding: "22px 28px", borderRadius: radius.md, background: colors.cyanTint, border: `2px solid ${colors.cyan}`, opacity: fadeIn(f, a.at, 12) }}>
            <div style={{ fontSize: type.descriptor, fontWeight: font.weights.extrabold, color: colors.cyanDeep }}>{a.label}</div>
            <div style={{ fontSize: type.chip, fontWeight: font.weights.bold, color: colors.slate, marginTop: 6, fontVariantNumeric: "tabular-nums" }}>{a.metric}</div>
          </div>
        ))}
      </div>
    </SafeArea>
  );
};
