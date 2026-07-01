/**
 * Scene 21 — Honest caveat (5232, dur 368). DISCLAIMER. A capped Gauge ("Better
 * Odds, Not A Guarantee") sits left; a real app capture cross-dissolves heavy
 * accumulation → sell-off on the right — even a clean read can be followed by a
 * sell-off. Sentence-case caption.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, Gauge, CapturePhone } from "../components";
import { theme } from "../theme";
import { tween, fadeIn, textReveal } from "../helpers";

const { colors, font, type } = theme;

export const Scene21 = () => {
  const f = useCurrentFrame();
  const val = tween(f, [90, 220], [0.12, 0.7]);
  const sellOp = fadeIn(f, 200, 18);

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 300, width: 760, opacity: fadeIn(f, 70, 18) }}>
        <Gauge left={0} top={0} width={720} value={val} cap={0.7} label="Better Odds, Not A Guarantee" />
      </div>

      <div style={{ position: "absolute", left: 96, top: 560, width: 760, fontSize: type.descriptor, fontWeight: font.weights.medium, color: colors.slate, ...textReveal(f, 240, 18) }}>
        Even a clean read can still be followed by a sell-off.
      </div>

      <CapturePhone
        cx={1300}
        top={222}
        height={728}
        op={fadeIn(f, 40, 18)}
        imageLayers={[
          { src: "bandarmology/scene21-accum.jpg", op: 1 },
          { src: "bandarmology/scene21-sell.jpg", op: sellOp },
        ]}
      />
    </SafeArea>
  );
};
