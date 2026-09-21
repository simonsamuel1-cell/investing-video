/**
 * VerifyStage — Step 2 Verify (comp 6776–7615), mounted once. Owns the "2. Verify"
 * title (from 6807) and two content phases below it:
 *   A) 6807–7329 — Shareholder Count (left) + Insider (right) captures; a blinking
 *      box highlights the 8 shareholder-count numbers (from 6900).
 *   B) 7329–7615 — Flow capture (centred); a blinking box highlights the Flow
 *      Detail section (from 7395).
 * The two side-by-side cards reuse Scene 11's captures. Frame = comp − 6776.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SafeArea, CapturePhone } from "../components";
import { theme } from "../theme";
import { fadeIn, fadeOut, blinkTwice } from "../helpers";

const { colors, font, radius } = theme;

// Rect = the phone's SCREEN area (the image); CapturePhone adds the device bezel
// around it, and its screen lands exactly on this rect, so the boxes still map.
type Rect = { L: number; T: number; W: number; H: number };
const CW = 414; // phones 15% larger (was 360)
const CH = Math.round((CW * 1920) / 980); // 811
const TOP = 935 - CH; // 124 — grown upward: bottom stays at the old 935 (230 + 705)
const BODY = CW + 12; // device body width (screen + 6px bezel each side)
const GAP = 40; // gap between the two side-by-side device bodies
const LCX = 960 - GAP / 2 - BODY / 2; // left phone centre
const RCX = 960 + GAP / 2 + BODY / 2; // right phone centre
const SH: Rect = { L: LCX - CW / 2, T: TOP, W: CW, H: CH }; // shareholders (left)
const INS: Rect = { L: RCX - CW / 2, T: TOP, W: CW, H: CH }; // insider (right)
const FLOW: Rect = { L: 960 - CW / 2, T: TOP, W: CW, H: CH }; // flow (centre 960)

const box = (r: Rect, fx0: number, fx1: number, fy0: number, fy1: number) => ({
  left: r.L + fx0 * r.W,
  top: r.T + fy0 * r.H,
  width: (fx1 - fx0) * r.W,
  height: (fy1 - fy0) * r.H,
});

const SH_NUMS = box(SH, 0.55, 0.78, 0.275, 0.72); // 8 numbers in the Number column
const FLOW_DETAIL_BASE = box(FLOW, 0.03, 0.96, 0.52, 0.905); // Flow Detail heading + chart card (vertical span)
// width runs 25px past the phone body (CW + 12 bezel) on each side
const FLOW_DETAIL = { left: FLOW.L - 6 - 25, top: FLOW_DETAIL_BASE.top, width: CW + 12 + 50, height: FLOW_DETAIL_BASE.height };

const Phone = ({ r, src, op }: { r: Rect; src: string; op: number }) =>
  op > 0 ? <CapturePhone cx={r.L + r.W / 2} top={r.T} height={r.H} op={op} imageLayers={[{ src, op: 1 }]} /> : null;

const Box = ({ b, op }: { b: { left: number; top: number; width: number; height: number }; op: number }) =>
  op > 0 ? <div style={{ position: "absolute", ...b, border: `3px solid ${colors.indigo}`, borderRadius: radius.sm, opacity: op, boxSizing: "border-box" }} /> : null;

export const VerifyStage = () => {
  const f = useCurrentFrame();
  const stageOut = fadeOut(f, 825, 14); // all fade by 7615
  const contentAOut = fadeOut(f, 539, 14); // shareholders/insider fade by 7329

  const titleOp = fadeIn(f, 31, 16); // 6807
  const leftOp = Math.min(fadeIn(f, 0, 16), contentAOut); // 6776
  const rightOp = Math.min(fadeIn(f, 282, 16), contentAOut); // 7058
  const shBox = Math.min(blinkTwice(f, 124, 553), contentAOut); // 6900, two blinks
  const flowOp = fadeIn(f, 553, 16); // 7329
  const flowBox = blinkTwice(f, 619, 839); // 7395, two blinks

  return (
    <SafeArea>
      <AbsoluteFill style={{ opacity: stageOut }}>
        <div style={{ position: "absolute", left: 96, top: 66, textAlign: "left", fontSize: 56, fontWeight: font.weights.extrabold, color: colors.text, opacity: titleOp }}>
          2. Verify
        </div>

        {/* A — shareholders (left) + insider (right) */}
        <Phone r={SH} src="bandarmology/scene11-shareholders.jpg" op={leftOp} />
        <Phone r={INS} src="bandarmology/scene11-insider.jpg" op={rightOp} />
        <Box b={SH_NUMS} op={shBox} />

        {/* B — flow (centre) */}
        <Phone r={FLOW} src="bandarmology/scene11-flow.jpg" op={flowOp} />
        <Box b={FLOW_DETAIL} op={flowBox} />
      </AbsoluteFill>
    </SafeArea>
  );
};
