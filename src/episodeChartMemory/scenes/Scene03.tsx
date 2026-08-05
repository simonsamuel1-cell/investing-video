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
import { theme } from "../theme";
import { progress } from "../helpers";
import { bmriDaily } from "../data/bmri";
import type { ContGeom } from "../continuity/ChartContinuity";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = { underline: 86, lift: 268, brave: 441, doubt: 487, exit: 517 };
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
  const local = useCurrentFrame();
  const { box, win, cx, scale } = geom;
  const [a, b] = win;
  const P = pickPivots(a, b);

  const lift = local >= T.lift ? progress(local, T.lift, 30) : 0;
  const underline = local >= T.underline ? progress(local, T.underline, 44) : 0;

  // Two similar swings, traced beneath the line as a repeating structure.
  const seg = (i0: number, i1: number) => ({ x1: cx(i0), y1: scale(bmriDaily[i0].l) + 26, x2: cx(i1), y2: scale(bmriDaily[i1].l) + 26 });
  const swings = [seg(a + 6, a + 26), seg(a + 34, a + 54)];

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
            background: theme.colors.cardBg,
            border: `${theme.stroke.hair}px solid ${theme.colors.border}`,
            boxShadow: sh,
            opacity: i === 0 ? 1 : lift,
            transform: `translateY(${-CARD_LIFT_PX * lift}px)`,
            zIndex: -1,
          }}
        />
      ))}

      {underline > 0.001 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
          {swings.map((s, i) => {
            const len = Math.hypot(s.x2 - s.x1, s.y2 - s.y1);
            const p = Math.max(0, Math.min(1, underline * 2 - i));
            return (
              <line
                key={i}
                x1={s.x1}
                y1={s.y1}
                x2={s.x2}
                y2={s.y2}
                stroke={theme.colors.indigo}
                strokeWidth={theme.stroke.rule}
                strokeDasharray={len}
                strokeDashoffset={len * (1 - p)}
                opacity={0.55}
              />
            );
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
