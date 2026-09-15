/**
 * scripts/trace-ss0607.mjs — reads Simon's `ss06.png` and `ss07.png` and writes
 * the SHAPE of each: the setup that worked and the one that did not.
 *
 * ⚠ WHAT COMES OUT IS A SHAPE, NOT A PRICE. Same rule as every other tracer
 * here — a screenshot has no axis in it, so nothing is a price and nothing
 * claims to be. Bars are emitted in units of each picture's own dotted level:
 * 0 is that line and 1 is the distance from it to the top of the frame. Each
 * chart is its own market, so each is normalised to its own line; a shared
 * scale would be a claim that the two are the same instrument.
 *
 * ⚠ AND THE LEVEL IS DRAWN IN A CANDLE COLOUR AGAIN. ss03's was the candles'
 * red; these two use their green. Left in it is worse than undetected — its
 * dots sit in nearly every column, each one a one-pixel "bar" that the body
 * test then reads as a candle with its wick inside its body. Found by DENSITY,
 * the way trace-ss03 finds its own, and masked out of everything below.
 */
import { createRequire } from "module";
import { readFileSync, writeFileSync } from "fs";

const require = createRequire(process.cwd() + "/");
const { PNG } = require("pngjs");

const DIR = "/Users/samuelsurja/Documents/01 Academy/VIDEO 22 - TA Mistakes";
const RED = [240, 47, 60];
const GREEN = [12, 142, 118];
const near = (c, t, d) =>
  Math.abs(c[0] - t[0]) < d && Math.abs(c[1] - t[1]) < d && Math.abs(c[2] - t[2]) < d;

const trace = (name) => {
  const p = PNG.sync.read(readFileSync(`${DIR}/${name}.png`));
  const W = p.width;
  const H = p.height;
  const at = (x, y) => {
    const i = (y * W + x) * 4;
    return [p.data[i], p.data[i + 1], p.data[i + 2], p.data[i + 3]];
  };
  const kind = (x, y) => {
    const c = at(x, y);
    if (c[3] < 200) return null;
    if (near(c, RED, 40)) return "r";
    if (near(c, GREEN, 40)) return "g";
    return null;
  };

  /**
   * The dotted level.
   *
   * ⚠ FOUND BY REACH, NOT BY COUNT. trace-ss03 finds its line by density and
   * that works there; here it does not. ss07 has a cluster of candles whose
   * busiest row carries 112 pixels of ink against a typical row's 14 — more
   * than its actual level — so the density test picked a row of candle bodies
   * and the tape came back with a range of -2.0. What separates a level from a
   * crowded row is that it touches BOTH EDGES of the frame: no candle does, and
   * no row of candles can.
   */
  const perRow = [];
  for (let y = 0; y < H; y++) {
    let n = 0;
    let nearLeft = false;
    let nearRight = false;
    for (let x = 0; x < W; x++) {
      if (!kind(x, y)) continue;
      n++;
      if (x < 4) nearLeft = true;
      if (x > W - 5) nearRight = true;
    }
    perRow.push(nearLeft && nearRight ? n : 0);
  }
  const LINE = perRow.indexOf(Math.max(...perRow));
  if (perRow[LINE] < 40) {
    throw new Error(`trace-${name}: no row carries a level from edge to edge`);
  }
  const typical = [...perRow].sort((a, b) => a - b)[Math.floor(H / 2)];
  /** ⚠ THE MASK IS THE LINE'S OWN ROW AND NOTHING MORE. Widen it and a doji on
   *  the level loses its body; narrow it and the dots come back. */
  const masked = (y) => y === LINE;

  /** Columns with candle ink, grouped into bars. */
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
  /**
   * ⚠ EDGE-CLIPPED RUNS ARE NOT BARS — same rule as trace-ss03: a candle cut by
   * the frame has no true open or close, and repairing one would put a made-up
   * bar at the end of the tape.
   *
   * ⚠ AND "TOUCHES THE EDGE" IS NOT ENOUGH OF A TEST. ss06 opens with a candle
   * whose body is off-frame entirely, leaving a ONE-PIXEL column of wick at
   * x=1 — past the edge, so the first test misses it, and wide enough for
   * nothing. It came through as a bar whose wick sat inside its own body. A run
   * narrower than half the median is not a candle; that is measured off this
   * picture rather than typed, so a chart drawn at any zoom is judged by its
   * own bars.
   */
  const widths = runs.map(([a, b]) => b - a + 1).sort((a, b) => a - b);
  const median = widths[Math.floor(widths.length / 2)];
  const whole = runs.filter(
    ([a, b]) => a > 0 && b < W - 1 && b - a + 1 >= median / 2,
  );
  const dropped = runs.length - whole.length;

  /** ⚠ THE BODY IS THE FULL-WIDTH PART, THE WICK IS THE CENTRE COLUMN. Read the
   *  other way round every wick becomes a body. */
  const bars = whole
    .map(([x0, x1]) => {
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
      return { up, o: up ? bb + 1 : bt, c: up ? bt : bb + 1, h: hi, l: lo + 1 };
    })
    .filter((b) => Number.isFinite(b.o) && Number.isFinite(b.c));

  /** Picture pixels → units of the picture's own level. Above it is positive. */
  const v = (y) => +((LINE - y) / LINE).toFixed(4);
  const out = bars.map((b) => ({ o: v(b.o), c: v(b.c), h: v(b.h), l: v(b.l) }));

  /** ⚠ KEPT HONEST: a wick inside its own body means the two detectors
   *  disagreed, which is how a clipped edge candle announces itself. */
  for (const [i, b] of out.entries()) {
    if (b.h < Math.max(b.o, b.c) - 1e-9 || b.l > Math.min(b.o, b.c) + 1e-9) {
      throw new Error(`trace-${name}: bar ${i + 1} has a wick inside its body`);
    }
  }
  console.log(
    `${name}: ${W}x${H}, level y=${LINE} (${perRow[LINE]} px vs a typical row's ${typical}), ${out.length} bars, ${dropped} clipped run(s) dropped, range ${Math.min(
      ...out.map((b) => b.l),
    ).toFixed(3)}..${Math.max(...out.map((b) => b.h)).toFixed(3)}`,
  );
  return { src: `${name}.png`, size: [W, H], level: LINE, bars: out.length, ohlc: out };
};

const doc = {
  note: "Heights are in units of each picture's own frame. Not prices.",
  ss06: trace("ss06"),
  ss07: trace("ss07"),
};
writeFileSync("src/episodes/022-ta-mistakes/data/ss0607.json", JSON.stringify(doc, null, 2) + "\n");
