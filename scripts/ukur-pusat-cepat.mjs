// UKUR PUSAT ISI (cepat) — sama dengan ukur-pusat.mjs (mode ukur: satu scene, latar hijau, tanpa kamera, skala penuh, tiap LANGKAH frame
// → out/pusat/SC[-kamera]/fNNNNN.png), tetapi lewat renderFrames Remotion (paralel) alih-alih renderStill satu per satu.
// pakai: SC=S09 COMP=Ide-S09 LANGKAH=10 [KAMERA=1] node scripts/ukur-pusat-cepat.mjs
import { bundle } from '@remotion/bundler';
import { renderFrames, selectComposition } from '@remotion/renderer';
import path from 'node:path'; import fs from 'node:fs'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SC = process.env.SC, COMP = process.env.COMP, STEP = Number(process.env.LANGKAH || 10);
const inputProps = { ukur: true, hanya: SC, tanpaKamera: process.env.KAMERA !== '1' };
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const composition = await selectComposition({ serveUrl, id: COMP, inputProps });
const dir = path.join(root, `out/pusat/${SC}${process.env.KAMERA === '1' ? '-kamera' : ''}`); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
const tmp = path.join(dir, '_tmp'); fs.mkdirSync(tmp);
await renderFrames({ composition, serveUrl, outputDir: tmp, inputProps, everyNthFrame: STEP, frameRange: [0, composition.durationInFrames - 1],
  imageFormat: 'png', scale: 1, concurrency: 6, onStart: () => {}, onFrameUpdate: () => {} });
for (const n of fs.readdirSync(tmp)) {
  const k = Number(n.match(/(\d+)\.png$/)[1]) * STEP; // everyNthFrame: nama berkas = nomor urut keluaran, bukan nomor frame
  fs.renameSync(path.join(tmp, n), path.join(dir, `f${String(k).padStart(5, '0')}.png`));
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log(dir, composition.durationInFrames, fs.readdirSync(dir).length, 'berkas');
fs.rmSync(serveUrl, { recursive: true, force: true });
