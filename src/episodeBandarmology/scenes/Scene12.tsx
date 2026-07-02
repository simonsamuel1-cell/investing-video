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

// phone body: cx 620, height 800 → width 420, x 410–830. Highlight = +20px each side.
const HL_LEFT = 390;
const HL_WIDTH = 460;

// row highlights (abs y, mapped from the 980×1920 capture → screen y = 150 + f·800)
const HILITES = [
  { top: 487, height: 123, at: 65 }, // DEWA + PRIM  (all appear at comp 2914)
  { top: 620, height: 124, at: 65 }, // ISAT + ISAT
  { top: 417, height: 58, at: 65 }, // SMMA
];

export const Scene12 = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      <CapturePhone cx={620} top={150} height={800} op={fadeIn(f, 10, 18)} imageLayers={[{ src: "bandarmology/scene12.jpg", op: 1 }]} />

      {/* row highlights */}
      {HILITES.map((h, i) => (
        <div key={i} style={{ position: "absolute", left: HL_LEFT, top: h.top, width: HL_WIDTH, height: h.height, border: `3px solid ${colors.indigo}`, borderRadius: radius.sm, opacity: fadeIn(f, h.at, 12), boxSizing: "border-box" }} />
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
