/**
 * Scene 12 — Nego market (2849, dur 249). Real Market-Radar capture in the phone
 * (Screenshot_20260708 — taller than the template, so it's cover-cropped top &
 * bottom, intentionally). "Nego Market" title + subtitle beside-right. ONE
 * highlight box over the green "Nego Spike/Active (IDR)" column on the right.
 * Frame = comp − 2849.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, CapturePhone } from "../components";
import { theme } from "../theme";
import { fadeIn, textReveal } from "../helpers";

const { colors, font, type, radius } = theme;

// phone: cx 620, height 811. Bottom kept at the old 950 → top 139.
const CX = 620;
const PH = 811;
const PTOP = 950 - PH; // 139
const SW = Math.round((PH * 980) / 1920); // 414 — screen width
const SL = CX - SW / 2; // 413 — screen left
// screen-fraction (0..1) → box on the phone screen
const sbox = (fx0: number, fx1: number, fy0: number, fy1: number) => ({
  left: SL + fx0 * SW,
  top: PTOP + fy0 * PH,
  width: (fx1 - fx0) * SW,
  height: (fy1 - fy0) * PH,
});

// the green "Nego Spike/Active (IDR)" column on the right
const GREEN = sbox(0.53, 0.97, 0.225, 0.925);

export const Scene12 = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      <CapturePhone cx={CX} top={PTOP} height={PH} op={fadeIn(f, 10, 18)} imageLayers={[{ src: "bandarmology/scene12b.jpg", op: 1 }]} />

      <div style={{ position: "absolute", ...GREEN, border: `3px solid ${colors.indigo}`, borderRadius: radius.sm, opacity: fadeIn(f, 65, 12), boxSizing: "border-box" }} />

      {/* title + subtitle beside-right */}
      <div style={{ position: "absolute", left: 900, top: 400, width: 860, fontSize: 84, fontWeight: font.weights.extrabold, color: colors.indigo, letterSpacing: -1, ...textReveal(f, 8, 18) }}>
        Nego Market
      </div>
      <div style={{ position: "absolute", left: 900, top: 520, width: 820, fontSize: type.subhead, fontWeight: font.weights.medium, color: colors.slate, ...textReveal(f, 78, 18) }}>
        Large buy and sell deals, leave tracks too.
      </div>
    </SafeArea>
  );
};
