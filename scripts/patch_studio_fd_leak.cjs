#!/usr/bin/env node
/**
 * TAMBALAN Remotion Studio 4.0.454: kebocoran file descriptor di server file statis Studio
 * (node_modules/@remotion/studio-server/dist/preview-server/serve-static.js).
 *
 * Gejala (2026-09-29): tombol Render di Studio -> Studio MATI dengan "Error: spawn EBADF" (BrowserRunner.js:74),
 * sesudah Studio menyala lama (4 j 38 m) & banyak diputar/di-seek.
 * Sebab (terukur):
 *   1. serveStatic mengirim berkas public/ dengan `readStream.pipe(res)`. Saat <video>/<audio> membatalkan
 *      request Range (tiap seek/scrub/putar ulang), pipe() TIDAK menutup readStream -> 1 fd bocor per
 *      pembatalan (uji: 200 pembatalan = 200 fd masih memegang vo_breakscene.wav, juga sesudah GC).
 *   2. Di macOS, Node 24 memakai posix_spawn; begitu nomor fd baru >= OPEN_MAX (10240) spawn melempar EBADF
 *      (uji: 10.150 fd terbuka = OK, 10.230 = EBADF). Render butuh spawn Chrome -> galat tak tertangkap -> Studio mati.
 * Tambalan: `res.on('close', () => readStream.destroy())` sesudah tiap pipe (uji: 200 pembatalan = 0 fd bocor;
 * unduhan penuh / Range / ekor tetap identik byte demi byte).
 *
 * Idempoten. Jalankan ulang sesudah `npm install` / upgrade Remotion:  node scripts/patch_studio_fd_leak.cjs
 * Berlaku di start Studio BERIKUTNYA (Studio yang sedang jalan memakai kode lama di memori).
 */
const fs = require('fs');
const path = require('path');

const F = path.join(__dirname, '..', 'node_modules', '@remotion', 'studio-server', 'dist', 'preview-server', 'serve-static.js');
const FIX = "        res.on('close', () => readStream.destroy());\n";
let s = fs.readFileSync(F, 'utf8');
if (s.includes("readStream.destroy()")) {
  console.log('serve-static.js sudah bertambalan — tidak ada yang diubah.');
  process.exit(0);
}
const olds = [
  "        res.writeHead(200);\n        readStream.pipe(res);\n        return;\n",
  "        });\n        readStream.pipe(res);\n        return;\n",
];
for (const o of olds) {
  if (s.split(o).length !== 2) {
    console.error('⚠ Struktur serve-static.js berubah (versi Remotion lain?) — tambalan TIDAK dipasang. Periksa manual.');
    process.exit(1);
  }
  s = s.replace(o, o.replace('        return;\n', FIX + '        return;\n'));
}
fs.writeFileSync(F, s);
console.log('Tambalan fd-leak dipasang di', F);
