// PINDAI DIAM (cepat) — sama dengan pindai-diam.mjs (tiap LANGKAH frame, skala 1/4 → out/pindai/COMP/fNNNNN.png untuk
// scripts/pindai-diam.py), tetapi lewat renderFrames Remotion (paralel). pakai: COMP=Ide-S09 LANGKAH=15 node scripts/pindai-diam-cepat.mjs
import { bundle } from '@remotion/bundler';
import { renderFrames, selectComposition } from '@remotion/renderer';
import path from 'node:path'; import fs from 'node:fs'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COMP = process.env.COMP, STEP = Number(process.env.LANGKAH || 15);
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const composition = await selectComposition({ serveUrl, id: COMP });
const dir = path.join(root, `out/pindai/${COMP}`); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
const tmp = path.join(dir, '_tmp'); fs.mkdirSync(tmp);
await renderFrames({ composition, serveUrl, outputDir: tmp, everyNthFrame: STEP, frameRange: [0, composition.durationInFrames - 1],
  imageFormat: 'png', scale: 0.25, concurrency: 6, onStart: () => {}, onFrameUpdate: () => {}, inputProps: {} });
for (const n of fs.readdirSync(tmp)) {
  const k = Number(n.match(/(\d+)\.png$/)[1]) * STEP; // everyNthFrame: nama berkas = nomor urut keluaran
  fs.renameSync(path.join(tmp, n), path.join(dir, `f${String(k).padStart(5, '0')}.png`));
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log(dir);
fs.rmSync(serveUrl, { recursive: true, force: true });
