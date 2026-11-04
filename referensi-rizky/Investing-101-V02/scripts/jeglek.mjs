// PEMINDAI JEGLEK — render SETIAP frame di jendela yang diberikan (skala 1/2), lalu scripts/jeglek.py menandai lonjakan.
// pakai: COMP=Ide-S05 JENDELA="30-70,100-180" node scripts/jeglek.mjs
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path'; import fs from 'node:fs'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COMP = process.env.COMP;
const jendela = process.env.JENDELA.split(',').map((w) => w.split('-').map(Number));
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const composition = await selectComposition({ serveUrl, id: COMP });
const dir = path.join(root, `out/jeglek/${COMP}`); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
for (const [a, b] of jendela) for (let f = a; f <= b; f += 1)
  await renderStill({ serveUrl, composition, frame: f, output: path.join(dir, `f${String(f).padStart(5, '0')}.png`), scale: 0.5 });
fs.rmSync(serveUrl, { recursive: true, force: true });
console.log(dir);
