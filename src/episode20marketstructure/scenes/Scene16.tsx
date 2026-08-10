/**
 * SC16 — Timeframe trap (from 7666, dur 542).
 *
 * ONE series seen from two distances. The "5-minute chart" is not a second
 * dataset — it is TIMEFRAME magnified over TF_WINDOW, and the zoom-out is a
 * continuous widening of that window to the full range. Nothing is swapped, so
 * the viewer can watch a collapse turn into a higher low without the picture
 * ever cheating: the camera pulls back, the price does not change.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { StructureLine } from "../components/StructureLine";
import { PivotLabel } from "../components/PivotLabel";
import { Chip } from "../components/Chip";
import { Line } from "../components/Text";
import { theme } from "../theme";
import { progress, fadeIn, fadeOut } from "../helpers";
import { plot, window as cut } from "../data/shape";
import { TIMEFRAME, TF_WINDOW, TF_HIGHER_LOW } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  card: 60,
  fiveMinute: 101, // "chart lima menit"
  worry: 131, // "akhir tren"
  out: 216, // "chart harian"
  higherLow: 262, // "hanya higher low"
  principle: 355, // "timeframe besar lebih dulu"
};
const OUT_OVER = 96; // frames the pull-back takes
const BOX = { x: theme.stage.plot.x, y: theme.stage.plot.y + 30, w: theme.stage.plot.w, h: theme.stage.plot.h - 110 };
const TAB = { x: theme.stage.card.x + 56, y: theme.stage.card.y + 54 };
const STRIP_DX = 130;
// ═══════════════════════════════════════════════════════════════════════════

const HL = TIMEFRAME.turns[TF_HIGHER_LOW];

export const Scene16 = () => {
  const f = useCurrentFrame();
  const card = fadeIn(f, T.card, 20);
  const out = f >= T.out ? progress(f, T.out, OUT_OVER) : 0;

  // the window the card is showing, opening from the five-minute view
  const a = interpolate(out, [0, 1], [TF_WINDOW[0], 0]);
  const b = interpolate(out, [0, 1], [TF_WINDOW[1], 1]);
  const p = plot(cut(TIMEFRAME, [a, b]), BOX, { pad: 0.14 });
  const draw = progress(f, T.card + 10, 60);

  const hl = { x: p.x((HL.t - a) / Math.max(1e-6, b - a)), y: p.y(HL.p) };
  const highlight = { x1: p.x((TF_WINDOW[0] - a) / (b - a)), x2: p.x((TF_WINDOW[1] - a) / (b - a)) };

  return (
    <Stage>
      <Card opacity={card}>
        {/* the highlight rectangle — only meaningful once we are outside it */}
        {out > 0.25 && (
          <Layer opacity={Math.min(1, (out - 0.25) / 0.35)}>
            <rect
              x={highlight.x1}
              y={BOX.y + 10}
              width={Math.max(0, highlight.x2 - highlight.x1)}
              height={BOX.h - 20}
              fill={theme.color.indigoWash}
              stroke={theme.color.indigo}
              strokeWidth={theme.shape.hairline}
              rx={10}
            />
          </Layer>
        )}

        <StructureLine plot={p} draw={draw} />

        {/* close up it looks like the end of something */}
        <Chip label="Akhir tren?" x={BOX.x + BOX.w * 0.5} y={BOX.y + 60} tone="slate" at={T.worry} opacity={f >= T.out ? fadeOut(f, T.out, 26) : 1} />

        {/* from further back it is a higher low inside a climb */}
        {out > 0.7 && <PivotLabel x={hl.x} y={hl.y} label="Higher low" tone="cyan" side="below" at={T.higherLow} />}
      </Card>

      {/* the tab the card is showing */}
      <Chip label="5M" x={TAB.x} y={TAB.y} tone="indigo" anchor="left" at={T.fiveMinute} opacity={f >= T.out ? fadeOut(f, T.out, 20) : 1} />
      <Chip label="1D" x={TAB.x} y={TAB.y} tone="indigo" anchor="left" at={T.out + 20} opacity={out} />

      {/* the habit, in sentence case, with the order it should be done in */}
      <Line text="Lihat timeframe besar lebih dulu." x={theme.canvas.width / 2 - STRIP_DX} y={theme.stage.caption.y} at={T.principle} anchor="right" />
      <Chip label="1D → 5M" x={theme.canvas.width / 2 + STRIP_DX} y={theme.stage.caption.y} tone="cyan" anchor="left" at={T.principle + 16} />
    </Stage>
  );
};
