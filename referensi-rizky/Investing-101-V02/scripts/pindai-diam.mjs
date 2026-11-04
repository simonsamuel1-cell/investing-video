// PINDAI DIAM — render komposisi Ide tiap LANGKAH frame, ukur perubahan antar-sampel di luar pita subtitle & watermark.
// Jendela "diam" = perubahan < AMBANG selama >= 1 dtk; "kosong" = hampir tanpa tinta. Keluaran JSON untuk scripts/pindai-diam.py.
// pakai: COMP=Ide-S05 LANGKAH=15 node scripts/pindai-diam.mjs
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path'; import fs from 'node:fs'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COMP = process.env.COMP, STEP = Number(process.env.LANGKAH || 15);
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const composition = await selectComposition({ serveUrl, id: COMP });
const dir = path.join(root, `out/pindai/${COMP}`); fs.mkdirSync(dir, { recursive: true });
for (let f = 0; f < composition.durationInFrames; f += STEP) {
  const output = path.join(dir, `f${String(f).padStart(5, '0')}.png`);
  await renderStill({ serveUrl, composition, frame: f, output, scale: 0.25 });
}
console.log(dir);

// bundle sementara (±950 MB) DIHAPUS — 226 sisa bundle sempat memenuhi disk (7 Okt)
fs.rmSync(serveUrl, { recursive: true, force: true });
