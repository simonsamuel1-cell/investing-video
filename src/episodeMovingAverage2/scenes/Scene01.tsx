/**
 * SCENE 01 — Manual is slow, indicators are fast. `from 0 · dur 607`
 *
 * One broker window, open for the whole scene, with a watchlist extension down
 * its right side. The scene is a session at that window: three charts are
 * opened in turn, the first two are read BY HAND — the market structure traced
 * out swing by swing, which takes seconds — and the third is handed to two
 * indicators, which answer across the whole series the moment they are
 * switched on.
 *
 * The panel is FLAT AND AT REST throughout: no tilt on any axis, no camera
 * travel, no dolly, and the candles are simply there when the scene opens.
 *
 * [PLACEHOLDER] Every QUOTE is read off one of Simon's own screenshots. Every
 * CANDLE is traced by eye from those screenshots (see `data/shots.ts`), which
 * is why the panel carries a visible "Ilustrasi" tag. The tag comes off when
 * real OHLC exports land; nothing else in the scene has to change.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { theme } from "../theme";
import { progress, progressInOut, clamp01, drawPath, fmtRp, sma, bollinger, mulberry32 } from "../helpers";
import { toBars } from "../series";
import { BBCA_1D, BBRI_1D, BMRI_1D, fromAnchors, type Anchor } from "../data/shots";
import { CUTS, cutOutStyle } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/**
 * ═══ THE TIMELINE ═══ (VO in the margin)
 *
 *   0        the window is already open on BBCA — flat, still, every candle
 *            drawn                             "Membaca candlestick dan chart
 *                                               pattern memang powerful."
 *   2 – 86   BBCA's structure is traced onto it, labelled LH · LL · HH · HL as
 *            the line reaches each swing. IT DOES NOT LEAVE — it stays on the
 *            chart it belongs to, and goes when that chart does.
 * 128       the plot gives up 400px and the watchlist opens beside it. It is
 *            open for the REST OF THE SCENE.
 *                                              "Tapi kalau harus cek saham
 *                                               satu per satu,"
 * 155       BBRI is selected and its chart takes the window
 * 170 – 228   BBRI's own structure is traced — the second hand-read, and the
 *            reason the move to BMRI waits
 *                                              "prosesnya bisa cukup lama dan
 *                                               butuh mata yang terlatih."
 * 245       BMRI is selected, in the last seconds of the run
 * 261       two indicator buttons appear under the timeframes, both OFF
 *                                              "Di sinilah indikator membantu."
 * 301       MOVING AVERAGE switches on: the button lights indigo and an orange
 *            average draws from the LEFT EDGE
 *                                              "Indikator mengolah data harga
 *                                               yang sudah ada …"
 * 435       BOLLINGER BANDS switches on: tosca bands unfold, also from the
 *            left edge                         "Bukan menggantikan analisismu,
 *                                               tapi membantu menyaring …"
 */
const T = {
  /** BBCA's structure. `dur` is the draw; the labels ride it. */
  zig: { from: 2, dur: 82 },
  /** The watchlist opens and never closes. */
  list: { in: 128, over: 20, step: 4 },
  /** When each chart takes the window, and how long the cross-fade runs. */
  bbri: 155,
  bmri: 245,
  swapOver: 12,
  /** BBRI's structure, drawn in the window it owns. */
  zigBbri: { from: 170, dur: 58 },
  buttons: 261,
  ma: 301,
  bb: 435,
  /** How long each indicator takes to draw across the series. */
  drawOver: 40,
};

const PANEL = { x: 96, y: 150, w: 1728, h: 750 };
const PLOT = { x: PANEL.x + 150, y: PANEL.y + 200, w: PANEL.w - 150 - 56, h: 490 };
const N = 105;
const MA_PERIOD = 20;

/**
 * ═══ THE WATCHLIST ═══
 *
 * Six names. The selected row is whichever chart is in the window, so the list
 * and the chart can never disagree about what is being looked at.
 *
 * Five of the six are quoted off Simon's own screenshots — BBCA, BBRI and BMRI
 * from the daily charts these candles are traced from, TLKM and ASII from the
 * 1H shots. The percentages on BBRI and BMRI are read off the last candle of
 * their screenshots and are approximate; BBCA's is exact, from its header.
 *
 * [PLACEHOLDER] ANTM alone is ILLUSTRATIVE — a real ticker with an invented
 * level, there to make six.
 */
const WATCH = [
  { t: "BBCA", p: 6325, c: "+0,40%", up: true },
  { t: "BBRI", p: 3220, c: "+3,20%", up: true },
  { t: "BMRI", p: 4210, c: "+0,70%", up: true },
  { t: "TLKM", p: 2590, c: "−0,38%", up: false },
  { t: "ASII", p: 4770, c: "+0,42%", up: true },
  { t: "ANTM", p: 1585, c: "+1,28%", up: true },
];
/**
 * The list is an EXTENSION of the chart window, not a window of its own: flush
 * to the panel's right edge, the panel's full height, set off by a single rule
 * down its left side. `take` is the width the plot gives up for it, and it is
 * the same as `w` — there is no gap to leave, because the two share an edge.
 */
const LIST = {
  take: 400,
  w: 400,
  x: PANEL.w - 400,
  pad: 24,
  headTop: 36,
  rowTop: 108,
  rowH: 88,
  avatar: 36,
  /** Every glyph in the extension. Smaller than the panel's own chrome — it is
      a dense list, not a readout. */
  size: 24,
};

const FRAMES = ["5m", "15m", "1H", "1D", "1W"];
/** Every screenshot is a DAILY chart, so 1D is the live pill throughout. */
const ACTIVE = "1D";
/** A daily chart's axis is dates, not session hours. */
const AXIS = ["Apr", "Mei", "Jun", "Jul", "Agu", "Sep"];
/**
 * ═══ THE PANEL'S OWN TYPE ═══
 *
 * NOT the episode's four sizes. This is a reproduction of a broker's UI and
 * these are its readouts — chrome, not headings, sentences or in-chart labels
 * — so they are named here, in the one scene that needs them.
 */
const UI = { size: 30, weight: 600, axis: 500, name: 36, price: 70 };
const HEAD = { x: 40, avatar: 52, gap: 16 };
/**
 * The price column's centre line. The axis labels and the last-price pill are
 * BOTH centred on it — right-aligning them lined up their right edges but left
 * their middles apart, because the pill carries padding the labels do not.
 */
const AXIS_CX = 84;
/**
 * The indicator buttons, floating under the timeframe row.
 *
 * 20px — smaller than every other readout in the panel, and deliberately: this
 * is a second row of controls under the first, and at the panel's own 30px the
 * pair ran from the price group all the way to the extension and sat on the
 * chart's wash. The padding is cut with the type so the chip stays a chip.
 */
const BTN = { top: 108, gap: 10, padX: 16, padY: 8, size: 20 };
// ═══════════════════════════════════════════════════════════════════════════

const font = theme.type.family;
const C = theme.colors;

/**
 * The plot's width is LIVE — it shrinks once, to make room for the extension —
 * so every horizontal position is a function of it. Only the price axis is
 * fixed, and it is fixed PER CHART.
 */
const lx = (i: number, w: number) => PLOT.x - PANEL.x + 14 + ((w - 28) * i) / (N - 1);
const bodyW = (w: number) => ((w - 28) / N) * 0.6;

/**
 * `period` closes BEFORE the first one on screen, walked backwards from it.
 *
 * Without these the average has no value until its twentieth bar and the line
 * starts a fifth of the way across — which would say this chart began the day
 * it was opened. The window is a SLICE of a series that was already running.
 */
const priorOf = (first: number, count: number, seed: number) => {
  const rnd = mulberry32(seed);
  const out: number[] = [];
  let v = first;
  for (let i = 0; i < count; i++) {
    v = v * (1 + (rnd() - 0.5) * 0.014);
    out.unshift(v);
  }
  return out;
};

type Pivot = { i: number; high: boolean; label?: string };

const makeChart = (sh: {
  t: string;
  name: string;
  price: number;
  change: string;
  up: boolean;
  anchors: Anchor[];
  seed: number;
  at: number;
  pivots: Pivot[];
}) => {
  const closes = fromAnchors(sh.anchors, N, sh.seed);
  const bars = toBars(closes, sh.seed + 1);
  const lo = Math.min(...bars.map((b) => b.l));
  const hi = Math.max(...bars.map((b) => b.h));
  /* Gridlines on a round step CHOSEN from the range: a fixed 200 gives four
     lines on a 900-point chart and eleven on a 2.000-point one. */
  const step = (() => {
    const want = (hi - lo) / 5;
    return [50, 100, 200, 250, 500, 1000, 2000].find((n) => n >= want) ?? 2000;
  })();
  const levels: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) levels.push(v);
  /* 0.80, not 0.88: a LL label hangs UNDER its low, and at 0.88 the lowest bar
     left no room for a chip above the month row. */
  const y = (v: number) =>
    PLOT.y - PANEL.y + PLOT.h * (1 - (v - lo) / (hi - lo)) * 0.8 + PLOT.h * 0.06;

  const prior = priorOf(closes[0], MA_PERIOD, sh.seed + 2);
  const full = [...prior, ...closes];
  const ma = sma(full, MA_PERIOD).slice(MA_PERIOD);
  const bbFull = bollinger(full, MA_PERIOD, 2);
  const bb = { upper: bbFull.upper.slice(MA_PERIOD), lower: bbFull.lower.slice(MA_PERIOD) };

  /* Swing points: highs on the bar's high, lows on its low. A swing marked at
     the close floats inside the candle it names. */
  const pt = sh.pivots.map((p) => ({ ...p, y: y(p.high ? bars[p.i].h : bars[p.i].l) }));
  const zigAt = [0];
  for (let i = 1; i < pt.length; i++) {
    const dx = lx(pt[i].i, PLOT.w) - lx(pt[i - 1].i, PLOT.w);
    zigAt.push(zigAt[i - 1] + Math.hypot(dx, pt[i].y - pt[i - 1].y));
  }

  return { ...sh, closes, bars, lo, hi, levels, y, ma, bb, pt, zigAt, zigLen: zigAt[zigAt.length - 1] };
};

/**
 * ═══ THE MARKET STRUCTURE ═══
 *
 * Every point is a SWING in the series its candles are drawn from, and every
 * label is checked against the swing of its own kind before it. The unlabelled
 * points are there because the line has to pass through them for the labelled
 * ones to be true — an LH is only a lower high next to the high before it.
 *
 *   BBCA   LH 6.800@10 < 6.900@0 · LL 5.900@24 < 6.450@6 · LH 6.300@30 <
 *          6.800@10 · LL 4.850@41 < 5.900@24 · HH 6.500@49 > 6.300@30 (the
 *          turn) · HL 5.650@60 > 4.850@41 · HH 6.550@76 > 6.500@49 ·
 *          HL 6.200@82 > 5.650@60. The 88–104 tail is a range, not a trend:
 *          a lower high AND a higher low, so it is left unnamed.
 *
 *   BBRI   LH 3.500@18 < 3.600@2 · LL 3.120@29 < 3.180@14 · LH 3.200@43 <
 *          3.300@32 · LL 2.500@49 < 3.050@38 · HL 2.650@66 > 2.500@49 ·
 *          HH 3.150@90 > 3.100@77.
 *
 * BMRI carries none. By the time it is in the window the reading is being done
 * by the indicators, and that is the whole comparison.
 */
const BBCA_PIVOTS: Pivot[] = [
  { i: 0, high: true },
  { i: 6, high: false },
  { i: 10, high: true, label: "LH" },
  { i: 24, high: false, label: "LL" },
  { i: 30, high: true, label: "LH" },
  { i: 41, high: false, label: "LL" },
  { i: 49, high: true, label: "HH" },
  { i: 60, high: false, label: "HL" },
  { i: 76, high: true, label: "HH" },
  { i: 82, high: false, label: "HL" },
  { i: 88, high: true },
  { i: 96, high: false },
  { i: 104, high: true },
];
const BBRI_PIVOTS: Pivot[] = [
  { i: 2, high: true },
  { i: 14, high: false },
  { i: 18, high: true, label: "LH" },
  { i: 29, high: false, label: "LL" },
  { i: 32, high: true },
  { i: 38, high: false },
  { i: 43, high: true, label: "LH" },
  { i: 49, high: false, label: "LL" },
  { i: 55, high: true },
  { i: 66, high: false, label: "HL" },
  { i: 77, high: true },
  { i: 82, high: false },
  { i: 90, high: true, label: "HH" },
  { i: 94, high: false },
  { i: 104, high: true },
];

const CHARTS = [
  makeChart({
    t: "BBCA", name: "Bank Central Asia", price: 6325, change: "+0,40%", up: true,
    anchors: BBCA_1D, seed: 4041, at: 0, pivots: BBCA_PIVOTS,
  }),
  makeChart({
    t: "BBRI", name: "Bank Rakyat Indonesia", price: 3220, change: "+3,20%", up: true,
    anchors: BBRI_1D, seed: 5150, at: T.bbri, pivots: BBRI_PIVOTS,
  }),
  makeChart({
    t: "BMRI", name: "Bank Mandiri", price: 4210, change: "+0,70%", up: true,
    anchors: BMRI_1D, seed: 6260, at: T.bmri, pivots: [],
  }),
];
/** Each chart's own structure timing. BMRI has none. */
const ZIG = [T.zig, T.zigBbri, null];
/**
 * Labels lead the line slightly. Keyed to the raw fraction the LAST one sits
 * at exactly 1.0, which the draw only reaches on its final frame — so it never
 * appeared at all.
 */
const ZIG_LEAD = 0.9;

type Chart = (typeof CHARTS)[number];

const pathOf = (v: (number | null)[], w: number, y: (n: number) => number) => {
  let d = "";
  v.forEach((n, i) => {
    if (n === null) return;
    d += `${d === "" ? "M" : "L"}${lx(i, w).toFixed(1)},${y(n).toFixed(1)} `;
  });
  return d.trim();
};
const lenOf = (v: (number | null)[], w: number, y: (n: number) => number) => {
  let len = 0;
  let prev: { x: number; y: number } | null = null;
  v.forEach((n, i) => {
    if (n === null) return;
    const q = { x: lx(i, w), y: y(n) };
    if (prev) len += Math.hypot(q.x - prev.x, q.y - prev.y);
    prev = q;
  });
  return len;
};

export const Scene01 = () => {
  const f = useCurrentFrame();

  /**
   * The extension opens once and stays. The plot's width is derived from it,
   * so the candles, the structure and the indicator lines all narrow together
   * rather than being scaled — text on a scaled group is text that stretches.
   */
  const open = progressInOut(f, T.list.in, T.list.over);
  const plotW = PLOT.w - LIST.take * open;

  /** Which chart the window is on, and therefore which row is selected. */
  const active = CHARTS.reduce((k, c, i) => (f >= c.at ? i : k), 0);
  /** A chart is up from its own frame until the next one takes over. */
  const alpha = (i: number) => {
    const inA = i === 0 ? 1 : progress(f, CHARTS[i].at, T.swapOver);
    const next = CHARTS[i + 1];
    return inA * (next ? 1 - progress(f, next.at, T.swapOver) : 1);
  };

  const maOn = f >= T.ma;
  const bbOn = f >= T.bb;

  /**
   * The cut out of the scene. SC01 starts at global 0, so its local frame IS
   * the global one and nothing has to be added back here — every other scene
   * in the episode has to add its own `from`.
   */
  const cut = cutOutStyle(f, CUTS.toAverage);

  return (
    <SafeArea>
      <div
        style={{
          position: "absolute",
          inset: 0,
          ...cut,
        }}
      >
        {/* ── the panel ────────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            left: PANEL.x,
            top: PANEL.y,
            width: PANEL.w,
            height: PANEL.h,
            borderRadius: theme.layout.radius.lg,
            background: C.surface,
            border: `${theme.layout.border.thin}px solid ${C.border}`,
            overflow: "hidden",
          }}
        >
          {/* the chart's own ground — a wash, hue-locked to the palette */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 168,
              width: PANEL.w,
              height: PANEL.h - 168,
              background: `linear-gradient(180deg, ${C.indigo12} 0%, ${C.cyan12} 46%, ${C.surface} 100%)`,
            }}
          />

          {/* ── header: it belongs to whichever chart is up ── */}
          {CHARTS.map((ch, i) => {
            const o = alpha(i);
            if (o <= 0.001) return null;
            return (
              <div key={ch.t} style={{ opacity: o }}>
                <div style={{ position: "absolute", left: HEAD.x, top: 36, display: "flex", alignItems: "center", gap: HEAD.gap }}>
                  <div
                    style={{
                      width: HEAD.avatar,
                      height: HEAD.avatar,
                      borderRadius: HEAD.avatar / 2,
                      background: C.indigo,
                      color: C.surface,
                      fontFamily: font,
                      fontSize: UI.size,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {ch.t[0]}
                  </div>
                  <span style={{ fontFamily: font, fontSize: UI.name, fontWeight: UI.weight, color: C.text }}>
                    {ch.t}
                  </span>
                  <span style={{ fontFamily: font, fontSize: UI.size, fontWeight: UI.weight, color: C.textMuted }}>
                    {ch.name}
                  </span>
                  {/* real ticker, traced candles — see the header note */}
                  <span
                    style={{
                      fontFamily: font,
                      fontSize: UI.size,
                      fontWeight: UI.weight,
                      color: C.textMuted,
                      border: `${theme.layout.border.thin}px solid ${C.border}`,
                      borderRadius: theme.layout.radius.sm,
                      padding: "4px 14px",
                    }}
                  >
                    Ilustrasi
                  </span>
                </div>

                {/* left edge on the ticker, not on the avatar beside it */}
                <div
                  style={{
                    position: "absolute",
                    left: HEAD.x + HEAD.avatar + HEAD.gap,
                    top: 92,
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <span style={{ fontFamily: font, fontSize: UI.price, fontWeight: 800, color: C.text, lineHeight: 1 }}>
                    {fmtRp(ch.price)}
                  </span>
                  <span
                    style={{
                      fontFamily: font,
                      fontSize: UI.size,
                      fontWeight: UI.weight,
                      color: ch.up ? C.candleGreen : C.candleRed,
                      background: ch.up ? "rgba(34, 181, 115, 0.12)" : "rgba(229, 71, 93, 0.12)",
                      borderRadius: theme.layout.radius.sm,
                      padding: "6px 16px",
                    }}
                  >
                    {ch.change}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Timeframe pills. They belong to the CHART WINDOW, not to the
              panel, so they travel left with its right edge when the extension
              opens: without that the chart appears to shrink under its own
              controls instead of making room beside them. */}
          <div style={{ position: "absolute", right: 40 + LIST.take * open, top: 40, display: "flex", gap: 8 }}>
            {FRAMES.map((t) => {
              const live = t === ACTIVE;
              return (
                <span
                  key={t}
                  style={{
                    fontFamily: font,
                    fontSize: UI.size,
                    fontWeight: UI.weight,
                    color: live ? C.surface : C.textMuted,
                    background: live ? C.indigo : C.indigo12,
                    borderRadius: theme.layout.radius.sm,
                    padding: "8px 20px",
                  }}
                >
                  {t}
                </span>
              );
            })}
          </div>

          {/* ── the two indicator buttons, under the timeframes ── */}
          {f >= T.buttons && (
            <div
              style={{
                position: "absolute",
                right: 40 + LIST.take * open,
                top: BTN.top,
                display: "flex",
                gap: BTN.gap,
                opacity: progress(f, T.buttons, theme.motion.revealF),
              }}
            >
              {[
                { label: "Moving Average", on: maOn, at: T.ma },
                { label: "Bollinger Bands", on: bbOn, at: T.bb },
              ].map((b) => {
                /* the switch is a cross-fade between the two skins, so fill,
                   border and label arrive together instead of snapping */
                const sel = b.on ? progress(f, b.at, 10) : 0;
                const pick = (off: string, onC: string) => (sel > 0.5 ? onC : off);
                return (
                  <span
                    key={b.label}
                    style={{
                      fontFamily: font,
                      fontSize: BTN.size,
                      fontWeight: UI.weight,
                      color: pick(C.textMuted, C.surface),
                      background: pick(C.surface, C.indigo),
                      border: `${theme.layout.border.thin}px solid ${pick(C.border, C.indigo)}`,
                      borderRadius: theme.layout.radius.sm,
                      padding: `${BTN.padY}px ${BTN.padX}px`,
                    }}
                  >
                    {b.label}
                  </span>
                );
              })}
            </div>
          )}

          {/* ── the charts ── */}
          {CHARTS.map((ch: Chart, n) => {
            const o = alpha(n);
            if (o <= 0.001) return null;
            const zt = ZIG[n];
            const drawn = zt ? progressInOut(f, zt.from, zt.dur) : 0;
            const isBmri = n === 2;
            return (
              <svg
                key={ch.t}
                style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
                width={PANEL.w}
                height={PANEL.h}
                opacity={o}
              >
                {ch.levels.map((v) => (
                  <g key={v}>
                    <line
                      x1={PLOT.x - PANEL.x}
                      y1={ch.y(v)}
                      x2={PLOT.x - PANEL.x + plotW}
                      y2={ch.y(v)}
                      stroke={C.gridline}
                      strokeWidth={theme.layout.border.thin}
                      strokeDasharray="2 8"
                    />
                    <text
                      x={AXIS_CX}
                      y={ch.y(v) + 10}
                      textAnchor="middle"
                      fontFamily={font}
                      fontSize={UI.size}
                      fontWeight={UI.axis}
                      fill={C.textMuted}
                    >
                      {fmtRp(v)}
                    </text>
                  </g>
                ))}

                {/* the tape is simply THERE — no entrance */}
                {ch.bars.map((b, i) => {
                  const x = lx(i, plotW);
                  const top = Math.min(ch.y(b.o), ch.y(b.c));
                  const h = Math.max(2, Math.abs(ch.y(b.c) - ch.y(b.o)));
                  const up = b.c >= b.o;
                  return (
                    <g key={i}>
                      <line
                        x1={x}
                        y1={ch.y(b.h)}
                        x2={x}
                        y2={ch.y(b.l)}
                        stroke={up ? C.candleGreen : C.candleRed}
                        strokeWidth={theme.layout.stroke.wick}
                      />
                      <rect
                        x={x - bodyW(plotW) / 2}
                        y={top}
                        width={bodyW(plotW)}
                        height={h}
                        rx={2}
                        fill={up ? C.candleGreen : C.candleRed}
                      />
                    </g>
                  );
                })}

                {/* ── the market structure, traced by hand ── */}
                {zt && f >= zt.from && (
                  <g>
                    <path
                      d={ch.pt
                        .map((p, i) => `${i === 0 ? "M" : "L"}${lx(p.i, plotW).toFixed(1)},${p.y.toFixed(1)}`)
                        .join(" ")}
                      fill="none"
                      stroke={C.indigo}
                      strokeWidth={theme.layout.stroke.ma}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={ch.zigLen}
                      strokeDashoffset={ch.zigLen * (1 - drawn)}
                    />
                    {ch.pt.map((pv, k) => {
                      /* a point waits for the LINE to reach it, not for a frame
                         number guessed off the easing curve */
                      const a = clamp01((drawn - (ch.zigAt[k] / ch.zigLen) * ZIG_LEAD) * 9);
                      if (a <= 0.001) return null;
                      const w = 74;
                      const cx = lx(pv.i, plotW);
                      const cy = pv.high ? pv.y - 18 : pv.y + 18;
                      return (
                        <g key={pv.i} opacity={a}>
                          {/* a NAMED swing gets a ring; a turn the line merely
                              passes through gets a dot */}
                          <circle
                            cx={cx}
                            cy={pv.y}
                            r={pv.label ? 9 : 5}
                            fill={pv.label ? C.surface : C.indigo}
                            stroke={C.indigo}
                            strokeWidth={theme.layout.border.thick}
                          />
                          {pv.label && (
                            <>
                              <rect
                                x={cx - w / 2}
                                y={pv.high ? cy - 46 : cy}
                                width={w}
                                height={46}
                                rx={theme.layout.radius.sm}
                                fill={C.indigo12}
                                stroke={C.indigo}
                                strokeWidth={theme.layout.border.thin}
                              />
                              <text
                                x={cx}
                                y={(pv.high ? cy - 46 : cy) + 33}
                                textAnchor="middle"
                                fontFamily={font}
                                fontSize={UI.size}
                                fontWeight={700}
                                fill={C.indigo}
                              >
                                {pv.label}
                              </text>
                            </>
                          )}
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* ── the bands, under the average ── */}
                {isBmri && bbOn && (
                  <g opacity={progress(f, T.bb, theme.motion.revealF)}>
                    <path
                      d={`${pathOf(ch.bb.upper, plotW, ch.y)} ${ch.bb.lower
                        .map((v, i) =>
                          v === null ? "" : `L${lx(i, plotW).toFixed(1)},${ch.y(v).toFixed(1)}`,
                        )
                        .reverse()
                        .join(" ")} Z`}
                      fill={C.bbTosca}
                      fillOpacity={0.1}
                      stroke="none"
                    />
                    {[ch.bb.upper, ch.bb.lower].map((band, k) => (
                      <path
                        key={k}
                        d={pathOf(band, plotW, ch.y)}
                        fill="none"
                        stroke={C.bbTosca}
                        strokeWidth={theme.layout.stroke.band}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        {...drawPath(f, T.bb, T.drawOver, lenOf(band, plotW, ch.y))}
                      />
                    ))}
                  </g>
                )}

                {/* ── the average ── */}
                {isBmri && maOn && (
                  <path
                    d={pathOf(ch.ma, plotW, ch.y)}
                    fill="none"
                    stroke={C.maOrange}
                    strokeWidth={theme.layout.stroke.ma}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    {...drawPath(f, T.ma, T.drawOver, lenOf(ch.ma, plotW, ch.y))}
                  />
                )}

                {/* the last-price line, and nothing else on it — the readout it
                    carries is the pill on the axis */}
                <line
                  x1={PLOT.x - PANEL.x}
                  y1={ch.y(ch.price)}
                  x2={PLOT.x - PANEL.x + plotW}
                  y2={ch.y(ch.price)}
                  stroke={C.text}
                  strokeWidth={theme.layout.border.thin}
                  strokeDasharray="8 8"
                />

                {AXIS.map((t, i) => (
                  <text
                    key={t}
                    x={PLOT.x - PANEL.x + 14 + ((plotW - 28) * i) / (AXIS.length - 1)}
                    /* the panel clips: a baseline below its height is a label
                       cut in half */
                    y={PLOT.y + PLOT.h - PANEL.y + 34}
                    textAnchor="middle"
                    fontFamily={font}
                    fontSize={UI.size}
                    fontWeight={UI.axis}
                    fill={C.textMuted}
                  >
                    {t}
                  </text>
                ))}
              </svg>
            );
          })}

          {/* the price the crosshair sits on, on the axis */}
          {CHARTS.map((ch, i) => {
            const o = alpha(i);
            if (o <= 0.001) return null;
            return (
              <div
                key={ch.t}
                style={{
                  position: "absolute",
                  left: AXIS_CX,
                  transform: "translateX(-50%)",
                  top: ch.y(ch.price) - 22,
                  opacity: o,
                  background: C.text,
                  color: C.surface,
                  fontFamily: font,
                  fontSize: UI.size,
                  fontWeight: UI.weight,
                  borderRadius: theme.layout.radius.sm,
                  padding: "6px 16px",
                }}
              >
                {fmtRp(ch.price)}
              </div>
            );
          })}

          {/* ── the watchlist, an extension of this same window ── */}
          {open > 0.001 && (
            <div
              style={{
                position: "absolute",
                left: LIST.x,
                top: 0,
                width: LIST.w,
                height: PANEL.h,
                background: C.surface,
                borderLeft: `${theme.layout.border.thin}px solid ${C.border}`,
                /* A DRAWER, not a fade: it starts its full width outside the
                   panel — which clips — and slides in opaque. Fading it in
                   showed the chart THROUGH it, and a pill behind it, for the
                   twenty frames it took to arrive. */
                transform: `translateX(${((1 - open) * LIST.w).toFixed(1)}px)`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: LIST.pad,
                  top: LIST.headTop,
                  fontFamily: font,
                  fontSize: LIST.size,
                  fontWeight: UI.weight,
                  color: C.textMuted,
                }}
              >
                Watchlist
              </div>
              {WATCH.map((w, i) => {
                /* the selected row IS the chart in the window — one source of
                   truth, so the two can never disagree */
                const on = w.t === CHARTS[active].t;
                return (
                  <div
                    key={w.t}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: LIST.rowTop + i * LIST.rowH,
                      width: LIST.w,
                      height: LIST.rowH,
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: LIST.pad - (on ? 4 : 0),
                      paddingRight: LIST.pad,
                      borderTop: `${theme.layout.border.thin}px solid ${C.border}`,
                      /* filled, and carrying a bar on the edge it shares with
                         the chart — it has to hold its own against everything
                         to its left */
                      background: on ? C.indigo12 : "transparent",
                      borderLeft: on ? `4px solid ${C.indigo}` : undefined,
                      fontFamily: font,
                      /* one row at a time, so the list reads as a list being
                         gone through rather than a block that appears */
                      opacity: progress(f, T.list.in + i * T.list.step, theme.motion.revealF),
                    }}
                  >
                    <div
                      style={{
                        width: LIST.avatar,
                        height: LIST.avatar,
                        borderRadius: LIST.avatar / 2,
                        flexShrink: 0,
                        background: on ? C.indigo : C.indigo12,
                        color: on ? C.surface : C.indigo,
                        fontSize: 18,
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {w.t[0]}
                    </div>
                    <span
                      style={{
                        flex: 1,
                        marginLeft: 14,
                        fontSize: LIST.size,
                        fontWeight: 700,
                        color: on ? C.indigo : C.text,
                      }}
                    >
                      {w.t}
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                      <span style={{ fontSize: LIST.size, fontWeight: UI.axis, color: C.price, lineHeight: 1.2 }}>
                        {fmtRp(w.p)}
                      </span>
                      <span
                        style={{
                          fontSize: LIST.size,
                          fontWeight: UI.weight,
                          lineHeight: 1.2,
                          color: w.up ? C.candleGreen : C.candleRed,
                        }}
                      >
                        {w.c}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </SafeArea>
  );
};
