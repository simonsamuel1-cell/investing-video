// SEMENTARA (audit 30 Okt): frame mode ukur (latar hijau) tiap LANGKAH → KE/fNNNNN.png — hapus sesudah audit
import { renderFrames, selectComposition } from '@remotion/renderer';
import fs from 'node:fs'; import path from 'node:path';
const [serveUrl, ke, a, b, langkah] = process.argv.slice(2);
const inputProps = { ukur: true, ...JSON.parse(process.env.EKSTRA || '{}') };
const composition = await selectComposition({ serveUrl, id: 'KesalahanInvestor', inputProps });
fs.mkdirSync(ke, { recursive: true });
const tmp = path.join(ke, '_tmp'); fs.mkdirSync(tmp, { recursive: true });
const L = Number(langkah);
await renderFrames({ composition, serveUrl, outputDir: tmp, frameRange: [Number(a), Number(b)], everyNthFrame: L, imageFormat: 'png', scale: 0.5, concurrency: 6, inputProps,
  onStart: () => {}, onFrameUpdate: () => {} });
fs.readdirSync(tmp).filter((n) => n.endsWith('.png')).sort().forEach((n, i) => fs.renameSync(path.join(tmp, n), path.join(ke, `f${String(Number(a) + i * L).padStart(5, '0')}.png`)));
fs.rmSync(tmp, { recursive: true, force: true });
console.log('ok');
