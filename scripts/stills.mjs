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

/**
 * ⚠ OPT-IN GL BACKEND. Headless Chrome serves no WebGL context by default, so
 * any composition with a shader in it throws "no WebGL context" here while
 * rendering perfectly in the Studio, which is a real browser. Set
 * REMOTION_GL=angle (or swangle, the software one) for those.
 *
 * Left unset it is undefined and nothing about an ordinary render changes —
 * this script is shared.
 */
const gl = process.env.REMOTION_GL;
const chromiumOptions = gl ? { gl } : undefined;

const serveUrl = await bundle({ entryPoint: join(root, "src/index.ts") });
const composition = await selectComposition({ serveUrl, id: compId, inputProps, chromiumOptions });
console.log(`${compId}  ${composition.width}x${composition.height} @${composition.fps}  ${composition.durationInFrames}f`);

for (const frame of frames) {
  const output = join(outDir, `f${String(frame).padStart(5, "0")}.png`);
  await renderStill({ composition, serveUrl, output, frame, inputProps, overwrite: true, chromiumOptions });
  process.stdout.write(`${frame} `);
}
console.log("\ndone");
