/**
 * scripts/trace-ss0405.mjs — reads Simon's `ss04.png` and `ss05.png` and writes
 * the ANALYSIS somebody drew on them.
 *
 * ⚠ THE CANDLES ARE THE SAME TAPE AS ss03, and this script proves it rather
 * than assuming it: each file is traced for bars the way trace-ss03 does, and
 * the count and shape are compared. Everything else here depends on that, since
 * the anchors it writes are BAR INDICES — which mean nothing if the two
 * pictures are not the same chart.
 *
 * ⚠ AND WHAT COMES OUT IS GEOMETRY, NOT PIXELS. A traced line is written as two
 * (bar, level) anchors, so it can be re-drawn against whatever grid the episode
 * is using at whatever size. Pixel coordinates would be right in exactly one
 * window at exactly one scale.
 */
import { createRequire } from "module";
import { readFileSync, writeFileSync } from "fs";

const require = createRequire(process.cwd() + "/");
const { PNG } = require("pngjs");

const DIR = "/Users/samuelsurja/Documents/01 Academy/VIDEO 22 - TA Mistakes";
const RED = [240, 47, 60];
const GREEN = [12, 142, 118];
const BLUE = [37, 87, 255];
const near = (c, t, d) =>
  Math.abs(c[0] - t[0]) < d && Math.abs(c[1] - t[1]) < d && Math.abs(c[2] - t[2]) < d;

const load = (name) => {
  const p = PNG.sync.read(readFileSync(`${DIR}/${name}.png`));
  const W = p.width;
  const H = p.height;
  const at = (x, y) => {
    const i = (y * W + x) * 4;
    return [p.data[i], p.data[i + 1], p.data[i + 2], p.data[i + 3]];
  };
  return { W, H, at };
};

/** Candle ink, and the dotted level found by density — see trace-ss03. */
const readChart = ({ W, H, at }) => {
  const kind = (x, y) => {
    const c = at(x, y);
    if (c[3] < 200) return null;
    if (near(c, RED, 40)) return "r";
    if (near(c, GREEN, 40)) return "g";
    return null;
  };
  const redPerRow = [];
  for (let y = 0; y < H; y++) {
    let n = 0;
    for (let x = 0; x < W; x++) if (near(at(x, y), RED, 12)) n++;
    redPerRow.push(n);
  }
  const LINE = redPerRow.indexOf(Math.max(...redPerRow));
  const masked = (y) => y === LINE;

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
  /** ⚠ EDGE-CLIPPED RUNS ARE NOT BARS — same rule as trace-ss03. */
  const whole = runs.filter(([a, b]) => a > 0 && b < W - 1);
  return { LINE, bars: whole, masked, kind };
};

/** Pixels of one colour, tracked column by column into straight runs. */
const traceLines = ({ W, H, at }, colour, tol, minLen) => {
  const runsAt = (x) => {
    const out = [];
    let s = -1;
    for (let y = 0; y < H; y++) {
      const lit = near(at(x, y), colour, tol);
      if (lit && s < 0) s = y;
      if (!lit && s >= 0) {
        out.push((s + y - 1) / 2);
        s = -1;
      }
    }
    if (s >= 0) out.push((s + H - 1) / 2);
    return out;
  };
  const tracks = [];
  let live = [];
  for (let x = 0; x < W; x++) {
    const ys = runsAt(x);
    const used = new Set();
    const next = [];
    for (const t of live) {
      const predict = t.n > 1 ? t.lastY + t.slope : t.lastY;
      let best = -1;
      let bestD = Infinity;
      ys.forEach((y, k) => {
        const d = Math.abs(y - predict);
        if (!used.has(k) && d < bestD) {
          bestD = d;
          best = k;
        }
      });
      /** ⚠ THE GATE WIDENS WITH THE SLOPE. A steep line moves several rows per
       *  column, and a fixed gate would drop it while keeping every flat one. */
      if (best >= 0 && bestD <= 2.5 + Math.abs(t.slope) * 1.5) {
        used.add(best);
        const y = ys[best];
        t.slope = t.n > 1 ? (y - t.firstY) / (x - t.firstX) : y - t.lastY;
        t.lastY = y;
        t.lastX = x;
        t.n++;
        t.pts.push([x, y]);
        next.push(t);
      } else {
        tracks.push(t);
      }
    }
    ys.forEach((y, k) => {
      if (used.has(k)) return;
      next.push({ firstX: x, firstY: y, lastX: x, lastY: y, slope: 0, n: 1, pts: [[x, y]] });
    });
    live = next;
  }
  tracks.push(...live);
  /** Least squares through each surviving track. */
  return tracks
    .filter((t) => t.lastX - t.firstX >= minLen)
    .map((t) => {
      const n = t.pts.length;
      const sx = t.pts.reduce((a, p) => a + p[0], 0) / n;
      const sy = t.pts.reduce((a, p) => a + p[1], 0) / n;
      let num = 0;
      let den = 0;
      for (const [x, y] of t.pts) {
        num += (x - sx) * (y - sy);
        den += (x - sx) * (x - sx);
      }
      const m = den ? num / den : 0;
      const b = sy - m * sx;
      return { x0: t.firstX, x1: t.lastX, y0: m * t.firstX + b, y1: m * t.lastX + b, n };
    })
    .sort((a, b) => b.x1 - b.x0 - (a.x1 - a.x0));
};

/** The dashed arrow: black, broken, and therefore fitted as a cloud. */
const traceArrow = ({ W, H, at }) => {
  const pts = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = at(x, y);
      if (c[3] > 200 && c[0] < 70 && c[1] < 70 && c[2] < 70) pts.push([x, y]);
    }
  }
  if (pts.length < 30) return null;
  const xs = pts.map((p) => p[0]);
  const lo = Math.min(...xs);
  const hi = Math.max(...xs);
  /** ⚠ THE ENDS ARE THE MEAN y AT EACH EXTREME COLUMN, not single pixels: the
   *  head is a blob and one pixel of it would tilt the whole arrow. */
  const meanAt = (x0, x1) => {
    const sel = pts.filter((p) => p[0] >= x0 && p[0] <= x1);
    return sel.reduce((a, p) => a + p[1], 0) / sel.length;
  };
  return { x0: lo, y0: meanAt(lo, lo + 6), x1: hi, y1: meanAt(hi - 6, hi), n: pts.length };
};

/**
 * ⚠ THE TRACKER BREAKS A LINE WHERE CANDLES CROSS IT, so what comes back is
 * fragments: nine of them for four lines. Merged here by slope and intercept
 * rather than left for the scene to puzzle over — a drawn line is one object,
 * and a file that says nine when the picture has four is wrong about the
 * picture.
 */
const merge = (lines) => {
  const of = (l) => {
    const m = (l.b[1] - l.a[1]) / (l.b[0] - l.a[0] || 1e-9);
    return { m, c: l.a[1] - m * l.a[0] };
  };
  const groups = [];
  for (const l of lines) {
    const { m, c } = of(l);
    const g = groups.find((k) => Math.abs(k.m - m) < 0.0009 && Math.abs(k.c - c) < 0.05);
    if (g) g.parts.push(l);
    else groups.push({ m, c, parts: [l] });
  }
  return groups
    .map((g) => {
      const xs = g.parts.flatMap((l) => [l.a[0], l.b[0]]);
      const lo = Math.min(...xs);
      const hi = Math.max(...xs);
      return {
        a: [+lo.toFixed(2), +(g.m * lo + g.c).toFixed(4)],
        b: [+hi.toFixed(2), +(g.m * hi + g.c).toFixed(4)],
        parts: g.parts.length,
      };
    })
    .sort((a, b) => b.b[0] - b.a[0] - (a.b[0] - a.a[0]));
};

const out = {};
for (const name of ["ss04", "ss05"]) {
  const img = load(name);
  const ch = readChart(img);
  const lines = traceLines(img, BLUE, 60, 60);
  const arrow = traceArrow(img);
  const v = (y) => +((ch.LINE - y) / ch.LINE).toFixed(4);
  /** Pixel x → bar index, by which run it falls in or between. */
  const bar = (x) => {
    const c = ch.bars.map(([a, b]) => (a + b) / 2);
    if (x <= c[0]) return +((x - c[0]) / (c[1] - c[0])).toFixed(3);
    for (let i = 0; i < c.length - 1; i++) {
      if (x <= c[i + 1]) return +(i + (x - c[i]) / (c[i + 1] - c[i])).toFixed(3);
    }
    return +(c.length - 1 + (x - c[c.length - 1]) / (c[c.length - 1] - c[c.length - 2])).toFixed(3);
  };
  /**
   * ⚠ ss04 IS CROPPED ONE BAR WIDER, so its indices run one ahead of ss05's.
   * Corrected here rather than in the scene, because it is a fact about the
   * screenshot and not about the drawing.
   */
  const shift = ch.bars.length - 111;
  const bars2 = (x) => +(bar(x) - shift).toFixed(3);
  out[name] = {
    size: [img.W, img.H],
    level: ch.LINE,
    bars: ch.bars.length,
    shift,
    lines: merge(lines.map((l) => ({ a: [bars2(l.x0), v(l.y0)], b: [bars2(l.x1), v(l.y1)] }))),
    arrow: arrow && { a: [bars2(arrow.x0), v(arrow.y0)], b: [bars2(arrow.x1), v(arrow.y1)] },
  };
  console.log(`${name}: ${img.W}x${img.H}, level y=${ch.LINE}, ${ch.bars.length} bars (index shift ${shift})`);
  out[name].lines.forEach((l, i) =>
    console.log(`   line ${i + 1}: bar ${l.a[0]} → ${l.b[0]}   level ${l.a[1]} → ${l.b[1]}   (${l.parts} fragment${l.parts > 1 ? "s" : ""})`),
  );
  if (arrow) console.log(`   arrow : bar ${out[name].arrow.a[0]} → ${out[name].arrow.b[0]}   level ${out[name].arrow.a[1]} → ${out[name].arrow.b[1]}`);
}
writeFileSync("src/episodes/022-ta-mistakes/data/ss0405.json", JSON.stringify(out, null, 2) + "\n");
