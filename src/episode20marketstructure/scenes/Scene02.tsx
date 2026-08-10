/**
 * SC02 — Indicators before direction (from 462, dur 466).
 *
 * The same candles as SC01, buried under tools and then dug back out. The
 * clearing move clips the OVERLAY GROUP only — the price itself never moves,
 * which is the argument: it was there the whole time.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { CandleChart, barGrid } from "../components/CandleChart";
import { Overlays, SubPane } from "../components/Studies";
import { Title } from "../components/Text";
import { theme } from "../theme";
import { progress, beat } from "../helpers";
import { HOOK_TICKS } from "../data/shapes";
import { rsi, macdHistogram } from "../data/studies";
import { BARS } from "./Scene01";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  title: 0, // "market structure"
  sub: 178, // "dasar terpenting"
  clutter: 290, // "mencari indikator"
  clear: 383, // "harga sebenarnya bergerak"
};
const BOX = { x: theme.stage.plot.x, y: theme.stage.plot.y + 40, w: theme.stage.plot.w, h: theme.stage.plot.h - 40 };
/** The two sub-panes rise over the lower third. The price gets buried. */
const RSI_BOX = { x: theme.stage.plot.x, y: 662, w: theme.stage.plot.w, h: 84 };
const MACD_BOX = { x: theme.stage.plot.x, y: 758, w: theme.stage.plot.w, h: 84 };
const STAGGER = 14; // frames between one tool arriving and the next
// ═══════════════════════════════════════════════════════════════════════════

const RSI = rsi(BARS);
const MACD = macdHistogram(BARS);

export const Scene02 = () => {
  const f = useCurrentFrame();
  const g = barGrid(BARS, BOX);

  // the card leans in as the sub-line lands — a settle, not a move
  const lean = interpolate(f, [T.sub, T.sub + 26], [0.985, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.motion.settle,
  });
  const tool = (i: number) => progress(f, T.clutter + i * STAGGER, 30);
  const wipe = f >= T.clear ? progress(f, T.clear, 30) : 0;
  const pulse = beat(f, T.clear + 18, 30);

  return (
    <Stage>
      <Title text="Market Structure" sub="Struktur pergerakan harga" at={T.title} subAt={T.sub} />

      <Card scale={lean}>
        <CandleChart bars={BARS} box={BOX} axisOpacity={1 - wipe * 0.15} ticks={HOOK_TICKS} />

        {/* the price, restated in indigo for exactly one beat */}
        {pulse > 0.001 && (
          <Layer opacity={pulse}>
            <path
              d={BARS.map((b, i) => `${i === 0 ? "M" : "L"}${g.x(i)},${g.scale(b.c)}`).join(" ")}
              fill="none"
              stroke={theme.color.indigo}
              strokeWidth={theme.shape.line}
            />
          </Layer>
        )}

        {/* EVERY tool lives in this one group, so a single clip clears them all */}
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${wipe * 100}%)` }}>
          <Overlays bars={BARS} box={BOX} envelope={tool(0)} slow={tool(1)} fast={tool(2)} />
          <SubPane box={RSI_BOX} values={RSI} kind="line" rise={tool(3)} label="RSI (14)" bounds={[0, 100]} />
          <SubPane box={MACD_BOX} values={MACD} kind="bars" rise={tool(4)} label="MACD" />
        </div>
      </Card>
    </Stage>
  );
};
