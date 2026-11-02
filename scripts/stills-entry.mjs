// still dari ENTRY lain (uji coba di salinan _umpan tanpa mengganggu Studio): ENTRY=_umpan/src/index.ts KE=nama node scripts/stills-entry.mjs 100 101 …
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path'; import fs from 'node:fs';
const frames = process.argv.slice(2).map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve(process.env.ENTRY) });
const composition = await selectComposition({ serveUrl, id: 'TigaJenisUang' });
const dir = path.resolve(`out/${process.env.KE}`); fs.mkdirSync(dir, { recursive: true });
for (const frame of frames) await renderStill({ serveUrl, composition, frame, output: path.join(dir, `f${String(frame).padStart(5, '0')}.png`) });
fs.rmSync(serveUrl, { recursive: true, force: true });
