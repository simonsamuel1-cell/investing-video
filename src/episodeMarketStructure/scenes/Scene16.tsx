/**
 * SC16 — Timeframe trap: 5m vs daily (from 7666, dur 542) — INDEPENDENT.
 *
 * The scene is ONE series seen from two distances. The "5-minute chart" is not
 * a second dataset — it is TIMEFRAME magnified over TF_WINDOW, and the zoom-out
 * is a continuous move of that window to the full range. Nothing is swapped, so
 * the viewer can watch a collapse turn into a higher low without the picture
 * ever cheating.
 *
 * The camera pulls back; the price does not change. That is the trap, stated
 * exactly once, in the only way it can be stated honestly.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartCard } from "../components/ChartCard";
import { PriceLine } from "../components/PriceLine";
import { PivotMarker } from "../components/PivotMarker";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { usePalette } from "../palette";
import { progress, fadeIn, fadeOut, textReveal } from "../helpers";
import { TIMEFRAME, TF_WINDOW, TF_HL, geom, zoom } from "../data/structures";
import { CARD, PLOT, CAPTION_Y } from "../layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  card: 60,
  fiveM: 101, // "chart lima menit"
  worry: 131, // "akhir tren"
  out: 216, // "chart harian"
  hl: 262, // "hanya higher low"
  principle: 355, // "timeframe besar lebih dulu"
};
const OUT_DUR = 96; // frames the pull-back takes
const BOX = { x: PLOT.x, y: PLOT.y + 40, w: PLOT.w, h: PLOT.h - 130 };
const TAB = { x: CARD.x + 56, y: CARD.y + 52 };
// ═══════════════════════════════════════════════════════════════════════════

const HL_T = TIMEFRAME.pivots[TF_HL].t;
const HL_P = TIMEFRAME.pivots[TF_HL].p;

export const Scene16 = () => {
  const pal = usePalette();
  const f = useCurrentFrame();

  const cardIn = fadeIn(f, T.card, 20);
  const out = f >= T.out ? progress(f, T.out, OUT_DUR) : 0;

  // the window the card is showing, sliding open from the 5-minute view
  const a = interpolate(out, [0, 1], [TF_WINDOW[0], 0]);
  const b = interpolate(out, [0, 1], [TF_WINDOW[1], 1]);
  const view = zoom(TIMEFRAME, [a, b]);
  const G = geom(view, BOX, { pad: 0.14 });

  const draw = progress(f, T.card + 10, 60);
  const hlT = (HL_T - a) / Math.max(1e-6, b - a);
  const hlPoint = { x: G.x(hlT), y: G.y(HL_P) };

  // where the 5-minute window now sits inside the daily view
  const rect = { x1: G.x((TF_WINDOW[0] - a) / (b - a)), x2: G.x((TF_WINDOW[1] - a) / (b - a)) };
  const strip = textReveal(f, T.principle);

  return (
    <SafeArea>
      <ChartCard box={CARD} opacity={cardIn}>
        {/* the highlight rectangle — only meaningful once we are outside it */}
        {out > 0.25 && (
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
            <rect
              x={rect.x1}
              y={BOX.y + 10}
              width={Math.max(0, rect.x2 - rect.x1)}
              height={BOX.h - 20}
              fill={pal.indigoTint8}
              stroke={pal.indigo}
              strokeWidth={theme.stroke.hair}
              rx={10}
              opacity={Math.min(1, (out - 0.25) / 0.35)}
            />
          </svg>
        )}

        <PriceLine g={G} draw={draw} color={pal.ink} width={3} />

        {/* close up it looks like the end of something */}
        <Chip
          label="Akhir Tren?"
          x={BOX.x + BOX.w * 0.5}
          y={BOX.y + 60}
          variant="slate"
          startFrame={T.worry}
          opacity={f >= T.out ? fadeOut(f, T.out, 26) : 1}
        />

        {/* from further back it is a higher low inside a climb */}
        {out > 0.7 && <PivotMarker x={hlPoint.x} y={hlPoint.y} label="Higher Low" variant="cyan" side="below" startFrame={T.hl} />}
      </ChartCard>

      {/* the tab the card is showing */}
      <Chip label="5M" x={TAB.x} y={TAB.y} variant="indigo" anchor="left" startFrame={T.fiveM} opacity={f >= T.out ? fadeOut(f, T.out, 20) : 1} />
      <Chip label="1D" x={TAB.x} y={TAB.y} variant="indigo" anchor="left" startFrame={T.out + 20} opacity={out} />

      {/* the habit, in sentence case, with the order it should be done in */}
      <div
        style={{
          position: "absolute",
          left: theme.canvas.width / 2 - 130,
          top: CAPTION_Y,
          transform: `translate(-100%, calc(-50% + ${strip.y}px))`,
          opacity: strip.opacity,
          fontFamily: theme.type.family,
          fontSize: theme.type.label.size,
          fontWeight: 600,
          color: pal.ink,
          whiteSpace: "nowrap",
        }}
      >
        Lihat timeframe besar lebih dulu.
      </div>
      <Chip label="1D → 5M" x={theme.canvas.width / 2 + 130} y={CAPTION_Y} variant="cyan" anchor="left" startFrame={T.principle + 16} />
    </SafeArea>
  );
};
