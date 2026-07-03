/**
 * Scene 30 — Step 3 Monitor (7839, dur 352). "3. Monitor" title (top-left, 7854),
 * the MARK chart capture centred (7903, same height as the Verify phones = 811),
 * a highlight box over the chart (7991, two blinks), then ascending trend arrows
 * on the price chart (8033) and the volume chart (8094), each running from "Jun"
 * to the right edge. Arrows are trend-descriptive (price/volume rose), NOT entry
 * cues. Frame = comp − 7839.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SafeArea, CapturePhone } from "../components";
import { theme } from "../theme";
import { fadeIn, fadeOut, blinkTwice } from "../helpers";

const { colors, radius } = theme;

const ARROW = colors.indigo; // indigo (per request)

// centred phone screen rect (cx 960, height 811 — matches the Verify phones)
const PW = 414;
const PH = 811;
const PL = 960 - PW / 2; // 753
const PT = 124; // bottom lands at 935, same as Verify
const mx = (ix: number) => PL + (ix / 980) * PW; // image-x (0..980) → screen
const my = (iy: number) => PT + (iy / 1920) * PH; // image-y (0..1920) → screen

// combined chart area (price candles + volume). Width runs 20px past the phone
// body (426px, centred on 960) on each side; vertical span maps to the image.
const CHART = { left: 747 - 20, top: my(648), width: 426 + 40, height: my(1448) - my(648) };

// ascending arrows: from "Jun" (image-x ~590) to the right edge (~930)
const PRICE_A = { x1: mx(590), y1: my(1080), x2: mx(930), y2: my(730) };
const VOL_A = { x1: mx(590), y1: my(1440), x2: mx(930), y2: my(1310) };

const Arrow = ({ x1, y1, x2, y2, op }: { x1: number; y1: number; x2: number; y2: number; op: number }) => {
  if (op <= 0) return null;
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const L = 26;
  const W = 13;
  const bx = x2 - L * Math.cos(ang);
  const by = y2 - L * Math.sin(ang);
  const px = -Math.sin(ang);
  const py = Math.cos(ang);
  return (
    <g style={{ opacity: op }}>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={ARROW} strokeWidth={7} strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${bx + px * W},${by + py * W} ${bx - px * W},${by - py * W}`} fill={ARROW} />
    </g>
  );
};

export const Scene30 = () => {
  const f = useCurrentFrame();
  const stageOut = fadeOut(f, 338, 14); // end 8191

  const phoneOp = fadeIn(f, 64, 16); // 7903
  const chartBox = blinkTwice(f, 152, 352); // 7991, two blinks then hold
  const priceArrow = fadeIn(f, 194, 16); // 8033
  const volArrow = fadeIn(f, 255, 16); // 8094

  return (
    <SafeArea>
      <AbsoluteFill style={{ opacity: stageOut }}>
        <CapturePhone cx={960} top={PT} height={PH} op={phoneOp} imageLayers={[{ src: "bandarmology/scene30.jpg", op: 1 }]} />

        {chartBox > 0 && (
          <div style={{ position: "absolute", left: CHART.left, top: CHART.top, width: CHART.width, height: CHART.height, border: `3px solid ${colors.indigo}`, borderRadius: radius.sm, opacity: chartBox, boxSizing: "border-box" }} />
        )}

        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <Arrow {...PRICE_A} op={priceArrow} />
          <Arrow {...VOL_A} op={volArrow} />
        </svg>
      </AbsoluteFill>
    </SafeArea>
  );
};
