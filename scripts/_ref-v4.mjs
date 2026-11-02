// REFERENSI v4 (16 Okt, sebelum migrasi ke VO v5): frame scene yang narasinya identik, tiap 5 frame, skala 1/4 → out/ref-v4/oNNNNN.png
import { bundle } from '@remotion/bundler';
import { renderFrames, selectComposition } from '@remotion/renderer';
import path from 'node:path'; import fs from 'node:fs'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const composition = await selectComposition({ serveUrl, id: 'InvestmentInstruments' });
const dir = path.join(root, 'out/ref-v4'); fs.mkdirSync(dir, { recursive: true });
for (const [a, b] of [[0, 4705], [8328, 10760], [12532, 14910], [25576, 27140]]) {
  const tmp = path.join(dir, `_tmp_${a}`); fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
  await renderFrames({ composition, serveUrl, outputDir: tmp, frameRange: [a, b], everyNthFrame: 5, imageFormat: 'png', scale: 0.25, concurrency: 6,
    onStart: () => {}, onFrameUpdate: () => {}, inputProps: {} });
  const fs_ = fs.readdirSync(tmp).filter((n) => n.endsWith('.png')).sort();
  fs_.forEach((n, i) => fs.renameSync(path.join(tmp, n), path.join(dir, `o${String(a + 5 * i).padStart(5, '0')}.png`)));
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(a, b, fs_.length);
}
fs.rmSync(serveUrl, { recursive: true, force: true });
