import { useCurrentFrame } from "remotion";
/**
 * SC05 — Two Axes, Two Questions (Phase D, local 1710–2100; scene-local passed
 * in as `local`). The candles fade to 30% in ChartContinuity; here the two axis
 * arrows sweep in and a crosshair locks onto a real candle with its real date
 * and price.
 */
import { AxisArrow } from "../components/AxisArrow";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, fmtPrice } from "../helpers";
import { bmriDaily } from "../data/bmri";
import type { ContGeom } from "../continuity/ChartContinuity";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = { xAxis: 60, yAxis: 150, cross: 240, questions: 315 };
// ═══════════════════════════════════════════════════════════════════════════

export const Scene05 = ({ geom }: { geom: ContGeom }) => {
  const local = useCurrentFrame();
  const { box, win, cx, scale } = geom;
  const [a, b] = win;
  const idx = a + Math.floor((b - a) * 0.62); // a real session, mid-right of the window
  const d = bmriDaily[idx];
  const px = cx(idx);
  const py = scale(d.c);

  const xP = local >= T.xAxis ? progress(local, T.xAxis, 46) : 0;
  const yP = local >= T.yAxis ? progress(local, T.yAxis, 46) : 0;
  const crossP = local >= T.cross ? progress(local, T.cross, 24) : 0;

  return (
    <>
      {xP > 0.001 && (
        <AxisArrow
          orientation="x"
          x1={box.x}
          y1={box.y + box.h}
          x2={box.x + box.w}
          y2={box.y + box.h}
          progress={xP}
          color={theme.colors.indigo}
          label="Waktu"
        />
      )}
      {yP > 0.001 && (
        <AxisArrow orientation="y" x1={box.x} y1={box.y + box.h} x2={box.x} y2={box.y} progress={yP} color={theme.colors.cyan} label="Harga" />
      )}

      {crossP > 0.001 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
          <line x1={px} y1={py} x2={px} y2={box.y + box.h} stroke={theme.colors.slate} strokeWidth={theme.stroke.hair} strokeDasharray="8 8" opacity={crossP} />
          <line x1={box.x} y1={py} x2={px} y2={py} stroke={theme.colors.slate} strokeWidth={theme.stroke.hair} strokeDasharray="8 8" opacity={crossP} />
          <circle cx={px} cy={py} r={8} fill={theme.colors.indigo} opacity={crossP} />
        </svg>
      )}

      {/* real values at the two axis intersections */}
      {crossP > 0.5 && (
        <>
          {/* dropped below the date-tick row so it never collides with an axis label */}
          <Chip label={d.date.slice(5).replace("-", "/")} x={px} y={892} variant="indigo" anchor="center" startFrame={T.cross + 12} />
          {/* pulled in from box.x − 24: at that offset the chip crossed the safe-left margin */}
          <Chip label={fmtPrice(d.c)} x={box.x - 2} y={py} variant="cyan" anchor="right" startFrame={T.cross + 12} />
        </>
      )}

      {/* the two questions every point answers — stacked, 12px gap, no overlap */}
      <Chip label="Harga berapa?" x={px + 46} y={py - 34} variant="cyan" anchor="left" startFrame={T.questions} />
      <Chip label="Kapan?" x={px + 46} y={py + 34} variant="indigo" anchor="left" startFrame={T.questions + 10} />
    </>
  );
};
