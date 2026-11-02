// PINDAI PUSAT (14 Okt): render MODE UKUR (latar hijau, tanpa judul/watermark/subtitle) SKALA PENUH tiap LANGKAH frame → out/ukur-pindai/fNNNNN.png
// pakai: JENDELA="1121-2446" LANGKAH=30 node scripts/ukur-pindai.mjs   · analisis: python3 scripts/pusat-pindai.py
import { bundle } from '@remotion/bundler';
import { renderFrames, selectComposition } from '@remotion/renderer';
import path from 'node:path'; import fs from 'node:fs'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STEP = Number(process.env.LANGKAH || 30);
const jendela = process.env.JENDELA.split(',').map((w) => w.split('-').map(Number));
const inputProps = { ukur: true, tanpaKamera: process.env.UKUR_TANPA_KAMERA === '1' }; // gen-kamera.py butuh ukuran TANPA kamera
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const composition = await selectComposition({ serveUrl, id: process.env.COMP || 'JalurInvestor', inputProps });
const dir = path.join(root, 'out/ukur-pindai'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
for (const [a, b] of jendela) {
  const tmp = path.join(dir, `_tmp_${a}`); fs.mkdirSync(tmp, { recursive: true });
  await renderFrames({ composition, serveUrl, outputDir: tmp, frameRange: [a, b], everyNthFrame: STEP, imageFormat: 'png', scale: 1, concurrency: 6,
    onStart: () => {}, onFrameUpdate: () => {}, inputProps });
  const fs_ = fs.readdirSync(tmp).filter((n) => n.endsWith('.png')).sort();
  fs_.forEach((n, i) => fs.renameSync(path.join(tmp, n), path.join(dir, `f${String(a + i * STEP).padStart(5, '0')}.png`)));
  fs.rmSync(tmp, { recursive: true, force: true });
}
fs.rmSync(serveUrl, { recursive: true, force: true });
console.log(dir);
