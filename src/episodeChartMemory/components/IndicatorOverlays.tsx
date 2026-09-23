/**
 * IndicatorOverlays — MA100 (orange) and the Bollinger band: its middle line,
 * the 20-day average (cyan), and its area (cyan). Each indicator wears its
 * own hue so the pile-up on SC01 reads as several different tools.
 *
 * ⚠ THE ORANGE LINE IS A 100-DAY AVERAGE. Simon: "garis orange adalah
 * MA100". The series has 320 sessions and SC01 shows the last 60, so the
 * average is fully defined across the whole window — no warm-up gap. All values are COMPUTED from the daily series in data/bmri —
 * never arbitrary squiggles. Every path is conditionally mounted by its own
 * progress prop so nothing flashes at frame 0.
 */
import { theme } from "../theme";
import type { Box } from "../helpers";
import type { OHLC } from "../data/bmri";
import { sma, bollinger } from "../data/bmri";
import { usePalette } from "../palette";

const pathFrom = (vals: (number | null)[], a: number, b: number, cx: (i: number) => number, scale: (p: number) => number) => {
  const pts: string[] = [];
  for (let i = a; i <= b; i++) {
    const v = vals[i];
    if (v === null || v === undefined) continue;
    pts.push(`${pts.length === 0 ? "M" : "L"}${cx(i)},${scale(v)}`);
  }
  return pts.join(" ");
};

export const IndicatorOverlays = ({
  data,
  window: win,
  box,
  cx,
  scale,
  ma20Progress = 0,
  ma100Progress = 0,
  bbProgress = 0,
  strokeWidth = theme.stroke.rule,
}: {
  data: OHLC[];
  window: [number, number];
  box: Box;
  cx: (globalIdx: number) => number;
  scale: (price: number) => number;
  ma20Progress?: number;
  ma100Progress?: number;
  bbProgress?: number;
  /** ⚠ A LAYER THAT ISN'T THE SUBJECT DRAWS THINNER. Simon: "Elemen yang
   *  ga di-highlight, tebel garisnya jadi 1 px." The scene owns the spotlight,
   *  so it hands the width down rather than this file guessing at it. */
  strokeWidth?: number;
}) => {
  const pal = usePalette();
  const [a, b] = win;
  const ma20 = sma(data, 20);
  const ma100 = sma(data, 100);
  const bb = bollinger(data, 20, 2);

  const d20 = pathFrom(ma20, a, b, cx, scale);
  const d100 = pathFrom(ma100, a, b, cx, scale);

  // Bollinger fill polygon: upper left→right, then lower right→left.
  const up: string[] = [];
  const lo: string[] = [];
  for (let i = a; i <= b; i++) {
    const u = bb.upper[i];
    const l = bb.lower[i];
    if (u === null || l === null) continue;
    up.push(`${cx(i)},${scale(u)}`);
    lo.unshift(`${cx(i)},${scale(l)}`);
  }
  const bbPoly = up.concat(lo).join(" ");

  const LEN = box.w * 2.4; // dash length comfortably longer than any path

  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
      {bbProgress > 0.001 && up.length > 1 && <polygon points={bbPoly} fill={pal.cyan} opacity={0.14 * bbProgress} />}
      {ma100Progress > 0.001 && d100 && (
        <path
          d={d100}
          fill="none"
          stroke={pal.maOrange}
          strokeWidth={strokeWidth}
          /* round joins: at 8px a mitred corner on every session turns the
             average into a row of spikes */
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={LEN}
          strokeDashoffset={LEN * (1 - ma100Progress)}
        />
      )}
      {ma20Progress > 0.001 && d20 && (
        <path
          d={d20}
          fill="none"
          stroke={pal.cyan}
          strokeWidth={strokeWidth}
          /* round joins: at 8px a mitred corner on every session turns the
             average into a row of spikes */
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={LEN}
          strokeDashoffset={LEN * (1 - ma20Progress)}
        />
      )}
    </svg>
  );
};
