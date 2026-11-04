import React from 'react';
import { Img, staticFile } from 'remotion';

/**
 * KARAKTER ORANG (Simon 9 Okt: "menambahkan orang seperti scene 1, menambahkan 2 karakter guru dan murid"; daftar pose di
 * 04_Asset/Daftar-Karakter-Guru-Murid.md, berkas asli di 04_Asset/karakter/). Gaya karakter pembuka Scene 01 (Scene 01 sendiri tidak
 * disentuh): lingkaran pekat, badan DIMASKER — di bawah garis tengah lingkaran terpotong lengkungnya, di atasnya utuh (kepala, dan lengan
 * yang terulur, menyembul keluar). Tanpa bayangan (Simon 9 Okt, lingkaran gedung: "hapus bayangannya").
 * Tiap pose: berkas tampil (public/karakter, ±2× ukuran tampil) + pusat & jari-jari lingkaran dalam piksel GAMBAR ASLI (1024 × 1536).
 */
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;
export type PoseKarakter = { src: string; w: number; h: number; cx: number; cy: number; r: number };
/** murid · S06 Investor (Simon 12 Okt: M1 menyodorkan uang → "ganti dengan ini saja" menoleh → "orang ini untuk menganti orang diadegan
 *  obligasi"): berdiri menghadap depan, tangan di saku, tersenyum. SETENGAH BADAN ("buat setengah badan saja orangnya"): tepi bawah lingkaran di pinggang (cy 490 + r 270 = 760).
 *  Asli 04_Asset/karakter/murid_depan_tangan_saku.webp */
export const MURID_S06: PoseKarakter = { src: 'karakter/murid_depan.webp', w: 1024, h: 1536, cx: 509, cy: 490, r: 270 };
/** investor berjas, menghadap depan (Simon 12 Okt, sisipan jual S06: "ganti orang discene obligasi dengan ini" = pembeli / "investor lain").
 *  Asli 04_Asset/karakter/investor_jas_depan.webp 1129 × 2000; tampil public/karakter/investor_jas_asli.webp 677 × 1200 — warna ASLI (sempat
 *  dicerahkan atas "kok warnanya jadi gelap", lalu Simon: "kembalikan ke aslinya saja"). Kepala selebar 203 px
 *  (murid 170) → r = 270 × 203 / 170 = 322, pusat 2,74 lebar kepala di bawah puncak kepala (= MURID_S06) → kepala tampil sama besar dan
 *  menyembul sama tinggi; cx 578 = tengah badan (kepala sedikit ke kiri). */
export const INVESTOR_JAS: PoseKarakter = { src: 'karakter/investor_jas_asli.webp', w: 1129, h: 2000, cx: 578, cy: 695, r: 322 };

/** pusat lingkaran (x, y), diameter D (gambar diskalakan supaya jari-jari pose = D / 2); `s` = pop seluruh susunan dari pusat lingkaran */
export const KarakterLingkar: React.FC<{ pose: PoseKarakter; x: number; y: number; D: number; s: number; warna: string }> = ({ pose, x, y, D, s, warna }) => {
  if (s <= 0.001) return null;
  const k = D / 2 / pose.r, w = pose.w * k, h = pose.h * k, ax = pose.cx * k, ay = pose.cy * k, r = D / 2;
  // persegi selebar gambar di atas garis tengah ∪ setengah lingkaran bawah
  const klip = `path('M -4 -4 H ${w + 4} V ${ay} H ${ax + r} A ${r} ${r} 0 0 1 ${ax - r} ${ay} H -4 Z')`;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transformOrigin: '0 0', transform: `${geser(x, y)} scale(${s})` }}>
      <div style={{ position: 'absolute', left: -r, top: -r, width: D, height: D, borderRadius: 999, background: warna }} />
      <Img src={staticFile(pose.src)} style={{ position: 'absolute', left: -ax, top: -ay, width: w, height: h, maxWidth: 'none', clipPath: klip }} />
    </div>);
};
