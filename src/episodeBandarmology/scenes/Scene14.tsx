/**
 * Scene 14 — Average cost (3453, dur 336). Two real captures shown SIDE-BY-SIDE
 * from 3453. Highlight sets: B.Avg column on both (3534), then the top-left stock
 * code + price on both (3678). All fade out by 3788. Frame = comp − 3453.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, CapturePhone } from "../components";
import { theme } from "../theme";
import { fadeIn, fadeOut } from "../helpers";

const { colors, radius } = theme;

// two phones side by side
const SW = 398; // screen width at height 780
const STOP = 120;
const SH = 780;
const LEFTS = [481, 1041]; // screen-left of the left / right phones

// image-fraction → screen box, per phone
const box = (sl: number, fx0: number, fx1: number, fy0: number, fy1: number) => ({
  left: sl + fx0 * SW,
  width: (fx1 - fx0) * SW,
  top: STOP + fy0 * SH,
  height: (fy1 - fy0) * SH,
});

// B.Avg column — the two captures have different table layouts, so per-image fy.
const AVG_BOXES = [
  box(LEFTS[0], 0.6, 0.82, 0.395, 0.87), // MARK (table high)
  box(LEFTS[1], 0.6, 0.82, 0.44, 0.76), // MIDI (table lower)
];
const CODE_BOXES = LEFTS.map((sl) => box(sl, 0.12, 0.47, 0.012, 0.08)); // code + price

export const Scene14 = () => {
  const f = useCurrentFrame();
  const out = fadeOut(f, 321, 14); // all end at 3788
  const phoneOp = Math.min(fadeIn(f, 0, 16), out);
  const avgOp = Math.min(fadeIn(f, 81, 12), out); // 3534
  const codeOp = Math.min(fadeIn(f, 225, 12), out); // 3678

  return (
    <SafeArea>
      <CapturePhone cx={680} top={STOP} height={SH} op={phoneOp} imageLayers={[{ src: "bandarmology/scene14-06.jpg", op: 1 }]} />
      <CapturePhone cx={1240} top={STOP} height={SH} op={phoneOp} imageLayers={[{ src: "bandarmology/scene14-08.jpg", op: 1 }]} />

      {AVG_BOXES.map((b, i) => (
        <div key={`avg-${i}`} style={{ position: "absolute", left: b.left, top: b.top, width: b.width, height: b.height, border: `3px solid ${colors.indigo}`, borderRadius: radius.sm, opacity: avgOp, boxSizing: "border-box" }} />
      ))}
      {CODE_BOXES.map((b, i) => (
        <div key={`code-${i}`} style={{ position: "absolute", left: b.left, top: b.top, width: b.width, height: b.height, border: `3px solid ${colors.cyan}`, borderRadius: radius.sm, opacity: codeOp, boxSizing: "border-box" }} />
      ))}
    </SafeArea>
  );
};
