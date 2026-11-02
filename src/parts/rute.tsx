import React from 'react';
import { Img, staticFile } from 'remotion';
import { ARAH, B, F, mixHex, rgba } from '../theme';
import { Icon } from './kit';
import type { KunciIkon } from '../ikon';
import { bayanganKaca, geser, HALUS3D } from './kaca';
import { FOTO } from './nyata';

/**
 * ALUR "KOTAK MASUK" (Simon 14 Okt, acuan inbox → kartu tujuan → ikon): daftar uang di kiri, tiap baris dialirkan lewat panah melengkung
 * berwarna ke kartu kebutuhannya, lalu ke ikon tujuan. Dipakai pembuka Scene 02 & 03. Semua posisi lewat translate3d + rotasi mikro.
 */

/* ═════════ DAFTAR (kartu bergaya inbox) ═════════ */
export const DAFTAR = { kepala: 84, baris: 92, bawah: 22 };
export type BarisDaftar = {
  judul: string; ket: string; tag: string;
  /** warna titik (abu sebelum dikelompokkan → warna kelompok) */ warna: string;
  /** 0…1 muncul (geser masuk + pudar) */ p: number;
  /** posisi slot pecahan (urutan baris; berubah halus saat diurutkan) */ slot: number;
  /** 0…1 sorot baris (latar berona warna titik) */ sorot?: number;
  /** 0…1 tag waktu muncul */ tagP?: number;
};
/** tinggi kartu untuk n baris (pecahan saat baris bertambah) */
export const tinggiDaftar = (n: number, baris = DAFTAR.baris) => DAFTAR.kepala + n * baris + DAFTAR.bawah;
/** titik kanan baris ke-slot (untuk pangkal panah), kartu berpusat (x, y) */
export const ujungBaris = (x: number, y: number, w: number, h: number, slot: number, baris = DAFTAR.baris): [number, number] =>
  [x + w / 2, y - h / 2 + DAFTAR.kepala + (slot + 0.5) * baris];

export const DaftarUang: React.FC<{ x: number; y: number; w: number; h: number; p: number; judul: string; ikon: KunciIkon; rows: BarisDaftar[];
  baris?: number; alfa?: number; lebarTag?: number; isiAlfa?: number }> = ({ x, y, w, h, p, judul, ikon, rows, baris = DAFTAR.baris, alfa = 1, lebarTag = 186, isiAlfa = 1 }) => {
  if (p <= 0.001 || alfa <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: 'center', transform: `${geser(x - w / 2, y - h / 2)} scale(${p})${HALUS3D}`,
      borderRadius: 30, background: `linear-gradient(165deg, ${rgba(B.white, 0.98)}, ${rgba(B.white, 0.9)})`, boxShadow: bayanganKaca(B.blue, 0.8), fontFamily: F,
      opacity: alfa < 1 ? alfa : undefined }}>
      {/* kepala: ikon + judul (acuan "Inbox") */}
      <div style={{ position: 'absolute', left: 30, top: 0, height: DAFTAR.kepala, display: 'flex', alignItems: 'center', gap: 14, opacity: isiAlfa < 1 ? isiAlfa : undefined }}>
        <Icon name={ikon} size={34} color={B.night} />
        <span style={{ fontSize: 30, fontWeight: 800, color: B.night }}>{judul}</span>
      </div>
      <div style={{ position: 'absolute', left: 24, right: 24, top: DAFTAR.kepala - 2, height: 2, background: rgba(B.night, 0.07), opacity: isiAlfa < 1 ? isiAlfa : undefined }} />
      {rows.map((r) => {
        if (r.p <= 0.001) return null;
        const top = DAFTAR.kepala + r.slot * baris;
        const sorot = r.sorot ?? 0;
        return (
          // (15 Okt, pindai piksel f2581–2634) posisi baris lewat transform sub-piksel — dulu `top` pecahan saat diurutkan: Chrome membulatkan teks ke piksel
          // bulat → langkah tegak tak rata (−0,15 · −0,78 · −1,43 · −0,88 px/frame, terukur)
          <div key={r.judul} style={{ position: 'absolute', left: 14, right: 14, top: 0, height: baris - 12, borderRadius: 18,
            background: sorot > 0.001 ? rgba(r.warna, 0.1 * sorot) : undefined, opacity: Math.min(0.9999, r.p), transform: `translate3d(${-24 * (1 - r.p)}px, ${top + 6}px, 0) rotate(0.001deg)` }}>
            {/* kotak centang (acuan) + titik warna */}
            <div style={{ position: 'absolute', left: 16, top: '50%', width: 24, height: 24, marginTop: -12, borderRadius: 7, border: `2.5px solid ${rgba(B.night, 0.22)}`,
              boxSizing: 'border-box' }} />
            <div style={{ position: 'absolute', left: 56, top: '50%', width: 20, height: 20, marginTop: -10, borderRadius: '50%', background: r.warna }} />
            <div style={{ position: 'absolute', left: 92, top: '50%', transform: 'translateY(-50%)', lineHeight: 1.15, whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: baris >= 98 ? 28 : baris >= 80 ? 26 : 24, fontWeight: 800, color: B.night }}>{r.judul}</div>
              <div style={{ fontSize: baris >= 98 ? 23 : baris >= 80 ? 21 : 20, fontWeight: 700, color: B.gray, fontVariantNumeric: 'tabular-nums' }}>{r.ket}</div>
            </div>
            {/* waktu pakai (acuan: jam di kanan baris) — kolom selebar tetap, RATA KIRI: ikon kalender tiap baris sejajar satu garis (Simon 14 Okt) */}
            {(r.tagP ?? 1) > 0.001 ? (
              <div style={{ position: 'absolute', right: 16, width: lebarTag, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 8, whiteSpace: 'nowrap',
                fontSize: baris >= 98 ? 22 : baris >= 80 ? 21 : 20, fontWeight: 800, color: mixHex(B.gray, r.warna === B.grayLite ? B.gray : r.warna, sorot), opacity: Math.min(0.9999, r.tagP ?? 1) }}>
                <Icon name="kalender" size={baris >= 80 ? 24 : 22} color={mixHex(B.gray, r.warna === B.grayLite ? B.gray : r.warna, sorot)} />{r.tag}
              </div>) : null}
          </div>);
      })}
    </div>);
};

/* ═════════ PANAH MELENGKUNG (acuan) ═════════ */
/** garis lengkung kubik dari (x0,y0) → (x1,y1), garis singgung mendatar di kedua ujung; g 0…1 = sapuan.
 *  Simon 14 Okt "hapus panahnya": TANPA kepala panah (dulu chevron di ujung) — ujung garis membulat menempel kartu tujuan. */
export const Rute: React.FC<{ x0: number; y0: number; x1: number; y1: number; g: number; warna: string; tebal?: number; alfa?: number }> =
  ({ x0, y0, x1, y1, g, warna, tebal = 5, alfa = 1 }) => {
    if (g <= 0.001 || alfa <= 0.001) return null;
    const dx = (x1 - x0) * 0.55;
    const d = `M ${x0} ${y0} C ${x0 + dx} ${y0} ${x1 - dx} ${y1} ${x1} ${y1}`;
    return (
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: alfa < 1 ? alfa : undefined }}>
        <circle cx={x0} cy={y0} r={7} fill={warna} opacity={Math.min(1, g * 4)} />
        <path d={d} fill="none" stroke={warna} strokeWidth={tebal} strokeLinecap="round" pathLength={1000} strokeDasharray={`${1000 * g} 1000`} />
      </svg>);
  };
/** titik pada lengkung rute di t 0…1 (untuk uang yang berjalan di atas panah) */
export const titikRute = (x0: number, y0: number, x1: number, y1: number, t: number): [number, number] => {
  const dx = (x1 - x0) * 0.55, u = 1 - t;
  const bx = u * u * u * x0 + 3 * u * u * t * (x0 + dx) + 3 * u * t * t * (x1 - dx) + t * t * t * x1;
  const by = u * u * u * y0 + 3 * u * u * t * y0 + 3 * u * t * t * y1 + t * t * t * y1;
  return [bx, by];
};

/* ═════════ KARTU TUJUAN (acuan: kartu bertab warna + ikon/foto + teks + centang) ═════════ */
export const KartuRute: React.FC<{ x: number; y: number; w: number; h: number; p: number; warna: string; judul: string; ket: string; foto?: keyof typeof FOTO;
  ikon?: KunciIkon; centang?: number; alfa?: number }> = ({ x, y, w, h, p, warna, judul, ket, foto, ikon, centang = 0, alfa = 1 }) => {
  if (p <= 0.001 || alfa <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: 'center', transform: `${geser(x - w / 2, y - h / 2)} scale(${p})${HALUS3D}`,
      borderRadius: 26, background: `linear-gradient(165deg, ${rgba(B.white, 0.98)}, ${rgba(B.white, 0.9)})`, boxShadow: bayanganKaca(warna, 0.9), fontFamily: F,
      opacity: alfa < 1 ? alfa : undefined, overflow: 'visible' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 12, background: warna, borderRadius: '26px 0 0 26px' }} />
      <div style={{ position: 'absolute', left: 34, top: 0, bottom: 0, width: h - 30, display: 'grid', placeItems: 'center' }}>
        {foto ? <Img src={staticFile(FOTO[foto].src)} style={{ maxWidth: h - 30, maxHeight: h - 34, objectFit: 'contain' }} />
          : ikon ? <div style={{ width: h - 50, height: h - 50, borderRadius: '50%', background: warna, display: 'grid', placeItems: 'center' }}><Icon name={ikon} size={(h - 50) * 0.55} color={B.white} /></div> : null}
      </div>
      <div style={{ position: 'absolute', left: 34 + (h - 30) + 16, top: '50%', transform: 'translateY(-50%)', lineHeight: 1.15, whiteSpace: 'nowrap' }}>
        <div style={{ fontSize: h >= 160 ? 32 : 28, fontWeight: 800, color: B.night }}>{judul}</div>
        <div style={{ fontSize: h >= 160 ? 24 : 22, fontWeight: 700, color: B.gray }}>{ket}</div>
      </div>
      {centang > 0.001 ? (
        <div style={{ position: 'absolute', right: 20, top: '50%', width: 52, height: 52, marginTop: -26, borderRadius: '50%', background: ARAH.naik, display: 'grid',
          placeItems: 'center', transform: `scale(${centang})`, boxShadow: `0 8px 18px -8px ${ARAH.naik}` }}>
          <Icon name="tersedia" size={30} color={B.white} />
        </div>) : null}
    </div>);
};
