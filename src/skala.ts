import { createContext } from 'react';
import { BATAS } from './batas';

/**
 * SKALA ADEGAN (Simon 14 Okt: "cek seluruh video, jika ada visual yang bisa diperbesar (secara keseluruhan scene, seperti di scene 6) perbesar saja.
 * perhatikan spacingnya"). Tiap scene diperbesar SERAGAM terhadap pusat frame (960, 540) → jarak antarbenda ikut membesar sebanding.
 * Faktor = ruang aman tersisa, diukur dari mode ukur tiap 30f seluruh video (isi tetap di x 96–1824, di bawah judul y 200, di atas subtitle y 950):
 * S05 1,09 · S08 1,11 · S12 1,21 · S13 1,23 (stabil) · S15 1,06 · S19 1,08; scene lain sudah ≤ 1,03 (sudah mengisi area aman) → tetap 1.
 * S19 dibatasi 1,04 (bukan 1,08): pada 1,08 tabel tiga baris menempel tepi aman kiri-kanan dan jarak baris bawah ke subtitle tinggal ±45 px.
 * Judul (TEXT naskah) TIDAK ikut membesar (Judul membalik skala lewat KonteksSkala); watermark & subtitle di luar adegan.
 */
export const SKALA: Record<string, number> = {
  S01: 1, S02: 1, S03: 1, S04: 1, S05: 1.08, S06: 1, S07: 1, S08: 1.1, S09: 1, S10: 1,
  S11: 1, S12: 1.18, S13: 1.15, S14: 1, S15: 1.06, S16: 1, S17: 1, S18: 1, S19: 1.04, S20: 1,
};
const AWAL: [string, number][] = [
  ['S01', 0], ['S02', BATAS.s2], ['S03', BATAS.s3], ['S04', BATAS.s4], ['S05', BATAS.s5], ['S06', BATAS.s6], ['S07', BATAS.s7], ['S08', BATAS.s8],
  ['S09', BATAS.s9], ['S10', BATAS.s10], ['S11', BATAS.s11], ['S12', BATAS.s12], ['S13', BATAS.s13], ['S14', BATAS.s14], ['S15', BATAS.s15],
  ['S16', BATAS.s16], ['S17', BATAS.s17], ['S18', BATAS.s18], ['S19', BATAS.s19], ['S20', BATAS.s20],
];
/** skala scene yang aktif pada frame f (dipakai masker untuk tahu skala scene TUJUAN) */
export const skalaPada = (f: number) => {
  let k = 1;
  for (const [sc, a] of AWAL) if (f >= a) k = SKALA[sc];
  return k;
};
/** skala scene yang sedang dirender (disediakan pembungkus adegan di Babak) */
export const KonteksSkala = createContext(1);
/** titik/lingkaran/kotak dalam koordinat scene TUJUAN (skala kTuju) → koordinat lokal scene SEKARANG (skala kKini), supaya mendarat di titik layar yang sama */
export const keLokal = <T extends { x: number; y: number; r?: number; w?: number; h?: number; d?: number }>(p: T, kKini: number, kTuju: number): T => {
  const q = kTuju / kKini;
  if (q === 1) return p;
  return {
    ...p, x: 960 + q * (p.x - 960), y: 540 + q * (p.y - 540),
    ...(p.r !== undefined ? { r: p.r * q } : {}), ...(p.w !== undefined ? { w: p.w * q } : {}), ...(p.h !== undefined ? { h: p.h * q } : {}), ...(p.d !== undefined ? { d: p.d * q } : {}),
  };
};
