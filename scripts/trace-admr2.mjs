/**
 * scripts/trace-admr2.mjs — a PIXEL-FOR-PIXEL trace of Simon's `ADMR_03.png`.
 *
 * ═══ WHY THERE IS A SECOND TRACER ═══
 * The first one (trace-admr.mjs) read the picture as DATA: opens, highs, lows,
 * closes, volumes in millions, a MACD value per bar. That is the right thing to
 * extract when a scene is going to re-plot the tape in the Tuntun house style,
 * and it is the wrong thing entirely when the brief is "duplikat aja semuanya".
 * Prices go through a grid, a grid goes through a domain, and a domain is a
 * decision — so every one of those conversions was a chance for the drawing to
 * stop looking like the photograph. It did.
 *
 * This file converts NOTHING. Every number it writes is a coordinate in the
 * 2758×1458 source image, and the scene draws them inside an <svg viewBox> cut
 * from the same rectangle. One uniform scale, no domain, no grid maths — so the
 * candle bodies, the wicks, the volume bars and the histogram bars keep the
 * proportions they have in the export by construction rather than by luck.
 *
 * Run:  node scripts/trace-admr2.mjs
 * Out:  src/episodes/022-ta-mistakes/data/admr-chart.json
 * Check: node scripts/redraw-admr.mjs   ← redraws this JSON at 2758×1458 and
 *        diffs it against the original. That is the only proof that counts.
 *
 * ═══ WHAT IS DELIBERATELY LEFT OUT ═══ (Simon's list, 2026-09-17)
 *   · the top-left legend: "ADMR, 1D, IDX  O… H… L… C… +15 (+0.99%)",
 *     "Volume 11.39 M", "MA (100, close, 0) 1,592"
 *   · the MACD legend: "MACD (12, 26, close, 9, EMA, EMA) −22 −12 9"
 *   · the TradingView wordmark along the bottom
 * Those three are also the three places where text is drawn in the SAME colours
 * as the data, so every one of them is masked before anything is measured —
 * which is what the first trace got wrong and what turned five candle columns
 * into one 94px bar.
 *
 * ═══ THE FOUR TRAPS, AND WHERE EACH IS HANDLED ═══
 *   1. THE CROSSHAIR at y559–560 is drawn in EXACTLY the up-candle teal. `MASK`.
 *   2. THE TWO LEGENDS, same story, in teal / red / blue / orange. `MASK`.
 *   3. THE MA100 IS UNDER THE CANDLES and vanishes wherever one covers it —
 *      `traceLine` interpolates the gaps and records which columns it invented.
 *   4. GRIDLINES ARE UNDER THE CANDLES BUT VOLUME IS OVER THE GRIDLINES, at
 *      half opacity — which is why a volume bar crossing y960 is (33,102,90)
 *      and not (27,96,84). Both composites are accepted as volume ink; the
 *      scene redraws it the way TradingView did, alpha and all. See `VOL`.
 */
import { createRequire } from "module";
import { readFileSync, writeFileSync } from "fs";

const require = createRequire(process.cwd() + "/");
const { PNG } = require("pngjs");

const SRC = "/Users/samuelsurja/Documents/01 Academy/VIDEO 22 - TA Mistakes/ADMR_03.png";
const OUT = "src/episodes/022-ta-mistakes/data/admr-chart.json";

const png = PNG.sync.read(readFileSync(SRC));
const W = png.width, H = png.height;
const at = (x, y) => { const i = (y * W + x) * 4; return [png.data[i], png.data[i + 1], png.data[i + 2]]; };
const is = (c, t) => c[0] === t[0] && c[1] === t[1] && c[2] === t[2];
const hex = (c) => "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");

/* ═══ THE PALETTE, SAMPLED — not named, not guessed ═══════════════════════ */
const BG    = [20, 20, 20];
const CHROME= [38, 38, 38];   // the app frame outside the chart
const EDGE  = [49, 49, 49];   // the chart's own 1px rule
const EDGE2 = [41, 41, 41];
const GRID  = [33, 33, 33];
const SEP   = [48, 48, 48];   // between the price pane and the MACD pane
const UP    = [8, 153, 129];
const DOWN  = [242, 54, 69];
const MA    = [244, 67, 54];
const BLUE  = [33, 150, 243];
const ORANGE= [255, 109, 0];
const HIST  = { upStrong: [34, 171, 148], upPale: [172, 229, 220], downStrong: [255, 82, 82], downPale: [252, 203, 205] };
/**
 * ⚠ VOLUME IS HALF-TRANSPARENT AND THAT IS MEASURABLE, NOT ASSUMED.
 * #22AB94 at 50% over the #141414 ground gives exactly (27,96,84); the same
 * ink over a #212121 gridline gives exactly (33,102,90). Both composites are in
 * the file, two rows apart, and they agree on one alpha. Same for #F7525F.
 */
const VOL = {
  up:   { base: "#22ab94", over: [[27, 96, 84], [33, 102, 90]] },
  down: { base: "#f7525f", over: [[134, 51, 58], [140, 57, 64]] },
  alpha: 0.5,
};
const volInk = (c) => (VOL.up.over.some((t) => is(c, t)) ? "up" : VOL.down.over.some((t) => is(c, t)) ? "down" : null);

/* ═══ THE FRAME, MEASURED ═════════════════════════════════════════════════ */
/** Walk in from each side until the row/column stops being the app chrome. */
const solid = (c) => (x, y) => is(at(x, y), c);
const chromeAt = solid(CHROME);
let fx0 = 0; while (chromeAt(fx0, (H / 2) | 0)) fx0++;
let fx1 = W - 1; while (chromeAt(fx1, (H / 2) | 0)) fx1--;
let fy0 = 0; while (chromeAt((W / 2) | 0, fy0)) fy0++;
let fy1 = H - 1; while (chromeAt((W / 2) | 0, fy1)) fy1--;
/** ⚠ THE BOTTOM WALK STOPS AT THE WORDMARK, not at the chart. The TradingView
 *  logo sits in the chrome band, so scanning up from the bottom finds ITS ink
 *  first. The chart's own bottom is the last row that carries the 1px rule. */
let chartBottom = fy1;
while (chartBottom > 0 && !is(at((W / 2) | 0, chartBottom), EDGE)) chartBottom--;
const FRAME = { x: fx0, y: fy0, w: fx1 - fx0 + 1, h: chartBottom - fy0 + 1 };

/** The pane separator: the run of rows painted in SEP right across the chart. */
const sepRows = [];
for (let y = FRAME.y; y <= chartBottom; y++) {
  let n = 0; for (let x = FRAME.x + 2; x <= fx1 - 2; x++) if (is(at(x, y), SEP)) n++;
  if (n > (fx1 - fx0) * 0.9) sepRows.push(y);
}
const SEPY = { y0: sepRows[0], y1: sepRows[sepRows.length - 1] };

/* ═══ THE MASKS ═══════════════════════════════════════════════════════════
 * Three rectangles and two rows. Everything below reads pixels through `live`,
 * so nothing can measure a legend by accident. */
const MASK = {
  /** ⚠ A BOX, NOT A BAND OF ROWS. The tallest candle reaches y131, which is
   *  above where this legend ends — masking whole rows would delete it. */
  headline: { x0: 21, x1: 810, y0: 21, y1: 145 },
  macdLegend: { x0: 21, x1: 620, y0: 980, y1: 1040 },
  wordmark: { x0: 0, x1: W - 1, y0: chartBottom + 1, y1: H - 1 },
};
const CROSSHAIR_ROWS = [];
{
  /* Its rows are the ones where the up-teal appears in a dashed comb right
   * across the plot — hundreds of hits in a row that is nowhere near that many
   * candles wide. */
  for (let y = 21; y <= SEPY.y0; y++) {
    let n = 0; for (let x = 21; x <= 2609; x++) if (is(at(x, y), UP)) n++;
    if (n > 500) CROSSHAIR_ROWS.push(y);
  }
}
const masked = (x, y) =>
  CROSSHAIR_ROWS.includes(y) ||
  Object.values(MASK).some((m) => x >= m.x0 && x <= m.x1 && y >= m.y0 && y <= m.y1);
const live = (x, y) => (masked(x, y) ? BG : at(x, y));

/* ═══ THE PLOT AND THE GRID ═══════════════════════════════════════════════ */
/** A price gridline runs from the plot's left edge to its right edge, so the
 *  longest run of GRID pixels in any row IS the plot's x-range. */
let PLOT = { x0: Infinity, x1: -Infinity };
const hGrid = [];
for (let y = FRAME.y; y <= chartBottom; y++) {
  /**
   * ⚠ COUNTED AND SPREAD, NOT COUNTED ALONE. Four of the nine price gridlines
   * are buried — 800 keeps only 272 of its pixels under the volume, and the
   * histogram leaves the MACD zero line 262 — so a count threshold high enough
   * to reject an ordinary row rejects them too. What no ordinary row can fake
   * is REACH: a gridline puts ink in every tenth of the plot, and a row that
   * merely crosses the thirteen vertical gridlines puts 26 pixels in thirteen
   * places. Both legends are drawn over the gridlines they cross, so the
   * longest unbroken run is useless here as well.
   */
  let n = 0, lo = Infinity, hi = -Infinity;
  const deciles = new Set();
  for (let x = FRAME.x; x <= fx1; x++)
    if (is(at(x, y), GRID)) { n++; lo = Math.min(lo, x); hi = Math.max(hi, x); }
  if (n < 150) continue;
  for (let x = lo; x <= hi; x++)
    if (is(at(x, y), GRID)) deciles.add((((x - lo) * 10) / (hi - lo + 1)) | 0);
  if (deciles.size < 9) continue;
  hGrid.push(y);
}
/**
 * ⚠ THE PLOT'S EDGES ARE A CONSENSUS OF THE GRIDLINE ROWS, NOT ANY ONE OF
 * THEM. Taken from a single row the right edge lands on a stray pixel in the
 * price gutter, and the plot then runs to x2660 — which swallows the 1,855 tag
 * as three extra candles and starts the gutter two thirds of the way across
 * every tag. A column is inside the plot when MOST gridline rows are lit there.
 *
 * ⚠ x20 IS HALF A COLUMN OF PLOT. The gridlines really start there, where they
 * land on the inner border and come out rgb(47,47,47) rather than rgb(33,33,33)
 * — which is why the exact-colour scan finds them from x21. The half column is
 * left to the border, which is where the export leaves it too.
 */
{
  const need = hGrid.length * 0.6;
  for (let x = FRAME.x + 2; x <= fx1; x++) {
    let n = 0; for (const y of hGrid) if (is(at(x, y), GRID)) n++;
    if (n >= need) { PLOT.x0 = Math.min(PLOT.x0, x); PLOT.x1 = Math.max(PLOT.x1, x); }
  }
}

/** Pair the doubled rows into single 2px lines. */
const pairRows = (rows) => {
  const out = []; let run = [];
  for (const r of rows) {
    if (run.length && r === run[run.length - 1] + 1) run.push(r);
    else { if (run.length) out.push(run); run = [r]; }
  }
  if (run.length) out.push(run);
  return out.map((r) => ({ y0: r[0], y1: r[r.length - 1], c: (r[0] + r[r.length - 1] + 1) / 2 }));
};
const seenH = pairRows(hGrid.filter((y) => y < SEPY.y0));
const seenM = pairRows(hGrid.filter((y) => y > SEPY.y1));
/**
 * ⚠ EVERY GRIDLINE IS MEASURED; THE LADDER IS ONLY THE CHECK. Fitting one
 * constant pitch and putting the lines where the fit says moved four of the
 * nine half a pixel — the real gaps alternate 110 / 111 and average 110.5, and
 * the average is not where any of them is. So the ladder below exists to prove
 * the nine are the nine (and to name them), not to place them.
 */
const ladderFit = (seen) => {
  if (seen.length < 2) throw new Error("need two gridlines to check a ladder");
  const step = (seen[seen.length - 1].c - seen[0].c) / (seen.length - 1);
  const err = Math.max(...seen.map((g, i) => Math.abs(g.c - (seen[0].c + i * step))));
  if (err > 0.75) throw new Error(`gridlines are not a ladder — worst line is ${err.toFixed(2)}px off`);
  return { step, err };
};
const priceLadder = ladderFit(seenH);
const macdLadder = ladderFit(seenM);
const H_PRICE = seenH.map((g) => g.c);
const H_MACD = seenM.map((g) => g.c);

/** Vertical gridlines: the union of what is visible in every empty band. */
const vSet = new Set();
const BANDS = [[24, 70], [SEPY.y1 + 3, 1010], [1245, 1320], [1340, chartBottom - 26]];
for (let x = PLOT.x0; x <= PLOT.x1; x++) {
  for (const [a, b] of BANDS) {
    let n = 0; for (let y = a; y <= b; y++) if (is(live(x, y), GRID)) n++;
    if (n > (b - a + 1) * 0.85) { vSet.add(x); break; }
  }
}
const V_PAIRS = pairRows([...vSet].sort((a, b) => a - b));
const V_GRID = V_PAIRS.map((p) => p.c);
/**
 * ⚠ THEY STOP ABOVE THE DATE STRIP. Drawn the full height of the window they
 * run down through the dates, which is not what the export does — the MACD
 * plot ends at y1331 and the time axis below it has no grid at all.
 */
const V_SPAN = (() => {
  let top = Infinity, bot = -Infinity;
  for (const p of V_PAIRS) {
    for (let y = FRAME.y; y <= chartBottom; y++) if (is(at(p.y0, y), GRID)) { top = Math.min(top, y); break; }
    for (let y = chartBottom; y >= FRAME.y; y--) if (is(at(p.y0, y), GRID)) { bot = Math.max(bot, y); break; }
  }
  return { y0: top, y1: bot };
})();

/**
 * ⚠ THE MEASURED EDGES, NOT THE NOMINAL WIDTH — AND THE RIGHT EDGE IS CUT ON
 * THE RIGHT. The pitch is 18.98px, so the rasteriser gave most bars 17 columns
 * and a few 16, and forcing every one of them to the mode pushed a column of
 * ink into the gap beside it. The two end bars are genuinely cut off by the
 * plot, and which SIDE they are cut on is not interchangeable: the first bar
 * continues off to the LEFT, the last one off to the RIGHT. Restoring both to
 * the left put a phantom two columns of the last bar in the gap before it.
 */
const edges = (l, r, nominal) => {
  const w = r - l + 1;
  if (w >= nominal - 1) return { l, w, clipped: false };
  if (l <= PLOT.x0) return { l: r - nominal + 1, w: nominal, clipped: "left" };
  return { l, w: nominal, clipped: "right" };
};

/* ═══ THE BARS ════════════════════════════════════════════════════════════
 * Body first. A body is 14px of solid ink; a wick is 2. Group the columns that
 * carry candle ink and every run that is 8px or wider is a body — the one that
 * is 8 rather than 14 is the first bar, cut off by the left edge of the plot,
 * and it is IN the picture, so it is in the trace. The old tracer dropped it
 * and started counting at what is really bar 1.
 */
const litCandle = (x, y) => { const c = live(x, y); return is(c, UP) ? 1 : is(c, DOWN) ? -1 : 0; };
const colCount = [];
for (let x = PLOT.x0; x <= PLOT.x1; x++) {
  let n = 0;
  for (let y = 21; y <= SEPY.y0; y++) if (litCandle(x, y)) n++;
  colCount.push(n);
}
const runs = [];
{
  let s = -1;
  for (let i = 0; i < colCount.length; i++) {
    if (colCount[i] > 0 && s < 0) s = i;
    else if (colCount[i] === 0 && s >= 0) { runs.push([s + PLOT.x0, i - 1 + PLOT.x0]); s = -1; }
  }
  if (s >= 0) runs.push([s + PLOT.x0, colCount.length - 1 + PLOT.x0]);
}
const widthHist = {};
for (const [a, b] of runs) widthHist[b - a + 1] = (widthHist[b - a + 1] || 0) + 1;
const BODY_W = +Object.entries(widthHist).sort((a, b) => b[1] - a[1])[0][0];

const bars = runs.map(([bl, br], i) => {
  /** A clipped bar's true edge is off the plot; keep it, and let the scene's
   *  own clip do to it what the export's did. */
  const g = edges(bl, br, BODY_W);
  const clipped = !!g.clipped;
  const left = g.l;
  /** ⚠ CONTINUOUS, NOT AN INDEX. Columns 34..47 are the span 34→48, whose
   *  middle is 41 — and the wick sits on 40..42, centred on 41 as well. Half a
   *  pixel out here is the difference between a wick down the middle of a body
   *  and a wick against its left side. */
  const centre = left + BODY_W / 2;
  let up = 0, dn = 0;
  const rows = [];
  for (let y = 21; y <= SEPY.y0; y++) {
    let n = 0;
    for (let x = bl; x <= br; x++) { const v = litCandle(x, y); if (v) { n++; v > 0 ? up++ : dn++; } }
    rows.push(n);
  }
  const wide = clipped ? Math.max(1, br - bl - 1) : BODY_W - 2;
  let bt = -1, bb = -1, wt = -1, wb = -1;
  rows.forEach((n, j) => {
    const y = j + 21;
    if (n >= wide) { if (bt < 0) bt = y; bb = y; }
    if (n >= 1) { if (wt < 0) wt = y; wb = y; }
  });
  return { i, x: +centre.toFixed(2), bl: left, bw: g.w, bt, bb, wt, wb, up: up >= dn, clipped };
});

/* ═══ THE VOLUME BARS ═════════════════════════════════════════════════════ */
const volRuns = [];
{
  const colOn = [];
  for (let x = PLOT.x0; x <= PLOT.x1; x++) {
    let n = 0;
    for (let y = SEPY.y0 - 500; y <= SEPY.y0; y++) if (volInk(live(x, y))) n++;
    colOn.push(n > 0);
  }
  let s = -1;
  for (let i = 0; i <= colOn.length; i++) {
    if (colOn[i] && s < 0) s = i;
    else if (!colOn[i] && s >= 0) { volRuns.push([s + PLOT.x0, i - 1 + PLOT.x0]); s = -1; }
  }
}
const volW = (() => { const h = {}; for (const [a, b] of volRuns) h[b - a + 1] = (h[b - a + 1] || 0) + 1; return +Object.entries(h).sort((a, b) => b[1] - a[1])[0][0]; })();
const vol = volRuns.map(([l, r], i) => {
  let top = -1, bot = -1, up = 0, dn = 0;
  for (let y = 21; y <= SEPY.y0; y++) {
    let n = 0;
    for (let x = l; x <= r; x++) { const k = volInk(live(x, y)); if (k) { n++; k === "up" ? up++ : dn++; } }
    if (n > (r - l + 1) * 0.5) { if (top < 0) top = y; bot = y; }
  }
  const g = edges(l, r, volW);
  return { i, l: g.l, w: g.w, t: top, b: bot, up: up >= dn, clipped: g.clipped };
});

/* ═══ THE MACD HISTOGRAM ══════════════════════════════════════════════════ */
const histInk = (c) => Object.entries(HIST).find(([, t]) => is(c, t))?.[0] ?? null;
const histRuns = [];
{
  const colOn = [];
  for (let x = PLOT.x0; x <= PLOT.x1; x++) {
    let n = 0;
    for (let y = SEPY.y1 + 1; y <= chartBottom; y++) if (histInk(live(x, y))) n++;
    colOn.push(n > 0);
  }
  let s = -1;
  for (let i = 0; i <= colOn.length; i++) {
    if (colOn[i] && s < 0) s = i;
    else if (!colOn[i] && s >= 0) { histRuns.push([s + PLOT.x0, i - 1 + PLOT.x0]); s = -1; }
  }
}
const histW = (() => { const h = {}; for (const [a, b] of histRuns) h[b - a + 1] = (h[b - a + 1] || 0) + 1; return +Object.entries(h).sort((a, b) => b[1] - a[1])[0][0]; })();
const hist = histRuns.map(([l, r], i) => {
  let top = -1, bot = -1; const tones = {};
  for (let y = SEPY.y1 + 1; y <= chartBottom; y++) {
    let n = 0;
    for (let x = l; x <= r; x++) { const k = histInk(live(x, y)); if (k) { n++; tones[k] = (tones[k] || 0) + 1; } }
    /**
     * ⚠ THREE COLUMNS, NOT HALF THE BAR. The MACD and signal lines are drawn
     * OVER the histogram, and where one of them runs flat along a bar's far end
     * it erases most of that row — bar 23 keeps three pixels of its last row
     * and loses the rest to the blue line. Asking for half the width there
     * stops the bar two rows short of where it ends.
     */
    if (n >= 3) { if (top < 0) top = y; bot = y; }
  }
  const tone = Object.entries(tones).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const g = edges(l, r, histW);
  return { i, l: g.l, w: g.w, t: top, b: bot, tone, clipped: g.clipped };
});

/* ═══ THE THREE LINES ═════════════════════════════════════════════════════
 * One sample per column — the mean row of that colour — then the gaps filled
 * and the whole thing simplified to within half a pixel. The MA100 is under the
 * candles; `gaps` records every column that had to be invented. */
const traceLine = (colour, y0, y1) => {
  /**
   * ⚠ THE CENTRE OF A LINE IS NOT THE ROW THAT MATCHES IT EXACTLY. A 2px
   * anti-aliased stroke lands as one saturated row with two part-lit ones, and
   * which of the three is saturated depends on where inside the pixel the
   * stroke happened to fall. Taking the exact match alone quantises every
   * sample to a whole pixel and puts a visible stair in the redraw; the
   * coverage-weighted centroid recovers the sub-pixel position the export drew.
   */
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const vec = [colour[0] - BG[0], colour[1] - BG[1], colour[2] - BG[2]];
  const vv = dot(vec, vec);
  const coverAt = (x, y) => {
    const c = live(x, y);
    const d = [c[0] - BG[0], c[1] - BG[1], c[2] - BG[2]];
    const t = dot(d, vec) / vv;
    const res = Math.hypot(d[0] - t * vec[0], d[1] - t * vec[1], d[2] - t * vec[2]);
    return res < 26 && t > 0.12 && t < 1.15 ? Math.min(1, t) : 0;
  };
  const raw = [];
  for (let x = PLOT.x0; x <= PLOT.x1; x++) {
    /* Anchor on a row that is unambiguously the line, then walk out through
       its anti-aliasing — so a red candle elsewhere in the column, which the
       projection alone would happily accept, is never even looked at. */
    let core = -1;
    for (let y = y0; y <= y1; y++) if (is(live(x, y), colour)) { core = y; break; }
    if (core < 0) { raw.push(null); continue; }
    let lo = core, hi = core;
    while (lo - 1 >= y0 && coverAt(x, lo - 1) > 0) lo--;
    while (hi + 1 <= y1 && coverAt(x, hi + 1) > 0) hi++;
    let s = 0, w = 0;
    for (let y = lo; y <= hi; y++) { const c = is(live(x, y), colour) ? 1 : coverAt(x, y); s += y * c; w += c; }
    /* +0.5 turns a row index into the centre of that row, which is the space
       the scene's <polyline> lives in. */
    raw.push(w > 0.3 ? s / w + 0.5 : null);
  }
  const first = raw.findIndex((v) => v !== null);
  let last = -1; raw.forEach((v, i) => { if (v !== null) last = i; });
  const gaps = [];
  if (first >= 0) {
    let i = first;
    while (i <= last) {
      if (raw[i] === null) {
        let j = i; while (j <= last && raw[j] === null) j++;
        gaps.push([i + PLOT.x0, j - 1 + PLOT.x0]);
        for (let k = i; k < j; k++) raw[k] = raw[i - 1] + ((raw[j] - raw[i - 1]) * (k - i + 1)) / (j - i + 1);
        i = j;
      } else i++;
    }
  }
  const pts = [];
  for (let i = first; i <= last; i++) pts.push([i + PLOT.x0, +raw[i].toFixed(2)]);
  /* Douglas–Peucker, tolerance half a pixel. */
  const dp = (a, b, keep) => {
    let worst = 0, at = -1;
    const [x1v, y1v] = pts[a], [x2v, y2v] = pts[b];
    for (let i = a + 1; i < b; i++) {
      const t = (pts[i][0] - x1v) / (x2v - x1v || 1);
      const d = Math.abs(pts[i][1] - (y1v + (y2v - y1v) * t));
      if (d > worst) { worst = d; at = i; }
    }
    if (worst > 0.5 && at > 0) { dp(a, at, keep); dp(at, b, keep); } else keep.push(b);
  };
  let simple = pts;
  if (pts.length > 2) { const keep = [0]; dp(0, pts.length - 1, keep); simple = keep.sort((a, b) => a - b).map((i) => pts[i]); }
  const err = (() => {
    let m = 0, j = 0;
    for (const p of pts) {
      while (j < simple.length - 2 && simple[j + 1][0] < p[0]) j++;
      const [ax, ay] = simple[j], [bx, by] = simple[j + 1] ?? simple[j];
      const t = bx === ax ? 0 : (p[0] - ax) / (bx - ax);
      m = Math.max(m, Math.abs(p[1] - (ay + (by - ay) * t)));
    }
    return +m.toFixed(3);
  })();
  /** Stroke width, from the same coverage: a full row plus what bled either
   *  side of it. Counting exact matches alone measures every line at 1px. */
  const widths = [];
  for (let x = PLOT.x0 + 40; x <= PLOT.x1 - 40; x += 7) {
    let core = -1;
    for (let y = y0; y <= y1; y++) if (is(live(x, y), colour)) { core = y; break; }
    if (core < 0) continue;
    let end = core; while (end + 1 <= y1 && is(live(x, end + 1), colour)) end++;
    widths.push(end - core + 1 + coverAt(x, core - 1) + coverAt(x, end + 1));
  }
  widths.sort((a, b) => a - b);
  return { pts: simple, from: first + PLOT.x0, to: last + PLOT.x0, gaps, err, width: +(widths[(widths.length / 2) | 0] ?? 2).toFixed(2) };
};
const ma = traceLine(MA, 21, SEPY.y0);
const macdLine = traceLine(BLUE, SEPY.y1 + 1, chartBottom);
const signal = traceLine(ORANGE, SEPY.y1 + 1, chartBottom);

/* ═══ THE CROSSHAIR ═══════════════════════════════════════════════════════ */
const crosshair = (() => {
  if (!CROSSHAIR_ROWS.length) return null;
  const y = CROSSHAIR_ROWS[0];
  const on = [], off = [];
  let run = 0, gap = 0, firstX = -1;
  for (let x = PLOT.x0; x <= PLOT.x1; x++) {
    if (is(at(x, y), UP)) { if (firstX < 0) firstX = x; if (gap) { off.push(gap); gap = 0; } run++; }
    else { if (run) { on.push(run); run = 0; } if (firstX >= 0) gap++; }
  }
  const mode = (a) => { const h = {}; for (const v of a) h[v] = (h[v] || 0) + 1; return +Object.entries(h).sort((x, z) => z[1] - x[1])[0][0]; };
  const dash = mode(on), gapW = mode(off);
  /**
   * ⚠ THE COMB HAS A PHASE AND IT IS NOT THE EDGE OF THE PLOT. The first dash
   * is cut off by the plot's left edge, so starting the pattern at x0 puts
   * every dash in the row one pixel out — 864 wrong pixels in a single row,
   * which is what the first redraw scored. Solve the phase from a dash in the
   * middle of the row instead.
   */
  let phase = 0;
  for (let x = PLOT.x0 + 200; x < PLOT.x0 + 400; x++)
    if (is(at(x, y), UP) && !is(at(x - 1, y), UP)) { phase = ((x % (dash + gapW)) + dash + gapW) % (dash + gapW); break; }
  return {
    y0: CROSSHAIR_ROWS[0], y1: CROSSHAIR_ROWS[CROSSHAIR_ROWS.length - 1],
    dash, gap: gapW, phase, x0: firstX, x1: PLOT.x1, color: hex(UP),
  };
})();

/* ═══ THE INK IN THE GUTTERS ══════════════════════════════════════════════
 * The right-hand scale and the date axis. Everything here is POSITION measured
 * off the file; what each label SAYS is settled two ways and they have to
 * agree — the price ladder computes it, and the glyphs were read off a zoomed
 * crop of the export. A label that only one of the two produces is a bug.
 */
const GUTTER = { x0: PLOT.x1 + 2, x1: fx1 - 2 };
const isBg = (c) => is(c, BG) || is(c, GRID) || is(c, SEP) || is(c, EDGE) || is(c, EDGE2) || is(c, CHROME);
const grey = (c) => c[0] > 120 && c[0] === c[1] && c[1] === c[2];

/** Every horizontal band of the gutter that carries ink at all. */
const gutterBands = (() => {
  const out = []; let s = -1;
  for (let y = FRAME.y + 2; y <= chartBottom - 2; y++) {
    let n = 0;
    for (let x = GUTTER.x0; x <= GUTTER.x1; x++) if (!isBg(at(x, y))) n++;
    if (n && s < 0) s = y; else if (!n && s >= 0) { out.push([s, y - 1]); s = -1; }
  }
  if (s >= 0) out.push([s, chartBottom - 2]);
  return out.map(([a, b]) => {
    let lx = Infinity, rx = -Infinity; const tally = {};
    for (let y = a; y <= b; y++)
      for (let x = GUTTER.x0; x <= GUTTER.x1; x++) {
        const c = at(x, y);
        if (isBg(c)) continue;
        lx = Math.min(lx, x); rx = Math.max(rx, x);
        tally[c.join(",")] = (tally[c.join(",")] || 0) + 1;
      }
    const rank = Object.entries(tally).sort((p, q) => q[1] - p[1]);
    return { y0: a, y1: b, x0: lx, x1: rx, cy: (a + b + 1) / 2, rank, ink: rank[0][0].split(",").map(Number), n: rank[0][1] };
  });
})();

/** A TAG is a band whose dominant ink is one of the plot's own colours — the
 *  scale paints its labels grey and only a tag borrows a series' colour. */
const TAG_INK = [MA, UP, HIST.upStrong, HIST.downPale, ORANGE, HIST.downStrong, BLUE];
const tagBands = gutterBands.filter((b) => TAG_INK.some((t) => is(b.ink, t)));
/**
 * ⚠ A BAND CAN HOLD BOTH. The MACD zero label sits directly above the −18 tag
 * and the two touch, so the band's dominant ink is the tag's and the label
 * disappears with it. Each band is therefore cut by ink: the rows carrying the
 * tag's colour are the tag, the rows carrying grey are a label, and a band can
 * hand over one of each.
 */
const rowsWith = (b, test) => {
  const ys = [];
  for (let y = b.y0; y <= b.y1; y++) {
    let n = 0; for (let x = GUTTER.x0; x <= GUTTER.x1; x++) if (test(at(x, y))) n++;
    if (n) ys.push(y);
  }
  return ys;
};
for (const b of tagBands) {
  b.band = { y0: b.y0, y1: b.y1 };
  const mine = rowsWith(b, (c) => is(c, b.ink));
  b.y0 = mine[0]; b.y1 = mine[mine.length - 1]; b.cy = (b.y0 + b.y1 + 1) / 2;
  let lx = Infinity, rx = -Infinity;
  for (let y = b.y0; y <= b.y1; y++)
    for (let x = GUTTER.x0; x <= GUTTER.x1; x++) if (!isBg(at(x, y))) { lx = Math.min(lx, x); rx = Math.max(rx, x); }
  b.x0 = lx; b.x1 = rx;
}
const labelBands = gutterBands.flatMap((b) => {
  if (grey(b.ink)) return [b];
  if (!TAG_INK.some((t) => is(b.ink, t))) return [];
  /* A grey run inside a tag band, entirely clear of the tag's own rows. */
  const ys = rowsWith({ y0: b.band.y0, y1: b.band.y1 }, grey).filter((y) => y < b.y0 || y > b.y1);
  if (ys.length < 6) return [];
  let lx = Infinity, rx = -Infinity;
  for (const y of ys) for (let x = GUTTER.x0; x <= GUTTER.x1; x++) if (grey(at(x, y))) { lx = Math.min(lx, x); rx = Math.max(rx, x); }
  return [{ y0: ys[0], y1: ys[ys.length - 1], x0: lx, x1: rx, cy: (ys[0] + ys[ys.length - 1] + 1) / 2, ink: [184, 184, 184], covered: true }];
});

/**
 * ⚠ THE PRICE LADDER NAMES ITS OWN LABELS. 2,400 at the top gridline and 200
 * per step down is the only reading that puts 800 on the bottom one, and the
 * export prints both ends, so the middle seven are arithmetic rather than
 * guesswork. Where a tag covers a label the label is simply not drawn — which
 * is why 1,400 has no grey twin and 0 is half behind the −18 tag.
 */
const fmt = (v) => (v < 0 ? "−" : "") + Math.abs(v).toLocaleString("en-US");
const priceOf = (y) => 2400 - ((y - H_PRICE[0]) / priceLadder.step) * 200;
const macdOf = (y) => 200 - ((y - H_MACD[0]) / macdLadder.step) * 100;
const nearest = (arr, y) => arr.reduce((a, b) => (Math.abs(b - y) < Math.abs(a - y) ? b : a));
/**
 * ⚠ CENTRE ON THE DIGITS, NOT ON THE BAND. "2,400" has a comma that drops
 * below the baseline, so the band's middle sits 2px lower than the middle of
 * the numerals — and a label set from the band reads as sagging next to its
 * own gridline. `cy` below is the centre of the rows the DIGITS occupy; the
 * band is kept beside it as evidence.
 */
const digitCentre = (b) => {
  let top = Infinity, bot = -Infinity;
  for (let y = b.y0; y <= b.y1; y++) {
    let n = 0; for (let x = b.x0; x <= b.x1; x++) if (grey(at(x, y))) n++;
    if (n >= 3) { top = Math.min(top, y); bot = Math.max(bot, y); }
  }
  return { cy: (top + bot + 1) / 2, top, bot };
};
const priceLabels = labelBands
  .filter((b) => b.cy < SEPY.y0)
  .map((b) => {
    const d = digitCentre(b);
    return { text: fmt(Math.round(priceOf(nearest(H_PRICE, b.cy)) / 50) * 50), x0: b.x0, x1: b.x1, y0: b.y0, y1: b.y1, cy: d.cy, band: b.cy, grid: nearest(H_PRICE, b.cy), clipped: b.y1 >= SEPY.y0 - 2 };
  });
const macdLabels = labelBands
  .filter((b) => b.cy > SEPY.y1)
  .map((b) => {
    const d = digitCentre(b);
    return { text: fmt(Math.round(macdOf(nearest(H_MACD, b.cy)))), x0: b.x0, x1: b.x1, y0: b.y0, y1: b.y1, cy: d.cy, band: b.cy, grid: nearest(H_MACD, b.cy), covered: !!b.covered };
  });

/**
 * ⚠ THE TAGS ARE READ, NOT DERIVED — except for the check. Each one is a
 * rounded box in a series' own colour: FILLED when its ink covers most of the
 * box, OUTLINED when it only traces the edge and the glyphs. The text is what
 * the crop says; the assertion underneath is that the box sits where the value
 * would sit if the ladder were asked, which is what makes them each other's
 * proof.
 */
const TAG_TEXT = {
  "244,67,54": "1,855",
  "8,153,129": ["1,525", "1,400"],
  "34,171,148": "66.96 M",
  "252,203,205": "−18",
  "255,109,0": "−106",
};
const seenTeal = [];
const tags = tagBands.map((b) => {
  const key = b.ink.join(",");
  let text = TAG_TEXT[key];
  if (Array.isArray(text)) { text = text[seenTeal.length]; seenTeal.push(b); }
  /**
   * The box is the columns where its own colour runs the WHOLE height of the
   * band — which is its border, or all of it when it is filled.
   *
   * ⚠ NOT SIMPLY "WHERE THE COLOUR REACHES". Reaching two columns further left
   * to look for a pointer found the MA100 arriving at the plot's right edge in
   * the same red, and two dashes of the crosshair in the same teal, and grew
   * three of the six tags by 3px each. There are no pointers on these tags.
   */
  let lx = Infinity, rx = -Infinity;
  for (let x = GUTTER.x0; x <= GUTTER.x1; x++) {
    let n = 0;
    for (let y = b.y0; y <= b.y1; y++) if (is(at(x, y), b.ink)) n++;
    if (n >= (b.y1 - b.y0 + 1) * 0.5) { lx = Math.min(lx, x); rx = Math.max(rx, x); }
  }
  const box = { x: lx, y: b.y0, w: rx - lx + 1, h: b.y1 - b.y0 + 1 };
  /** Corner radius: how far in from the corner the top edge starts. */
  let radius = 0;
  while (radius < 8 && !is(at(box.x + radius, box.y), b.ink)) radius++;
  const filled = b.n > box.w * box.h * 0.5;
  /** Border weight: the run of the tag's colour down its own left edge. */
  let weight = 0;
  while (is(at(box.x + weight, b.y0 + ((box.h / 2) | 0)), b.ink)) weight++;
  /** The glyph colour: white on a filled tag, the tag's own ink otherwise. */
  const inkHex = hex(b.ink);
  return {
    text, ...box, cy: b.cy, filled, weight: filled ? 0 : weight, r: radius,
    fill: filled ? inkHex : null,
    stroke: inkHex,
    color: filled ? "#ffffff" : inkHex,
  };
});

/**
 * ═══ THE SCALES, MADE WHOLE ═══
 *
 * ⚠ TWO GRIDLINES HAVE NO LABEL IN THE EXPORT, AND THAT IS THE TAGS' DOING.
 * TradingView hides a scale label when one of its value tags lands on it — so
 * 1,400 is missing from the price ladder and −100 from the MACD ladder, each
 * sitting exactly under the tag that displaced it. The scene does not draw
 * those tags (Simon, 2026-09-17: "Semua label dengan style itu, hapus"), which
 * would leave a hole in an otherwise regular ladder and read as a bug. So the
 * hidden labels are put back — their VALUES are arithmetic off the same ladder
 * that names every other one, not a guess.
 *
 * ⚠ AND THE ZERO LABEL IS DISPLACED, not just hidden. It is drawn 3px above its
 * own gridline to clear the −18 tag; every other label in that pane is within
 * half a pixel of its line. With the tag gone it goes back on its line.
 *
 * So both ladders are snapped: one x for every label (the export left-aligns
 * them, and the 2px scatter is glyph side-bearing, not position) and one offset
 * from the gridline, the median of what was measured.
 */
const wholeScale = (labels, grids, valueAt, ink) => {
  const mid = (a) => [...a].sort((x, y) => x - y)[(a.length / 2) | 0];
  const off = mid(labels.map((l) => l.cy - nearest(grids, l.cy)));
  const x0 = mid(labels.map((l) => l.x0));
  return grids.map((gy, i) => {
    const had = labels.find((l) => nearest(grids, l.cy) === gy);
    return {
      text: had ? had.text : fmt(valueAt(i)),
      x0,
      cy: gy + off,
      grid: gy,
      restored: !had,
      ...(had ? { measured: { x0: had.x0, cy: had.cy } } : {}),
    };
  });
};
const priceScale = wholeScale(priceLabels, H_PRICE, (i) => 2400 - 200 * i, "price");
const macdScale = wholeScale(macdLabels, H_MACD, (i) => 200 - 100 * i, "macd");

/** The date axis. Words, not letters: inside a word the gaps are a few px. */
const dateBand = (() => {
  let a = -1, b = -1;
  for (let y = chartBottom - 60; y <= chartBottom - 2; y++) {
    let n = 0; for (let x = PLOT.x0; x <= PLOT.x1; x++) if (grey(at(x, y))) n++;
    if (n) { if (a < 0) a = y; b = y; }
  }
  return { y0: a, y1: b };
})();
const DATE_TEXT = ["Nov", "14", "Dec", "12", "2026", "15", "Feb", "13", "Mar", "Apr", "15", "May", "Jun"];
const dates = (() => {
  const on = [];
  for (let x = PLOT.x0; x <= PLOT.x1; x++) {
    let n = 0; for (let y = dateBand.y0; y <= dateBand.y1; y++) if (grey(at(x, y))) n++;
    on.push(n > 0);
  }
  const runs = []; let s = -1;
  for (let i = 0; i <= on.length; i++) {
    if (on[i] && s < 0) s = i; else if (!on[i] && s >= 0) { runs.push([s + PLOT.x0, i - 1 + PLOT.x0]); s = -1; }
  }
  const words = []; let cur = runs[0];
  for (let i = 1; i < runs.length; i++) {
    if (runs[i][0] - cur[1] <= 10) cur = [cur[0], runs[i][1]];
    else { words.push(cur); cur = runs[i]; }
  }
  if (cur) words.push(cur);
  return words.map(([a, b], i) => {
    /** The year is set in the bold weight — it simply has more ink per column. */
    let ink = 0, top = Infinity, bot = -Infinity;
    for (let y = dateBand.y0; y <= dateBand.y1; y++) {
      let n = 0;
      for (let x = a; x <= b; x++) if (grey(at(x, y))) { ink++; n++; }
      if (n >= 2) { top = Math.min(top, y); bot = Math.max(bot, y); }
    }
    return { text: DATE_TEXT[i], x0: a, x1: b, cx: (a + b + 1) / 2, cy: (top + bot + 1) / 2, density: +(ink / ((b - a + 1) * (dateBand.y1 - dateBand.y0 + 1))).toFixed(3) };
  });
})();
const densities = dates.map((d) => d.density).sort((a, b) => a - b);
const bold = densities[densities.length - 1];
for (const d of dates) d.strong = d.density === bold;

/** Type size: the cap height of a digit, and the em it implies. */
const capH = (() => {
  const b = priceLabels[0];
  let top = Infinity, bot = -Infinity;
  for (let y = b.y0; y <= b.y1; y++) {
    let n = 0; for (let x = b.x0; x <= b.x1; x++) if (grey(at(x, y))) n++;
    if (n >= 3) { top = Math.min(top, y); bot = Math.max(bot, y); }
  }
  return bot - top + 1;
})();

/** Where the MACD pane stops drawing: the lines are cut off at its floor. */
const macdFloor = H_MACD[H_MACD.length - 1] + 1;

writeFileSync(
  OUT,
  JSON.stringify(
    {
      source: "ADMR_03.png — TradingView export, ADMR · 1D · IDX",
      size: { w: W, h: H },
      frame: FRAME,
      plot: PLOT,
      panes: { price: { y0: FRAME.y + 2, y1: SEPY.y0 - 1 }, sep: SEPY, macd: { y0: SEPY.y1 + 1, y1: chartBottom - 1 } },
      colors: {
        bg: hex(BG), chrome: hex(CHROME), edge: hex(EDGE), edge2: hex(EDGE2), grid: hex(GRID), sep: hex(SEP),
        up: hex(UP), down: hex(DOWN), ma: hex(MA), macd: hex(BLUE), signal: hex(ORANGE),
        hist: Object.fromEntries(Object.entries(HIST).map(([k, v]) => [k, hex(v)])),
        vol: { up: VOL.up.base, down: VOL.down.base, alpha: VOL.alpha },
        axis: "#b8b8b8",
      },
      grid: { h: H_PRICE, macdH: H_MACD, v: V_GRID, vSpan: V_SPAN, weight: 2, priceStep: +priceLadder.step.toFixed(4), priceFit: +priceLadder.err.toFixed(3), macdStep: +macdLadder.step.toFixed(4), macdFit: +macdLadder.err.toFixed(3) },
      bars, vol, hist,
      ma, macdLine, signal, crosshair,
      axis: { price: priceScale, macd: macdScale, dates, band: dateBand, capH, size: +(capH / 0.72).toFixed(1), ink: "#b8b8b8" },
      tags,
      macdFloor,
      masks: { ...MASK, crosshairRows: CROSSHAIR_ROWS },
      counts: { bars: bars.length, vol: vol.length, hist: hist.length, bodyW: BODY_W, volW, histW },
    },
    null,
    1,
  ),
);

/* ═══ WHAT IT FOUND ═══════════════════════════════════════════════════════ */
const log = console.log;
log(`frame        ${JSON.stringify(FRAME)}   bottom rule y${chartBottom}`);
log(`plot         x ${PLOT.x0}..${PLOT.x1}   sep y ${SEPY.y0}..${SEPY.y1}`);
log(`crosshair    ${JSON.stringify(crosshair)}`);
log(`price grid   step ${priceLadder.step.toFixed(4)} fit ±${priceLadder.err.toFixed(3)}  → ${H_PRICE.join(" ")}`);
log(`macd grid    step ${macdLadder.step.toFixed(4)} fit ±${macdLadder.err.toFixed(3)}  → ${H_MACD.join(" ")}`);
log(`v grid       ${V_GRID.join(" ")}`);
log(`bars         ${bars.length}  body ${BODY_W}px  widths ${JSON.stringify(widthHist)}`);
log(`             pitch ${((bars[bars.length - 1].x - bars[0].x) / (bars.length - 1)).toFixed(4)}  x ${bars[0].x}..${bars[bars.length - 1].x}`);
log(`             clipped: ${bars.filter((b) => b.clipped).map((b) => b.i).join(",") || "none"}`);
log(`volume       ${vol.length} bars  ${volW}px wide  floor ${[...new Set(vol.map((v) => v.b))].join(",")}`);
log(`hist         ${hist.length} bars  ${histW}px wide  tones ${JSON.stringify(hist.reduce((a, h) => ((a[h.tone] = (a[h.tone] || 0) + 1), a), {}))}`);
log(`             above-zero bottom ${[...new Set(hist.filter((h) => h.tone?.startsWith("up")).map((h) => h.b))].join(",")}  below-zero top ${[...new Set(hist.filter((h) => h.tone?.startsWith("down")).map((h) => h.t))].join(",")}`);
log(`ma100        ${ma.pts.length} pts  x ${ma.from}..${ma.to}  err ${ma.err}  w ${ma.width}  gaps ${ma.gaps.length}`);
log(`macd line    ${macdLine.pts.length} pts  x ${macdLine.from}..${macdLine.to}  err ${macdLine.err}  w ${macdLine.width}  gaps ${macdLine.gaps.length}`);
log(`signal       ${signal.pts.length} pts  x ${signal.from}..${signal.to}  err ${signal.err}  w ${signal.width}  gaps ${signal.gaps.length}`);
log(`price labels ${priceScale.map((b) => b.text + "@" + b.cy + (b.restored ? "*" : "")).join(" ")}`);
log(`macd labels  ${macdScale.map((b) => b.text + "@" + b.cy + (b.restored ? "*" : "")).join(" ")}  (* = put back where a tag had hidden it)`);
log(`tags         ${tags.map((t) => `${t.text}@${t.cy}${t.filled ? " filled" : " outline"} ${t.stroke} ${t.w}x${t.h}`).join("  |  ")}`);
log(`type         cap ${capH}px → size ${(capH / 0.72).toFixed(1)}px   macd floor y${macdFloor}`);
log(`dates        band y${dateBand.y0}..${dateBand.y1}  ${dates.map((d) => d.text + "@" + d.cx + (d.strong ? "*" : "")).join(" ")}`);
log(`→ ${OUT}`);
