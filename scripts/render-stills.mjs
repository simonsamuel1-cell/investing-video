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
  [1815, "s9-reversex"], [2050, "s10-bridge"], [2190, "s11-phonetitle"], [2360, "s12-tabs"],
  [2520, "s13-phoneclip"], [2950, "s14-concepts"], [3250, "s15-group"], [3432, "s16-thumbs"],
  [3550, "s17-hotthemes"], [3720, "s18-stocktheme"], [3950, "s19-callouts"], [4250, "s20-research"],
  [4520, "s21-filters"], [4750, "s22-lockup"], [4850, "s23-twochecks"], [5050, "s24-validation"],
  [5350, "s25-research"], [5655, "s26-technical"], [5870, "s27-memberships"], [6020, "s28-conviction"],
  [6175, "s29-arrows"], [6450, "s30-recap"], [6770, "s31-theme"], [6880, "s32-endcard"],
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
