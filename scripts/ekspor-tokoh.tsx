// EKSPOR TOKOH ke SVG mandiri (26 Okt, Simon: "kirimkan padaku salah satu char yang sudah kamu edit bajunya").
// Dibundel esbuild lalu dijalankan node: render <Tokoh> ke markup statis → 04_Asset/karakter-flat/*.svg
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { writeFileSync } from 'node:fs';
import { BERDIRI, TUNIK, Tokoh, type Kepala, type Warna } from '../src/flat/rig';

const KE = process.argv[2];
const tokoh: [string, Kepala, Partial<Warna> | undefined, number][] = [
  ['tokoh-utama_baju-gua', 'netral', undefined, 2.4],
  ['kelompok-keriting_baju-gua', { set: 'keriting', eks: 'netral' }, TUNIK.oranye, 2.32],
  ['kelompok-wanita_baju-gua', { set: 'wanita', eks: 'netral' }, TUNIK.krem, 2.16],
  ['kelompok-ikal_baju-gua', { set: 'ikal', eks: 'netral' }, TUNIK.cokelat, 2.34],
];
for (const [nama, kepala, warna, s] of tokoh) {
  const W = 360 * (s / 2.4), H = 640 * (s / 2.4);
  const isi = renderToStaticMarkup(
    <svg xmlns="http://www.w3.org/2000/svg" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <Tokoh x={W / 2} tanah={H - 12} s={s} pose={BERDIRI} kostum="dulu" kepala={kepala} warna={warna} />
    </svg>);
  writeFileSync(`${KE}/${nama}.svg`, `<?xml version="1.0" encoding="UTF-8"?>\n${isi}`);
  console.log(nama);
}
