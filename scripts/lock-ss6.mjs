#!/usr/bin/env node
/**
 * lock-ss6.mjs — the contract for SC19's two product displays.
 *
 * ⚠ SS6.png IS THIS PROJECT'S OWN OUTPUT AT f18250, approved by Simon after the
 * display had been broken and rebuilt several times. It is kept here so the
 * check does not depend on a path outside the repo.
 *
 * Renders f18250 and compares it with the reference. ANY difference in the two
 * 400×400 display regions is a failure — whatever the change was trying to do
 * elsewhere. Run it after touching SC19, LIMITS, SS4, COLOUR or the palette:
 *
 *     node scripts/lock-ss6.mjs
 */
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";
import { PNG } from "pngjs";
import { readFileSync, mkdtempSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";

const FRAME = 18250;
const REGIONS = [
  ["left display", 460, 330, 400, 400],
  ["right display", 1060, 330, 400, 400],
];

const root = resolve(".");
const out = join(mkdtempSync(join(tmpdir(), "ss6-")), "f.png");
const serveUrl = await bundle({ entryPoint: join(root, "src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "Volume020" });
await renderStill({ composition, serveUrl, output: out, frame: FRAME, overwrite: true });

const ref = PNG.sync.read(readFileSync(join(root, "scripts/ref/ss6.png")));
const got = PNG.sync.read(readFileSync(out));
if (ref.width !== got.width || ref.height !== got.height) {
  console.error(`SS6 LOCK BROKEN: the composition is ${got.width}x${got.height}, the reference is ${ref.width}x${ref.height}`);
  process.exit(1);
}

let bad = 0;
for (const [name, x, y, w, h] of REGIONS) {
  let diff = 0;
  for (let j = y; j < y + h; j++) {
    for (let i = x; i < x + w; i++) {
      const k = (ref.width * j + i) << 2;
      const d = Math.max(
        Math.abs(ref.data[k] - got.data[k]),
        Math.abs(ref.data[k + 1] - got.data[k + 1]),
        Math.abs(ref.data[k + 2] - got.data[k + 2]),
      );
      if (d > 2) diff++;
    }
  }
  console.log(`${name.padEnd(14)} ${diff === 0 ? "unchanged" : `${diff} px CHANGED`}`);
  bad += diff;
}
if (bad) {
  console.error(`\nSS6 LOCK BROKEN — f${FRAME} no longer matches scripts/ref/ss6.png.\nThe two product displays are approved artwork; fix the change rather than the reference.`);
  process.exit(1);
}
console.log("\nSS6 lock holds.");
