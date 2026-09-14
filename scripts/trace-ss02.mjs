/**
 * scripts/trace-ss02.mjs — reads Simon's `ss02.png` and writes the SHAPE of it.
 *
 * ⚠ WHAT COMES OUT IS A SHAPE, NOT A PRICE. The picture has no axis in it, so
 * nothing here can say what anything cost. Bars are emitted in units of the
 * picture's own blue line: 0 is that line and 1 is the distance from it to the
 * top of the frame. What that is worth in rupiah is not knowable from a
 * screenshot and is not claimed anywhere.
 *
 * ⚠ AND IT IS SPLIT AT THE LINE, because that is how Simon asked for it: the
 * bars above the line are one source and the bars below it are another.
 */
import { createRequire } from "module";
import { readFileSync, writeFileSync } from "fs";

const require = createRequire(process.cwd() + "/");
const { PNG } = require("pngjs");

const SRC = "/Users/samuelsurja/Documents/01 Academy/VIDEO 22 - TA Mistakes/ss02.png";
const p = PNG.sync.read(readFileSync(SRC));
const W = p.width;
const H = p.height;
const at = (x, y) => {
  const i = (y * W + x) * 4;
  return [p.data[i], p.data[i + 1], p.data[i + 2]];
};
/** The two candle hues in this screenshot: a bright red and a teal green. */
const kind = (x, y) => {
  const [r, g, b] = at(x, y);
  if (r > 120 && r - g > 50 && r - b > 40) return "r";
  if (g > 70 && g - r > 40 && b > 60 && Math.abs(g - b) < 60) return "g";
  return null;
};

/** The blue level: the only row that is blue across nearly the whole frame. */
const blueRows = [];
for (let y = 0; y < H; y++) {
  let n = 0;
  for (let x = 0; x < W; x++) {
    const [r, g, b] = at(x, y);
    if (b > 150 && b - r > 60 && b - g > 40) n++;
  }
  if (n > W * 0.8) blueRows.push(y);
}
if (!blueRows.length) throw new Error("no blue level found in ss02");
const LINE = (blueRows[0] + blueRows[blueRows.length - 1]) / 2;

/** Columns that have candle ink in them, grouped into bars. */
const on = [];
for (let x = 0; x < W; x++) {
  let n = 0;
  for (let y = 0; y < H; y++) if (kind(x, y)) n++;
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
  let up = null;
  let bt = Infinity;
  let bb = -Infinity;
  let red = 0;
  let green = 0;
  for (let y = 0; y < H; y++) {
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
  up = green > red;
  /** ⚠ BODIES ARE PIXEL EDGES, so the bottom edge is the row AFTER the last
   *  lit one — a one-row body is 1px tall, not 0. */
  const top = bt;
  const bot = bb + 1;
  return {
    up,
    o: up ? bot : top,
    c: up ? top : bot,
    h: hi,
    l: lo + 1,
  };
});

/** Picture pixels → units of the blue line. Above the line is positive. */
const K = LINE - 0; // the line to the top of the frame
const v = (y) => (LINE - y) / K;
const out = bars.map((b) => ({
  o: +v(b.o).toFixed(4),
  c: +v(b.c).toFixed(4),
  h: +v(b.h).toFixed(4),
  l: +v(b.l).toFixed(4),
}));

/** Where the tape crosses the line for good — the split Simon asked for. */
let cross = out.findIndex((b, i) => b.c < 0 && out.slice(i).every((k) => k.c < 0.06));
if (cross < 0) cross = out.findIndex((b) => b.c < 0);

const doc = {
  src: "ss02.png",
  size: [W, H],
  line: LINE,
  bars: out.length,
  cross,
  above: out.slice(0, cross),
  below: out.slice(cross),
};
writeFileSync("src/episodes/022-ta-mistakes/data/ss02.json", JSON.stringify(doc, null, 1));
console.log(
  `ss02: ${out.length} bars, line at y=${LINE}, crosses at ${cross}`,
  `\nabove: ${doc.above.length} bars, high ${Math.max(...doc.above.map((b) => b.h)).toFixed(2)}, low ${Math.min(...doc.above.map((b) => b.l)).toFixed(2)}`,
  `\nbelow: ${doc.below.length} bars, high ${Math.max(...doc.below.map((b) => b.h)).toFixed(2)}, low ${Math.min(...doc.below.map((b) => b.l)).toFixed(2)}`,
);
