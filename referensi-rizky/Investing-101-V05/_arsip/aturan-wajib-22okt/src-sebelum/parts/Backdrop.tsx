import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ramp } from '../core/motion';
import { HUES } from '../plan';
import { mixHex } from '../theme';

/**
 * LATAR = VIDEO 04 (Simon 22 Okt: "Revisi untuk seluruh video samakan warna backgroundnya dengan video 4 yang aku kirimkan kemarin").
 * Terukur dari render `Investing 101_Video 04 - Investasi yang Cocok_Dub Indo.mp4` (21 frame, median):
 *   · DASAR: abu netral rata #F5F5F5 — sama di keempat sudut & tengah (tanpa gradien sudut, tanpa bola blur, tanpa rona per scene).
 *   · KISI: garis 2 px abu kebiruan (puncak ≈ rgb 209,209,213), petak 84 px; pekat penuh di blok tengah, memudar elips ke tepi
 *     (pusat ±960,518 · rx 1100 · ry 640 · pekat s/d 44 %), lalu terpotong di atas pita subtitle (habis di y ±1000).
 * Latar lama (rona V02/V03 + sudut diagonal + kisi putih) diarsip di _arsip/relayout-22okt/sebelum-latar-v04/Backdrop.tsx.
 */
export const LATAR = '#F5F5F5';
export const KISI = { petak: 84, garis: 2, warna: '#D1D1D5', cx: 960, cy: 518, rx: 1100, ry: 640, padat: 0.44, bawah: [970, 1000] as const };

/** rona rumah (sisa sistem rona lama) — masih dibaca MaskerKeluar; latar kini satu warna, jadi nilainya tak lagi mengubah tampilan */
export const hueAt = (f: number) => {
  let hue = HUES[0].hue;
  for (let i = 1; i < HUES.length; i++) hue = HUES[i].instan ? (f >= HUES[i].at ? HUES[i].hue : hue) : mixHex(hue, HUES[i].hue, ramp(f, HUES[i].at));
  return hue;
};

/** `f`/`hue` dipertahankan supaya pemanggil lama (Babak, MaskerKeluar, Uji-Latar) tetap jalan — latar V04 diam & sama di seluruh video */
export const Backdrop: React.FC<{ f: number; hue?: string }> = () => {
  // garis kisi lewat pusat layar: offset = sisa 960 / 540 terhadap petak
  const ox = 960 % KISI.petak - KISI.garis / 2, oy = 540 % KISI.petak - KISI.garis / 2;
  const masker = `radial-gradient(${KISI.rx}px ${KISI.ry}px at ${KISI.cx}px ${KISI.cy}px, #000 ${KISI.padat * 100}%, transparent 100%)`;
  const bawah = `linear-gradient(to bottom, #000 ${KISI.bawah[0]}px, transparent ${KISI.bawah[1]}px)`;
  return (
    <AbsoluteFill style={{ background: LATAR }}>
      {/* dua masker bertingkat = dikalikan: elips memudar ke tepi × potong di atas subtitle */}
      <AbsoluteFill style={{ WebkitMaskImage: bawah, maskImage: bawah }}>
        <AbsoluteFill style={{
          backgroundImage: `linear-gradient(to right, ${KISI.warna} ${KISI.garis}px, transparent ${KISI.garis}px), linear-gradient(to bottom, ${KISI.warna} ${KISI.garis}px, transparent ${KISI.garis}px)`,
          backgroundSize: `${KISI.petak}px ${KISI.petak}px`,
          backgroundPosition: `${ox}px ${oy}px`,
          WebkitMaskImage: masker, maskImage: masker,
        }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
