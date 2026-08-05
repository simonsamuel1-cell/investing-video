/**
 * SC01 — The Overloaded Chart (from 0, dur 489) — INDEPENDENT.
 * A clean BMRI daily chart eases in, then accumulates real indicators until it
 * is almost unreadable: two trendlines anchored to genuine pivots, MA20, MA50,
 * Bollinger, RSI and MACD sub-panes (price pane compressing 100% → 62% → 45%).
 * Every overlay is COMPUTED from the daily series — no arbitrary squiggles.
 * TODO [NEEDS DATA: BMRI daily OHLC CSV]
 */
import { useCurrentFrame, interpolate } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { CandlestickChart, chartGeom } from "../components/CandlestickChart";
import { IndicatorOverlays } from "../components/IndicatorOverlays";
import { SubPane } from "../components/SubPane";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, fadeIn, fadeOut } from "../helpers";
import { bmriDaily, WIN } from "../data/bmri";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
// Card top sits BELOW the 150px logo clear-zone so the brand mark never
// lands on card chrome.
const CARD = { x: 96, y: 160, w: 1728, h: 812 };
const INNER = { x: 160, y: 250, w: 1500, h: 620 };
const T = {
  chartIn: 3, // "Pertama kali melihat chart saham"
  look: 58, // "banyak orang langsung berpikir" — the frame eases back, as if studied
  thought: 106, // "Ini pasti cuma bisa dibaca"
  thoughtDim: 149, // "Bukan buat saya"
  thoughtOut: 203, // the doubt clears before the clutter starts
  trend: 208, // "Garis di mana-mana"
  pulse: 241, // "Candlestick"
  ma20: 272, // "Indikator bertumpuk"
  ma50: 288,
  bb: 290,
  rsi: 315, // "sampai chart-nya sendiri"
  macd: 345,
  legend: 315, // 5 chips across f315–f395
  // (no brightness dim on this beat — the density alone carries it)
  caption: 405, // "Rasanya rumit"
};
const LEGEND_STEP = 20;
const LEGEND = ["MA 20", "MA 50", "BB", "RSI 14", "MACD"];
const LEGEND_OPACITY = [1, 0.85, 0.7, 0.55, 0.4];
// ═══════════════════════════════════════════════════════════════════════════

const WINDOW = WIN.sc01;

/** Two genuine pivots per side of the window — the trendlines anchor to these. */
const pivots = () => {
  const [a, b] = WINDOW;
  const mid = Math.floor((a + b) / 2);
  let loA = a;
  let loB = mid;
  let hiA = a;
  let hiB = mid;
  for (let i = a; i <= mid; i++) {
    if (bmriDaily[i].l < bmriDaily[loA].l) loA = i;
    if (bmriDaily[i].h > bmriDaily[hiA].h) hiA = i;
  }
  for (let i = mid + 1; i <= b; i++) {
    if (bmriDaily[i].l < bmriDaily[loB].l) loB = i;
    if (bmriDaily[i].h > bmriDaily[hiB].h) hiB = i;
  }
  return { loA, loB, hiA, hiB };
};
const P = pivots();

export const Scene01 = () => {
  const f = useCurrentFrame();

  // price pane compresses as the sub-panes arrive
  const rsiIn = progress(f, T.rsi, 26);
  const macdIn = progress(f, T.macd, 26);
  const priceH = INNER.h * (1 - 0.38 * rsiIn - 0.17 * macdIn);
  const priceBox = { ...INNER, h: priceH };
  const g = chartGeom(bmriDaily, WINDOW, priceBox);

  const rsiBox = { x: INNER.x, y: INNER.y + priceH + 46, w: INNER.w, h: 118 };
  const macdBox = { x: INNER.x, y: rsiBox.y + rsiBox.h + 46, w: INNER.w, h: 118 };

  const chartOp = fadeIn(f, T.chartIn, 40);
  const rise = interpolate(f, [T.chartIn, T.chartIn + 40], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.motion.ease,
  });

  const trendDraw = f >= T.trend ? progress(f, T.trend, 34) : 0;
  // one-cycle brightness pulse on the candle series
  const pulse = f >= T.pulse && f < T.pulse + 30 ? Math.sin(((f - T.pulse) / 30) * Math.PI) : 0;
  const thoughtDim = f >= T.thoughtDim ? progress(f, T.thoughtDim, 24) : 0;
  const thoughtOut = f >= T.thoughtOut ? fadeOut(f, T.thoughtOut, 14) : 1;
  const lookBack = f >= T.look ? progress(f, T.look, 40) : 0;
  const cardScale = interpolate(lookBack, [0, 1], [1, 0.985]);

  const ma20 = f >= T.ma20 ? progress(f, T.ma20, 30) : 0;
  const ma50 = f >= T.ma50 ? progress(f, T.ma50, 30) : 0;
  const bb = f >= T.bb ? progress(f, T.bb, 30) : 0;

  const trendLine = (ia: number, ib: number, useLow: boolean) => {
    const x1 = g.cx(ia);
    const y1 = g.scale(useLow ? bmriDaily[ia].l : bmriDaily[ia].h);
    const x2 = g.cx(ib);
    const y2 = g.scale(useLow ? bmriDaily[ib].l : bmriDaily[ib].h);
    // extend to the window edge so it reads as a trendline, not a segment
    const dx = x2 - x1;
    const dy = y2 - y1;
    const k = dx === 0 ? 0 : (INNER.x + INNER.w - x1) / dx;
    return { x1, y1, x2: x1 + dx * k, y2: y1 + dy * k };
  };
  // the price gridlines CandlestickChart draws; the doubt chip sits above the
  // 4.997 line (index 2 counting up from the bottom).
  const tickPrices = Array.from({ length: 4 }, (_, i) => g.min + ((g.max - g.min) * (i + 0.5)) / 4);
  const thoughtY = g.scale(tickPrices[2]) - 42;

  const tLow = trendLine(P.loA, P.loB, true);
  const tHigh = trendLine(P.hiA, P.hiB, false);

  return (
    <SafeArea>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${cardScale})`,
          transformOrigin: "960px 566px",
        }}
      >
        {/* chart card */}
        <div
          style={{
            position: "absolute",
            left: CARD.x,
            top: CARD.y,
            width: CARD.w,
            height: CARD.h,
            borderRadius: theme.radius.cardLg,
            background: theme.colors.cardBg,
            border: `${theme.stroke.hair}px solid ${theme.colors.border}`,
            opacity: chartOp,
          }}
        />

        <div style={{ position: "absolute", inset: 0, opacity: chartOp, transform: `translateY(${rise}px)` }}>
          <div style={{ position: "absolute", inset: 0, filter: `brightness(${1 + 0.18 * pulse})` }}>
            <CandlestickChart data={bmriDaily} window={WINDOW} box={priceBox} />
          </div>

          <IndicatorOverlays
            data={bmriDaily}
            window={WINDOW}
            box={priceBox}
            cx={g.cx}
            scale={g.scale}
            ma20Progress={ma20}
            ma50Progress={ma50}
            bbProgress={bb}
          />

          {/* trendlines anchored to real pivots */}
          {trendDraw > 0.001 && (
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
              {[tLow, tHigh].map((t, i) => {
                const len = Math.hypot(t.x2 - t.x1, t.y2 - t.y1);
                return (
                  <line
                    key={i}
                    x1={t.x1}
                    y1={t.y1}
                    x2={t.x2}
                    y2={t.y2}
                    stroke={theme.colors.indigo}
                    strokeWidth={theme.stroke.rule}
                    strokeDasharray={len}
                    strokeDashoffset={len * (1 - trendDraw)}
                    opacity={0.8}
                  />
                );
              })}
            </svg>
          )}

          <SubPane kind="rsi" data={bmriDaily} window={WINDOW} box={rsiBox} cx={g.cx} slideProgress={rsiIn} title="RSI 14" />
          <SubPane kind="macd" data={bmriDaily} window={WINDOW} box={macdBox} cx={g.cx} slideProgress={macdIn} title="MACD 12 26 9" />
        </div>

        {/* accumulating legend chips — top-left, stepped opacity so text stays legible */}
        {LEGEND.map((lab, i) => (
          <Chip
            key={lab}
            label={lab}
            x={INNER.x + i * 168}
            y={210}
            variant="indigo"
            anchor="left"
            startFrame={T.legend + LEGEND_STEP * i}
            opacity={LEGEND_OPACITY[i]}
          />
        ))}
      </div>

      {/* the doubt the VO names, before the clutter piles on */}
      <Chip
        label="Cuma buat profesional?"
        x={INNER.x}
        y={thoughtY}
        variant="slate"
        anchor="left"
        startFrame={T.thought}
        opacity={(1 - 0.45 * thoughtDim) * thoughtOut}
      />

      {/* closing caption, above the subtitle zone */}
      <Chip label="Rumit?" x={1500} y={912} variant="slate" anchor="center" startFrame={T.caption} />
    </SafeArea>
  );
};
