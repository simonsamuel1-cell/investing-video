// UKUR PUSAT ISI pada RENTANG frame (varian ukur-pusat-cepat.mjs): mode ukur + kamera, tiap LANGKAH frame di RENTANG "a-b" (frame lokal)
// → out/pusat/SC-rentang/fNNNNN.png (nomor = frame lokal). Untuk memeriksa transisi pendek dengan langkah rapat.
// pakai: SC=S09 COMP=Ide-S09 RENTANG=1500-1620 LANGKAH=2 node scripts/_ukur_rentang.mjs
import { bundle } from '@remotion/bundler';
import { renderFrames, selectComposition } from '@remotion/renderer';
import path from 'node:path'; import fs from 'node:fs'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SC = process.env.SC, COMP = process.env.COMP, STEP = Number(process.env.LANGKAH || 2);
const [A, B] = process.env.RENTANG.split('-').map(Number);
const inputProps = { ukur: true, hanya: SC, tanpaKamera: false };
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const composition = await selectComposition({ serveUrl, id: COMP, inputProps });
const dir = path.join(root, `out/pusat/${SC}-rentang`); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
const tmp = path.join(dir, '_tmp'); fs.mkdirSync(tmp);
await renderFrames({ composition, serveUrl, outputDir: tmp, inputProps, everyNthFrame: STEP, frameRange: [A, B],
  imageFormat: 'png', scale: 1, concurrency: 6, onStart: () => {}, onFrameUpdate: () => {} });
const nama = fs.readdirSync(tmp).sort();
nama.forEach((n, i) => fs.renameSync(path.join(tmp, n), path.join(dir, `f${String(A + i * STEP).padStart(5, '0')}.png`)));
fs.rmSync(tmp, { recursive: true, force: true });
console.log(dir, nama.length, 'berkas');
fs.rmSync(serveUrl, { recursive: true, force: true });
