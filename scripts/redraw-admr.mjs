/**
 * scripts/redraw-admr.mjs — the proof that `admr-chart.json` IS the picture.
 *
 * It takes nothing but the traced JSON, paints it back at the export's own
 * 2758×1458, and diffs that against `ADMR_03.png`. A trace you can only check
 * by looking at it is a trace nobody ever checks; this one either lands on the
 * original or prints where it did not, bar by bar.
 *
 * Run:  node scripts/redraw-admr.mjs
 * Out:  <scratch>/redraw.png, <scratch>/diff.png  and a report on stdout.
 *
 * ⚠ WHAT IS NOT COMPARED, and why. The right-hand gutter, the two legends, the
 * date strip and the wordmark band are all TEXT, and text is re-set in the
 * video's own face rather than reproduced glyph for glyph — so diffing it would
 * only ever measure the difference between two typefaces. Everything that
 * carries data is compared: every candle, every volume bar, every histogram
 * bar, all three lines, the grid and the crosshair.
 */
import { createRequire } from "module";
import { readFileSync, writeFileSync, mkdirSync } from "fs";

const require = createRequire(process.cwd() + "/");
const { PNG } = require("pngjs");

const SRC = "/Users/samuelsurja/Documents/01 Academy/VIDEO 22 - TA Mistakes/ADMR_03.png";
const DATA = JSON.parse(readFileSync("src/episodes/022-ta-mistakes/data/admr-chart.json", "utf8"));
const DIR = process.argv[2] ?? "/private/tmp/claude-502/-Users-samuelsurja-Documents-01-Academy-Claude-Educational-video-about-investing-2/f042db63-5b59-44f8-ba89-bc261f370602/scratchpad/trace";
mkdirSync(DIR, { recursive: true });

const src = PNG.sync.read(readFileSync(SRC));
const W = DATA.size.w, H = DATA.size.h;
const out = new PNG({ width: W, height: H });

const rgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const C = DATA.colors;

const put = (x, y, c, a = 1) => {
  if (x < 0 || y < 0 || x >= W || y >= H || a <= 0) return;
  const i = (y * W + x) * 4;
  out.data[i] = Math.round(out.data[i] * (1 - a) + c[0] * a);
  out.data[i + 1] = Math.round(out.data[i + 1] * (1 - a) + c[1] * a);
  out.data[i + 2] = Math.round(out.data[i + 2] * (1 - a) + c[2] * a);
  out.data[i + 3] = 255;
};
const rect = (x, y, w, h, c, a = 1) => {
  for (let j = Math.round(y); j < Math.round(y) + Math.round(h); j++)
    for (let i = Math.round(x); i < Math.round(x) + Math.round(w); i++) put(i, j, c, a);
};
/** A 2px-wide polyline painted column by column, anti-aliased vertically —
 *  which is how the export's own renderer put these three lines down. */
const poly = (pts, c, width) => {
  const yAt = (x) => {
    for (let i = 1; i < pts.length; i++) {
      if (x <= pts[i][0]) {
        const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
        return bx === ax ? by : ay + ((by - ay) * (x - ax)) / (bx - ax);
      }
    }
    return pts[pts.length - 1][1];
  };
  const x0 = pts[0][0], x1 = pts[pts.length - 1][0];
  for (let x = x0; x <= x1; x++) {
    const a = yAt(x), b = yAt(Math.min(x + 1, x1));
    const top = Math.min(a, b) - width / 2, bot = Math.max(a, b) + width / 2;
    for (let r = Math.floor(top); r <= Math.ceil(bot); r++) {
      const cover = Math.max(0, Math.min(r + 1, bot) - Math.max(r, top));
      if (cover > 0) put(x, r, c, Math.min(1, cover));
    }
  }
};

/* ═══ PAINT, IN THE ORDER THE EXPORT DID ══════════════════════════════════ */
rect(0, 0, W, H, rgb(C.chrome));
const F = DATA.frame;
rect(F.x, F.y, F.w, F.h, rgb(C.edge));
rect(F.x + 1, F.y + 1, F.w - 2, F.h - 2, rgb(C.edge2));
rect(F.x + 2, F.y + 2, F.w - 4, F.h - 4, rgb(C.bg));

/* the grid, under everything */
const G = DATA.grid;
for (const y of [...G.h, ...G.macdH]) rect(DATA.plot.x0, Math.floor(y - 1), DATA.plot.x1 - DATA.plot.x0 + 1, G.weight, rgb(C.grid));
for (const x of G.v) rect(Math.floor(x - 1), F.y + 2, G.weight, F.h - 4, rgb(C.grid));
rect(F.x + 2, DATA.panes.sep.y0, F.w - 4, DATA.panes.sep.y1 - DATA.panes.sep.y0 + 1, rgb(C.sep));

/* ⚠ VOLUME OVER THE GRID, AT HALF OPACITY — which is exactly why a volume bar
   crossing the 800 line is a lighter teal than the rest of itself. */
for (const v of DATA.vol) rect(v.l, v.t, v.w, v.b - v.t + 1, rgb(C.vol[v.up ? "up" : "down"]), C.vol.alpha);

/* ⚠ THE MA100 GOES UNDER THE CANDLES. It is drawn first and then buried, which
   is why the trace had to interpolate six stretches of it. */
poly(DATA.ma.pts, rgb(C.ma), DATA.ma.width);

for (const b of DATA.bars) {
  const c = rgb(b.up ? C.up : C.down);
  rect(b.x - 1, b.wt, 2, b.wb - b.wt + 1, c);
  rect(b.bl, b.bt, b.bw, b.bb - b.bt + 1, c);
}

/* the crosshair, on top of the price pane */
if (DATA.crosshair) {
  const ch = DATA.crosshair, c = rgb(ch.color);
  const period = ch.dash + ch.gap;
  for (let x = ch.x0 - period; x <= ch.x1; x++)
    if (((x % period) + period) % period === ch.phase)
      for (let k = 0; k < ch.dash; k++)
        if (x + k >= ch.x0 && x + k <= ch.x1) rect(x + k, ch.y0, 1, ch.y1 - ch.y0 + 1, c);
}

for (const h of DATA.hist) rect(h.l, h.t, h.w, h.b - h.t + 1, rgb(C.hist[h.tone]));
poly(DATA.macdLine.pts, rgb(C.macd), DATA.macdLine.width);
poly(DATA.signal.pts, rgb(C.signal), DATA.signal.width);

writeFileSync(`${DIR}/redraw.png`, PNG.sync.write(out));

/* ═══ DIFF ════════════════════════════════════════════════════════════════ */
const skip = (x, y) =>
  x > DATA.plot.x1 || x < DATA.plot.x0 ||
  y > DATA.axis.band.y0 - 8 || y < F.y + 2 ||
  Object.values(DATA.masks).some((m) => m && m.x0 !== undefined && x >= m.x0 && x <= m.x1 && y >= m.y0 && y <= m.y1);

const diff = new PNG({ width: W, height: H });
let bad = 0, live = 0;
const zones = { price: 0, vol: 0, macd: 0 };
const volTop = Math.min(...DATA.vol.map((v) => v.t));
const colBad = new Array(W).fill(0);
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    const d = Math.max(
      Math.abs(src.data[i] - out.data[i]),
      Math.abs(src.data[i + 1] - out.data[i + 1]),
      Math.abs(src.data[i + 2] - out.data[i + 2]),
    );
    const off = skip(x, y);
    diff.data[i] = off ? 30 : d > 40 ? 255 : 0;
    diff.data[i + 1] = off ? 30 : d > 40 ? 0 : Math.min(255, src.data[i + 1]);
    diff.data[i + 2] = off ? 30 : 0;
    diff.data[i + 3] = 255;
    if (off) continue;
    live++;
    if (d > 40) {
      bad++; colBad[x]++;
      if (y > DATA.panes.sep.y1) zones.macd++;
      else if (y >= volTop) zones.vol++;
      else zones.price++;
    }
  }
writeFileSync(`${DIR}/diff.png`, PNG.sync.write(diff));

const worst = colBad.map((n, x) => [x, n]).filter((p) => p[1] > 8).sort((a, b) => b[1] - a[1]).slice(0, 14);
console.log(`compared   ${live.toLocaleString()} px inside the plot`);
console.log(`different  ${bad.toLocaleString()}  (${((bad / live) * 100).toFixed(3)}%)`);
console.log(`           price ${zones.price}   volume-band ${zones.vol}   macd ${zones.macd}`);
console.log(`worst cols ${worst.map(([x, n]) => `${x}:${n}`).join("  ") || "none over 8px"}`);
console.log(`→ ${DIR}/redraw.png   ${DIR}/diff.png`);
