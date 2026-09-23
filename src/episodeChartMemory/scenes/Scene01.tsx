/**
 * SC01 — The Overloaded Chart (from 0, dur 791) — INDEPENDENT.
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
import { DashedFrame, dashOpenAt } from "../components/DashedFrame";
import { theme } from "../theme";
import { progress, fadeIn, fadeOut, textReveal } from "../helpers";
import { bmriDaily, WIN } from "../data/bmri";
import { usePalette } from "../palette";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
// Card top sits BELOW the 150px logo clear-zone so the brand mark never
// lands on card chrome.
const CARD = { x: 96, y: 160, w: 1728, h: 812 };
/**
 * ⚠ NOTHING DRAWS OUTSIDE THE PAPER. Simon, at 346: "elemennya muncul dari
 * luar background putih, jadi jelek. Buat munculnya dari dalam background
 * putih, yang RSI juga sama." The sub-panes slide up from a full pane-height
 * below their resting box — which, before RSI has compressed the price pane,
 * starts off the bottom of the card entirely. Clipping to the card turns that
 * into exactly what he asked for: the pane emerges FROM the white edge.
 * Written as a CSS inset so the coordinate space the chart draws in is
 * untouched — an overflow:hidden wrapper would need its own origin.
 */
const CLIP = `inset(${CARD.y}px ${theme.canvas.width - CARD.x - CARD.w}px ${
  theme.canvas.height - CARD.y - CARD.h
}px ${CARD.x}px round ${theme.radius.cardLg}px)`;
const INNER = { x: 160, y: 250, w: 1500, h: 620 };
const T = {
  chartIn: 3, // "Pertama kali melihat chart saham"
  /**
   * ⚠ THE PAPER ARRIVES BEFORE ANYTHING IS ON IT. Simon: "Fade in background
   * putihnya aja (beserta label harganya), lalu muncul candlesticksnya satu
   * per satu." The card and its price labels fade up empty, and only then do
   * the candles walk in left to right — so the first thing the film does is
   * set a stage rather than drop a finished picture onto one.
   */
  candlesIn: 20,
  look: 58, // "banyak orang langsung berpikir" — the frame eases back, as if studied
  thought: 106, // "Ini pasti cuma bisa dibaca"
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
  // (no closing caption either — the stacked indicators say "rumit" on their own)
};
/**
 * ⚠ 531 TAKES IT ALL BACK OFF. Simon: "Reverse chart yang saat ini penuh
 * dengan indikator dan tools, menjadi seperti chart di 238 (tapi tanpa trend
 * line)." Everything piled on between 208 and 395 leaves again in the REVERSE
 * of the order it arrived — MACD first, the trendlines last.
 *
 * ⚠ AND IT IS THE SAME PROGRESS, MULTIPLIED, NOT A FADE LAID OVER THE TOP.
 * Every one of these elements is DRAWN by its progress — a stroke that grows,
 * a pane that slides in — so winding that progress back to 0 un-draws it: the
 * averages retract along themselves and the sub-panes collapse, which is the
 * only thing that lets the price chart grow back to the full height it had at
 * 238. A fade would leave a squeezed chart behind a transparent RSI.
 *
 * It is finished by 597, which leaves twenty-two frames of the bare chart
 * before 619 freezes it for the roadmap. That gap is deliberate: the picture
 * the transition shrinks has to be one the eye has already settled on.
 */
const R = { start: 531, step: 8, dur: 26 };
/** 0 → still there, 1 → gone. `i` is DEPARTURE order, not arrival order. */
const leaves = (f: number, i: number) => progress(f, R.start + i * R.step, R.dur);

/** The doubt's box. Fixed, like every marquee in this film. */
const DOUBT = { w: 560, h: 96 };
/**
 * ⚠ THE CHART'S LINES ARE 3px AT FULL WEIGHT, 1px WHEN NOT THE SUBJECT.
 * Simon's "Pertebal garisnya jadi 3 px" was first applied only to the doubt's
 * dashed box; it was meant for the lines on the chart as well — trendlines,
 * MA20, MA50 and RSI. The theme's 2px rule stays the default everywhere else.
 */
const LINE = { full: 3, dim: 1 };
const MACD_SQUEEZE = 0.036;
const LEGEND_STEP = 20;
const LEGEND = ["MA 20", "MA 50", "BB", "RSI 14", "MACD"];
/** ⚠ ALL FIVE CHIPS READ THE SAME. Simon: "MA50, BB, RSI 14, dan MCD kenapa
 *  beda transparansi ya? Samain aja sama MA20." The stepped ramp was meant to
 *  keep the row legible; it just looked like four chips were malfunctioning. */
const LEGEND_OPACITY = [1, 1, 1, 1, 1];
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
  const pal = usePalette();
  const f = useCurrentFrame();

  /** How much of each layer survives the 531 reverse — see R, above. */
  const keep = {
    macd: 1 - leaves(f, 0),
    rsi: 1 - leaves(f, 1),
    bb: 1 - leaves(f, 2),
    ma50: 1 - leaves(f, 3),
    ma20: 1 - leaves(f, 4),
    trend: 1 - leaves(f, 5),
  };

  // price pane compresses as the sub-panes arrive — and grows back as they go
  const rsiIn = progress(f, T.rsi, 26) * keep.rsi;
  const macdIn = progress(f, T.macd, 26) * keep.macd;
  /**
   * ⚠ MACD TAKES THE SPACE RSI LEFT, IT DOES NOT PUSH THE STACK UP. Simon:
   * "Setelah MACD masuk, malah jadi ada banyak white space di bagian bawah
   * background putih ... masuknya MACD jangan terlalu dalem/naik." At 0.17
   * the stack ended at 857 on a card that ends at 972 — 115px of empty paper.
   * The stack's bottom is 250 + priceH + 328 (two 46px gaps, two 118px
   * panes). Aimed at 940: the histogram's bars stop short of their pane's
   * edge (the deepest red bar is about half the pane), so a 64px margin on the
   * BOX still read as 100px of empty paper. priceH = 362 →
   * 1 − 0.38 − 362/620 = 0.036 — MACD barely lifts the price pane at all.
   */
  const priceH = INNER.h * (1 - 0.38 * rsiIn - MACD_SQUEEZE * macdIn);
  const priceBox = { ...INNER, h: priceH };
  const g = chartGeom(bmriDaily, WINDOW, priceBox);

  const rsiBox = { x: INNER.x, y: INNER.y + priceH + 46, w: INNER.w, h: 118 };
  const macdBox = { x: INNER.x, y: rsiBox.y + rsiBox.h + 46, w: INNER.w, h: 118 };

  const chartOp = fadeIn(f, T.chartIn, 26);
  /** The candles, one at a time, once the paper is there to put them on. */
  const candlesIn = f >= T.candlesIn ? progress(f, T.candlesIn, 64) : 0;

  /**
   * ⚠ ONE THING AT A TIME, AND THE REST AT HALF. Simon, on "garis di
   * mana-mana" / "candlestick" / "indikator bertumpuk": "Ketika lagi
   * gilirannya muncul, yang lain kurangi transparansinya jadi 50%. Pas sampe
   * di 315, buat transparansi semuanya jadi 100%."
   *
   * Before 208 nothing is competing yet, so everything is full. From 315 the
   * release ramps every layer back up together — the scene stops naming parts
   * and starts showing the pile-up, which only works if the pile is whole.
   */
  const release = f >= T.rsi ? progress(f, T.rsi, 12) : 0;
  const spotlight = (a: number, b: number) => {
    if (f < T.trend) return 1;
    const inn = progress(f, a, 8);
    const out = f >= b ? progress(f, b, 8) : 0;
    const lvl = 0.5 + 0.5 * inn * (1 - out);
    return lvl + (1 - lvl) * release;
  };
  const trendLvl = spotlight(T.trend, T.pulse);
  const candleLvl = spotlight(T.pulse, T.ma20);
  const indLvl = spotlight(T.ma20, T.rsi);
  /**
   * ⚠ THE SPOTLIGHT DIMS *AND* THINS. Simon: "Elemen yang ga di-highlight,
   * tebel garisnya jadi 1 px." Half-opacity alone left four 2px lines fighting
   * the subject; at 1px they recede into texture, which is the point of the
   * beat. Same 0.5→1 level, so the two effects can never disagree.
   */
  const strokeOf = (lvl: number) =>
    interpolate(lvl, [0.5, 1], [LINE.dim, LINE.full], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const rise = interpolate(f, [T.chartIn, T.chartIn + 40], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.motion.ease,
  });

  const trendDraw = (f >= T.trend ? progress(f, T.trend, 34) : 0) * keep.trend;
  const thoughtOut = f >= T.thoughtOut ? fadeOut(f, T.thoughtOut, 14) : 1;
  /** The words wait for the frame — see DashedFrame. */
  const doubt = textReveal(f, dashOpenAt(T.thought), 14);
  const lookBack = f >= T.look ? progress(f, T.look, 40) : 0;
  const cardScale = interpolate(lookBack, [0, 1], [1, 0.985]);

  const ma20 = (f >= T.ma20 ? progress(f, T.ma20, 30) : 0) * keep.ma20;
  const ma50 = (f >= T.ma50 ? progress(f, T.ma50, 30) : 0) * keep.ma50;
  const bb = (f >= T.bb ? progress(f, T.bb, 30) : 0) * keep.bb;

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
            background: pal.cardBg,
            border: `${theme.stroke.hair}px solid ${pal.border}`,
            opacity: chartOp,
          }}
        />

        <div style={{ position: "absolute", inset: 0, clipPath: CLIP }}>
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${rise}px)` }}>
          {/* ⚠ NO GLOW. It went brightness lift → glow + 10% swell → glow on the
              candles only → gone: Simon, "glow indigo di candlesticks nya
              cancel deh." On "Candlestick" the spotlight alone carries the
              beat — the candles hold full opacity while the trendlines drop to
              half and thin to 1px. */}
          <div style={{ position: "absolute", inset: 0, opacity: candleLvl }}>
            <CandlestickChart
              data={bmriDaily}
              window={WINDOW}
              box={priceBox}
              axesOpacity={chartOp}
              revealProgress={candlesIn}
            />
          </div>

          <div style={{ position: "absolute", inset: 0, opacity: indLvl }}>
          <IndicatorOverlays
            data={bmriDaily}
            window={WINDOW}
            box={priceBox}
            cx={g.cx}
            scale={g.scale}
            ma20Progress={ma20}
            ma50Progress={ma50}
            bbProgress={bb}
            strokeWidth={strokeOf(indLvl)}
          />
          </div>

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
                    stroke={pal.indigo}
                    strokeWidth={strokeOf(trendLvl)}
                    strokeDasharray={len}
                    strokeDashoffset={len * (1 - trendDraw)}
                    opacity={0.8 * trendLvl}
                  />
                );
              })}
            </svg>
          )}

          <SubPane kind="rsi" data={bmriDaily} window={WINDOW} box={rsiBox} cx={g.cx} slideProgress={rsiIn} title="RSI 14" strokeWidth={strokeOf(indLvl)} />
          <SubPane kind="macd" data={bmriDaily} window={WINDOW} box={macdBox} cx={g.cx} slideProgress={macdIn} title="MACD 12 26 9" strokeWidth={strokeOf(indLvl)} />
        </div>
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
            /* ⚠ THE CHIPS LEAVE RIGHT TO LEFT — departure index 4 - i, so
               MACD goes first and MA 20 last, mirroring how they arrived. */
            opacity={LEGEND_OPACITY[i] * (1 - leaves(f, 4 - i))}
          />
        ))}
      </div>

      {/* ⚠ THE DOUBT IS IN A BOX NOW — Simon: "kasih text box garis putus
          putus deh, biar ga hambar stylenya". Same marquee the rest of the
          film uses, so the one thought the viewer is being handed looks like
          something the film put there on purpose. */}
      <DashedFrame
        x={(theme.canvas.width - DOUBT.w) / 2}
        y={thoughtY - DOUBT.h / 2}
        w={DOUBT.w}
        h={DOUBT.h}
        at={T.thought}
        /* ⚠ BLACK UNTIL IT LEAVES. The old cut faded the box to 55% on
           "Bukan buat saya" — Simon: "Text box dan text 'cuma buat profesional'
           buat hitam terus aja, jangan berubah warna." One opacity, and it is
           the exit. */
        opacity={thoughtOut}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: theme.type.family,
            fontSize: theme.type.chip.size,
            fontWeight: theme.type.chip.weight,
            color: pal.ink,
            whiteSpace: "nowrap",
            opacity: doubt.opacity,
            transform: `translateY(${doubt.y}px)`,
          }}
        >
          Cuma buat profesional?
        </div>
      </DashedFrame>
    </SafeArea>
  );
};
