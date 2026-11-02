// PINDAI FRAME (rakitan 13 Okt; turunan jeglek-cepat / pindai-diam-cepat Video 02): renderFrames paralel, PNG (bukan mp4/JPEG).
// pakai: COMP=TigaJenisUang JENDELA="11600-11760,14250-14420" LANGKAH=1 SKALA=0.5 KE=jeglek node scripts/pindai.mjs
//        → out/<KE>/fNNNNN.png (NNNNN = frame komposisi). Analisis: scripts/jeglek.py (LANGKAH=1) · scripts/diam.py (LANGKAH>1).
import { bundle } from '@remotion/bundler';
import { renderFrames, selectComposition } from '@remotion/renderer';
import path from 'node:path'; import fs from 'node:fs'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COMP = process.env.COMP || 'TigaJenisUang', STEP = Number(process.env.LANGKAH || 1), SCALE = Number(process.env.SKALA || 0.5), KE = process.env.KE || 'jeglek';
const jendela = process.env.JENDELA.split(',').map((w) => w.split('-').map(Number));
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const composition = await selectComposition({ serveUrl, id: COMP });
const dir = path.join(root, `out/${KE}`); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
for (const [a, b] of jendela) {
  const tmp = path.join(dir, `_tmp_${a}`); fs.mkdirSync(tmp, { recursive: true });
  await renderFrames({ composition, serveUrl, outputDir: tmp, frameRange: [a, b], everyNthFrame: STEP, imageFormat: 'png', scale: SCALE, concurrency: 6,
    onStart: () => {}, onFrameUpdate: () => {}, inputProps: process.env.TANPA_KAMERA === '1' ? { tanpaKamera: true } : {} });
  const fs_ = fs.readdirSync(tmp).filter((n) => n.endsWith('.png')).sort();
  fs_.forEach((n, i) => fs.renameSync(path.join(tmp, n), path.join(dir, `f${String(a + i * STEP).padStart(5, '0')}.png`)));
  fs.rmSync(tmp, { recursive: true, force: true });
}
fs.rmSync(serveUrl, { recursive: true, force: true });
console.log(dir);
