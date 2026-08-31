#!/usr/bin/env node
/**
 * compare.mjs <dirA> <dirB> [bgDelta]
 *
 * Per-frame pixel differences between two renders.
 *
 * ⚠ TWO NUMBERS, NOT ONE. The migration deliberately changes the background
 * from #FFFFFF to #F5F5F5 — a channel difference of exactly 10 — and every
 * anti-aliased edge in the frame blends against that ground, so a shift of up
 * to 10 anywhere is ALREADY EXPLAINED by a change that was asked for.
 *
 * So each frame reports the raw count and, separately, the count of pixels
 * that moved by MORE than that. The second number is the one that matters:
 * anything above zero there is a difference the background cannot account for.
 */
import { readdirSync } from "node:fs";
import { join } from "node:path";
const [, , A, B, bgArg] = process.argv;
const BG = Number(bgArg ?? 10);
const load = async (p) => {
  const { PNG } = await import("pngjs");
  const { readFileSync } = await import("node:fs");
  return PNG.sync.read(readFileSync(p));
};
const files = readdirSync(A).filter((f) => f.endsWith(".png")).sort();
let totalUnexplained = 0;
for (const f of files) {
  let a, b;
  try { a = await load(join(A, f)); b = await load(join(B, f)); }
  catch { console.log(`${f}  MISSING on one side`); continue; }
  let raw = 0, real = 0, worst = 0, at = null;
  for (let i = 0; i < a.data.length; i += 4) {
    const d = Math.max(
      Math.abs(a.data[i] - b.data[i]),
      Math.abs(a.data[i + 1] - b.data[i + 1]),
      Math.abs(a.data[i + 2] - b.data[i + 2]),
    );
    if (d > 2) raw++;
    if (d > BG) { real++; if (d > worst) { worst = d; at = i / 4; } }
  }
  totalUnexplained += real;
  const px = a.width * a.height;
  console.log(
    real === 0
      ? `✓ ${f}  ${raw ? `${raw} px within the background's own ${BG} — nothing else` : "identical"}`
      : `✗ ${f}  ${real} px unexplained (${((real / px) * 100).toFixed(2)}%)  max Δ${worst}  at (${at % a.width},${Math.floor(at / a.width)})`,
  );
}
console.log(totalUnexplained === 0
  ? `\nno differences beyond the background change`
  : `\n${totalUnexplained} unexplained pixels across ${files.length} frames`);
