// render f-2..f+2 untuk tiap titik (global) → out/stills/cek_fNNNNN.png
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path'; import fs from 'node:fs';
const root = process.cwd();
const titik = process.argv.slice(2).map(Number);
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const composition = await selectComposition({ serveUrl, id: 'InvestmentInstruments' });
const fr = [...new Set(titik.flatMap((t) => [t - 2, t - 1, t, t + 1, t + 2]))];
for (const frame of fr) await renderStill({ serveUrl, composition, frame, output: path.join(root, `out/stills/cek_f${String(frame).padStart(5, '0')}.png`) });
fs.rmSync(serveUrl, { recursive: true, force: true }); console.log('selesai', fr.length);
