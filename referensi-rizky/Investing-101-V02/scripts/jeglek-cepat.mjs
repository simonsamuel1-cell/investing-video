// PEMINDAI JEGLEK (cepat) — sama dengan jeglek.mjs (PNG skala 1/2 tiap frame, nama fNNNNN.png → scripts/jeglek.py), tetapi memakai
// renderFrames Remotion (paralel) alih-alih renderStill satu per satu (±1 frame/dtk → jauh lebih cepat). Tetap PNG, bukan mp4/JPEG.
// pakai: COMP=Ide-S08 JENDELA="0-240,330-520" node scripts/jeglek-cepat.mjs
import { bundle } from '@remotion/bundler';
import { renderFrames, selectComposition } from '@remotion/renderer';
import path from 'node:path'; import fs from 'node:fs'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COMP = process.env.COMP;
const jendela = process.env.JENDELA.split(',').map((w) => w.split('-').map(Number));
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const composition = await selectComposition({ serveUrl, id: COMP });
const dir = path.join(root, `out/jeglek/${COMP}`); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
for (const [a, b] of jendela) {
  const tmp = path.join(dir, `_tmp_${a}`); fs.mkdirSync(tmp, { recursive: true });
  await renderFrames({ composition, serveUrl, outputDir: tmp, frameRange: [a, b], imageFormat: 'png', scale: 0.5, concurrency: 6,
    onStart: () => {}, onFrameUpdate: () => {}, inputProps: {} });
  const fs_ = fs.readdirSync(tmp).filter((n) => n.endsWith('.png')).sort();
  if (fs_.length !== b - a + 1) throw new Error(`jendela ${a}-${b}: ${fs_.length} berkas, harusnya ${b - a + 1}`);
  // nama keluaran renderFrames = nomor frame komposisi (diuji: berkas pertama = frame a)
  fs_.forEach((n) => {
    const k = Number(n.match(/(\d+)\.png$/)[1]);
    fs.renameSync(path.join(tmp, n), path.join(dir, `f${String(k).padStart(5, '0')}.png`));
  });
  fs.rmSync(tmp, { recursive: true, force: true });
}
fs.rmSync(serveUrl, { recursive: true, force: true });
console.log(dir);
