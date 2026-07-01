/**
 * Scene 14 — Avg cost vs price (3453, dur 336). Real app captures (portrait
 * phone) cross-dissolving two views of the average-cost read. Header + caption
 * beside the phone. Figures/date are in the capture.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, CapturePhone } from "../components";
import { theme } from "../theme";
import { fadeIn, textReveal } from "../helpers";

const { colors, font, type } = theme;

export const Scene14 = () => {
  const f = useCurrentFrame();
  const secondOp = fadeIn(f, 160, 18);
  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 1060, top: 240, width: 720, fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(f, 8, 18) }}>
        Average cost vs price
      </div>
      <div style={{ position: "absolute", left: 1060, top: 360, width: 720, fontSize: type.subhead, fontWeight: font.weights.medium, color: colors.slate, ...textReveal(f, 40, 18) }}>
        How far is price from what they paid — early, or late?
      </div>

      <CapturePhone
        cx={620}
        top={150}
        height={800}
        op={fadeIn(f, 10, 18)}
        imageLayers={[
          { src: "bandarmology/scene14-06.jpg", op: 1 },
          { src: "bandarmology/scene14-08.jpg", op: secondOp },
        ]}
      />
    </SafeArea>
  );
};
