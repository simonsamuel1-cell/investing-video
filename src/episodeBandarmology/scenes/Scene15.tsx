/**
 * Scene 15 — Five mistakes intro (comp 3805, dur 155). The Broker Summary capture
 * appears at 3805 with a highlight on the broker table; the title "There are five
 * classic mistakes" appears above it at 3880. All fade out by 3960.
 * Frame = comp − 3805.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, CapturePhone } from "../components";
import { theme } from "../theme";
import { fadeIn, fadeOut, textReveal } from "../helpers";

const { colors, font, radius } = theme;

// phone (centered) screen geometry at height 811
const CX = 960;
const PTOP = 145;
const PH = 811;
const SW = 414; // round(811 * 980/1920)
const fy = (v: number) => PTOP + v * PH;

export const Scene15 = () => {
  const f = useCurrentFrame();
  const out = fadeOut(f, 141, 14); // all end at 3960
  const phoneOp = Math.min(fadeIn(f, 0, 16), out);
  const hlOp = Math.min(fadeIn(f, 10, 12), out);
  const title = textReveal(f, 75, 18);

  return (
    <SafeArea>
      {/* title above the image */}
      <div style={{ position: "absolute", left: 96, top: 62, width: 1728, textAlign: "center", fontSize: 52, fontWeight: font.weights.extrabold, color: colors.text, letterSpacing: -0.5, transform: title.transform, opacity: Math.min(title.opacity, out) }}>
        There are five classic mistakes
      </div>

      <CapturePhone cx={CX} top={PTOP} height={PH} op={phoneOp} imageLayers={[{ src: "bandarmology/scene14-08.jpg", op: 1 }]} />

      {/* highlight on the Broker Summary table — 25px wider than the phone each side */}
      <div style={{ position: "absolute", left: CX - (SW + 12) / 2 - 25, top: fy(0.5), width: SW + 12 + 50, height: (0.83 - 0.5) * PH, border: `3px solid ${colors.indigo}`, borderRadius: radius.sm, opacity: hlOp, boxSizing: "border-box" }} />
    </SafeArea>
  );
};
