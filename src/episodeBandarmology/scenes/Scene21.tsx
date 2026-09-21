/**
 * Scene 21 — Honest caveat (5232, dur 368). DISCLAIMER. Two real broker-summary
 * captures shown SIDE-BY-SIDE: an accumulation read (5270) next to the same name
 * being sold off (5380), each captioned. The YU row is boxed in both. At 5470 the
 * captions give way to the bigger takeaway line. All fade out by 5599.
 * Frame = comp − 5232.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SafeArea, CapturePhone } from "../components";
import { theme } from "../theme";
import { fadeIn, fadeOut } from "../helpers";

const { colors, font, radius } = theme;

// two framed captures, top-aligned, centred. Both sources are the full 980×1920
// phone screen, so the cards keep the phone's tall aspect (centres symmetric
// about 960: 670 / 1250).
type Rect = { L: number; T: number; W: number; H: number };
const CW = 414; // shared card width (height 811)
const CH = Math.round((CW * 1920) / 980); // 811
const CT = 155; // top — bottom lands at 966, clear of the subtitle band
const ACCUM: Rect = { L: 670 - CW / 2, T: CT, W: CW, H: CH }; // centre 670
const SELL: Rect = { L: 1250 - CW / 2, T: CT, W: CW, H: CH }; // centre 1250

// image-fraction → display box over a given card
const box = (r: Rect, fx0: number, fx1: number, fy0: number, fy1: number) => ({
  left: r.L + fx0 * r.W,
  top: r.T + fy0 * r.H,
  width: (fx1 - fx0) * r.W,
  height: (fy1 - fy0) * r.H,
});

const YU_ACCUM = box(ACCUM, 0.03, 0.79, 0.768, 0.822); // 5th row (ZP,KZ,BB,AK,YU,BK)
const YU_SELL = box(SELL, 0.2, 0.97, 0.388, 0.44); // top row (Seller: YU)

const SWITCH = 238; // 5470: captions out, takeaway in
const END = 367; // 5599

const Phone = ({ r, src, op }: { r: Rect; src: string; op: number }) =>
  op > 0 ? <CapturePhone cx={r.L + r.W / 2} top={r.T} height={r.H} op={op} imageLayers={[{ src, op: 1 }]} /> : null;

const Box = ({ b, op }: { b: { left: number; top: number; width: number; height: number }; op: number }) =>
  op > 0 ? <div style={{ position: "absolute", ...b, border: `3px solid ${colors.indigo}`, borderRadius: radius.sm, opacity: op, boxSizing: "border-box" }} /> : null;

export const Scene21 = () => {
  const f = useCurrentFrame();
  const stageOut = fadeOut(f, END - 14, 14);

  const accumImg = fadeIn(f, 38, 18); // 5270
  const sellImg = fadeIn(f, 148, 18); // 5380
  const accumBox = fadeIn(f, 88, 12); // 5320
  const sellBox = fadeIn(f, 198, 12); // 5430

  const capOut = fadeOut(f, SWITCH, 12);
  const accumCap = Math.min(fadeIn(f, 38, 16), capOut);
  const sellCap = Math.min(fadeIn(f, 148, 16), capOut);
  const bigOp = fadeIn(f, SWITCH, 18); // 5470

  return (
    <SafeArea>
      <AbsoluteFill style={{ opacity: stageOut }}>
        {/* per-image captions (fade out at 5470) */}
        {/* captions pushed to the outer sides — accum left, sell right */}
        <div style={{ position: "absolute", left: ACCUM.L, top: 100, width: 500, textAlign: "left", fontSize: 38, fontWeight: font.weights.extrabold, color: colors.indigo, opacity: accumCap }}>
          Accumulation signal
        </div>
        <div style={{ position: "absolute", left: SELL.L + SELL.W - 500, top: 100, width: 500, textAlign: "right", fontSize: 38, fontWeight: font.weights.extrabold, color: colors.indigo, opacity: sellCap }}>
          still followed by sell off
        </div>

        {/* takeaway line above the images (fade in at 5470) */}
        <div style={{ position: "absolute", left: 96, top: 61, width: 1728, textAlign: "center", fontSize: 62, fontWeight: font.weights.extrabold, color: colors.text, opacity: bigOp }}>
          Reading tracks improves odds, <span style={{ color: colors.indigo }}>not risks</span>
        </div>

        <Phone r={ACCUM} src="bandarmology/scene21b-accum.jpg" op={accumImg} />
        <Phone r={SELL} src="bandarmology/scene21b-sell.jpg" op={sellImg} />

        <Box b={YU_ACCUM} op={accumBox} />
        <Box b={YU_SELL} op={sellBox} />
      </AbsoluteFill>
    </SafeArea>
  );
};
