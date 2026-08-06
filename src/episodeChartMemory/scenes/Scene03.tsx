import { useCurrentFrame } from "remotion";
/**
 * SC03 — The Chart Records Decisions (ChartContinuity Phase B, local 608–1190). The chili line has morphed into BMRI; an
 * underline traces a repeating swing structure, the card lifts, and three chips
 * mark real decisions already recorded in the series.
 * Compliance: these describe PAST recorded behaviour — no arrows, no entry
 * markers, wording exactly as specced.
 */
import { Ping } from "../components/Ping";
import { Chip } from "../components/Chip";
import { SwingLines } from "../components/SwingLines";
import { SmileCurves } from "../components/SmileCurves";
import { theme } from "../theme";
import { progress } from "../helpers";
import { bmriDaily } from "../data/bmri";
import type { ContGeom } from "../continuity/ChartContinuity";
import { usePalette } from "../palette";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  underline: 86, // "membentuk pola tertentu" — global 1183
  underlineDur: 44, // straight swing lines finish at global 1227
  smileDur: 56, // smile curves finish at global 1239
  question: 182, // "membaca pesan di baliknya"
  lift: 268, // "bukan sekadar catatan masa lalu"
  ticks: 366, // "setiap keputusan pembeli dan penjual"
  brave: 441,
  doubt: 487,
  exit: 517,
};
const CARD_LIFT_PX = 6;
// ═══════════════════════════════════════════════════════════════════════════

/** Real pivots inside the window — the chips attach to these, not to guesses. */
const pickPivots = (a: number, b: number) => {
  const mid = Math.floor((a + b) / 2);
  let low = a;
  let high = mid;
  for (let i = a; i <= mid; i++) if (bmriDaily[i].l < bmriDaily[low].l) low = i;
  for (let i = mid; i <= b; i++) if (bmriDaily[i].h > bmriDaily[high].h) high = i;
  const consol = Math.floor((low + high) / 2);
  return { low, high, consol };
};

export const Scene03 = ({ geom }: { geom: ContGeom }) => {
  const pal = usePalette();
  const local = useCurrentFrame();
  const { box, win, cx, scale } = geom;
  const [a, b] = win;
  const P = pickPivots(a, b);

  const lift = local >= T.lift ? progress(local, T.lift, 30) : 0;
  const underline = local >= T.underline ? progress(local, T.underline, T.underlineDur) : 0;
  const smile = local >= T.underline ? progress(local, T.underline, T.smileDur) : 0;
  const underlineDim = local >= T.question ? progress(local, T.question, 24) : 0;
  const ticks = local >= T.ticks ? progress(local, T.ticks, 60) : 0;

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

      {/* the repeating structure: two straight underlines and two smile curves.
          Both carry their own geometry — see SwingLines.tsx / SmileCurves.tsx. */}
      <SwingLines progress={underline} opacity={1 - 0.6 * underlineDim} />
      <SmileCurves progress={smile} opacity={1 - 0.6 * underlineDim} />

      {/* the repeating structure, then the question it raises */}
      <Chip
        label="?"
        x={cx(a + 44)}
        y={scale(bmriDaily[a + 44].h) - 74}
        variant="indigo"
        anchor="center"
        startFrame={T.underline + 30}
        opacity={1 - underlineDim}
      />
      {/* plain text above the line chart, centred on the canvas */}
      <Chip label="Apa pesannya?" x={theme.canvas.width / 2} y={224} variant="indigo" anchor="center" bare startFrame={T.question} />

      {/* every session point is one recorded decision */}
      {ticks > 0.001 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
          {Array.from({ length: b - a + 1 }, (_, k) => {
            const i = a + k;
            const q = Math.max(0, Math.min(1, ticks * (b - a + 1) - k));
            if (q <= 0) return null;
            return <circle key={i} cx={cx(i)} cy={scale(bmriDaily[i].c)} r={3.2} fill={pal.indigo} opacity={0.55 * q} />;
          })}
        </svg>
      )}

      {/* three recorded decisions — chips alternate above/below so none stack */}
      <Ping x={cx(P.low)} y={scale(bmriDaily[P.low].l)} startFrame={T.brave} variant="indigo" />
      {/* dropped below the date-tick row so the chip never collides with an axis label */}
      <Chip
        label="Berani masuk"
        x={cx(P.low)}
        y={880}
        variant="indigo"
        anchor="center"
        startFrame={T.brave + 6}
        connectorTo={{ x: cx(P.low), y: scale(bmriDaily[P.low].l) + 14 }}
      />

      <Ping x={cx(P.consol)} y={scale(bmriDaily[P.consol].c)} startFrame={T.doubt} variant="slate" />
      <Chip
        label="Ragu"
        x={cx(P.consol)}
        y={scale(bmriDaily[P.consol].c) - 82}
        variant="slate"
        anchor="center"
        startFrame={T.doubt + 6}
        connectorTo={{ x: cx(P.consol), y: scale(bmriDaily[P.consol].c) - 16 }}
      />

      <Ping x={cx(P.high)} y={scale(bmriDaily[P.high].h)} startFrame={T.exit} variant="cyan" />
      <Chip
        label="Keluar"
        x={cx(P.high)}
        y={scale(bmriDaily[P.high].h) - 82}
        variant="cyan"
        anchor="center"
        startFrame={T.exit + 6}
        connectorTo={{ x: cx(P.high), y: scale(bmriDaily[P.high].h) - 16 }}
      />
    </>
  );
};
