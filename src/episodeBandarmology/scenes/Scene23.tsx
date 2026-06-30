/**
 * Scene 23 — Step 1 Screen (5806, dur 359). [NEEDS DATA]. UI path chips in order:
 * Bullish Signals → Bandar Tracker → Flow → Dominant Brokers Analysis. The
 * PhoneFrame (owned by WorkflowStage) shows the Bandar Tracker capture, then
 * cross-dissolves to Dominant Brokers Analysis. This scene renders the path chips
 * and a side caption arranged AROUND the centered phone.
 *
 * TODO[NEEDS DATA]: real Bandar Tracker + Dominant Brokers Analysis captures live
 * in WorkflowStage's PhoneFrame placeholders; swap there + add data date.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { fadeIn, textReveal } from "../helpers";

const { colors, font, type, radius } = theme;

const PATH = ["Bullish Signals", "Bandar Tracker", "Flow", "Dominant Brokers Analysis"];

export const Scene23 = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      {/* caption (left column, clear of the centered phone at x760–1160) */}
      <div style={{ position: "absolute", left: 96, top: 230, width: 600, fontSize: type.subhead, fontWeight: font.weights.bold, color: colors.text, ...textReveal(f, 8, 18) }}>
        Open The Track That Shows Who Is Buying.
      </div>

      {/* UI path as a vertical stack down the left column */}
      <div style={{ position: "absolute", left: 96, top: 400, width: 600, display: "flex", flexDirection: "column", gap: 16 }}>
        {PATH.map((p, i) => (
          <div key={p} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
            <div style={{ padding: "12px 24px", borderRadius: radius.pill, background: i === PATH.length - 1 ? colors.indigo : colors.white, border: `2px solid ${colors.indigo}`, color: i === PATH.length - 1 ? colors.white : colors.indigo, fontSize: type.chip, fontWeight: font.weights.bold, opacity: fadeIn(f, 10 + i * 22, 14) }}>{p}</div>
            {i < PATH.length - 1 && <span style={{ color: colors.slateMute, fontSize: type.chip, opacity: fadeIn(f, 20 + i * 22, 14) }}>↓</span>}
          </div>
        ))}
      </div>
    </SafeArea>
  );
};
