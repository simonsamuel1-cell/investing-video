/**
 * Scene 30 — Step 3 Monitor: the trigger (7839, dur 352). Rail → Monitor
 * (WorkflowStage). Real app capture (portrait phone) of the trigger pattern —
 * price holds near the cost area, then lifts on volume. ⚠️ Pattern-descriptive,
 * NO buy arrow / entry marker. Header + caption beside the phone.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, CapturePhone } from "../components";
import { theme } from "../theme";
import { fadeIn, textReveal } from "../helpers";

const { colors, font, type } = theme;

export const Scene30 = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 1060, top: 250, width: 720, fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(f, 8, 18) }}>
        The pattern to watch
      </div>
      <div style={{ position: "absolute", left: 1060, top: 370, width: 720, fontSize: type.subhead, fontWeight: font.weights.medium, color: colors.slate, ...textReveal(f, 40, 18) }}>
        Holds near cost, then a lift on volume — an observed pattern, not a cue.
      </div>

      <CapturePhone cx={620} top={200} height={760} op={fadeIn(f, 10, 18)} imageLayers={[{ src: "bandarmology/scene30.jpg", op: 1 }]} />
    </SafeArea>
  );
};
