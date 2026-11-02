// UJI INVARIAN migrasi v5 (16 Okt): scene yang narasinya identik harus sama per piksel dengan referensi v4 (out/ref-v4/oNNNNN.png,
// skala 1/4, tiap 5 frame). frame baru n = o − geser. Keluar: out/invarian/nNNNNN.png
import { bundle } from '@remotion/bundler';
import { renderFrames, selectComposition } from '@remotion/renderer';
import path from 'node:path'; import fs from 'node:fs'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const composition = await selectComposition({ serveUrl, id: 'InvestmentInstruments' });
const dir = path.join(root, 'out/invarian'); fs.mkdirSync(dir, { recursive: true });
// [o0, o1, geser]: o0 kelipatan 5
const W = (process.env.W ? JSON.parse(process.env.W) : [[60, 4700, 0], [8388, 10758, 1284], [12592, 14907, 632], [25636, 27136, 5549]]);
for (const [o0, o1, g] of W) {
  const tmp = path.join(dir, `_tmp_${o0}`); fs.mkdirSync(tmp, { recursive: true });
  await renderFrames({ composition, serveUrl, outputDir: tmp, frameRange: [o0 - g, o1 - g], everyNthFrame: 5, imageFormat: 'png', scale: 0.25, concurrency: 6,
    onStart: () => {}, onFrameUpdate: () => {}, inputProps: {} });
  const fs_ = fs.readdirSync(tmp).filter((n) => n.endsWith('.png')).sort();
  fs_.forEach((n, i) => fs.renameSync(path.join(tmp, n), path.join(dir, `o${String(o0 + 5 * i).padStart(5, '0')}.png`)));
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(o0, o1, g, fs_.length);
}
fs.rmSync(serveUrl, { recursive: true, force: true });
