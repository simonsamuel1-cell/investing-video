import React from 'react';
import { Img, staticFile } from 'remotion';
import { STUDIO } from '../kamera';

/**
 * AI TUNTUN — maskot resmi (Simon 7 Okt: "ini icon tuntunnya", berkas `023…/Video 02 - Peluang & Ritme Trading/AI.mov`):
 * memantul + berkedip, qtrle 313×300 60fps, 64 dtk = putaran 240f berulang (dipakai frame 240–479, putaran bersih).
 * Sprite dibangun scripts/ai-tuntun-sprite.py: alfa un-premultiply (berkas premultiplied ke hitam → tanpa ini pendarnya halo
 * gelap) dan KANVAS DIPERBESAR 345×372 (+48 atas, +24 bawah, +16 sisi) — Simon: "bagian atas kepala icon ada bagian yang
 * terpotong": pendar toska terpotong lurus di tepi atas kanvas asli; dilengkapi model pendar yang dipas ke aslinya.
 * Satu LEMBAR SPRITE: satu <Img> bersumber tetap, hanya posisinya yang bergeser → tidak ada kedip ganti-src di Studio.
 * Tanpa teks nama (Simon: "hapus text AI tuntun"). Peran: sosok pengingat yang muncul SESEKALI.
 */
export const AI = { asliW: 313, asliH: 300, padAtas: 48, padSisi: 16, w: 345, h: 372, putaran: 240, kolom: 16, pad: 2, lebarSheet: 5584, tinggiSheet: 5640 } as const;

/** maskot: (x, y) = pusat kanvas ASLI 313×300 (posisi karakter sama dengan sebelum kanvas diperbesar); `tinggi` = tinggi kanvas
 *  asli yang ditampilkan; `p` = pop (skala); `t0` = frame awal putaran (fase deterministik) */
/** lembar sprite: sprite.png asli (sel 345×372). Diuji 12 Okt melawan lembar "diperhalus" (bingkai digeser sub-piksel ke kurva pantul halus +
 *  diperkecil): pemindai judder S13 1290–1566 → asli 1 petak-langkah terisolasi, diperhalus 40 (resampling ganda) → asli dipakai.
 *  Dipecah jadi 15 STRIP BARIS (public/media/ai-tuntun/baris-NN.png, 5584 × 376, ±2 MP): lembar utuh 31 MP diunggah ke GPU saat maskot
 *  pertama tampil → Studio tersendat 150–240 ms (terukur, juga sesudah dekode di latar). Yang dipasang hanya strip baris bingkai aktif +
 *  strip berikutnya (sudah dimuat sebelum gilirannya → tanpa kedip ganti strip). */
const LEMBAR = { cw: AI.w, ch: AI.h, w: AI.lebarSheet, baris: Math.ceil(AI.putaran / AI.kolom) } as const;
const strip = (r: number) => `media/ai-tuntun/baris-${String(r).padStart(2, '0')}.png`;

/* STUDIO: dekode strip DI LATAR saat modul dimuat (Image.decode(), di luar utas utama); rujukan disimpan supaya cache tidak dibuang.
 * Render tidak terpengaruh (Img menunggu muat). */
if (STUDIO && typeof window !== 'undefined') {
  (window as unknown as { __aiTuntun?: HTMLImageElement[] }).__aiTuntun = Array.from({ length: LEMBAR.baris }, (_, r) => {
    const im = new Image(); im.src = staticFile(strip(r)); im.decode().catch(() => undefined); return im;
  });
}

/** maskot: (x, y) = pusat kanvas ASLI 313×300; `tinggi` = tinggi kanvas asli yang ditampilkan; `p` = pop (skala); `t0` = frame awal putaran.
 *  Simon 12 Okt "ikan tuntunnya kok jadi freeze?" → pilih "animasi asli terus-menerus": memantul + berkedip BERULANG lagi (240f/putaran,
 *  dulu 9 Okt dibekukan ke bingkai diam karena pantulan sprite patah-patah & idle). Yang dulu patah-patah = PENEMPATAN lembar di piksel bulat;
 *  kini posisi lembar lewat translate3d + rotasi mikro (sub-piksel) → pemindai judder bersih (lihat LEMBAR). */
export const AiTuntun: React.FC<{ f: number; x: number; y: number; tinggi: number; p: number; t0: number; op?: number }> = ({ f, x, y, tinggi, p, t0, op = 1 }) => {
  if (p <= 0.001 || op <= 0.001) return null;
  const s = tinggi / AI.asliH, L = LEMBAR;
  const k = (((f - t0) % AI.putaran) + AI.putaran) % AI.putaran;
  const r = Math.floor(k / AI.kolom), c = k % AI.kolom;
  const kx = (AI.w * s) / L.cw, ky = (AI.h * s) / L.ch;
  const kiri = x - (AI.padSisi + AI.asliW / 2) * s, atas = y - (AI.padAtas + AI.asliH / 2) * s;
  return (
    <div style={{ position: 'absolute', left: kiri, top: atas, width: AI.w * s, height: AI.h * s, overflow: 'hidden', opacity: op,
      transform: `scale(${p})`, transformOrigin: `${(AI.padSisi + AI.asliW / 2) * s}px ${(AI.padAtas + AI.asliH / 2) * s}px` }}> {/* poros = tengah maskot */}
      {/* hanya strip AKTIF + strip BERIKUTNYA yang dipasang (15 strip sekaligus = 15 lapisan diunggah serentak saat maskot muncul, jeda ±100 ms,
          terukur). Strip berikut SUDAH lapisan GPU (translate3d + rotasi, di luar jendela): dulu translate 2D → jadi lapisan baru tepat di
          gilirannya → satu bingkai digambar beda tiap 16 bingkai (pemindai judder S11: langkah tepat tiap 16f) */}
      {[r, (r + 1) % LEMBAR.baris].map((rr) => (
        <Img key={rr} src={staticFile(strip(rr))} style={{ position: 'absolute', left: 0, top: 0, width: L.w * kx, height: (L.ch + 2 * AI.pad) * ky, maxWidth: 'none',
          transform: rr === r ? `translate3d(${-(c * (L.cw + 2 * AI.pad) + AI.pad) * kx}px, ${-AI.pad * ky}px, 0) rotate(0.001deg)` : 'translate3d(0, -100000px, 0) rotate(0.001deg)' }} />))}
    </div>);
};
