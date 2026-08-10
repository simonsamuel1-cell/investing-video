/**
 * SC02 — Indicators before direction (from 462, dur 466).
 *
 * The same candles as SC01, buried under tools and then dug back out. The
 * clearing move is a left→right clip on the OVERLAY GROUP only — the price
 * never moves, which is the argument: it was there the whole time.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { SafeArea, ChartCard, Layer } from "../components/SafeArea";
import { CandleChart, candleGeom } from "../components/CandleChart";
import { IndicatorClutter, SubPane } from "../components/IndicatorClutter";
import { Header } from "../components/Header";
import { theme } from "../theme";
import { progress, pulse } from "../helpers";
import { AMBIGUOUS_CANDLES, AMBIGUOUS_TICKS } from "../data/series";
import { rsi, macd } from "../data/indicators";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  title: 0, // "market structure"
  sub: 178, // "dasar terpenting"
  clutter: 290, // "mencari indikator"
  clear: 383, // "harga sebenarnya bergerak"
};
const BOX = { x: theme.frame.plot.x, y: theme.frame.plot.y + 60, w: theme.frame.plot.w, h: theme.frame.plot.h - 60 };
/** The two sub-panes rise over the lower third — the price gets buried. */
const RSI_BOX = { x: theme.frame.plot.x, y: 656, w: theme.frame.plot.w, h: 84 };
const MACD_BOX = { x: theme.frame.plot.x, y: 752, w: theme.frame.plot.w, h: 84 };
const STAGGER = 14; // frames between one tool arriving and the next
// ═══════════════════════════════════════════════════════════════════════════

const WIN: [number, number] = [0, AMBIGUOUS_CANDLES.length - 1];
const RSI = rsi(AMBIGUOUS_CANDLES);
const MACD = macd(AMBIGUOUS_CANDLES);

export const Scene02 = () => {
  const f = useCurrentFrame();
  const g = candleGeom(AMBIGUOUS_CANDLES, WIN, BOX);

  // the card leans in as the sub-line lands — a settle, not a move
  const settle = interpolate(f, [T.sub, T.sub + 26], [0.985, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.motion.ease,
  });
  const st = (i: number) => progress(f, T.clutter + i * STAGGER, 30);
  const wipe = f >= T.clear ? progress(f, T.clear, 30) : 0;
  const beat = pulse(f, T.clear + 18, 30);

  return (
    <SafeArea>
      <Header title="Market Structure" sub="Struktur pergerakan harga" startFrame={T.title} subFrame={T.sub} />

      <ChartCard scale={settle}>
        <CandleChart data={AMBIGUOUS_CANDLES} window={WIN} box={BOX} axesOpacity={1 - wipe * 0.15} tickValues={AMBIGUOUS_TICKS} />

        {/* the price, restated in indigo for exactly one beat */}
        {beat > 0.001 && (
          <Layer opacity={beat}>
            <path
              d={AMBIGUOUS_CANDLES.map((d, i) => `${i === 0 ? "M" : "L"}${g.cx(i)},${g.scale(d.c)}`).join(" ")}
              fill="none"
              stroke={theme.colors.indigo}
              strokeWidth={theme.stroke.line}
            />
          </Layer>
        )}

        {/* EVERY tool lives in this one group, so one clip clears all of them */}
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${wipe * 100}%)` }}>
          <IndicatorClutter data={AMBIGUOUS_CANDLES} window={WIN} box={BOX} cx={g.cx} scale={g.scale} band={st(0)} maSlow={st(1)} maFast={st(2)} />
          <SubPane box={RSI_BOX} values={RSI} window={WIN} kind="line" rise={st(3)} label="RSI (14)" bounds={[0, 100]} />
          <SubPane box={MACD_BOX} values={MACD.hist} window={WIN} kind="hist" rise={st(4)} label="MACD" />
        </div>
      </ChartCard>
    </SafeArea>
  );
};
