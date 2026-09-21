/**
 * Scene 04 — (755, dur 287). Shows the MARK capture (scene14-06.jpg) centred in a
 * phone template. At 905 a highlight box frames the broker table
 * (Buyer/B.Lot/B.Val/B.Avg/Seller rows). More visuals to be directed next.
 * Frame = comp − 755.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, CapturePhone } from "../components";
import { theme } from "../theme";
import { tween, blinkTwice } from "../helpers";

const { colors, radius } = theme;

// phone screen geometry (cx 960, top 130, height 811)
const SW = 414; // round(811 * 980/1920)
const STOP = 130;
const SH = 811;
const BODY_W = SW + 12; // 426 — phone body (screen + 6px bezel each side)

// broker table (header → IH row); box runs 25px past the phone body each side
const TABLE = {
  left: 960 - BODY_W / 2 - 25,
  top: STOP + 0.385 * SH,
  width: BODY_W + 50,
  height: (0.868 - 0.385) * SH,
};
const TABLE_IN = 150; // comp 905

export const Scene04 = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      <CapturePhone cx={960} top={STOP} height={SH} op={tween(f, [6, 22], [0, 1])} imageLayers={[{ src: "bandarmology/scene14-06.jpg", op: 1 }]} />

      <div style={{ position: "absolute", ...TABLE, border: `3px solid ${colors.indigo}`, borderRadius: radius.sm, opacity: blinkTwice(f, TABLE_IN, 287), boxSizing: "border-box" }} />
    </SafeArea>
  );
};
