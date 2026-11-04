import React from 'react';
import { AbsoluteFill } from 'remotion';
import { F } from '../theme';

/**
 * GARIS BANTU ALIGNMENT (Simon 27 Okt sore: "Buat garis bantu/guide yang detail untuk mengatur alignment semua visualnya, agar alignmentnya
 * tidak berantakan"). Lapisan teratas, HANYA tampil di komposisi `KesalahanInvestor-Guide` atau input `{ "guide": true }` — tidak ikut render final.
 *  · magenta  = sumbu tengah: x 960 · y 497 (pusat isi di atas pita subtitle, aturan V05) · y 540 putus-putus (pusat bingkai)
 *  · biru     = area aman 96 / 54 px + 12 kolom (talang 24) di antara x 96–1824 + baris tiap 1/6 tinggi area isi
 *  · oranye   = zona terlarang: logo (x ≥ 1464, y ≤ 204) dan pita subtitle (y ≥ 925, mulai pudar foto)
 *  · hijau    = garis kolom kustom per scene (`KOLOM`), mis. tepi kiri kartu S01 x 300
 */
export const AMAN = { x: 96, y: 54 };
export const ZONA = { logoX: 1464, logoY: 204, subY: 925, pusatY: 497 };
const KOL = { n: 12, talang: 24 };
const lebarKol = (1920 - 2 * AMAN.x - (KOL.n - 1) * KOL.talang) / KOL.n;
/** garis kolom kustom (x) yang dipakai lebih dari satu benda — tambahkan saat menata scene */
export const KOLOM: { x: number; ket: string }[] = [
  { x: 300, ket: 'S01 tepi kiri kartu' },
  { x: 1200, ket: 'S01 tepi kanan kartu · S01 F lingkaran Dulu' },
  { x: 720, ket: 'S01 F otak' },
];

const Teks: React.FC<{ x: number; y: number; warna: string; children: React.ReactNode; kanan?: boolean }> = ({ x, y, warna, children, kanan }) => (
  <div style={{ position: 'absolute', left: kanan ? undefined : x + 4, right: kanan ? 1920 - x + 4 : undefined, top: y + 2, fontFamily: F, fontSize: 13,
    fontWeight: 700, color: warna, background: 'rgba(255,255,255,.75)', padding: '0 3px', borderRadius: 3, whiteSpace: 'nowrap' }}>{children}</div>);

export const Guide: React.FC = () => {
  const kolom = Array.from({ length: KOL.n }, (_, i) => AMAN.x + i * (lebarKol + KOL.talang));
  const isiAtas = ZONA.logoY, isiBawah = ZONA.subY;
  const baris = Array.from({ length: 5 }, (_, i) => isiAtas + ((i + 1) * (isiBawah - isiAtas)) / 6);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 5 }}>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
        {/* zona terlarang */}
        <rect x={ZONA.logoX} y={0} width={1920 - ZONA.logoX} height={ZONA.logoY} fill="rgba(228,156,44,.10)" stroke="#E49C2C" strokeWidth={2} strokeDasharray="8 6" />
        <rect x={0} y={ZONA.subY} width={1920} height={1080 - ZONA.subY} fill="rgba(228,156,44,.10)" stroke="#E49C2C" strokeWidth={2} strokeDasharray="8 6" />
        {/* 12 kolom */}
        {kolom.map((x, i) => <rect key={i} x={x} y={AMAN.y} width={lebarKol} height={1080 - 2 * AMAN.y} fill="rgba(92,200,227,.06)" stroke="rgba(92,200,227,.55)" strokeWidth={1} />)}
        {/* baris area isi (204–925) */}
        {baris.map((y, i) => <line key={i} x1={AMAN.x} x2={1920 - AMAN.x} y1={y} y2={y} stroke="rgba(92,200,227,.55)" strokeWidth={1} />)}
        {/* area aman */}
        <rect x={AMAN.x} y={AMAN.y} width={1920 - 2 * AMAN.x} height={1080 - 2 * AMAN.y} fill="none" stroke="#2E7FD8" strokeWidth={2} />
        {/* sumbu tengah */}
        <line x1={960} x2={960} y1={0} y2={1080} stroke="#E0249A" strokeWidth={2} />
        <line x1={0} x2={1920} y1={ZONA.pusatY} y2={ZONA.pusatY} stroke="#E0249A" strokeWidth={2} />
        <line x1={0} x2={1920} y1={540} y2={540} stroke="#E0249A" strokeWidth={1.5} strokeDasharray="10 8" />
        {/* kolom kustom */}
        {KOLOM.map((k) => <line key={k.x} x1={k.x} x2={k.x} y1={AMAN.y} y2={1080 - AMAN.y} stroke="#22B573" strokeWidth={1.5} strokeDasharray="4 4" />)}
      </svg>
      <Teks x={960} y={AMAN.y} warna="#E0249A">x 960</Teks>
      <Teks x={AMAN.x} y={ZONA.pusatY} warna="#E0249A">y 497 pusat isi</Teks>
      <Teks x={AMAN.x} y={540} warna="#E0249A">y 540 pusat bingkai</Teks>
      <Teks x={ZONA.logoX} y={ZONA.logoY - 22} warna="#B06F12">zona logo</Teks>
      <Teks x={AMAN.x} y={ZONA.subY} warna="#B06F12">pita subtitle y 925</Teks>
      {KOLOM.map((k, i) => <Teks key={k.x} x={k.x} y={1080 - AMAN.y - 22 - i * 20} warna="#15814F">{`x ${k.x} · ${k.ket}`}</Teks>)}
    </AbsoluteFill>);
};
