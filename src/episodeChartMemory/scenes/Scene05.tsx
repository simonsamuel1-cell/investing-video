import { useCurrentFrame } from "remotion";
/**
 * SC05 — Two Axes, Two Questions (Phase D, local 2299–2821). It opens on the
 * empty white paper; both rails draw, the months fill the time rail, the grey
 * price lines trim in with their labels and the (dimmed) candles, and then
 * every candle's open and close are marked — each point a price at a time.
 */
import { AxisArrow } from "../components/AxisArrow";
import { theme } from "../theme";
import { progress, progressInOut, fadeIn, fadeOut, fmtPrice } from "../helpers";
import type { ContGeom } from "../continuity/ChartContinuity";
import { usePalette } from "../palette";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  axes: 15, // global 3105 — both rails draw together ("mulai muncul 2 sumbu")
  axesDur: 70,
  xTicks: 148, // global 3238 — "kapan pergerakan itu terjadi?"
  /**
   * ⚠ GLOBAL 3303 — Simon: "Trim path in garis abu abu harganya. Muncul juga
   * label label harganya." The grey price lines draw in here, with their
   * labels and with the candles (ChartContinuity K.sc05Candles).
   */
  yTicks: 213,
  gridDur: 30,
  /**
   * ⚠ GLOBAL 3407 — the rail names leave, and every candle gets its two
   * points: "Berikan 2 titik: open dan close, pada setiap candle, kecuali yang
   * tipis/doji." This replaces the crosshair, its dashed guides and the
   * price / date readouts, which are gone.
   */
  points: 317,
  namesOutDur: 15,
  pointStep: 0.4, // frames between one candle's pair of points and the next
  // Everything this scene drew clears before the boundary.
  clear: 480,
  clearDur: 38,
};
const TICK_STEP = 8; // frames between each tick label appearing
const N_Y_TICKS = 5;
/** "Harga" / "Waktu" — Simon: "font sizenya kecilin 10 px". */
const NAME_SIZE = theme.type.header.size - 10;
/** Open / close points: radius, and the clearance that rules a doji out. */
const POINT_R = 4.5;
const POINT_GAP = 2;
/** "Ubah label label pada sumbu waktu jadi bulan aja Jan Feb Mar dst." */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
// ═══════════════════════════════════════════════════════════════════════════

export const Scene05 = ({ geom }: { geom: ContGeom }) => {
  const pal = usePalette();
  const local = useCurrentFrame();
  const { box, win, cx, scale, series } = geom;
  // Window bounds can be fractional mid-camera-move — round for array indexing.
  const a = Math.ceil(win[0]);
  const b = Math.floor(win[1]);

  const axisP = local >= T.axes ? progress(local, T.axes, T.axesDur) : 0;
  const clearOp = local >= T.clear ? fadeOut(local, T.clear, T.clearDur) : 1;
  const namesOp = local >= T.points ? fadeOut(local, T.points, T.namesOutDur) : 1;

  /** One label per month, on that month's first session in the window. */
  const xTicks: { i: number; label: string }[] = [];
  for (let i = a; i <= b; i++) {
    const m = Number(series[i].date.slice(5, 7));
    const prev = i > a ? Number(series[i - 1].date.slice(5, 7)) : -1;
    if (m !== prev) xTicks.push({ i, label: MONTHS[m - 1] });
  }
  const lo = Math.min(...series.slice(a, b + 1).map((s) => s.l));
  const hi = Math.max(...series.slice(a, b + 1).map((s) => s.h));
  const yTicks = Array.from({ length: N_Y_TICKS }, (_, i) => lo + ((hi - lo) * (i + 0.5)) / N_Y_TICKS);

  return (
    <>
      {/* both rails draw together — ⚠ BOTH INDIGO, names included, the names
          10px smaller and set just past each arrowhead so they sit inside the
          white paper instead of hanging off it */}
      {axisP > 0.001 && (
        <div style={{ opacity: clearOp }}>
          <AxisArrow
            orientation="x"
            x1={box.x}
            y1={box.y + box.h}
            x2={box.x + box.w}
            y2={box.y + box.h}
            progress={axisP}
            color={pal.indigo}
            label="Waktu"
            labelAtTip
            labelSize={NAME_SIZE}
            labelOpacity={namesOp}
          />
          <AxisArrow
            orientation="y"
            x1={box.x}
            y1={box.y + box.h}
            x2={box.x}
            y2={box.y}
            progress={axisP}
            color={pal.indigo}
            label="Harga"
            labelAtTip
            labelSize={NAME_SIZE}
            labelOpacity={namesOp}
          />
        </div>
      )}

      {/* "kapan?" — the time rail fills in, month by month */}
      {local >= T.xTicks &&
        xTicks.map(({ i, label }, k) => (
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
              color: pal.slate,
              opacity: fadeIn(local, T.xTicks + k * TICK_STEP, 12) * clearOp,
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </div>
        ))}

      {/* "di level berapa?" — the grey price lines trim in, and their labels */}
      {local >= T.yTicks && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: clearOp }} width={theme.canvas.width} height={theme.canvas.height}>
          {yTicks.map((p, k) => {
            const draw = progressInOut(local, T.yTicks + k * TICK_STEP, T.gridDur);
            return (
              <line
                key={k}
                x1={box.x}
                y1={scale(p)}
                x2={box.x + box.w * draw}
                y2={scale(p)}
                stroke={pal.border}
                strokeWidth={theme.stroke.hair}
              />
            );
          })}
        </svg>
      )}
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
              color: pal.slate,
              opacity: fadeIn(local, T.yTicks + k * TICK_STEP, 12) * clearOp,
              whiteSpace: "nowrap",
            }}
          >
            {fmtPrice(p)}
          </div>
        ))}

      {/* every candle's open and close — skipped where the two would touch */}
      {local >= T.points && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: clearOp }} width={theme.canvas.width} height={theme.canvas.height}>
          {series.slice(a, b + 1).map((d, k) => {
            const i = a + k;
            const yo = scale(d.o);
            const yc = scale(d.c);
            if (Math.abs(yo - yc) < 2 * POINT_R + POINT_GAP) return null;
            const p = progress(local, T.points + k * T.pointStep, 8);
            if (p <= 0.001) return null;
            return (
              <g key={i} opacity={p}>
                {[yo, yc].map((yy, j) => (
                  <circle key={j} cx={cx(i)} cy={yy} r={POINT_R * (0.6 + 0.4 * p)} fill={pal.indigo} stroke={pal.cardBg} strokeWidth={1.5} />
                ))}
              </g>
            );
          })}
        </svg>
      )}
    </>
  );
};
