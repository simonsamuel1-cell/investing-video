import React from 'react';
import { B, CORET, F, R, lerp, rgba } from '../theme';
import { Icon, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import type { KunciIkon } from '../ikon';

/**
 * KOMPONEN BERSAMA Scene 14–20 (gaya rumah yang sama dengan Scene 03–13): lingkaran ikon berwarna, chip putih bertepi warna, label di bawah ikon,
 * panah putus-putus, gelembung kutipan, dompet tiga jenis uang. Semua posisi lewat translate3d + rotate(0.001deg) (anti patah-patah).
 */
export const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;
/** Simon 14 Okt: "hapus animasi yang tidak diperlukan (animasi yang seperti berdenyut)" → denyut DIMATIKAN di seluruh video (selalu 0). */
export const denyut = (_f: number, _at: number, _a = 0.07) => 0;
export const WARNA_UANG = [B.blue, B.turq, B.orange];
export const NAMA_UANG = ['Uang Aktif', 'Uang Stabil', 'Uang Jangka Panjang'];

/** lingkaran warna + ikon putih (pop berporos di pusat) */
export const Bulat: React.FC<{ x: number; y: number; d: number; warna: string; ikon: KunciIkon; p: number; alfa?: number; ikonAlfa?: number }> = ({ x, y, d, warna, ikon, p, alfa = 1, ikonAlfa = 1 }) =>
  p <= 0.001 ? null : (
    // posisi lewat translate3d + rotasi mikro (bukan left/top): benda yang bergeser pelan (geser bertahap) tidak meloncat 1 px karena pembulatan Chrome
    <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: warna, display: 'grid', placeItems: 'center',
      transformOrigin: 'center', transform: `${geser(x - d / 2, y - d / 2)} scale(${p})`, opacity: alfa < 1 ? alfa : undefined, boxShadow: `0 16px 34px -12px ${warna}aa` }}>
      <Icon name={ikon} size={d * 0.54} color={B.white} style={ikonAlfa < 1 ? { opacity: ikonAlfa } : undefined} />
    </div>);

/** lencana kecil (centang / gembok / silang) di kanan-atas lingkaran */
export const Lencana: React.FC<{ x: number; y: number; d: number; p: number; warna: string; ikon?: KunciIkon; teks?: string; besar?: number }> =
  ({ x, y, d, p, warna, ikon, teks, besar = 64 }) => p <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: x + d * 0.36 - besar / 2, top: y - d * 0.36 - besar / 2, width: besar, height: besar, borderRadius: '50%', background: warna,
      border: `4px solid ${B.white}`, display: 'grid', placeItems: 'center', transform: `scale(${p})`, color: B.white, fontFamily: F, fontSize: besar * 0.55, fontWeight: 800,
      lineHeight: 1, boxShadow: `0 10px 24px -8px ${warna}cc` }}>
      {ikon ? <Icon name={ikon} size={besar * 0.52} color={B.white} /> : teks}
    </div>);

/** label tengah (WordText) — di bawah ikon */
export const Label: React.FC<{ x: number; y: number; teks: string; f: number; at: number; size?: number; warna?: string; lebar?: number; alfa?: number; tebal?: number }> =
  ({ x, y, teks, f, at, size = 32, warna = B.night, lebar = 420, alfa = 1, tebal = 800 }) => f < at - 30 ? null : (
    <div style={{ position: 'absolute', left: 0, top: 0, width: lebar, transform: geser(x - lebar / 2, y - size * 0.6), textAlign: 'center', lineHeight: 1.15, opacity: alfa < 1 ? alfa : undefined }}>
      <WordText halus rataBaris f={f} at={at} style={{ fontFamily: F, fontSize: size, fontWeight: tebal, color: warna }}>{teks}</WordText>
    </div>);

/** chip putih bertepi warna, ikon + teks; `lebar` = lebar seragam rata kiri (Simon 13 Okt); `coret` = coret merah kiri → kanan */
export const Chip: React.FC<{ x: number; y: number; teks: string; ikon?: KunciIkon; warna: string; p: number; lebar?: number; coret?: number; size?: number;
  kosong?: boolean; jangkar?: 'tengah' | 'kiri' }> = ({ x, y, teks, ikon, warna, p, lebar, coret = 0, size = 28, kosong = false, jangkar = 'tengah' }) =>
  p <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(${jangkar === 'tengah' ? '-50%' : '0%'}, -50%) scale(${p})`,
      transformOrigin: jangkar === 'tengah' ? 'center' : 'left center', display: 'flex', alignItems: 'center', justifyContent: lebar ? 'flex-start' : 'center', gap: 10,
      width: lebar, boxSizing: lebar ? 'border-box' : undefined, background: kosong ? rgba(B.white, 0.6) : B.white, border: `2.5px ${kosong ? 'dashed' : 'solid'} ${coret > 0.5 ? CORET : warna}`,
      borderRadius: 999, padding: `${size * 0.4}px ${size * 0.86}px`, fontFamily: F, fontSize: size, fontWeight: 700, color: kosong ? B.grayLite : coret > 0.5 ? CORET : B.night,
      whiteSpace: 'nowrap', lineHeight: 1, boxShadow: kosong ? 'none' : `0 10px 24px -14px ${warna}aa` }}>
      {ikon ? <Icon name={ikon} size={size * 1.08} color={kosong ? B.grayLite : coret > 0.5 ? CORET : warna} /> : null}
      {teks}
      {coret > 0.001 ? <div style={{ position: 'absolute', left: 14, top: '50%', height: 4, width: `calc(${coret} * (100% - 28px))`, background: CORET, borderRadius: 2,
        transform: 'translateY(-50%)' }} /> : null}
    </div>);

/** panah lurus putus-putus (SVG <g>) — g = kemajuan 0…1 */
export const panah = (x0: number, y0: number, x1: number, y1: number, g: number, col: string, key: string, dash = '7 11', tebal = 3) => {
  if (g <= 0.001) return null;
  const ang = Math.atan2(y1 - y0, x1 - x0), hx = lerp(x0, x1, g), hy = lerp(y0, y1, g);
  return (
    <g key={key}>
      <line x1={x0} y1={y0} x2={hx} y2={hy} stroke={col} strokeWidth={tebal} strokeDasharray={dash} strokeLinecap="round" />
      {g > 0.9 ? <path d={`M ${x1} ${y1} l ${-Math.cos(ang - 0.45) * 18} ${-Math.sin(ang - 0.45) * 18} l ${Math.cos(ang - 0.45) * 18 - Math.cos(ang + 0.45) * 18} ${Math.sin(ang - 0.45) * 18 - Math.sin(ang + 0.45) * 18} z`}
        fill={col} opacity={R(g, 0.9, 1, 0, 1)} /> : null}
    </g>);
};

/** gelembung kutipan (VO dikutip di layar): kartu putih + ekor; `coret` = garis coret merah; `sorot` = bingkai warna menyala */
export const Kutipan: React.FC<{ x: number; y: number; teks: string; p: number; warna: string; coret?: number; sorot?: number; size?: number; alfa?: number; ikon?: KunciIkon }> =
  ({ x, y, teks, p, warna, coret = 0, sorot = 0, size = 40, alfa = 1, ikon }) => p <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(-50%, -50%) scale(${p})`, opacity: alfa }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16, background: B.white, borderRadius: 28, padding: `${size * 0.6}px ${size * 0.9}px`,
        border: `3px solid ${rgba(warna, 0.25 + 0.75 * sorot)}`, fontFamily: F, fontSize: size, fontWeight: 800, color: coret > 0.5 ? B.gray : B.night, whiteSpace: 'nowrap',
        lineHeight: 1.1, boxShadow: `0 18px 40px -18px ${rgba(B.night, 0.3)}${sorot > 0.01 ? `, 0 0 0 ${8 * sorot}px ${rgba(warna, 0.12)}` : ''}` }}>
        {ikon ? <Icon name={ikon} size={size * 1.1} color={warna} /> : null}
        “{teks}”
        {coret > 0.001 ? <div style={{ position: 'absolute', left: 24, top: '52%', height: 6, width: `calc(${coret} * (100% - 48px))`, background: CORET, borderRadius: 3 }} /> : null}
        <div style={{ position: 'absolute', left: 60, bottom: -18, width: 0, height: 0, borderLeft: '18px solid transparent', borderRight: '18px solid transparent',
          borderTop: `20px solid ${B.white}` }} />
      </div>
    </div>);

/** dompet jenis uang (lingkaran warna + ikon dompet) + label titik warna di bawahnya */
export const DompetUang: React.FC<{ k: number; x: number; y: number; d: number; p: number; f: number; labelAt: number; alfa?: number; labelPx?: number; label?: boolean; ikonAlfa?: number }> =
  ({ k, x, y, d, p, f, labelAt, alfa = 1, labelPx = 34, label = true, ikonAlfa = 1 }) => p <= 0.001 ? null : (
    <div style={{ position: 'absolute', inset: 0, opacity: alfa < 1 ? alfa : undefined }}>
      <Bulat x={x} y={y} d={d} warna={WARNA_UANG[k]} ikon="dompet" p={p} ikonAlfa={ikonAlfa} />
      {label && f >= labelAt - 30 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(x, y + d / 2 + 38), translate: '-50% -50%', display: 'flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap' }}>
          {/* (15 Okt, pindai hilang-dom) titik warna POP bersama labelnya — dulu skala = pop dompet (sudah 1) → titik muncul penuh seketika di labelAt − 30 */}
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: WARNA_UANG[k], transform: `scale(${Math.min(1, p) * popIn(f, labelAt)})` }} />
          <WordText halus f={f} at={labelAt} style={{ fontFamily: F, fontSize: labelPx, fontWeight: 800, color: B.night }}>{NAMA_UANG[k]}</WordText>
        </div>) : null}
    </div>);
