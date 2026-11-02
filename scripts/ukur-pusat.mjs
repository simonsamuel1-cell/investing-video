// UKUR PUSAT ISI — render satu scene saja (inputProps hanya) di latar putih, tanpa kamera, skala penuh, tiap LANGKAH frame.
// pakai: SC=S01 COMP=Ide-S01 LANGKAH=10 node scripts/ukur-pusat.mjs   → out/pusat/S01/fNNNNN.png (frame LOKAL komposisi)
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path'; import fs from 'node:fs'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SC = process.env.SC, COMP = process.env.COMP, STEP = Number(process.env.LANGKAH || 10);
const inputProps = { ukur: true, hanya: SC, tanpaKamera: process.env.KAMERA !== '1' };
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const composition = await selectComposition({ serveUrl, id: COMP, inputProps });
const dir = path.join(root, `out/pusat/${SC}${process.env.KAMERA === '1' ? '-kamera' : ''}`); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
for (let f = 0; f < composition.durationInFrames; f += STEP) {
  await renderStill({ serveUrl, composition, frame: f, output: path.join(dir, `f${String(f).padStart(5, '0')}.png`), scale: 1, inputProps });
}
console.log(dir, composition.durationInFrames);

// bundle sementara (±950 MB) DIHAPUS — 226 sisa bundle sempat memenuhi disk (7 Okt)
fs.rmSync(serveUrl, { recursive: true, force: true });
