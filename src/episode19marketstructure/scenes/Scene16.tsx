/**
 * SC16 — Timeframe trap (from 7666, dur 542).
 *
 * ONE series seen from two distances. The "5-minute chart" is not a second
 * dataset — it is TIMEFRAME magnified over TF_WINDOW, and the zoom-out is a
 * continuous move of that window to the full range. Nothing is swapped, so the
 * viewer watches a collapse turn into a higher low without the picture ever
 * cheating: the camera pulls back, the price does not change.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { SafeArea, ChartCard, Layer } from "../components/SafeArea";
import { StructureLine } from "../components/StructureLine";
import { PivotLabel } from "../components/PivotLabel";
import { Chip } from "../components/Chip";
import { Statement } from "../components/Header";
import { theme } from "../theme";
import { progress, fadeIn, fadeOut } from "../helpers";
import { TIMEFRAME, TF_WINDOW, TF_HL, geom, zoom } from "../data/series";

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
const BOX = { x: theme.frame.plot.x, y: theme.frame.plot.y + 40, w: theme.frame.plot.w, h: theme.frame.plot.h - 130 };
const TAB = { x: theme.frame.card.x + 56, y: theme.frame.card.y + 52 };
const STRIP_DX = 130;
// ═══════════════════════════════════════════════════════════════════════════

const HL_T = TIMEFRAME.pivots[TF_HL].t;
const HL_P = TIMEFRAME.pivots[TF_HL].p;

export const Scene16 = () => {
  const f = useCurrentFrame();
  const cardIn = fadeIn(f, T.card, 20);
  const out = f >= T.out ? progress(f, T.out, OUT_DUR) : 0;

  // the window the card is showing, sliding open from the 5-minute view
  const a = interpolate(out, [0, 1], [TF_WINDOW[0], 0]);
  const b = interpolate(out, [0, 1], [TF_WINDOW[1], 1]);
  const g = geom(zoom(TIMEFRAME, [a, b]), BOX, { pad: 0.14 });
  const draw = progress(f, T.card + 10, 60);

  const hl = { x: g.x((HL_T - a) / Math.max(1e-6, b - a)), y: g.y(HL_P) };
  const rect = { x1: g.x((TF_WINDOW[0] - a) / (b - a)), x2: g.x((TF_WINDOW[1] - a) / (b - a)) };

  return (
    <SafeArea>
      <ChartCard opacity={cardIn}>
        {/* the highlight rectangle — only meaningful once we are outside it */}
        {out > 0.25 && (
          <Layer opacity={Math.min(1, (out - 0.25) / 0.35)}>
            <rect
              x={rect.x1}
              y={BOX.y + 10}
              width={Math.max(0, rect.x2 - rect.x1)}
              height={BOX.h - 20}
              fill={theme.colors.indigoTint8}
              stroke={theme.colors.indigo}
              strokeWidth={theme.stroke.hair}
              rx={10}
            />
          </Layer>
        )}

        <StructureLine g={g} draw={draw} />

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
        {out > 0.7 && <PivotLabel x={hl.x} y={hl.y} label="Higher Low" variant="cyan" side="below" startFrame={T.hl} />}
      </ChartCard>

      {/* the tab the card is showing */}
      <Chip label="5M" x={TAB.x} y={TAB.y} variant="indigo" anchor="left" startFrame={T.fiveM} opacity={f >= T.out ? fadeOut(f, T.out, 20) : 1} />
      <Chip label="1D" x={TAB.x} y={TAB.y} variant="indigo" anchor="left" startFrame={T.out + 20} opacity={out} />

      {/* the habit, in sentence case, with the order it should be done in */}
      <Statement text="Lihat timeframe besar lebih dulu." x={theme.canvas.width / 2 - STRIP_DX} y={theme.frame.captionY} startFrame={T.principle} anchor="right" />
      <Chip label="1D → 5M" x={theme.canvas.width / 2 + STRIP_DX} y={theme.frame.captionY} variant="cyan" anchor="left" startFrame={T.principle + 16} />
    </SafeArea>
  );
};
