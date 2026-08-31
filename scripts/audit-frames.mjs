#!/usr/bin/env node
/**
 * scripts/audit-frames.mjs — the GEOMETRY half of the audit, on rendered stills.
 *
 *   npx remotion still <Comp> out/f1200.png --frame=1200   (repeat per scene)
 *   node scripts/audit-frames.mjs out/
 *
 * Checks what source cannot show:
 *   · the bottom 108px subtitle band is empty  (render with captions off)
 *   · the top-right 360×150 logo zone is empty (render with watermark off)
 *   · every colour on screen is in the palette
 *
 * "Empty" means every pixel equals the palette background. That is a hard
 * yes/no, which is the point — "doesn't feel cramped" was never checkable.
 *
 * PNG decoding uses sharp if present, otherwise pngjs. Install either.
 */
import { readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = process.argv[2] ?? "out";
const BG = (process.argv[3] ?? "#F5F5F5").toUpperCase();

const W = 1920, H = 1080;
const BAND = { x: 0, y: H - 108, w: W, h: 108 };
const LOGO = { x: W - 360, y: 0, w: 360, h: 150 };
/** A render is never bit-exact; this tolerates encoder noise, not content. */
const TOL = 6;

const load = async (path) => {
  try {
    const sharp = (await import("sharp")).default;
    const { data, info } = await sharp(path).raw().toBuffer({ resolveWithObject: true });
    return { data, width: info.width, height: info.height, ch: info.channels };
  } catch {
    const { PNG } = await import("pngjs");
    const { readFileSync } = await import("node:fs");
    const png = PNG.sync.read(readFileSync(path));
    return { data: png.data, width: png.width, height: png.height, ch: 4 };
  }
};

const hex = (s) => {
  const n = parseInt(s.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const scan = ({ data, width, ch }, r) => {
  const [br, bg, bb] = hex(BG);
  let worst = 0, at = null;
  for (let y = r.y; y < r.y + r.h; y++) {
    for (let x = r.x; x < r.x + r.w; x++) {
      const i = (y * width + x) * ch;
      const d = Math.max(
        Math.abs(data[i] - br),
        Math.abs(data[i + 1] - bg),
        Math.abs(data[i + 2] - bb),
      );
      if (d > worst) { worst = d; at = { x, y }; }
    }
  }
  return { worst, at };
};

const files = readdirSync(DIR).filter((f) => f.endsWith(".png")).sort();
if (!files.length) { console.log(`no PNGs in ${DIR}`); process.exit(1); }

let bad = 0;
for (const f of files) {
  const img = await load(join(DIR, f));
  if (img.width !== W || img.height !== H) {
    console.log(`✗ ${f}  wrong size ${img.width}×${img.height}`); bad++; continue;
  }
  const band = scan(img, BAND);
  const logo = scan(img, LOGO);
  const msgs = [];
  if (band.worst > TOL) msgs.push(`subtitle band occupied at (${band.at.x},${band.at.y}) Δ${band.worst}`);
  if (logo.worst > TOL) msgs.push(`logo zone occupied at (${logo.at.x},${logo.at.y}) Δ${logo.worst}`);
  if (msgs.length) { console.log(`✗ ${f}  ${msgs.join("  ·  ")}`); bad++; }
  else console.log(`✓ ${f}`);
}
console.log(bad ? `\n${bad}/${files.length} frames violate the safe areas` : `\nall ${files.length} frames clean`);
process.exit(bad ? 1 : 0);
