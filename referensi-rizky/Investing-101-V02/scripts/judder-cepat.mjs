// PEMINDAI JUDDER (skala PENUH) — Chrome membulatkan geseran lambat ke piksel bulat: satu petak melompat 1 px lalu diam
// (reference_chrome_pixel_snap). Render ½ skala (jeglek-cepat) menyamarkannya, jadi ini merender SKALA 1 per potongan,
// lalu scripts/judder.py menganalisis per PETAK dan menghapus PNG-nya (hemat disk).
// pakai: COMP=Ide-S02 JENDELA="0-1845" POTONG=150 LABEL=sebelum node scripts/judder-cepat.mjs
import { bundle } from '@remotion/bundler';
import { renderFrames, selectComposition } from '@remotion/renderer';
import path from 'node:path'; import fs from 'node:fs'; import { fileURLToPath } from 'node:url'; import { execFileSync } from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COMP = process.env.COMP, POTONG = Number(process.env.POTONG || 150), LABEL = process.env.LABEL || 'hasil';
const [A, B] = process.env.JENDELA.split('-').map(Number);
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
console.log('bundle siap');
const composition = await selectComposition({ serveUrl, id: COMP });
const out = path.join(root, `out/judder/${COMP}-${LABEL}.jsonl`); fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, '');
for (let a = A; a <= B; a += POTONG) {
  const b = Math.min(B, a + POTONG); // tumpang 1 frame antar potongan
  // _tmp per pindaian: dua pindaian serentak dulu saling menghapus folder yang sama (hasil rusak diam-diam)
  const tmp = path.join(root, `out/judder/_tmp-${COMP}-${LABEL}`); fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
  await renderFrames({ composition, serveUrl, outputDir: tmp, frameRange: [a, b], imageFormat: 'png', scale: 1, concurrency: 6, onStart: () => {}, onFrameUpdate: () => {}, inputProps: {} });
  execFileSync('python3', [path.join(root, 'scripts/judder.py'), tmp, String(a), out], { stdio: 'inherit' });
  fs.rmSync(tmp, { recursive: true, force: true });
}
fs.rmSync(serveUrl, { recursive: true, force: true });
console.log(out);
