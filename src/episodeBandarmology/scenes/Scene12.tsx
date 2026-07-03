/**
 * Scene 12 — Nego market (2849, dur 249). Real Market-Radar capture in the phone;
 * "Nego Market" title + subtitle beside-right. Three row highlights over the
 * phone (each 20px wider than the phone on each side, per [[highlight-box-width]]):
 * DEWA+PRIM, then ISAT+ISAT, then SMMA. Subtitle fades in at 2927.
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
const BODYW = Math.round((PH * 980) / 1920) + 12; // 426
const HL_LEFT = CX - BODYW / 2 - 20; // +20px each side, per [[highlight-box-width]]
const HL_WIDTH = BODYW + 40;
const fy = (v: number) => PTOP + v * PH; // image-fraction (0..1) → screen y

// row highlights (image-y fractions of the 980×1920 capture)
const HILITES = [
  { fy0: 0.421, fy1: 0.575, at: 65 }, // DEWA + PRIM  (all appear at comp 2914)
  { fy0: 0.5875, fy1: 0.7425, at: 65 }, // ISAT + ISAT
  { fy0: 0.334, fy1: 0.4065, at: 65 }, // SMMA
];

export const Scene12 = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      <CapturePhone cx={CX} top={PTOP} height={PH} op={fadeIn(f, 10, 18)} imageLayers={[{ src: "bandarmology/scene12.jpg", op: 1 }]} />

      {/* row highlights */}
      {HILITES.map((h, i) => (
        <div key={i} style={{ position: "absolute", left: HL_LEFT, top: fy(h.fy0), width: HL_WIDTH, height: fy(h.fy1) - fy(h.fy0), border: `3px solid ${colors.indigo}`, borderRadius: radius.sm, opacity: fadeIn(f, h.at, 12), boxSizing: "border-box" }} />
      ))}

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
