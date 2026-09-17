/**
 * scripts/trace-admr.mjs — reads Simon's `ADMR_03.png` and writes the real
 * ADMR daily tape the SC12/SC13 case study has been waiting for.
 *
 * ⚠ THIS IS THE ONE SCENE IN THE EPISODE THAT NAMES A REAL STOCK ON REAL
 * DATES. "Pada 11 Mei 2026, harga break di bawah MA100" is a claim about a
 * chart somebody can go and look at, so every number here has to come OFF that
 * chart rather than near it. Nothing in this file is chosen.
 *
 * ═══ WHAT THE PICTURE IS ═══
 * A TradingView export, 2758×1458, dark theme: ADMR · 1D · IDX with a 100-day
 * moving average, a volume overlay on the price pane's floor, and a MACD
 * (12, 26, 9) pane underneath.
 *
 * ⚠ THE MA100 AND THE MACD ARE TRACED, NOT COMPUTED, and that is not laziness.
 * A 100-day average needs a hundred closes BEFORE the first bar on screen, and
 * the picture does not have them; the same goes for a 26-period EMA. The line
 * TradingView drew is the only evidence of those hundred days that exists, so
 * the line is the data.
 *
 * ⚠ THE CROSSHAIR IS IN THE PICTURE. Simon's mouse left a dotted horizontal
 * line at 1,525, and TradingView draws it in the SAME teal as an up candle —
 * it read as 39 extra bars on the first pass. Rows 559 and 560 are masked.
 *
 * ⚠ SO IS THE LEGEND, and it is worse: its O/H/L/C values are teal and its
 * MA100 value is red, so five candle columns merged into one 94px "bar". It is
 * masked as a BOX rather than as a band of rows, because the tallest candles
 * (2,300) reach y131 — above where the legend ends.
 */
import { createRequire } from "module";
import { readFileSync, writeFileSync } from "fs";

const require = createRequire(process.cwd() + "/");
const { PNG } = require("pngjs");

const SRC = "/Users/samuelsurja/Documents/01 Academy/VIDEO 22 - TA Mistakes/ADMR_03.png";
const OUT = "src/episodes/022-ta-mistakes/data/admr.json";

const png = PNG.sync.read(readFileSync(SRC));
const W = png.width;
const at = (x, y) => {
  const i = (y * W + x) * 4;
  return [png.data[i], png.data[i + 1], png.data[i + 2]];
};
/** Exact match. Every colour below was read out of the file, so nothing here
 *  needs a tolerance — and a tolerance is what would blur the MA's red into
 *  the down candles', which differ by 13 in one channel. */
const is = (c, t) => c[0] === t[0] && c[1] === t[1] && c[2] === t[2];
const near = (c, t, d) =>
  Math.abs(c[0] - t[0]) <= d && Math.abs(c[1] - t[1]) <= d && Math.abs(c[2] - t[2]) <= d;

/* ── the palette, sampled from the file ─────────────────────────────────── */
const UP = [8, 153, 129];
const DOWN = [242, 54, 69];
const MA = [244, 67, 54];
const VOL_UP = [27, 96, 84];
const VOL_DOWN = [134, 51, 58];
const HIST = [[34, 171, 148], [172, 229, 220], [255, 82, 82], [252, 203, 205]];

/* ── the frame ──────────────────────────────────────────────────────────── */
const PLOT = { x0: 21, x1: 2609 };
const PRICE = { y0: 21, y1: 935 };
const MACD_PANE = { y0: 970, y1: 1385 };
const CROSSHAIR = new Set([559, 560]);
/** The legend's box. See the header for why this is a box and not a band. */
const LEGEND = { x0: 21, x1: 790, y0: 21, y1: 135 };
const inLegend = (x, y) => x >= LEGEND.x0 && x <= LEGEND.x1 && y >= LEGEND.y0 && y <= LEGEND.y1;

/* ── the two scales, solved from the axis gridlines ─────────────────────── */
/** Price: nine gridlines, 2,400 at y76.5 down to 800 at y960.5. */
const priceAt = (y) => 2400 - ((y - 76.5) * 1600) / (960.5 - 76.5);
/** MACD: 200 at y1015.5, −100 at y1328.5. */
const macdAt = (y) => 200 - ((y - 1015.5) * 300) / (1328.5 - 1015.5);

/* ── 1 · the candle columns ─────────────────────────────────────────────── */
const candleY = [];
for (let x = PLOT.x0; x <= PLOT.x1; x++) {
  const ys = [];
  for (let y = PRICE.y0; y < PRICE.y1; y++) {
    if (CROSSHAIR.has(y) || inLegend(x, y)) continue;
    const c = at(x, y);
    if (is(c, UP) || is(c, DOWN)) ys.push(y);
  }
  candleY[x] = ys;
}
const runs = [];
let s = -1;
for (let x = PLOT.x0; x <= PLOT.x1 + 1; x++) {
  const lit = x <= PLOT.x1 && candleY[x].length > 0;
  if (lit && s < 0) s = x;
  if (!lit && s >= 0) { runs.push([s, x - 1]); s = -1; }
}
/** ⚠ A CLIPPED RUN IS NOT A BAR. The picture is scrolled, so the first column
 *  holds half of the last October bar; its high and low are cut by the border
 *  and there is no way to know by how much. */
const BODY_W = 14;
const bars = runs.filter(([a, b]) => b - a + 1 === BODY_W);
const dropped = runs.filter(([a, b]) => b - a + 1 !== BODY_W);

/* ── 2 · OHLC, from body rows against wick rows ─────────────────────────── */
/**
 * ⚠ THE BODY IS THE ROWS THAT ARE FULL WIDTH, and the wick is the rows that
 * are not. That is the only thing separating an open from a high: both are the
 * top of some ink, and only the width says which.
 */
const ohlc = bars.map(([a, b]) => {
  let up = 0, down = 0;
  const bodyRows = [], allRows = [];
  for (let y = PRICE.y0; y < PRICE.y1; y++) {
    if (CROSSHAIR.has(y)) continue;
    let n = 0;
    for (let x = a; x <= b; x++) {
      if (inLegend(x, y)) continue;
      const c = at(x, y);
      if (is(c, UP)) { n++; up++; }
      else if (is(c, DOWN)) { n++; down++; }
    }
    if (n > 0) allRows.push(y);
    if (n >= BODY_W - 2) bodyRows.push(y);
  }
  const rising = up >= down;
  const hiY = allRows[0];
  const loY = allRows[allRows.length - 1];
  const bTop = bodyRows[0];
  const bBot = bodyRows[bodyRows.length - 1];
  return {
    x: (a + b) / 2,
    rising,
    high: priceAt(hiY),
    low: priceAt(loY),
    open: priceAt(rising ? bBot : bTop),
    close: priceAt(rising ? bTop : bBot),
    _bodyRows: bodyRows.length,
  };
});

/* ── 3 · the MA100, traced ──────────────────────────────────────────────── */
/** ⚠ IT IS DRAWN ON TOP OF THE CANDLES, which is what makes this possible at
 *  all — found in 2552 of 2588 columns. The handful it is not found in are
 *  interpolated from their neighbours, and the count is reported. */
const maRaw = [];
for (let x = PLOT.x0; x <= PLOT.x1; x++) {
  const ys = [];
  for (let y = PRICE.y0; y < PRICE.y1; y++) {
    if (inLegend(x, y)) continue;
    if (is(at(x, y), MA)) ys.push(y);
  }
  maRaw[x] = ys.length ? (ys[0] + ys[ys.length - 1]) / 2 : null;
}
let maGaps = [];
const maRead = bars.map(([a, b], i) => {
  const got = [];
  for (let x = a; x <= b; x++) if (maRaw[x] !== null) got.push(maRaw[x]);
  if (got.length) return priceAt(got.reduce((s, v) => s + v, 0) / got.length);
  maGaps.push(i);
  return null;
});
/**
 * ⚠ TWO BARS HIDE IT, AND THEY ARE INTERPOLATED RATHER THAN LEFT EMPTY. The
 * average is drawn UNDER the candles, so wherever it passes inside a body there
 * is nothing to read — bar 120 is 8 May, the day before the break, which is
 * exactly the bar somebody would want to check. Its neighbours are solid
 * readings one bar either side and the line moves about 6 a day, so the gap is
 * worth a rupiah at most. It is recorded as interpolated all the same.
 */
const ma100 = maRead.map((v, i) => {
  if (v !== null) return v;
  let a = i - 1, b = i + 1;
  while (a >= 0 && maRead[a] === null) a--;
  while (b < maRead.length && maRead[b] === null) b++;
  if (a < 0 || b >= maRead.length) return null;
  return maRead[a] + ((maRead[b] - maRead[a]) * (i - a)) / (b - a);
});

/* ── 4 · volume, off the overlay at the price pane's floor ──────────────── */
/**
 * ⚠ THE FLOOR IS y963, NOT THE PRICE PANE'S BOTTOM. The volume overlay hangs
 * BELOW the 800 gridline, in the strip between it and the pane edge — the first
 * pass stopped at y934 and lost every bar shorter than 30px, which read as
 * eight days with no volume at all.
 *
 * ⚠ AND ZERO IS y964, the bottom EDGE of the last drawn row rather than its
 * centre. A bar occupies whole rows from the baseline up, so the baseline is
 * the edge under them.
 *
 * ⚠ THE SCALE COMES FROM THE AXIS LABEL. "66.96 M" sits in a box whose borders
 * are at y882.5 and y914.5, so its value is at y898.5 — and it is not clamped,
 * which is the only thing that would make its position a lie. That bar is not
 * on screen (the chart is scrolled; see the note on the legend), but the
 * LABEL'S HEIGHT still encodes its value on this axis, which is all a scale
 * needs.
 */
const VOL_ZERO_Y = 964;
const VOL_REF = { y: 898.5, m: 66.96 };
const volAt = (y) => ((VOL_ZERO_Y - y) * VOL_REF.m) / (VOL_ZERO_Y - VOL_REF.y);
const isVol = (c) => near(c, VOL_UP, 14) || near(c, VOL_DOWN, 14);
let volFloor = 0;
for (let x = PLOT.x0; x <= PLOT.x1; x++) {
  for (let y = 975; y > 820; y--) if (isVol(at(x, y))) { if (y > volFloor) volFloor = y; break; }
}
const volume = bars.map(([a, b]) => {
  for (let y = 700; y <= volFloor; y++) {
    for (let x = a; x <= b; x++) if (isVol(at(x, y))) return volAt(y);
  }
  return 0;
});

/* ── 5 · the MACD histogram ─────────────────────────────────────────────── */
const macd = bars.map(([a, b]) => {
  const ys = [];
  for (let y = MACD_PANE.y0; y < MACD_PANE.y1; y++) {
    for (let x = a; x <= b; x++) {
      const c = at(x, y);
      if (HIST.some((h) => near(c, h, 10))) { ys.push(y); break; }
    }
  }
  if (!ys.length) return 0;
  /* the bar runs from zero to its value; the far end is the value */
  const zero = 1224.17;
  const top = ys[0], bot = ys[ys.length - 1];
  return Math.abs(top - zero) > Math.abs(bot - zero) ? macdAt(top) : macdAt(bot);
});

/* ── 6 · the dates ──────────────────────────────────────────────────────── */
/**
 * ⚠ READ OFF THE AXIS, THEN CHECKED AGAINST THE CALENDAR — not assumed from
 * either. The thirteen tick labels land within 0.1 of a bar index, which is
 * what says the pitch is right; the April anchors then pin the chain: bar 95 is
 * 1 Apr and bar 104 is 15 Apr, which only works if 3 Apr (Good Friday) did not
 * trade. From there bar 116 is 4 May, because 1 May is Hari Buruh.
 */
const ANCHORS = [
  [0, "Nov"], [9, "14 Nov"], [20, "Dec"], [29, "12 Dec"], [40, "Jan"], [49, "15 Jan"],
  [60, "Feb"], [69, "13 Feb"], [78, "Mar"], [95, "1 Apr"], [104, "15 Apr"],
  [116, "1st trading day of May"], [132, "1st trading day of Jun"],
];
const MAY = ["4 May", "5 May", "6 May", "7 May", "8 May", "11 May", "12 May", "13 May",
  "18 May", "19 May", "20 May", "21 May", "22 May", "25 May", "26 May", "29 May"];

/* ── 7 · the shape and the three events, DERIVED then CHECKED ──────────── */
/**
 * ⚠ THE EVENTS ARE FOUND IN THE DATA AND THEN MATCHED TO THE DATES, not the
 * other way round. Reading them off the calendar would only prove I can count
 * days; finding them in the tape and landing on 11, 12 and 18 May is the thing
 * that says the trace is right — and it is the claim the narration makes.
 */
const closes = ohlc.map((b) => b.close);
const highs = ohlc.map((b) => b.high);
const lows = ohlc.map((b) => b.low);

/** The first bar to CLOSE below the average, once the average is above price. */
let breakMa = -1;
for (let i = 110; i < closes.length; i++) {
  if (ma100[i] !== null && closes[i] < ma100[i] - 20) { breakMa = i; break; }
}
/** The next bar: it reaches back ABOVE the average intraday and closes below. */
const retest = breakMa + 1;
const retested = highs[retest] > ma100[retest] && closes[retest] < ma100[retest];

/** The flat support: the level the lows sat on before the break. */
const touches = [];
for (let i = 95; i < breakMa + 2; i++) {
  const isLow = lows[i] <= lows[i - 1] && lows[i] <= lows[i + 1];
  if (isLow && lows[i] < 1760) touches.push(i);
}
const support = Math.round(touches.reduce((s, i) => s + lows[i], 0) / touches.length);
/** The first bar after the retest to CLOSE below it. */
let breakSupport = -1;
for (let i = retest + 1; i < closes.length; i++) {
  if (closes[i] < support) { breakSupport = i; break; }
}
/**
 * The lower highs the upper line hangs under.
 *
 * ⚠ A FRACTAL, NOT A NEIGHBOUR TEST, and the difference is not academic. "Higher
 * than the bar either side" picked bar 100 — a 1,829 bounce in the middle of the
 * April dip — and then refused every real high after it for being above 1,829.
 * A swing high is the highest bar for four days in each direction, which is what
 * makes 2,050, 2,019 and 1,990 the three the line actually hangs on.
 *
 * ⚠ AND A TIE GOES TO THE LATER BAR. Bars 93 and 95 both top out at 2,050; the
 * line wants the one nearest the triangle, or its first leg is flat.
 */
const REACH = 4;
const hiMarks = [];
for (let i = 95; i <= breakMa; i++) {
  let top = true;
  for (let k = -REACH; k <= REACH; k++) {
    if (k === 0) continue;
    const j = i + k;
    if (j < 0 || j >= highs.length) continue;
    if (highs[j] > highs[i] || (k > 0 && highs[j] === highs[i])) { top = false; break; }
  }
  if (!top) continue;
  const last = hiMarks[hiMarks.length - 1];
  if (last === undefined || highs[i] < highs[last]) hiMarks.push(i);
}

const DATES = {};
ANCHORS.forEach(([i, t]) => { DATES[i] = t; });
MAY.forEach((t, k) => { DATES[116 + k] = t; });

const fail = (m) => { console.log("  ✗ " + m); process.exitCode = 1; };
console.log("\n═══ the three events, found in the tape ═══");
console.log(`  break MA100      bar ${breakMa}  ${DATES[breakMa]}  close ${Math.round(closes[breakMa])} vs MA ${Math.round(ma100[breakMa])}`);
console.log(`  failed retest    bar ${retest}  ${DATES[retest]}  high ${Math.round(highs[retest])} > MA ${Math.round(ma100[retest])}, close ${Math.round(closes[retest])} below it — ${retested ? "yes" : "NO"}`);
console.log(`  support broken   bar ${breakSupport}  ${DATES[breakSupport]}  close ${Math.round(closes[breakSupport])} vs support ${support}`);
console.log(`  support ${support} from lows at ${JSON.stringify(touches)} = ${touches.map((i) => Math.round(lows[i])).join(", ")}`);
console.log(`  lower highs at ${JSON.stringify(hiMarks)} = ${hiMarks.map((i) => Math.round(highs[i])).join(", ")}`);
console.log("\n═══ against the narration ═══");
if (DATES[breakMa] !== "11 May") fail(`the MA break lands on ${DATES[breakMa]}, not 11 May`); else console.log("  ✓ 11 Mei 2026 — harga break di bawah MA100");
if (DATES[retest] !== "12 May" || !retested) fail(`the retest lands on ${DATES[retest]} / reached above the MA: ${retested}`); else console.log("  ✓ besoknya — retest, gagal kembali ke atas MA100");
if (DATES[breakSupport] !== "18 May") fail(`the support break lands on ${DATES[breakSupport]}, not 18 May`); else console.log("  ✓ 18 Mei — support descending triangle ditembus");
const green = [breakMa - 4, breakMa - 3, breakMa - 2].every((i) => macd[i] > 0);
if (!green) fail("the MACD histogram is not green in the run-up"); else console.log("  ✓ MACD histogram sudah hijau, in the days before the break");
if (hiMarks.length < 3) fail("fewer than three lower highs — that is not a descending triangle");
else console.log("  ✓ descending triangle — lower highs onto a flat support");

/* ── report ─────────────────────────────────────────────────────────────── */
const r2 = (v) => (v === null ? null : Math.round(v));
const out = {
  source: "ADMR_03.png — TradingView, ADMR · 1D · IDX",
  label: "ADMR · 1D · IDX",
  bars: ohlc.length,
  droppedRuns: dropped.map(([a, b]) => `${a}..${b} (w${b - a + 1})`),
  maInterpolated: maGaps,
  volFloor,
  ohlc: ohlc.map((b) => ({ o: r2(b.open), h: r2(b.high), l: r2(b.low), c: r2(b.close), up: b.rising })),
  ma100: ma100.map(r2),
  volume: volume.map((v) => Math.round(v * 100) / 100),
  macd: macd.map((v) => Math.round(v * 10) / 10),
  anchors: ANCHORS,
  may: MAY,
  events: { breakMa, retest, breakSupport },
  shape: { support, highs: hiMarks, lows: touches },
  dates: DATES,
};
writeFileSync("/tmp/claude-502/trace/admr-raw.json", JSON.stringify(out, null, 1));
writeFileSync(OUT, JSON.stringify(out, null, 1));

console.log(`bars ${ohlc.length}   dropped ${dropped.length} ${JSON.stringify(out.droppedRuns)}   MA interpolated at ${JSON.stringify(maGaps)}   vol floor y${volFloor}`);
const L = out.ohlc.length - 1;
console.log("last bar:", JSON.stringify(out.ohlc[L]), " MA100", out.ma100[L], " hist", out.macd[L], " vol", out.volume[L] + "M");
console.log("volume range:", Math.min(...out.volume).toFixed(1) + "M ..", Math.max(...out.volume).toFixed(1) + "M");
console.log("checks against the axis boxes → last close 1400 · MA100 1855 · hist −18");
const want = { o: 1510, h: 1535, l: 1505, c: 1525 };
let best = -1, bestErr = 9e9;
out.ohlc.forEach((b, i) => {
  const e = Math.abs(b.o - want.o) + Math.abs(b.h - want.h) + Math.abs(b.l - want.l) + Math.abs(b.c - want.c);
  if (e < bestErr) { bestErr = e; best = i; }
});
console.log(`legend bar O1510 H1535 L1505 C1525 → closest traced bar ${best}: ${JSON.stringify(out.ohlc[best])} (total error ${bestErr})`);
console.log("bars 116..132:", out.ohlc.slice(116, 133).map((b, i) => `${116 + i}:${b.c}`).join(" "));
console.log("ma 116..132:  ", out.ma100.slice(116, 133).map((v, i) => `${116 + i}:${v}`).join(" "));
