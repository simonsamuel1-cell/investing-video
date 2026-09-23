import { useCurrentFrame } from "remotion";
/**
 * SC03 — The Chart Records Decisions (ChartContinuity Phase B, local 608–1190).
 * The saham chart from SC02's right window has grown and zoomed out (see
 * continuity/SahamChart); two trendlines trace its structure, the card lifts,
 * and three chips mark decisions already recorded in the series.
 * Compliance: these describe PAST recorded behaviour — no arrows, no entry
 * markers, wording exactly as specced.
 *
 * ⚠ EVERY MARK IS READ OFF THE SAHAM CHART NOW, not the BMRI series. The chart
 * under this scene changed at 1370 (Simon: "ubah jadi window kanan yang
 * membesar"), and marks pinned to the old series would point at candles that
 * are no longer there.
 */
import { Ping } from "../components/Ping";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, progressInOut } from "../helpers";
import { SAHAM_CANDLES, SAHAM_ALL } from "../data/sahamReference";
import type { ContGeom } from "../continuity/ChartContinuity";
import { usePalette } from "../palette";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  /**
   * ⚠ GLOBAL 1487 — Simon: "Muncul 1 garis trend yang menghubungkan lows dan
   * 1 garis trend yang menghubungkan highs." "Tapi kenapa geraknya membentuk
   * pola tertentu?" The two lines replace the old swing underlines and smile
   * curves, which were drawn to the BMRI series.
   */
  underline: 88,
  question: 182, // "membaca pesan di baliknya"
  lift: 268, // "bukan sekadar catatan masa lalu"
  ticks: 366, // "setiap keputusan pembeli dan penjual"
  brave: 441,
  doubt: 487,
  exit: 517,
};
/** Same draw as SC01's lines: 32 frames, symmetric ease — see Scene01 TRIM. */
const TRIM = 32;
/** Same weight as SC01's lines at full strength. */
const LINE_W = 5;
const CARD_LIFT_PX = 6;
// ═══════════════════════════════════════════════════════════════════════════

const D = SAHAM_CANDLES;
const [A, B] = SAHAM_ALL;
const MID = Math.floor((A + B) / 2);

/** Index of the lowest low / highest high in [a, b]. */
const argLow = (a: number, b: number) => {
  let k = a;
  for (let i = a; i <= b; i++) if (D[i].l < D[k].l) k = i;
  return k;
};
const argHigh = (a: number, b: number) => {
  let k = a;
  for (let i = a; i <= b; i++) if (D[i].h > D[k].h) k = i;
  return k;
};
/**
 * Genuine pivots, one per half, the same way SC01 anchors its trendlines. On
 * this series the lows line runs through candles 25 and 57 and the highs line
 * through 7 and 93 — every low between its anchors sits above the one, every
 * high below the other.
 */
const LOWS = [argLow(A, MID), argLow(MID + 1, B)] as const;
const HIGHS = [argHigh(A, MID), argHigh(MID + 1, B)] as const;
/** The three recorded decisions the chips attach to. */
const P = { low: LOWS[0], high: HIGHS[1], consol: Math.floor((LOWS[0] + HIGHS[1]) / 2) };

export const Scene03 = ({ geom }: { geom: ContGeom }) => {
  const pal = usePalette();
  const local = useCurrentFrame();
  const { box } = geom;
  const { cx, y, box: sbox, contentOp } = geom.saham;

  const lift = local >= T.lift ? progress(local, T.lift, 30) : 0;
  const draw = local >= T.underline ? progressInOut(local, T.underline, TRIM) : 0;
  const underlineDim = local >= T.question ? progress(local, T.question, 24) : 0;
  const ticks = local >= T.ticks ? progress(local, T.ticks, 60) : 0;

  /** From the first anchor, through the second, on to the chart's right edge. */
  const trend = ([i, j]: readonly [number, number], key: "l" | "h") => {
    const x1 = cx(i);
    const y1 = y(D[i][key]);
    const x2 = cx(j);
    const y2 = y(D[j][key]);
    const k = (sbox.x + sbox.w - x1) / (x2 - x1);
    return { x1, y1, x2: x1 + (x2 - x1) * k, y2: y1 + (y2 - y1) * k };
  };
  const lines = [trend(LOWS, "l"), trend(HIGHS, "h")];
  /** The question sits above the highs line, over the middle of the chart. */
  const qx = cx(MID);
  const qLine = lines[1].y1 + ((lines[1].y2 - lines[1].y1) * (qx - lines[1].x1)) / (lines[1].x2 - lines[1].x1);

  return (
    <>
      {/* card behind the chart — lifts one shadow step on the "not just history"
          beat by crossfading the two theme elevations */}
      {([theme.shadow.rest, theme.shadow.lift] as const).map((sh, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: box.x - 60,
            top: box.y - 70,
            width: box.w + 120,
            height: box.h + 150,
            borderRadius: theme.radius.cardLg,
            background: pal.cardBg,
            border: `${theme.stroke.hair}px solid ${pal.border}`,
            boxShadow: sh,
            opacity: i === 0 ? 1 : lift,
            transform: `translateY(${-CARD_LIFT_PX * lift}px)`,
            zIndex: -1,
          }}
        />
      ))}

      {/* ⚠ EVERYTHING BELOW LEAVES WITH THE CANDLES before the handover to
          SC04's BMRI chart — see SahamChart's contentOut. */}
      <div style={{ position: "absolute", inset: 0, opacity: contentOp }}>
        {/* the structure: one line along the lows, one along the highs */}
        {draw > 0.001 && (
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
            {lines.map((t, i) => {
              const len = Math.hypot(t.x2 - t.x1, t.y2 - t.y1);
              return (
                <line
                  key={i}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke={pal.indigo}
                  strokeWidth={LINE_W}
                  strokeLinecap="round"
                  strokeDasharray={len}
                  strokeDashoffset={len * (1 - draw)}
                  opacity={0.8 * (1 - 0.6 * underlineDim)}
                />
              );
            })}
          </svg>
        )}

        {/* the repeating structure, then the question it raises */}
        <Chip label="?" x={qx} y={qLine - 56} variant="indigo" anchor="center" startFrame={T.underline + 30} opacity={1 - underlineDim} />
        {/* plain text above the chart, centred on the canvas */}
        <Chip label="Apa pesannya?" x={theme.canvas.width / 2} y={224} variant="indigo" anchor="center" bare startFrame={T.question} />

        {/* every session is one recorded decision — a point on each close */}
        {ticks > 0.001 && (
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
            {D.map((d, i) => {
              const q = Math.max(0, Math.min(1, ticks * D.length - i));
              if (q <= 0) return null;
              return <circle key={i} cx={cx(i)} cy={y(d.c)} r={3.2} fill={pal.indigo} opacity={0.55 * q} />;
            })}
          </svg>
        )}

        {/* three recorded decisions — chips alternate above/below so none stack */}
        <Ping x={cx(P.low)} y={y(D[P.low].l)} startFrame={T.brave} variant="indigo" />
        <Chip
          label="Berani masuk"
          x={cx(P.low)}
          y={y(D[P.low].l) + 82}
          variant="indigo"
          anchor="center"
          startFrame={T.brave + 6}
          connectorTo={{ x: cx(P.low), y: y(D[P.low].l) + 14 }}
        />

        <Ping x={cx(P.consol)} y={y(D[P.consol].c)} startFrame={T.doubt} variant="slate" />
        <Chip
          label="Ragu"
          x={cx(P.consol)}
          y={y(D[P.consol].c) - 82}
          variant="slate"
          anchor="center"
          startFrame={T.doubt + 6}
          connectorTo={{ x: cx(P.consol), y: y(D[P.consol].c) - 16 }}
        />

        <Ping x={cx(P.high)} y={y(D[P.high].h)} startFrame={T.exit} variant="cyan" />
        <Chip
          label="Keluar"
          x={cx(P.high)}
          y={y(D[P.high].h) - 82}
          variant="cyan"
          anchor="center"
          startFrame={T.exit + 6}
          connectorTo={{ x: cx(P.high), y: y(D[P.high].h) - 16 }}
        />
      </div>
    </>
  );
};
