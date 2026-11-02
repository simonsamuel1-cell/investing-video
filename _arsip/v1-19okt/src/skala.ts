import { createContext } from 'react';
import { BATAS } from './batas';

/**
 * SKALA ADEGAN (pola Video 03, Simon 14 Okt "perbesar visual seluruh video bila bisa, perhatikan spacing"): tiap scene diperbesar SERAGAM
 * terhadap pusat frame (960, 540). Semua 1 sampai scene dibangun & diukur (mode ukur tiap 30f).
 */
export const SKALA: Record<string, number> = { S01: 1, S02: 1, S03: 1, S04: 1, S05: 1, S06: 1, S07: 1, S08: 1 };
const AWAL: [string, number][] = [
  ['S01', 0], ['S02', BATAS.s2], ['S03', BATAS.s3], ['S04', BATAS.s4], ['S05', BATAS.s5], ['S06', BATAS.s6], ['S07', BATAS.s7], ['S08', BATAS.s8],
];
/** skala scene yang aktif pada frame f (dipakai masker untuk tahu skala scene TUJUAN) */
export const skalaPada = (f: number) => {
  let k = 1;
  for (const [sc, a] of AWAL) if (f >= a) k = SKALA[sc];
  return k;
};
/** skala scene yang sedang dirender (disediakan pembungkus adegan di Babak) */
export const KonteksSkala = createContext(1);
/** titik/lingkaran/kotak dalam koordinat scene TUJUAN (skala kTuju) → koordinat lokal scene SEKARANG (skala kKini) */
export const keLokal = <T extends { x: number; y: number; r?: number; w?: number; h?: number; d?: number }>(p: T, kKini: number, kTuju: number): T => {
  const q = kTuju / kKini;
  if (q === 1) return p;
  return {
    ...p, x: 960 + q * (p.x - 960), y: 540 + q * (p.y - 540),
    ...(p.r !== undefined ? { r: p.r * q } : {}), ...(p.w !== undefined ? { w: p.w * q } : {}), ...(p.h !== undefined ? { h: p.h * q } : {}), ...(p.d !== undefined ? { d: p.d * q } : {}),
  };
};
