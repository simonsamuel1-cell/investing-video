/**
 * MistakesStage — Scenes 16–20 (comp 3962–5232), mounted once. Owns the
 * scene16-20.mp4 phone, the five point titles (above the phone), and the
 * per-point highlights over the recording. Frame = comp − 3962.
 *
 * Points (comp appear→disappear): titles above the phone.
 * Highlights: (1) timeframe row, (2) Net switch, (3) top rows → expand to 3rd,
 * (4a) B.Avg column, (4b) S.Avg column, (5) none. Whole stage fades out by 5231.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SafeArea, CapturePhone } from "../components";
import { theme } from "../theme";
import { fadeIn, fadeOut, tween, blinkTwice } from "../helpers";

const { colors, font, radius } = theme;

const OFF = 3962;

// phone (centered) + screen mapping at height 740
const CX = 960;
const PTOP = 220;
const PH = 740;
const SW = 378;
const SH = 740;
const SLEFT = 771;
const fx = (v: number) => SLEFT + v * SW;
const fy = (v: number) => PTOP + v * SH;

const POINTS = [
  { t: "1. Judging by a single day", a: 3970 - OFF, b: 4256 - OFF },
  { t: "2. Staring at the net-buy ranking", a: 4256 - OFF, b: 4553 - OFF },
  { t: "3. Obsessing over who's number one", a: 4553 - OFF, b: 4793 - OFF },
  { t: "4. Ignoring the average cost", a: 4793 - OFF, b: 5021 - OFF },
  { t: "5. Forgetting the nego market", a: 5021 - OFF, b: 5231 - OFF },
];

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const winOp = (f: number, a: number, b: number) => clamp01(Math.min(fadeIn(f, a, 12), fadeOut(f, b - 12, 12)));

const Box = ({ left, top, width, height, op }: { left: number; top: number; width: number; height: number; op: number }) =>
  op > 0 ? <div style={{ position: "absolute", left, top, width, height, border: `3px solid ${colors.indigo}`, borderRadius: radius.sm, opacity: op, boxSizing: "border-box" }} /> : null;

export const MistakesStage = () => {
  const f = useCurrentFrame();
  const stageOut = fadeOut(f, 5231 - OFF - 14, 14);

  const h1 = blinkTwice(f, 3970 - OFF, 4256 - OFF); // timeframe row
  const h2 = blinkTwice(f, 4256 - OFF, 4553 - OFF); // Net switch
  const h3 = blinkTwice(f, 4553 - OFF, 4793 - OFF); // rows
  const h3grow = tween(f, [4687 - OFF, 4707 - OFF], [0, 1]); // expand down at 4687
  const h4a = blinkTwice(f, 4821 - OFF, 4878 - OFF); // B.Avg column
  const h4b = blinkTwice(f, 4918 - OFF, 5012 - OFF); // S.Avg column
  const h5 = blinkTwice(f, 5070 - OFF, 5231 - OFF); // "Nego" dropdown

  const rowTop = fy(0.435) - 3; // top of the ZP row, nudged up 3px
  const rowH = 0.12 * SH + (0.15 * SH + 10) * h3grow; // 2 rows → expand through YU (+10px)

  return (
    <SafeArea>
      <AbsoluteFill style={{ opacity: stageOut }}>
        {/* point titles above the phone */}
        {POINTS.map((p, i) => (
          <div key={i} style={{ position: "absolute", left: 96, top: 120, width: 1728, textAlign: "center", fontSize: 52, fontWeight: font.weights.extrabold, color: colors.text, opacity: winOp(f, p.a, p.b) }}>
            {p.t}
          </div>
        ))}

        <CapturePhone video="bandarmology/scene16-20.mp4" cx={CX} top={PTOP} height={PH} op={fadeIn(f, 0, 14)} />

        {/* highlights */}
        <Box left={fx(-0.05)} top={fy(0.26) - 10} width={1.1 * SW} height={0.065 * SH} op={h1} />
        <Box left={fx(0.82)} top={fy(0.215) - 3} width={0.16 * SW} height={0.05 * SH} op={h2} />
        <Box left={fx(-0.05)} top={rowTop} width={1.1 * SW} height={rowH} op={h3} />
        <Box left={fx(0.625) + 3} top={fy(0.42)} width={0.19 * SW} height={0.47 * SH - 10} op={h4a} />
        <Box left={fx(0.84) - 6} top={fy(0.42)} width={0.14 * SW} height={0.47 * SH - 10} op={h4b} />
        <Box left={fx(0.53)} top={fy(0.316)} width={0.43 * SW} height={0.056 * SH} op={h5} />
      </AbsoluteFill>
    </SafeArea>
  );
};
