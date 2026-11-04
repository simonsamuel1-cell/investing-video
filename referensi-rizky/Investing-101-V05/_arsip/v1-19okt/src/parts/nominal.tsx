import React from 'react';
import { ARAH, B, F, mixHex } from '../theme';
import { skalaPop } from './kit';

/**
 * NOMINAL — Simon 9 Okt: "bisa ditambahkan nominal yang bertambah atau berkurang agar semakin memperjelas konteks penurunan atau
 * kenaikan harga" (properti, obligasi, reksa dana, saham). Pil putih berbingkai (gaya PilArah): angka BERJALAN mengikuti gerak visualnya
 * (dihitung dari keadaan yang sama, bukan animasi sendiri) + segitiga ▲ hijau / ▼ merah saat nilainya di atas / di bawah acuan.
 * Angka `tabular-nums` + lebar minimum tetap → pil tidak bergoyang saat digitnya berganti.
 */

/** pemisah ribuan titik (format Indonesia) tanpa bergantung locale mesin render */
const ribuan = (n: number) => String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const rpPenuh = (v: number) => `Rp${ribuan(v)}`; // Rp1.180
export const rpJuta = (v: number) => `Rp${ribuan(v)} jt`; // Rp104 jt
export const rpJutaKoma = (v: number) => `Rp${v.toFixed(1).replace('.', ',')} jt`; // Rp4,5 jt
export const rpMiliar = (v: number, des = 1) => `Rp${v.toFixed(des).replace('.', ',')} M`; // Rp1,6 M · Rp1,52 M
export const rpRibu = (v: number) => `Rp${ribuan(v)} rb`; // Rp500 rb
/** tanda + / − di depan (aliran masuk / keluar): "+Rp5 jt", "−Rp48 jt" */
export const tanda = (teks: string, positif: boolean) => `${positif ? '+' : '−'}${teks}`;

/**
 * pil nominal. `arah`: +1 naik (hijau ▲) · −1 turun (merah ▼) · 0 netral (bingkai gelap, tanpa segitiga); boleh pecahan (silang-pudar warna).
 * `jangkar`: titik (x, y) = tengah pil (bawaan) · 'kiri' = tepi kiri pil · 'kanan' = tepi kanan pil.
 */
export const PilNominal: React.FC<{ x: number; y: number; teks: string; arah: number; p: number; size?: number; jangkar?: 'tengah' | 'kiri' | 'kanan'; lebarMin?: number }> =
  ({ x, y, teks, arah, p, size = 30, jangkar = 'tengah', lebarMin = 0 }) => {
    if (p <= 0.001) return null;
    const a = Math.max(-1, Math.min(1, arah));
    const col = a >= 0 ? mixHex(B.night, ARAH.naik, a) : mixHex(B.night, ARAH.turun, -a);
    const tri = Math.abs(a);
    // lebar segitiga mencapai penuh di |arah| 0,1 lalu TETAP (dulu ikut |arah| → pil berganti lebar tiap angka berganti, terukur S07)
    const lebarTri = Math.min(1, tri * 10);
    const geserX = jangkar === 'tengah' ? '-50%' : jangkar === 'kiri' ? '0%' : '-100%';
    const asal = jangkar === 'tengah' ? 'center' : jangkar === 'kiri' ? 'left center' : 'right center';
    return (
      // posisi lewat translate3d (cek 12 Okt): `left/top` pecahan dibulatkan Chrome ke piksel bulat → pil yang bergerak pelan (S08 nilai
      // perusahaan di puncak batang) meloncat 1 px sesekali (lonjakan satu-frame terukur). Matriks identik: T(x,y)·T(geser)·S
      <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate3d(${x}px, ${y}px, 0) translate(${geserX}, -50%) scale(${skalaPop(p)}) rotate(0.001deg)`, transformOrigin: asal, display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: 10 * lebarTri, background: B.white, border: `2.5px solid ${col}`, borderRadius: 999, padding: `${size * 0.36}px ${size * 0.72}px`,
        minWidth: lebarMin, fontFamily: F, fontSize: size, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1, fontVariantNumeric: 'tabular-nums',
        boxShadow: `0 10px 24px -12px ${col}aa` }}>
        {tri > 0.001 ? (
          <svg width={size * 0.72 * lebarTri} height={size * 0.6} viewBox="0 0 22 18" style={{ opacity: tri }}>
            <path d={a > 0 ? 'M11 1 L21 17 L1 17 Z' : 'M11 17 L21 1 L1 1 Z'} fill={col} />
          </svg>) : null}
        {teks}
      </div>);
  };
