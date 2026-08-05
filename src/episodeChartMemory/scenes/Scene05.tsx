import { useCurrentFrame } from "remotion";
/**
 * SC05 — Two Axes, Two Questions (Phase D, local 1997–2519). The candles fade to
 * 30% in ChartContinuity; here both axes brighten, their tick labels populate in
 * sequence, and a crosshair locks onto a real candle so its real price and date
 * can land on the two rails.
 */
import { AxisArrow } from "../components/AxisArrow";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, fadeIn, fmtPrice } from "../helpers";
import { bmriDaily } from "../data/bmri";
import type { ContGeom } from "../continuity/ChartContinuity";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  // Both rails now draw TOGETHER over global 2501–2571 (scene-local 15–85).
  // Their tick labels keep their own later beats — the dates and the price
  // levels are deliberately not part of this.
  axes: 15, // global 2501
  axesDur: 70, // both rails complete at global 2571
  xTicks: 148, // "kapan pergerakan itu terjadi?"
  yTicks: 260, // "di level berapa?"
  cross: 316, // "menjawab dua pertanyaan"
  priceTag: 401, // "harganya berapa"
  dateTag: 455, // "dan kapan harga itu terbentuk"
};
const TICK_STEP = 8; // frames between each tick label appearing
const N_X_TICKS = 6;
const N_Y_TICKS = 5;
// ═══════════════════════════════════════════════════════════════════════════

export const Scene05 = ({ geom }: { geom: ContGeom }) => {
  const local = useCurrentFrame();
  const { box, win, cx, scale } = geom;
  // Window bounds can be fractional mid-camera-move — round for array indexing.
  const a = Math.ceil(win[0]);
  const b = Math.floor(win[1]);
  const idx = a + Math.floor((b - a) * 0.62); // a real session, mid-right of the window
  const d = bmriDaily[idx];
  const px = cx(idx);
  const py = scale(d.c);

  const axisP = local >= T.axes ? progress(local, T.axes, T.axesDur) : 0;
  const crossP = local >= T.cross ? progress(local, T.cross, 24) : 0;

  // real sessions and real price levels, spread across each rail
  const xTicks = Array.from({ length: N_X_TICKS }, (_, i) => a + Math.round(((b - a) * i) / (N_X_TICKS - 1)));
  const lo = Math.min(...bmriDaily.slice(a, b + 1).map((s) => s.l));
  const hi = Math.max(...bmriDaily.slice(a, b + 1).map((s) => s.h));
  const yTicks = Array.from({ length: N_Y_TICKS }, (_, i) => lo + ((hi - lo) * (i + 0.5)) / N_Y_TICKS);

  return (
    <>
      {/* both rails draw together */}
      {axisP > 0.001 && (
        <>
          <AxisArrow
            orientation="x"
            x1={box.x}
            y1={box.y + box.h}
            x2={box.x + box.w}
            y2={box.y + box.h}
            progress={axisP}
            color={theme.colors.indigo}
            label="Waktu"
          />
          <AxisArrow orientation="y" x1={box.x} y1={box.y + box.h} x2={box.x} y2={box.y} progress={axisP} color={theme.colors.cyan} label="Harga" />
        </>
      )}

      {/* "kapan?" — the time rail fills in, one session at a time */}
      {local >= T.xTicks &&
        xTicks.map((i, k) => (
          <div
            key={`x${i}`}
            style={{
              position: "absolute",
              left: cx(i),
              top: box.y + box.h + 18,
              transform: "translateX(-50%)",
              fontFamily: theme.type.family,
              fontSize: theme.type.axis.size,
              fontWeight: theme.type.axis.weight,
              color: theme.colors.slate,
              opacity: fadeIn(local, T.xTicks + k * TICK_STEP, 12),
              whiteSpace: "nowrap",
            }}
          >
            {bmriDaily[i].date.slice(5).replace("-", "/")}
          </div>
        ))}

      {/* "di level berapa?" — the price rail fills in */}
      {local >= T.yTicks &&
        yTicks.map((p, k) => (
          <div
            key={`y${k}`}
            style={{
              position: "absolute",
              left: box.x + box.w + 16,
              top: scale(p) - 16,
              fontFamily: theme.type.family,
              fontSize: theme.type.axis.size,
              fontWeight: theme.type.axis.weight,
              color: theme.colors.slate,
              opacity: fadeIn(local, T.yTicks + k * TICK_STEP, 12),
              whiteSpace: "nowrap",
            }}
          >
            {fmtPrice(p)}
          </div>
        ))}

      {crossP > 0.001 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
          <line x1={px} y1={py} x2={px} y2={box.y + box.h} stroke={theme.colors.slate} strokeWidth={theme.stroke.hair} strokeDasharray="8 8" opacity={crossP} />
          <line x1={box.x} y1={py} x2={px} y2={py} stroke={theme.colors.slate} strokeWidth={theme.stroke.hair} strokeDasharray="8 8" opacity={crossP} />
          <circle cx={px} cy={py} r={8} fill={theme.colors.indigo} opacity={crossP} />
        </svg>
      )}

      {/* the price answer lands on the Y rail… */}
      {/* pulled in from box.x − 24: at that offset the chip crossed the safe-left margin */}
      <Chip label={fmtPrice(d.c)} x={box.x - 2} y={py} variant="cyan" anchor="right" startFrame={T.priceTag} />

      {/* …and the time answer on the X rail, dropped below the tick row */}
      <Chip label={d.date.slice(5).replace("-", "/")} x={px} y={892} variant="indigo" anchor="center" startFrame={T.dateTag} />
    </>
  );
};
