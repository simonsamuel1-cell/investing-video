#!/usr/bin/env node
/**
 * trace-ss01.mjs — Simon's `ss01.png` → the opening tape of VIDEO 22.
 *
 *   node scripts/trace-ss01.mjs "/Users/…/VIDEO 22 - TA Mistakes/ss01.png"
 *
 * Writes src/episodes/022-ta-mistakes/data/ss01.json. Committed, so the episode
 * builds without the screenshot — but re-runnable, so the trace can be checked
 * against the picture rather than trusted.
 *
 * ⚠ FIXED PITCH, NOT GAP DETECTION. The candles in this screenshot touch: two
 * of them share one run of keyed columns, so splitting on empty columns finds
 * 86 "candles" where there are 170. The pitch is regular (6 px, bodies 5 wide,
 * first at x=1), so the slots are read off that instead — measured from the
 * run starts, which land every 12 px because they are pairs.
 *
 * ⚠ THE DOTTED LEVEL LINE IS MASKED BY ROW. It keys as a candle (it is teal),
 * it spans the whole plot, and left in it drags every low in the tape down to
 * its own y. Dropping short runs does not remove it — the dashes are 1px and
 * so are real doji bodies, which is the trap that flipped VIDEO 20's dojis
 * green. A row that spans >80% of the width is a rule, not a candle.
 *
 * ⚠ BODIES ARE READ AS EDGES (`bb + 1`). A one-row body gives o === c, and
 * `c >= o` renders GREEN — every red doji in the tape would flip.
 */
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";

const req = createRequire(process.cwd() + "/");
const { PNG } = req("pngjs");
const { readFileSync } = req("node:fs");

const SRC = process.argv[2];
if (!SRC) {
  console.error("usage: trace-ss01.mjs <ss01.png>");
  process.exit(1);
}
const OUT = "src/episodes/022-ta-mistakes/data/ss01.json";

/** The tape the episode needs: 63 bars, SC01's whole build. */
const BARS = 63;
/** The final thrust — the breakout itself, excluded when the level it breaks
 *  is measured. A resistance defined including the bars that broke it is not a
 *  resistance. */
const RUN = 4;
/** How far back the consolidation floor is looked for. */
const BASE = 20;
/** The two prices the narration names, and the two the map is solved for. */
const RESISTANCE = 120;
const SUPPORT = 104;

const png = PNG.sync.read(readFileSync(SRC));
const { width: W, height: H } = png;

/** Hue, not hex — the screenshot's bull is a teal, ours is a green. */
const cls = (x, y) => {
  const i = (W * y + x) << 2;
  const r = png.data[i], g = png.data[i + 1], b = png.data[i + 2];
  const mx = Math.max(r, g, b) / 255;
  const mn = Math.min(r, g, b) / 255;
  if (png.data[i + 3] < 40 || mx < 0.15 || mx - mn < 0.22) return 0;
  return g > r ? 1 : -1;
};

/* ── the rules that are not candles ──────────────────────────────────────── */
const isRule = new Set();
for (let y = 0; y < H; y++) {
  let n = 0, first = -1, last = -1;
  for (let x = 0; x < W; x++) if (cls(x, y)) { n++; if (first < 0) first = x; last = x; }
  if (n > W * 0.1 && last - first > W * 0.8) isRule.add(y);
}

/* ── one slot per candle, on the measured pitch ──────────────────────────── */
const PITCH = 6, X0 = 1, BODY = 5;
const slots = [];
for (let x = X0; x + BODY - 1 < W; x += PITCH) {
  let bull = 0, bear = 0, top = Infinity, bot = -1;
  const filled = new Map();
  for (let dx = 0; dx < BODY; dx++) {
    for (let y = 0; y < H; y++) {
      if (isRule.has(y)) continue;
      const k = cls(x + dx, y);
      if (!k) continue;
      if (y < top) top = y;
      if (y > bot) bot = y;
      filled.set(y, (filled.get(y) ?? 0) + 1);
      if (k > 0) bull++; else bear++;
    }
  }
  if (bot < 0) continue;
  /** The body is the WIDE part: rows painted in most of the slot's columns. */
  const rows = [...filled.entries()].filter(([, n]) => n >= 3).map(([y]) => y);
  slots.push({
    top,
    bot,
    bt: rows.length ? Math.min(...rows) : top,
    bb: rows.length ? Math.max(...rows) : bot,
    up: bull >= bear,
  });
}

/* ── 170 candles → 63 bars ───────────────────────────────────────────────
   ⚠ AGGREGATED, NOT SAMPLED. Taking every third candle would invent a tape
   that never traded; grouping them is what a higher timeframe IS — open of the
   first, close of the last, the extremes of all. */
const px = [];
for (let k = 0; k < BARS; k++) {
  const a = Math.round((k * slots.length) / BARS);
  const b = Math.round(((k + 1) * slots.length) / BARS);
  const win = slots.slice(a, b);
  const first = win[0], last = win[win.length - 1];
  px.push({
    o: first.up ? first.bb + 1 : first.bt,
    h: Math.min(...win.map((s) => s.top)),
    l: Math.max(...win.map((s) => s.bot)) + 1,
    c: last.up ? last.bt : last.bb + 1,
  });
}

/* ── the two levels, measured off the tape ───────────────────────────────── */
const cut = BARS - RUN;
/** Pixel y is upside down: the smallest y is the highest price. */
const resPx = Math.min(...px.slice(0, cut).map((b) => b.h));
const supPx = Math.max(...px.slice(cut - BASE, cut).map((b) => b.l));
const supFrom = px.findIndex((b, i) => i >= cut - BASE && b.l === supPx);

/** Two points fix the map: the level the tape broke is 120, the floor it held
 *  is 104. Everything else follows, so no price on this chart is chosen. */
const k = (RESISTANCE - SUPPORT) / (supPx - resPx);
const price = (y) => Number((RESISTANCE + (resPx - y) * k).toFixed(2));
const bars = px.map((b) => ({ o: price(b.o), h: price(b.h), l: price(b.l), c: price(b.c) }));

const breakout = bars.findIndex((b, i) => i >= cut && b.c > RESISTANCE);
if (breakout === -1) throw new Error("trace-ss01: the tape never closes above the level it is supposed to break");
if (bars.some((b) => b.h < b.l)) throw new Error("trace-ss01: a bar's high is below its low");

writeFileSync(
  OUT,
  JSON.stringify(
    {
      source: "VIDEO 22 - TA Mistakes/ss01.png",
      candles: slots.length,
      bars,
      levels: { resistance: RESISTANCE, support: SUPPORT, supportFrom: supFrom },
      breakout,
    },
    null,
    1,
  ) + "\n",
);

console.log(
  `${slots.length} candles → ${bars.length} bars\n` +
    `resistance ${RESISTANCE} at px ${resPx} · support ${SUPPORT} at px ${supPx} (bar ${supFrom})\n` +
    `breaks out on bar ${breakout} at ${bars[breakout].c}\n` +
    `range ${Math.min(...bars.map((b) => b.l))} – ${Math.max(...bars.map((b) => b.h))}\n` +
    `→ ${OUT}`,
);
