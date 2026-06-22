// Smoke-test: bundle once, render representative frames across every component
// family. Run: node scripts/render-stills.mjs
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";
import { enableTailwind } from "@remotion/tailwind-v4";
import path from "path";
import fs from "fs";

const root = process.cwd();
const outDir = path.join(root, "out", "stills");
fs.mkdirSync(outDir, { recursive: true });

// One representative frame per scene — a full smoke-test + visual pass.
const FRAMES = [
  [100, "s1-tickergrid"], [430, "s2-noise"], [650, "s3-cards"], [905, "s4-sparklines"],
  [1010, "s5-bridge"], [1180, "s6-diagram"], [1420, "s7-policy"], [1600, "s8-holdings"],
  [1815, "s9-reversex"], [2050, "s10-bridge"], [2200, "s11-dualphone"], [2360, "s12-popup"],
  [2514, "s13-state1"], [2700, "s13-state2"], [2876, "s14"], [3254, "s15"],
  [3420, "s16"], [3558, "s17"], [3722, "s18"], [4030, "s19"],
  [4264, "s20"], [4534, "s21"], [4780, "s22"], [4850, "s23"],
  [5050, "s24"], [5350, "s25"], [5655, "s26"], [5870, "s27"],
  [6020, "s28"], [6175, "s29"], [6450, "s30"], [6770, "s31"], [6880, "s32"],
];

const entryPoint = path.join(root, "src", "index.ts");
console.log("bundling…");
const serveUrl = await bundle({ entryPoint, webpackOverride: enableTailwind });
console.log("selecting composition…");
const composition = await selectComposition({ serveUrl, id: "ConceptSectorTutorial" });

for (const [frame, name] of FRAMES) {
  const output = path.join(outDir, `f${String(frame).padStart(4, "0")}-${name}.png`);
  process.stdout.write(`render frame ${frame} (${name})… `);
  await renderStill({ composition, serveUrl, output, frame, scale: 0.5 });
  console.log("ok");
}
console.log("DONE →", outDir);
