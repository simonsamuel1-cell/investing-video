/**
 * Scene 31 — Market Radar (8205, dur 274). Rail → Monitor (WorkflowStage). The
 * real Market Radar capture (scene31.mp4) plays in a centered phone — mounted
 * HERE (not in WorkflowStage) so the video plays from its own frame 0. Beside it
 * three alert cards light up: Big Orders · Fast Orders · Push To New Highs.
 */
import { useCurrentFrame, useVideoConfig } from "remotion";
import { SafeArea, CapturePhone } from "../components";
import { theme } from "../theme";
import { textReveal, fadeIn, fadeOut, popIn } from "../helpers";

const { colors, font, type, radius } = theme;

const ALERTS = [
  { label: "Big Orders", metric: "Order 4.2 M lot", at: 60 },
  { label: "Fast Orders", metric: "12 prints/sec", at: 110 },
  { label: "Push To New Highs", metric: "New High Rp 1,340", at: 160 },
];

export const Scene31 = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phoneOp = Math.min(fadeIn(f, 6, 12), fadeOut(f, 262, 12));

  return (
    <SafeArea>
      <CapturePhone video="bandarmology/scene31.mp4" cx={960} top={214} height={728} op={phoneOp} />

      <div style={{ position: "absolute", left: 96, top: 210, width: 600, fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(f, 8, 18) }}>
        Market Radar
      </div>
      <div style={{ position: "absolute", left: 96, top: 320, width: 600, fontSize: type.descriptor, fontWeight: font.weights.medium, color: colors.slate, ...textReveal(f, 40, 18) }}>
        Live aggression on the stock.
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
