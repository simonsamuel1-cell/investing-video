import React from 'react';
import { ARAH, B, F, rgba, SISI, bayanganKecil, mixHex } from '../theme';
import { Icon, skalaPop } from './kit';
import { geser } from './umum';
import type { KunciIkon } from '../ikon';

/**
 * PERKAKAS BERSAMA VIDEO 06 (dipakai Scene 02 dst.; Scene 01 memakai salinan lokalnya yang identik).
 * Gaya: piktogram juicy_fish satu warna (dunia dulu = oranye ala lukisan gua), penanda arah harga ▲/▼ (hijau/merah, pengecualian Simon 7 Okt),
 * pembesar "ikon disebut" (resep V05 22 Okt), rumput padang.
 */

/** piktogram tanpa lingkaran: pusat (x, y), pop `p` (linear → easeOutBack), goyang lari `lari` 0…1, pendar `glow` 0…1 */
export const Piktogram: React.FC<{ ikon: KunciIkon; x: number; y: number; s: number; warna: string; p: number; lari?: number; f: number; alfa?: number; glow?: number;
  cermin?: boolean }> = ({ ikon, x, y, s, warna, p, lari = 0, f, alfa = 1, glow = 0, cermin = false }) => p <= 0 || alfa <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: 0, top: 0, width: s, height: s, transformOrigin: 'center',
      transform: `${geser(x - s / 2, y - s / 2 - 10 * lari * Math.abs(Math.sin(f * 0.42)))} scale(${skalaPop(p) * (1 + 0.15 * glow)})${cermin ? ' scaleX(-1)' : ''}`,
      opacity: alfa < 1 ? alfa : undefined, filter: glow > 0.01 ? `drop-shadow(0 0 ${14 * glow}px ${rgba(warna, 0.55)})` : undefined }}>
      <Icon name={ikon} size={s} color={warna} />
    </div>);

/** IKON DISEBUT: diperbesar 12 % berporos di (x, y) */
export const Besar: React.FC<{ x: number; y: number; s: number; children: React.ReactNode }> = ({ x, y, s, children }) => (
  <div style={{ position: 'absolute', inset: 0, transformOrigin: `${x}px ${y}px`, transform: s > 0.001 ? `scale(${1 + 0.12 * s})` : undefined }}>{children}</div>);

/** pendar lingkaran (cincin glow) untuk ikon yang disebut */
export const Pendar: React.FC<{ x: number; y: number; d: number; s: number; warna: string; skala?: number }> = ({ x, y, d, s, warna, skala = 1 }) => s <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: x - d / 2 - 14, top: y - d / 2 - 14, width: d + 28, height: d + 28, borderRadius: '50%',
    boxShadow: `0 0 ${36 * s}px ${10 * s}px ${rgba(warna, 0.22)}`, transform: `scale(${skala})` }} />); // = cincin pendar Scene 01 (tak ikut skala 1,12)

/** penanda arah harga ▲ naik (hijau) / ▼ turun (merah): lingkaran putih + outline, pop di pusat */
export const PanahArah: React.FC<{ x: number; y: number; naik: boolean; p: number; d?: number }> = ({ x, y, naik, p, d = 40 }) => p <= 0 ? null : (
  <div style={{ position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: '50%', background: B.white,
    border: `3px solid ${naik ? ARAH.naik : ARAH.turun}`, boxSizing: 'border-box', display: 'grid', placeItems: 'center', transform: `scale(${skalaPop(p)})`,
    transformOrigin: 'center', color: naik ? ARAH.naik : ARAH.turun, fontSize: d * 0.45, lineHeight: 1, fontFamily: F, fontWeight: 800,
    boxShadow: bayanganKecil(naik ? ARAH.naik : ARAH.turun) }}>{naik ? '▲' : '▼'}</div>);

/** rumput padang: garis tanah + rumpun (lokal panel w × h, garis tanah di `tanah`) */
export const Rumput: React.FC<{ w: number; h: number; tanah: number; alfa?: number }> = ({ w, h, tanah, alfa = 1 }) => {
  const rumpun = Array.from({ length: Math.floor(w / 92) }, (_, k) => 40 + k * 92 + (k % 3) * 14);
  return (
    <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0, opacity: alfa }}>
      <path d={`M 0 ${tanah} L ${w} ${tanah}`} stroke={rgba(B.orange, 0.55)} strokeWidth={4} strokeLinecap="round" />
      <rect x={0} y={tanah} width={w} height={h - tanah} fill={rgba(B.orangeLite, 0.22)} />
      {rumpun.map((x, k) => (
        <path key={k} d={`M ${x} ${tanah} q 4 -34 -10 -54 M ${x + 10} ${tanah} q 2 -44 8 -70 M ${x + 20} ${tanah} q 6 -30 22 -46`} stroke={rgba(B.orange, 0.5)}
          strokeWidth={5} strokeLinecap="round" fill="none" />))}
    </svg>);
};

/** avatar orang umum (lingkaran putih + outline abu + ikon orang) — "orang lain / banyak orang" */
export const Avatar: React.FC<{ x: number; y: number; d: number; p: number; warna?: string }> = ({ x, y, d, p, warna = B.gray }) => p <= 0 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: B.white, border: `${SISI}px solid ${warna}`,
    boxSizing: 'border-box', display: 'grid', placeItems: 'center', transformOrigin: 'center', transform: `${geser(x - d / 2, y - d / 2)} scale(${skalaPop(p)})`,
    boxShadow: bayanganKecil(warna) }}><Icon name="orangLain" size={d * 0.52} color={warna} /></div>);

/** lingkaran ikon yang bisa BERGANTI rona & ikon (tint 60f, aturan 22 Okt sore): ikon lama memudar, ikon baru menebal */
export const BulatTint: React.FC<{ x: number; y: number; d: number; p: number; dari: { warna: string; ikon: KunciIkon }; ke: { warna: string; ikon: KunciIkon };
  t: number }> = ({ x, y, d, p, dari, ke, t }) => {
  if (p <= 0) return null;
  const warna = mixHex(dari.warna, ke.warna, t);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: B.white, border: `${SISI}px solid ${warna}`,
      boxSizing: 'border-box', transformOrigin: 'center', transform: `${geser(x - d / 2, y - d / 2)} scale(${skalaPop(p)})`, boxShadow: bayanganKecil(warna) }}>
      {t < 0.999 ? <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: 1 - t }}><Icon name={dari.ikon} size={d * 0.54} color={warna} /></div> : null}
      {t > 0.001 ? <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: t }}><Icon name={ke.ikon} size={d * 0.54} color={warna} /></div> : null}
    </div>);
};
