// still MODE UKUR (latar hijau, tanpa judul/watermark/subtitle) → out/ukur/<COMP>_fNNNNN.png — untuk pusat tinta isi
// pakai: COMP=Ide-S01 node scripts/ukur-stills.mjs 100 200 …
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const frames = process.argv.slice(2).map(Number);
const inputProps = { ukur: true };
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const composition = await selectComposition({ serveUrl, id: process.env.COMP || 'Ide-S01', inputProps });
fs.mkdirSync(path.join(root, 'out/ukur'), { recursive: true });
for (const frame of frames) {
  const output = path.join(root, `out/ukur/${process.env.COMP || 'Ide-S01'}_f${String(frame).padStart(5, '0')}.png`);
  await renderStill({ serveUrl, composition, frame, output, inputProps });
}
fs.rmSync(serveUrl, { recursive: true, force: true });
