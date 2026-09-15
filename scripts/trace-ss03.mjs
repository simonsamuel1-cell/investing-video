/**
 * scripts/trace-ss03.mjs — reads Simon's `ss03.png` and writes the SHAPE of it.
 *
 * ⚠ WHAT COMES OUT IS A SHAPE, NOT A PRICE. Same rule as trace-ss02: the
 * picture has no axis in it, so nothing here can say what anything cost. Bars
 * are emitted in units of the picture's own dotted level — 0 is that line and 1
 * is the distance from it to the top of the frame. What that is worth in rupiah
 * is not knowable from a screenshot and is not claimed anywhere.
 *
 * ⚠ AND THE PALE MARKS ARE NOT CANDLES. This screenshot carries a washed-out
 * pair of bars near the bottom and an orange marker at the right edge; both are
 * chart furniture, and a tracer that took any coloured pixel would emit them as
 * a bar with an impossible range. Only the two SATURATED hues count.
 */
import { createRequire } from "module";
import { readFileSync, writeFileSync } from "fs";

const require = createRequire(process.cwd() + "/");
const { PNG } = require("pngjs");

const SRC = "/Users/samuelsurja/Documents/01 Academy/VIDEO 22 - TA Mistakes/ss03.png";
const p = PNG.sync.read(readFileSync(SRC));
const W = p.width;
const H = p.height;
const at = (x, y) => {
  const i = (y * W + x) * 4;
  return [p.data[i], p.data[i + 1], p.data[i + 2], p.data[i + 3]];
};

/**
 * ⚠ MEASURED OFF THE FILE, NOT GUESSED: the two candle hues in this screenshot
 * are exactly (240,47,60) and (12,142,118). Matching near them rather than on
 * them keeps the anti-aliased edges of a body, and the distance is tight enough
 * that the washed-out furniture (135,204,197) and (246,159,157) cannot pass.
 */
const RED = [240, 47, 60];
const GREEN = [12, 142, 118];
const near = (c, t, d) =>
  Math.abs(c[0] - t[0]) < d && Math.abs(c[1] - t[1]) < d && Math.abs(c[2] - t[2]) < d;
const kind = (x, y) => {
  const c = at(x, y);
  if (c[3] < 200) return null;
  if (near(c, RED, 40)) return "r";
  if (near(c, GREEN, 40)) return "g";
  return null;
};

/**
 * ⚠ THE LEVEL IS DRAWN IN THE CANDLES' OWN RED, so it cannot be told from a
 * candle by colour — and left in, it is worse than undetected: those dots sit
 * in nearly every column, so they would stitch separate bars into one run and
 * drag every high or low toward the line. It is found by DENSITY instead. One
 * row carries far more red than any other because it crosses the whole frame,
 * and that row is then masked out of everything below.
 */
const redPerRow = [];
for (let y = 0; y < H; y++) {
  let n = 0;
  for (let x = 0; x < W; x++) if (near(at(x, y), RED, 12)) n++;
  redPerRow.push(n);
}
const sorted = [...redPerRow].sort((a, b) => a - b);
const median = sorted[Math.floor(sorted.length / 2)];
const LINE = redPerRow.indexOf(Math.max(...redPerRow));
if (redPerRow[LINE] < Math.max(60, median * 4)) {
  throw new Error("no dotted level found in ss03 — no row carries red across the frame");
}
/** ⚠ THE MASK IS THE LINE'S OWN ROWS AND NOTHING MORE. Widen it and a doji on
 *  the level loses its body; narrow it and the dots come back. */
const masked = (y) => y === LINE;

/** Columns that have candle ink, grouped into bars. */
const on = [];
for (let x = 0; x < W; x++) {
  let n = 0;
  for (let y = 0; y < H; y++) if (!masked(y) && kind(x, y)) n++;
  on.push(n > 0);
}
const runs = [];
let s = -1;
for (let x = 0; x <= W; x++) {
  const lit = x < W && on[x];
  if (lit && s < 0) s = x;
  if (!lit && s >= 0) {
    runs.push([s, x - 1]);
    s = -1;
  }
}

/** ⚠ THE BODY IS THE FULL-WIDTH PART, THE WICK IS THE CENTRE COLUMN. Read the
 *  other way round — body as "any ink" — every wick would become a body and
 *  every bar would be an engulfing one. */
const bars = runs.map(([x0, x1]) => {
  const cx = Math.round((x0 + x1) / 2);
  let hi = Infinity;
  let lo = -Infinity;
  let bt = Infinity;
  let bb = -Infinity;
  let red = 0;
  let green = 0;
  for (let y = 0; y < H; y++) {
    if (masked(y)) continue;
    if (kind(cx, y)) {
      if (y < hi) hi = y;
      if (y > lo) lo = y;
    }
    let lit = 0;
    for (let x = x0; x <= x1; x++) {
      const k = kind(x, y);
      if (k) {
        lit++;
        if (k === "r") red++;
        else green++;
      }
    }
    if (lit >= x1 - x0) {
      if (y < bt) bt = y;
      if (y > bb) bb = y;
    }
  }
  const up = green > red;
  const top = bt;
  const bot = bb + 1;
  return { x0, x1, up, o: up ? bot : top, c: up ? top : bot, h: hi, l: lo + 1 };
});

/**
 * ⚠ RUNS THAT ARE NOT BARS ARE DROPPED, and loudly. A run with no full-width
 * row is a stray mark, not a candle with no body.
 *
 * ⚠ AND A BAR CUT BY THE FRAME IS NOT A BAR. The screenshot opens mid-candle,
 * so the column at x=0 is a sliver whose "full width" is one pixel — every row
 * of it passes the body test, and it comes out as a candle spanning the whole
 * picture. Dropped, not repaired: half a candle has no true open or close, and
 * inventing one would put a made-up bar at the front of the tape.
 */
const whole = bars.filter((b) => b.x0 > 0 && b.x1 < W - 1);
const kept = whole.filter((b) => Number.isFinite(b.o) && Number.isFinite(b.c));
const dropped = bars.length - kept.length;

/** Picture pixels → units of the dotted level. Above the line is positive. */
const v = (y) => (LINE - y) / LINE;
const out = kept.map((b) => ({
  o: +v(b.o).toFixed(4),
  c: +v(b.c).toFixed(4),
  h: +v(b.h).toFixed(4),
  l: +v(b.l).toFixed(4),
}));

/** ⚠ KEPT HONEST: a wick that sits inside its own body means the two detectors
 *  disagreed, which is exactly how the clipped edge candle announced itself. */
for (const [i, b] of out.entries()) {
  if (b.h < Math.max(b.o, b.c) - 1e-9 || b.l > Math.min(b.o, b.c) + 1e-9) {
    throw new Error(
      `trace-ss03: bar ${i + 1} has a wick inside its body (o ${b.o} c ${b.c} h ${b.h} l ${b.l})`,
    );
  }
}

const doc = {
  src: "ss03.png",
  size: [W, H],
  line: LINE,
  bars: out.length,
  dropped,
  note: "Heights are in units of the picture's own dotted level. Not prices.",
  ohlc: out,
};
writeFileSync("src/episodes/022-ta-mistakes/data/ss03.json", JSON.stringify(doc, null, 2) + "\n");
console.log(
  `ss03: ${W}x${H}, level at y=${LINE} (${redPerRow[LINE]} red px vs a median row of ${median}), ${out.length} bars traced, ${dropped} stray run(s) dropped`,
);
console.log(
  `  range: ${Math.min(...out.map((b) => b.l)).toFixed(3)} .. ${Math.max(...out.map((b) => b.h)).toFixed(3)}`,
);
