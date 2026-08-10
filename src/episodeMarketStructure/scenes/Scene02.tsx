/**
 * SC02 — Indicators before direction (from 462, dur 466) — INDEPENDENT.
 *
 * The same candles as SC01, buried under tools and then dug back out. Every
 * overlay is COMPUTED from that series (data/indicators) — the MAs really are
 * this chart's MAs, the RSI really is its RSI. Clutter drawn as squiggles would
 * make the scene's point dishonestly.
 *
 * The clearing move is a left→right clip on the overlay group only. The price
 * never moves, which is the argument: it was there the whole time.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartCard } from "../components/ChartCard";
import { CandlestickChart, chartGeom } from "../components/CandlestickChart";
import { IndicatorOverlays } from "../components/IndicatorOverlays";
import { SubPane } from "../components/SubPane";
import { Header } from "../components/Header";
import { theme } from "../theme";
import { usePalette } from "../palette";
import { progress } from "../helpers";
import { AMBIGUOUS_CANDLES } from "../data/structures";
import { rsi, macd } from "../data/indicators";
import { CARD, PLOT } from "../layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  title: 0, // "market structure"
  sub: 178, // "dasar terpenting"
  clutter: 290, // "mencari indikator"
  clear: 383, // "harga sebenarnya bergerak"
};
const BOX = { x: PLOT.x, y: PLOT.y + 60, w: PLOT.w, h: PLOT.h - 60 };
/** The two sub-panes slide up over the lower third — price gets buried. */
const RSI_BOX = { x: PLOT.x, y: 656, w: PLOT.w, h: 84 };
const MACD_BOX = { x: PLOT.x, y: 752, w: PLOT.w, h: 84 };
const WIN: [number, number] = [0, AMBIGUOUS_CANDLES.length - 1];
// ═══════════════════════════════════════════════════════════════════════════

const RSI = rsi(AMBIGUOUS_CANDLES);
const MACD = macd(AMBIGUOUS_CANDLES);

export const Scene02 = () => {
  const pal = usePalette();
  const f = useCurrentFrame();
  const g = chartGeom(AMBIGUOUS_CANDLES, WIN, BOX);

  // The card settles forward as the sub-line lands — a lean-in, not a move.
  const settle = interpolate(f, [T.sub, T.sub + 26], [0.985, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.motion.ease,
  });

  // Each tool arrives on its own beat, a few frames after the last.
  const st = (i: number) => progress(f, T.clutter + i * 14, 30);
  const wipe = f >= T.clear ? progress(f, T.clear, 30) : 0;
  // One indigo pulse on the price once the tools are gone.
  const pulse = f >= T.clear + 18 ? Math.max(0, Math.sin(((f - T.clear - 18) / 30) * Math.PI)) : 0;

  return (
    <SafeArea>
      <Header title="Market Structure" sub="Struktur pergerakan harga" startFrame={T.title} subFrame={T.sub} />

      <ChartCard box={CARD} scale={settle}>
        <CandlestickChart data={AMBIGUOUS_CANDLES} window={WIN} box={BOX} axesOpacity={1 - wipe * 0.15} ticks={4} />

        {/* The price, restated in indigo for one beat. */}
        {pulse > 0.001 && (
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
            <path
              d={AMBIGUOUS_CANDLES.map((d, i) => `${i === 0 ? "M" : "L"}${g.cx(i)},${g.scale(d.c)}`).join(" ")}
              fill="none"
              stroke={pal.indigo}
              strokeWidth={3}
              opacity={pulse}
            />
          </svg>
        )}

        {/* EVERY tool lives in this one group, so one clip clears all of them. */}
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${wipe * 100}%)` }}>
          <IndicatorOverlays
            data={AMBIGUOUS_CANDLES}
            window={WIN}
            box={BOX}
            cx={g.cx}
            scale={g.scale}
            bbProgress={st(0)}
            ma50Progress={st(1)}
            ma20Progress={st(2)}
          />
          <SubPane box={RSI_BOX} values={RSI} window={WIN} kind="line" rise={st(3)} label="RSI (14)" bounds={[0, 100]} />
          <SubPane box={MACD_BOX} values={MACD.hist} window={WIN} kind="hist" rise={st(4)} label="MACD" />
        </div>
      </ChartCard>
    </SafeArea>
  );
};
