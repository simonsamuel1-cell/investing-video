import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BATAS } from '../batas';
import { R, io, lerp } from '../theme';
import { Scene04, S04_AWAL, S04_KELUAR, S04_T, kebX } from '../s04/Scene04';
import { CakramDarat, type Masuk } from '../parts/kaca';
import { CINCIN_JARAK, simpulLuar } from '../parts/infografis';
import { Uang } from '../parts/nyata';

/**
 * REVISI SCENE 04 (14 Okt, evaluasi 5 pertanyaan). Tata letak infografis TETAP (arahan Simon 13 Okt: "posisinya sudah benar") — yang
 * ditambahkan KEJADIANNYA: saat tiap kebutuhan disebut, uang mengalir dari cakram Uang Aktif menyusuri garisnya ke kebutuhan itu;
 * "saat dibutuhkan, uangnya harus tersedia" → kelima kebutuhan menerima uang sekaligus, cepat (uangnya ada saat diminta).
 * Geometri = Scene04 (simpul y 334 · jarak 310 · cakram (960, 836) Ø240 · titik cincin −155° … −25°).
 */
const S = S04_T;
const SUDUT = [0, 1, 2, 3, 4].map((i) => ((-155 + 32.5 * i) * Math.PI) / 180);
const ujungY = (i: number) => 334 + simpulLuar(172) + 18 + (i === 4 ? 2 : 1) * 34.5 + 16;
const HUB = { x: 960, y: 836, r: 120 + CINCIN_JARAK };

/** uang kecil menyusuri garis kebutuhan ke-i, `t` 0…1 */
const UangJalan: React.FC<{ i: number; t: number; f: number; w?: number }> = ({ i, t, f, w = 86 }) => {
  if (t <= 0.001 || t >= 0.999) return null;
  const sx = HUB.x + Math.cos(SUDUT[i]) * HUB.r, sy = HUB.y + Math.sin(SUDUT[i]) * HUB.r;
  const x = lerp(sx, kebX(i, f), t), y = lerp(sy, ujungY(i), t);
  return <Uang x={x} y={y} w={w} alfa={R(t, 0, 0.12, 0, 1) * R(t, 0.8, 1, 1, 0)} />;
};

/** MASUK (revisi 14 Okt): masker Scene 03 mendarat di dompet Uang Aktif tempat Scene04 mengambil alih (titik & rupa sama) */
export const RS04_MASUK: Masuk = { x: S04_AWAL.x, y: S04_AWAL.y, r: S04_AWAL.d / 2, warna: S04_AWAL.warna, mulai: BATAS.s4 - 20 };

export const RS04: React.FC<{ f: number }> = ({ f }) => {
  // Scene04 tetap dirender sampai keluarnya selesai (S04_KELUAR + 60, milik Scene 05); cakram Uang Aktif diambil alih RS05 di batas s5
  if (f < BATAS.s4 || f >= S04_KELUAR + 60) return null;
  return (
    <AbsoluteFill>
      <Scene04 f={f} />
      {/* cakram pendaratan masker Scene 03 menutup dompet lalu memudar 20f — ikon dompet tidak muncul mendadak */}
      <CakramDarat f={f} ke={RS04_MASUK} />
      {/* tiap kebutuhan disebut → uang mengalir ke sana (sesudah garisnya selesai tergambar) */}
      {S.kebutuhan.map((at, i) => <UangJalan key={i} i={i} f={f} t={R(f, at + 14, at + 74, 0, 1, io)} />)}
      {/* "saat DIBUTUHKAN, uangnya harus tersedia" → kelima kebutuhan menerima uang sekaligus, cepat */}
      {[0, 1, 2, 3, 4].map((i) => <UangJalan key={`s${i}`} i={i} f={f} t={R(f, S.dompetDenyut - 30, S.dompetDenyut + 10, 0, 1, io)} w={74} />)}
    </AbsoluteFill>);
};
