import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

/**
 * WATERMARK Tuntun (Simon 5 Okt: "tambahkan watermark juga") — berkas, ukuran & posisi SAMA PERSIS dengan Video 08
 * (`oscillator-episode/src/v4/chrome.tsx`, diukur dari Video 06: lebar 322, kanan 66, atas 41) — di dalam zona logo
 * kanan atas (x ≥ 1464, y ≤ 204). Berkas asli 8001×2562 (20 MP) diperkecil ke 644 px (2× tampil): watermark 20 MP
 * pernah membuat Studio tersendat (Video 04).
 */
const WM = { w: 322, right: 66, top: 41 };

/** `plat` 0…1 (30 Okt malam, Simon VI01: "warna logo bertabrakan dengan warna background kota"): pelat putih lembut di belakang logo, hanya selama latar
 *  kota terlihat — logonya sendiri tidak diubah */
export const Watermark: React.FC<{ plat?: number }> = ({ plat = 0 }) => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    {plat > 0.001 ? <div style={{ position: 'absolute', top: WM.top - 16, right: WM.right - 22, width: WM.w + 44, height: 116, borderRadius: 26,
      background: 'rgba(255,255,255,0.9)', boxShadow: '0 6px 18px -10px rgba(18,16,48,.35)', opacity: plat < 0.9999 ? plat : undefined }} /> : null}
    <Img src={staticFile('brand/watermark.png')} style={{ position: 'absolute', top: WM.top, right: WM.right, width: WM.w, height: 'auto' }} />
  </AbsoluteFill>
);
