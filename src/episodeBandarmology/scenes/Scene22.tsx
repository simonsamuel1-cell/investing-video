/**
 * Scene 22 — Three Steps (5609, dur 180). The rail's three cards (1 Screen ·
 * 2 Verify · 3 Monitor) are drawn by WorkflowStage; this scene adds the header
 * reveal and the cyan connectors animating in between the cards. Active = Screen.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { tween, textReveal } from "../helpers";

const { colors, font, type } = theme;

export const Scene22 = () => {
  const f = useCurrentFrame();
  const grow = tween(f, [20, 70], [0, 1]);

  return (
    <SafeArea>
      {/* cyan connectors between the rail cards (rail sits at y70–170) */}
      <svg width={1180} height={20} viewBox="0 0 1180 20" style={{ position: "absolute", left: 96, top: 116, overflow: "visible" }}>
        {[388, 788].map((x) => (
          <line key={x} x1={x} y1={10} x2={x + 22} y2={10} stroke={colors.cyan} strokeWidth={6} strokeLinecap="round" strokeDasharray={22} strokeDashoffset={22 * (1 - grow)} />
        ))}
      </svg>

      <div style={{ position: "absolute", left: 96, top: 280, width: 1728, textAlign: "center", fontSize: type.header, fontWeight: font.weights.extrabold, ...textReveal(f, 8, 18) }}>
        Three Steps
      </div>
      <div style={{ position: "absolute", left: 96, top: 380, width: 1728, textAlign: "center", fontSize: type.subhead, fontWeight: font.weights.medium, color: colors.slate, ...textReveal(f, 60, 18) }}>
        Screen, Then Verify, Then Monitor
      </div>
    </SafeArea>
  );
};
