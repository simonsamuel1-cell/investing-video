// effects-previews.mjs — the panel's clips: every FX-* composition → public/effects-library/<code>.mp4 (384×216, 30 fps) + .jpg.
//   node scripts/effects-previews.mjs [CODE,CODE]     default: those whose mp4 is missing; "all" redoes every one
import { bundle } from "@remotion/bundler";
import { getCompositions, openBrowser, renderMedia, renderStill } from "@remotion/renderer";
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { withRizky } from "../referensi-rizky/_studio/webpack.mjs";
const OUT = "public/effects-library"; mkdirSync(OUT, { recursive: true });
const want = process.argv[2];
const serveUrl = await bundle({ entryPoint: resolve("src/index.ts"), webpackOverride: withRizky });
const browser = await openBrowser("chrome");
const all = (await getCompositions(serveUrl, { puppeteerInstance: browser })).filter((c) => c.id.startsWith("FX-") && c.durationInFrames === 180); // 360 = excerpts, cut by effects-excerpts.mjs
const todo = all.filter((c) => { const id = c.id.slice(3); return want === "all" ? true : want ? want.split(",").includes(id) : !existsSync(`${OUT}/${id}.mp4`); });
const bad = [];
for (const [i, composition] of todo.entries()) {
  const id = composition.id.slice(3);
  try {
    await renderMedia({ composition, serveUrl, codec: "h264", crf: 26, scale: 0.2, everyNthFrame: 2, muted: true, outputLocation: `${OUT}/${id}.mp4`, overwrite: true, puppeteerInstance: browser });
    await renderStill({ composition, serveUrl, output: `${OUT}/${id}.jpg`, imageFormat: "jpeg", jpegQuality: 80, scale: 0.2, frame: 112, overwrite: true, puppeteerInstance: browser });
    console.log(`${i + 1}/${todo.length} ${id}`);
  } catch (e) { bad.push(id); console.log(`FAIL ${id}: ${String(e.message).split("\n")[0]}`); }
}
await browser.close({ silent: true });
console.log(bad.length ? `failed: ${bad.join(", ")}` : "all ok"); process.exit(bad.length ? 1 : 0);
