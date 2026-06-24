// Smoke-test: bundle once, render representative frames across every scene.
// Run: node scripts/render-stills.mjs   (or: npm run stills)
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";
import { enableTailwind } from "@remotion/tailwind-v4";
import path from "path";
import fs from "fs";

const root = process.cwd();
const outDir = path.join(root, "out", "stills");
fs.mkdirSync(outDir, { recursive: true });

// Representative absolute frames (a visual + smoke pass per scene).
const FRAMES = [
  // S1 (v2 — thematic blindness)
  [200, "s1-silos"],
  [430, "s1-crowd"],
  [840, "s1-close"],
  // S2 (v2 — one theme)
  [1180, "s2-connect"],
  [1320, "s2-proof"],
  [1500, "s2-resolve"],
  // S3–S6 = ONE continuity block (PhoneContinuity); sample its overlay beats
  [1565, "s3-t0-right"],
  [1900, "s3-esip-hl"],
  [2092, "s3-bear-hl"],
  [2240, "s3-neutral"],
  [2330, "s3-t8-typo"],
  [2733, "s4-trend"],
  [3045, "s4-strength"],
  [3360, "s4-typo"],
  [3716, "s5-ma"],
  [3960, "s5-typo"],
  [4391, "s6-laju"],
  [4660, "s6-rgas"],
  [4820, "s6-recenter"],
  [4849, "seam-6to7-dissolve"],
  // S7–S9 = part of the same one-phone block (PhoneWalkthrough)
  [4880, "s7-open"],
  [5400, "s7-rows12"],
  [5740, "s7-rows-tag"],
  [6060, "s8-radar"],
  [6230, "s8-highlight"],
  [6810, "s9-closing"],
  // S10 (native)
  [7074, "s10-principle"],
  [7290, "s10-lockup"],
];

const entryPoint = path.join(root, "src", "index.ts");
console.log("bundling…");
const serveUrl = await bundle({ entryPoint, webpackOverride: enableTailwind });
console.log("selecting composition…");
const composition = await selectComposition({ serveUrl, id: "TechnicalTabPreview" });

for (const [frame, name] of FRAMES) {
  const output = path.join(outDir, `f${String(frame).padStart(4, "0")}-${name}.png`);
  process.stdout.write(`render frame ${frame} (${name})… `);
  await renderStill({ composition, serveUrl, output, frame, scale: 0.5 });
  console.log("ok");
}
console.log("DONE →", outDir);
