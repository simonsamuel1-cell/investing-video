/**
 * SC02 — Chili Prices Become a Chart (ChartContinuity Phase A, local 0–608).
 * Three price cards pop in, shrink onto the chart baseline, collapse into dots,
 * and the indigo line connects them (the line itself lives in ChartContinuity).
 * The three figures are from the VO and are final.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { PriceCard } from "../components/PriceCard";
import { Chip } from "../components/Chip";
import { LineChart } from "../components/LineChart";
import { theme } from "../theme";
import { progress, fmtRp, mulberry32 } from "../helpers";
import { chiliMonthly, CHILI_SPOKEN } from "../data/chili";
import type { ContGeom } from "../continuity/ChartContinuity";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = { c1: 141, c2: 196, c3: 238, settle: 273, dots: 337, glow: 393, stream: 444 };
const CARD_START = [
  { cx: 560, cy: 430 },
  { cx: 960, cy: 430 },
  { cx: 1360, cy: 430 },
];
const SPOKEN = [
  { idx: CHILI_SPOKEN.high, start: T.c1, rise: false },
  { idx: CHILI_SPOKEN.low, start: T.c2, rise: false },
  { idx: CHILI_SPOKEN.back, start: T.c3, rise: true },
];
// ═══════════════════════════════════════════════════════════════════════════

export const Scene02 = ({ geom }: { geom: ContGeom }) => {
  const f = useCurrentFrame();
  const { box, chiliScaleY } = geom;

  const settle = f >= T.settle ? progress(f, T.settle, 46) : 0;
  const dots = f >= T.dots ? progress(f, T.dots, 20) : 0;
  const glow = f >= T.glow && f < T.glow + 30 ? Math.sin(((f - T.glow) / 30) * Math.PI) : 0;

  const target = (idx: number) => ({
    cx: box.x + (box.w * idx) / (chiliMonthly.length - 1),
    cy: chiliScaleY(chiliMonthly[idx].price),
  });

  // Denser cyan "stock" line — texture beside the chili line, not data.
  const streamPts = (() => {
    const rnd = mulberry32(99213);
    const pts: { x: number; y: number }[] = [];
    const N = 160;
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      const baseY = chiliScaleY(chiliMonthly[Math.min(chiliMonthly.length - 1, Math.round(t * (chiliMonthly.length - 1)))].price);
      pts.push({ x: box.x + box.w * t, y: baseY + 92 + (rnd() - 0.5) * 54 });
    }
    return pts;
  })();
  const streamDraw = f >= T.stream ? progress(f, T.stream, 70) : 0;

  return (
    <>
      {/* one-cycle glow on the connected line */}
      {glow > 0.001 && (
        <div style={{ position: "absolute", inset: 0, filter: `brightness(${1 + 0.25 * glow})`, pointerEvents: "none" }} />
      )}

      {/* the three spoken figures */}
      {SPOKEN.map(({ idx, start, rise }, i) => {
        const tgt = target(idx);
        const cx = interpolate(settle, [0, 1], [CARD_START[i].cx, tgt.cx]);
        const cy = interpolate(settle, [0, 1], [CARD_START[i].cy, tgt.cy]);
        const scale = interpolate(settle, [0, 1], [1, 0.55]);
        return (
          <PriceCard
            key={idx}
            value={`${fmtRp(chiliMonthly[idx].price)}/kg`}
            cx={cx}
            cy={cy}
            startFrame={start}
            scale={scale}
            opacity={1 - dots}
            rise={rise}
          />
        );
      })}

      {/* the cards collapse into dots on the baseline */}
      {dots > 0.001 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
          {SPOKEN.map(({ idx }) => {
            const tgt = target(idx);
            return <circle key={idx} cx={tgt.cx} cy={tgt.cy} r={8 * dots} fill={theme.colors.indigo} />;
          })}
        </svg>
      )}

      {/* denser, busier stock line streaming in beside it */}
      {streamDraw > 0.001 && <LineChart points={streamPts} progress={streamDraw} color={theme.colors.cyan} width={theme.stroke.hair} opacity={0.85} />}
      <Chip label="Saham — lebih cepat, lebih ramai" x={box.x} y={box.y + box.h + 92} variant="cyan" anchor="left" startFrame={T.stream + 20} />
    </>
  );
};
