// still ke folder sendiri (tidak bentrok dengan out/stills): node stills_ke.mjs <folder> f1 f2 ...
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path'; import fs from 'node:fs';
const root = process.cwd();
const [dir, ...fr] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const inputProps = process.env.TANPA_KAMERA === '1' ? { tanpaKamera: true } : {};
const composition = await selectComposition({ serveUrl, id: 'JalurInvestor', inputProps });
fs.mkdirSync(dir, { recursive: true });
for (const f of fr.map(Number)) await renderStill({ serveUrl, composition, frame: f, output: path.join(dir, `f${String(f).padStart(5, '0')}.png`), scale: Number(process.env.SKALA || 0.5), inputProps });
fs.rmSync(serveUrl, { recursive: true, force: true });
