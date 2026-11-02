import React from 'react';
import { Img, getRemotionEnvironment, staticFile } from 'remotion';

/**
 * AI TUNTUN — maskot resmi, SALINAN UTUH dari Investing 101 V02 (`instruments-episode/src/parts/aiTuntun.tsx`, disetujui Simon
 * 7–12 Okt): memantul + berkedip, putaran 240f berulang. Sprite = 15 STRIP BARIS `public/media/ai-tuntun/baris-NN.png`
 * (lembar utuh 31 MP = Studio tersendat 150–240 ms saat diunggah ke GPU). Hanya strip aktif + strip berikutnya yang dipasang;
 * posisi lembar lewat translate3d + rotasi mikro (penempatan piksel bulat = patah-patah). Tanpa teks nama.
 */
export const AI = { asliW: 313, asliH: 300, padAtas: 48, padSisi: 16, w: 345, h: 372, putaran: 240, kolom: 16, pad: 2, lebarSheet: 5584, tinggiSheet: 5640 } as const;
const LEMBAR = { cw: AI.w, ch: AI.h, w: AI.lebarSheet, baris: Math.ceil(AI.putaran / AI.kolom) } as const;
const strip = (r: number) => `media/ai-tuntun/baris-${String(r).padStart(2, '0')}.png`;

/* STUDIO: dekode strip di latar saat modul dimuat; rujukan disimpan supaya cache tidak dibuang. Render tidak terpengaruh. */
if (typeof window !== 'undefined' && getRemotionEnvironment().isStudio) {
  (window as unknown as { __aiTuntun?: HTMLImageElement[] }).__aiTuntun = Array.from({ length: LEMBAR.baris }, (_, r) => {
    const im = new Image(); im.src = staticFile(strip(r)); im.decode().catch(() => undefined); return im;
  });
}

/** (x, y) = pusat kanvas ASLI 313×300; `tinggi` = tinggi kanvas asli yang ditampilkan; `p` = skala; `t0` = frame awal putaran */
export const AiTuntun: React.FC<{ f: number; x: number; y: number; tinggi: number; p?: number; t0: number; op?: number }> = ({ f, x, y, tinggi, p = 1, t0, op = 1 }) => {
  if (p <= 0.001 || op <= 0.001) return null;
  const s = tinggi / AI.asliH, L = LEMBAR;
  const k = (((f - t0) % AI.putaran) + AI.putaran) % AI.putaran;
  const r = Math.floor(k / AI.kolom), c = k % AI.kolom;
  const kx = (AI.w * s) / L.cw, ky = (AI.h * s) / L.ch;
  const kiri = x - (AI.padSisi + AI.asliW / 2) * s, atas = y - (AI.padAtas + AI.asliH / 2) * s;
  return (
    <div style={{ position: 'absolute', left: kiri, top: atas, width: AI.w * s, height: AI.h * s, overflow: 'hidden', opacity: op,
      transform: `scale(${p})`, transformOrigin: `${(AI.padSisi + AI.asliW / 2) * s}px ${(AI.padAtas + AI.asliH / 2) * s}px` }}>
      {[r, (r + 1) % LEMBAR.baris].map((rr) => (
        <Img key={rr} src={staticFile(strip(rr))} style={{ position: 'absolute', left: 0, top: 0, width: L.w * kx, height: (L.ch + 2 * AI.pad) * ky, maxWidth: 'none',
          transform: rr === r ? `translate3d(${-(c * (L.cw + 2 * AI.pad) + AI.pad) * kx}px, ${-AI.pad * ky}px, 0) rotate(0.001deg)` : 'translate3d(0, -100000px, 0) rotate(0.001deg)' }} />))}
    </div>);
};
