#!/usr/bin/env node
/**
 * stills-all.mjs — bundle ONCE, render one still from EVERY composition.
 *
 * The health check for a branch that carries every episode at once. `tsc` and
 * a successful bundle only prove that imports resolve; this proves each video
 * still RUNS — its components mount, its data loads, its assets are found.
 *
 * Run it after anything that touches shared files, and after a migration.
 *
 *   node scripts/stills-all.mjs <projectDir> <outDir> [fraction]
 *
 * `fraction` is where in each video to sample, 0..1 (default 0.4 — far enough
 * in to be past the opening card, not so far as to be the closing hold).
 */
import { bundle } from "@remotion/bundler";
import { getCompositions, selectComposition, renderStill } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const [, , dir, outDir, fractionArg] = process.argv;
const root = resolve(dir ?? ".");
const out = outDir ?? "out/stills-all";
const fraction = Number(fractionArg ?? 0.4);
mkdirSync(out, { recursive: true });

const serveUrl = await bundle({ entryPoint: join(root, "src/index.ts") });
const comps = await getCompositions(serveUrl);
console.log(`bundled — ${comps.length} compositions\n`);

const failed = [];
for (const c of comps) {
  const frame = Math.floor(c.durationInFrames * fraction);
  try {
    const composition = await selectComposition({ serveUrl, id: c.id });
    await renderStill({
      composition,
      serveUrl,
      output: join(out, `${c.id}-f${frame}.png`),
      frame,
      overwrite: true,
    });
    console.log(`  OK    ${c.id.padEnd(28)} ${c.width}x${c.height} @${c.fps}  ${c.durationInFrames}f  → f${frame}`);
  } catch (e) {
    console.log(`  FAIL  ${c.id.padEnd(28)} f${frame}  ${String(e.message).split("\n")[0].slice(0, 160)}`);
    failed.push(c.id);
  }
}

console.log(`\n${comps.length - failed.length}/${comps.length} rendered.`);
if (failed.length) {
  console.log("FAILED: " + failed.join(", "));
  process.exit(1);
}
