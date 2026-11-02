// still verifikasi: satu bundle, banyak frame -> out/stills/fNNNNN.png
// pakai: node scripts/stills.mjs 120 400 ...
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const frames = process.argv.slice(2).map(Number);
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const composition = await selectComposition({ serveUrl, id: process.env.COMP || 'JalurInvestor' });
fs.mkdirSync(path.join(root, 'out/stills'), { recursive: true });
for (const frame of frames) {
  const output = path.join(root, `out/stills/${process.env.COMP ? process.env.COMP + '_' : ''}f${String(frame).padStart(5, '0')}.png`);
  await renderStill({ serveUrl, composition, frame, output, scale: Number(process.env.SKALA || 1) });
  console.log(output);
}

// bundle sementara (±950 MB) DIHAPUS — 226 sisa bundle sempat memenuhi disk (7 Okt)
fs.rmSync(serveUrl, { recursive: true, force: true });
