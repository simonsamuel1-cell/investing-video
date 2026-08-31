#!/usr/bin/env node
/**
 * stills.mjs — bundle ONCE, render many stills.
 *
 * `npx remotion still` re-bundles and relaunches a browser per frame, which is
 * about eight seconds each; twenty-two frames twice over is most of an hour of
 * waiting for something that is one bundle and one browser.
 *
 *   node stills.mjs <projectDir> <compId> <outDir> <f,f,f...> [propsJson]
 */
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const [, , dir, compId, outDir, frameList, propsJson] = process.argv;
const root = resolve(dir);
const frames = frameList.split(",").map(Number);
const inputProps = propsJson ? JSON.parse(propsJson) : {};
mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: join(root, "src/index.ts") });
const composition = await selectComposition({ serveUrl, id: compId, inputProps });
console.log(`${compId}  ${composition.width}x${composition.height} @${composition.fps}  ${composition.durationInFrames}f`);

for (const frame of frames) {
  const output = join(outDir, `f${String(frame).padStart(5, "0")}.png`);
  await renderStill({ composition, serveUrl, output, frame, inputProps, overwrite: true });
  process.stdout.write(`${frame} `);
}
console.log("\ndone");
