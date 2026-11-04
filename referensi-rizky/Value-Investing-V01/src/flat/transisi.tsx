import React from 'react';
import { Easing, Img, staticFile } from 'remotion';
import { R, lerp } from '../theme';
import { lajuIo } from '../parts/kit';

/**
 * TRANSISI PARALAKS (resep Scene 01 purba → kota yang disetujui Simon 26–27 Okt), dipakai ulang:
 *  · Scene 02 → 03 (Simon 27 Okt sore: "gunakan transisi paralax seperti yang ada di scene 1. Bedanya pada transisi ini gunakan pohon dari scene 3") —
 *    pembatas = pohon akasia Hutan.svg (public/flat/s03/pohon.svg).
 * 60 frame berpusat di `pusat`: batas masker + PEMBATAS besar di latar depan bergerak KIRI → KANAN (ease in-out cubic); di kirinya adegan BARU (dimasker)
 * yang isinya bergeser ke kiri 600 → 0 (ease in-out cubic); di kanannya adegan LAMA terdorong ke kanan 0 → 960 (ease in cubic).
 * (30 Okt malam, Simon VI01: "transisi paralaxnya jangan ditambahkan motion blur" — blur DIHAPUS.) Dulu: MOTION BLUR mendatar per lapis sebanding lajunya (σ = laju × 0,25, maks 12 px): adegan lama (puncak 48 px/f), adegan baru (30 px/f), pembatas (104 px/f).
 */
export type Pembatas = { src: string; w: number; h: number; s: number; tiang: number; atas: number };
export const LAMPU_KOTA: Pembatas = { src: 'flat/lampu-kota.svg', w: 51, h: 383, s: 3.3, tiang: 25.35, atas: -4 * 3.3 };
/** pohon akasia 354 × 392 (kanopi 0–160, batang x 199 tegak ke bawah) ×2,9: kanopi menyentuh tepi atas frame, batang melewati tepi bawah */
export const POHON_S03: Pembatas = { src: 'flat/s03/pohon.svg', w: 354, h: 392, s: 2.9, tiang: 199, atas: -36 };

const io3 = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

export const kemajuanParalaks = (f: number, pusat: number) => R(f, pusat - 30, pusat + 30, 0, 1, (x) => x);

export const TransisiParalaks: React.FC<{ f: number; pusat: number; lama: React.ReactNode; baru: React.ReactNode; pembatas: Pembatas }> =
  ({ f, pusat, lama, baru, pembatas: P }) => {
    const tr = kemajuanParalaks(f, pusat);
    if (tr <= 0) return <>{lama}</>;
    if (tr >= 1) return <>{baru}</>;
    const lebarP = P.w * P.s;
    const geserLama = 960 * tr ** 3;
    const geserBaru = 600 * (1 - io3(tr));
    const batas = lerp(-lebarP / 2, 1920 + lebarP / 2, io3(tr));
    return (
      <>
        <div style={{ position: 'absolute', inset: 0, transform: `translate3d(${geserLama}px, 0, 0)` }}>{lama}</div>
        {/* masker adegan baru = semua yang di KIRI batang pembatas (poligon melebar ke kiri melewati layar: isi yang bergeser tetap menutup tepi kiri) */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', clipPath: `polygon(-3000px 0, ${batas}px 0, ${batas}px 1080px, -3000px 1080px)` }}>
          <div style={{ position: 'absolute', inset: 0, transform: `translate3d(${geserBaru}px, 0, 0)` }}>{baru}</div>
        </div>
        <Img src={staticFile(P.src)} style={{ position: 'absolute', left: 0, top: 0, width: lebarP, height: P.h * P.s, maxWidth: 'none',
          transform: `translate3d(${batas - P.tiang * P.s}px, ${P.atas}px, 0)` }} />
      </>);
  };

/**
 * PARALAKS LAMPU LANTAI toko → ruang tamu (2 Nov, Simon: "kamu membangun paralaxnya salah" + contoh `Contoh paralax 1.mp4`). Angka DIUKUR dari contoh
 * (pencocokan geser per lapis tiap frame, sisa < 1 px): ketiga lapis memakai SATU kurva = ease rumah Simon bezier(0,40 · 0 · 0,40 · 1), 60 f.
 *  · adegan LAMA (toko) terdorong ke kanan 0 → +1085 px (tidak pernah memperlihatkan celah: dunia toko memanjang jauh ke kiri);
 *  · adegan BARU (ruang tamu) MENGISI SELURUH bagian kiri batas, isinya bergeser −458 → 0 (lapis paling lambat);
 *  · PEMBATAS = LAMPU JALAN oranye (2 Nov, Simon: "ganti saja lampu yang digunakan untuk transisi paralax dengan lampu jalan" — percobaan pertama memakai
 *    salinan lampu lantai ungu ruang tamu ×1,5 seperti contoh, LAMPU_LANTAI di bawah, tidak dipakai lagi); tiangnya = batas masker, melintas
 *    −361 → 2046 (lapis tercepat, lintasan terukur dari contoh). Tanpa motion blur (Simon 30 Okt).
 * Dulu (TransisiParalaks): isi baru bergeser +600 di dalam masker → di kiri pita ruang tamu toko masih terlihat; pembatas = lampu jalan kota (sudah tidak
 * ada di adegan mana pun); toko hampir diam (ease-in kubik).
 */
export const LAMPU_LANTAI = { src: 'flat/ruang/lampu-lantai.svg', w: 330, h: 760, x0: 180, y0: 60, tiang: 282.95, atasTiang: 137, s: 1.5, yTiang: 62 };
const easeSimon = Easing.bezier(0.4, 0, 0.4, 1);
export const ParalaksLampu: React.FC<{ f: number; pusat: number; lama: React.ReactNode; baru: React.ReactNode; pembatas?: Pembatas }> =
  ({ f, pusat, lama, baru, pembatas: P = LAMPU_KOTA }) => {
  const tr = kemajuanParalaks(f, pusat);
  if (tr <= 0) return <>{lama}</>;
  if (tr >= 1) return <>{baru}</>;
  const e = easeSimon(tr);
  const tiang = lerp(-361, 2046, e);
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, transform: `translate3d(${(1085 * e).toFixed(2)}px, 0, 0) rotate(0.001deg)` }}>{lama}</div>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', clipPath: `polygon(-3000px 0, ${tiang.toFixed(2)}px 0, ${tiang.toFixed(2)}px 1080px, -3000px 1080px)` }}>
        <div style={{ position: 'absolute', inset: 0, transform: `translate3d(${(-458 * (1 - e)).toFixed(2)}px, 0, 0) rotate(0.001deg)` }}>{baru}</div>
      </div>
      <Img src={staticFile(P.src)} style={{ position: 'absolute', left: 0, top: 0, width: P.w * P.s, height: P.h * P.s, maxWidth: 'none',
        transform: `translate3d(${(tiang - P.tiang * P.s).toFixed(2)}px, ${P.atas}px, 0) rotate(0.001deg)` }} />
    </>);
};

/**
 * SAPUAN LEMBUT dulu → sekarang (Simon 27 Okt sore: "transisi dari dulu ke sekarang tidak perlu paralax, karena yang berubah cuman background dan
 * bajunya" + sebelumnya "tambahkan motion blur ketika transisi mengubah backgroundnya agar tidak terlihat seperti patahan"): tokoh & latar DIAM; batas
 * sapuan bergerak kiri → kanan 60 f inOut cubic, di kirinya adegan BARU. Tepi batas = gradasi selebar 60 px + 360 px × laju relatif (motion blur tepi:
 * paling lebar di tengah sapuan, tajam di awal/akhir) — dulu tepi keras + garis putih 8 px.
 */
export const SapuanLembut: React.FC<{ f: number; pusat: number; lama: React.ReactNode; baru: React.ReactNode }> = ({ f, pusat, lama, baru }) => {
  const tr = R(f, pusat - 30, pusat + 30, 0, 1, (x) => x);
  if (tr <= 0) return <>{lama}</>;
  if (tr >= 1) return <>{baru}</>;
  const lebar = 60 + 360 * lajuIo(tr);
  const batas = lerp(-lebar, 1920 + lebar, io3(tr));
  const gradasi = `linear-gradient(to right, #000 ${(batas - lebar / 2).toFixed(1)}px, transparent ${(batas + lebar / 2).toFixed(1)}px)`;
  return (
    <>
      {lama}
      <div style={{ position: 'absolute', inset: 0, WebkitMaskImage: gradasi, maskImage: gradasi }}>{baru}</div>
    </>);
};
