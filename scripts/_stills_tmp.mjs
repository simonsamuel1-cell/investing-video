// node stills.mjs <bundle> <outdir> <scale> f1 f2 ...
import { renderStill, selectComposition } from '@remotion/renderer';
const [bundle, out, scale, ...fr] = process.argv.slice(2);
const comp = await selectComposition({ serveUrl: bundle, id: 'KesalahanInvestor', inputProps: JSON.parse(process.env.PROPS || '{}') });
for (const f of fr) {
  await renderStill({ serveUrl: bundle, composition: comp, frame: +f, output: `${out}/f${String(f).padStart(5, '0')}.png`, scale: +scale, inputProps: JSON.parse(process.env.PROPS || '{}') });
  process.stdout.write(f + ' ');
}
