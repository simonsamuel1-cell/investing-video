import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

/**
 * WATERMARK Tuntun (Simon 5 Okt: "tambahkan watermark juga") — berkas, ukuran & posisi SAMA PERSIS dengan Video 08
 * (`oscillator-episode/src/v4/chrome.tsx`, diukur dari Video 06: lebar 322, kanan 66, atas 41) — di dalam zona logo
 * kanan atas (x ≥ 1464, y ≤ 204). Berkas asli 8001×2562 (20 MP) diperkecil ke 644 px (2× tampil): watermark 20 MP
 * pernah membuat Studio tersendat (Video 04).
 */
const WM = { w: 322, right: 66, top: 41 };

export const Watermark: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    <Img src={staticFile('brand/watermark.png')} style={{ position: 'absolute', top: WM.top, right: WM.right, width: WM.w, height: 'auto' }} />
  </AbsoluteFill>
);
