import React, { useContext } from 'react';
import { KonteksKamera } from '../skala';
import { B, R, io } from '../theme';
import { Backdrop } from './Backdrop';
import { CAKRAM_R, cakramPenuh, rCakram } from './waktuTransisi';

/**
 * TRANSISI BENTUK (port V06 — resep ST-02 yang Simon setujui 27–28 Okt, reference_transisi_lingkaran_kotak_st02):
 *  · TIGA CAKRAM dari satu titik: cakram turkis · turkis muda (selang 3 f, 60 f inOut cubic) lalu cakram ketiga = MASKER berisi latar rona baru + isi baru.
 *  · BILAH NAIK: dua bilah layar penuh (turkis · turkis muda, selang 16 f) naik 60 f, lalu latar rona baru + isi baru naik menutupnya (+30 f);
 *    adegan lama ikut terdorong naik 320 px ease-in (Simon 27 Okt 17.20: "tidak sampai keluar frame").
 * Masker = transform (bukan clip-path yang dianimasikan — reference_masker_transform). Rona latar global berganti SEKETIKA sesudah tertutup (plan.ts).
 */

/** masker lingkaran (transform): lingkaran berpusat (cx, cy) bergaris tengah d — isi = layar penuh (koordinat layar) */
export const MaskerBulat: React.FC<{ cx: number; cy: number; d: number; children: React.ReactNode }> = ({ cx, cy, d, children }) => {
  const D = 2400, s = Math.max(1e-4, d / D);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: D, height: D, borderRadius: '50%', overflow: 'hidden', transformOrigin: 'center',
      transform: `translate3d(${cx - D / 2}px, ${cy - D / 2}px, 0) scale(${s})` }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0',
        transform: `translate(${D / 2}px, ${D / 2}px) scale(${1 / s}) translate(${-cx}px, ${-cy}px)` }}>{children}</div>
    </div>);
};

export { cakramPenuh, cakramTutup, bilahPenuh } from './waktuTransisi';
export const TigaCakram: React.FC<{ f: number; mulai: number; x?: number; y?: number; hue: string; children?: React.ReactNode }> =
  ({ f, mulai, x = 960, y = 540, hue, children }) => {
    const kam = useContext(KonteksKamera);
    if (f < mulai || f >= cakramPenuh(mulai)) return null;
    const r2 = rCakram(f, mulai, 2);
    return (
      <>
        {[B.turq, B.turqLite].map((w, k) => {
          const r = rCakram(f, mulai, k);
          return r > 0.5 ? <div key={k} style={{ position: 'absolute', left: 0, top: 0, width: 2 * CAKRAM_R, height: 2 * CAKRAM_R, borderRadius: '50%', background: w,
            transformOrigin: 'center', transform: `translate3d(${x - CAKRAM_R}px, ${y - CAKRAM_R}px, 0) scale(${r / CAKRAM_R})` }} /> : null;
        })}
        {/* latar baru dibalik geser kamera (2 Nov, kamera +40): sebidang dengan latar global, tanpa pita kosong di tepi atas */}
        {r2 > 0.5 ? <MaskerBulat cx={x} cy={y} d={2 * r2}><div style={{ position: 'absolute', inset: 0, transform: `translate3d(${-kam.x}px, ${-kam.y}px, 0)` }}><Backdrop f={f} hue={hue} /></div>{children}</MaskerBulat> : null}
      </>);
  };

/** BILAH NAIK: posisi y bilah ke-k (0, 1) — 1080 → 0 dalam 60 f inOut cubic, selang 16 f; lapisan baru (latar + isi) naik di mulai + 30 */
const yBilah = (f: number, mulai: number, k: number) => R(f, mulai + 16 * k, mulai + 16 * k + 60, 1080, 0, io);
export const yBilahBaru = (f: number, mulai: number) => R(f, mulai + 30, mulai + 90, 1080, 0, io);
/** adegan lama terdorong naik 320 px ease-in (selama bilah pertama naik) */
export const dorongLama = (f: number, mulai: number) => -320 * R(f, mulai, mulai + 60, 0, 1, (t) => t * t * t);
/** isi baru IKUT NAIK bersama latarnya (V06 S09 "naikPadang") */
export const BilahNaik: React.FC<{ f: number; mulai: number; hue: string; children?: React.ReactNode }> = ({ f, mulai, hue, children }) => {
  const kam = useContext(KonteksKamera); // bilah & latar = LAYAR penuh → balik geser kamera (2 Nov, kamera +40); isi tetap di koordinat papan
  if (f < mulai || f >= mulai + 90) return null;
  const yBaru = yBilahBaru(f, mulai);
  return (
    <>
      {[B.turq, B.turqLite].map((w, k) => <div key={k} style={{ position: 'absolute', inset: 0, background: w, transform: `translate3d(${-kam.x}px, ${yBilah(f, mulai, k) - kam.y}px, 0)` }} />)}
      {yBaru < 1079.5 ? (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', transform: `translate3d(${-kam.x}px, ${yBaru - kam.y}px, 0)` }}>
          <Backdrop f={f} hue={hue} />
          <div style={{ position: 'absolute', inset: 0, transform: `translate3d(${kam.x}px, ${kam.y}px, 0)` }}>{children}</div>
        </div>) : null}
    </>);
};
