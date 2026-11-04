import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { B, F, R, io, lerp, rgba } from '../theme';
import { Backdrop } from './Backdrop';
import { MODE_UKUR } from './kit';

/**
 * GAYA REFERENSI SIMON (13 Okt, `04_Asset/referensi-layout-simon/ref-01…22`) dalam gaya rumah: KARTU KACA (putih tembus, tepi putih,
 * bayangan lembut berona warna kartunya, pita warna atas/kiri — ref-05/09/10/17/21/22), NOMOR 01·02·03 (ref-04/09/21), PENGHUBUNG
 * putus-putus bertitik (ref-03/04/15), KARAKTER ORANG di lingkaran (brief Video 02 12 Okt: "ganti icon investor, dengan gambar orang
 * berkemeja biru"), FOTO di lingkaran (Video 02: Deposito = brankas), dan MASKER KELUAR scene (brief Video 02 B: perpindahan scene =
 * masker / kesinambungan benda, bukan pudar biasa). Posisi lewat translate3d + rotasi mikro (anti patah-patah).
 */
export const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;

/* ═════════ kartu kaca ═════════ */
export const bayanganKaca = (warna: string, kuat = 1) =>
  `0 34px 60px -30px ${rgba(warna, 0.42 * kuat)}, 0 12px 26px -16px ${rgba(B.night, 0.2 * kuat)}, inset 0 0 0 1.5px ${rgba(B.white, 0.9)}`;

/** kartu kaca berpusat (x, y), w × h; `p` = skala pop dari pusat; `tab` = pita warna (atas / kiri, ref-09 · ref-10); `rona` = wash warna
 *  di dalam kartu (ref-04 · ref-22); `tepi` = bingkai warna (0…1, menyala saat disorot); isi = anak berposisi mutlak dari kiri-atas kartu */
export const Kaca: React.FC<{ x: number; y: number; w: number; h: number; p: number; warna?: string; tab?: 'atas' | 'kiri'; tabTebal?: number; radius?: number;
  rona?: number; tepi?: number; alfa?: number; children?: React.ReactNode; z?: number }> =
  ({ x, y, w, h, p, warna = B.blue, tab, tabTebal = 14, radius = 32, rona = 0, tepi = 0, alfa = 1, children, z }) => p <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: `${w / 2}px ${h / 2}px`, transform: `${geser(x - w / 2, y - h / 2)} scale(${p})`,
      opacity: alfa < 1 ? alfa : undefined, zIndex: z }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: radius, overflow: 'hidden', boxShadow: bayanganKaca(warna),
        background: `linear-gradient(165deg, ${rgba(B.white, 0.98)} 0%, ${rgba(B.white, 0.9)} 100%)` }}>
        {rona > 0 ? <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${rgba(warna, 0.16 * rona)} 0%, ${rgba(warna, 0.04 * rona)} 70%)` }} /> : null}
        {tab === 'atas' ? <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: tabTebal, background: warna }} /> : null}
        {tab === 'kiri' ? <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: tabTebal, background: warna }} /> : null}
        {tepi > 0.001 ? <div style={{ position: 'absolute', inset: 0, borderRadius: radius, boxShadow: `inset 0 0 0 3px ${rgba(warna, Math.min(1, tepi))}` }} /> : null}
      </div>
      {children}
    </div>);

/** nomor bulat "01" (ref-04 · ref-09 · ref-21): lingkaran warna, angka putih dua digit */
export const Nomor: React.FC<{ x: number; y: number; n: number; warna: string; p: number; d?: number }> = ({ x, y, n, warna, p, d = 64 }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, transformOrigin: `${d / 2}px ${d / 2}px`, transform: `${geser(x - d / 2, y - d / 2)} scale(${p})`,
    borderRadius: '50%', background: warna, border: `4px solid ${B.white}`, boxSizing: 'border-box', display: 'grid', placeItems: 'center', color: B.white,
    fontFamily: F, fontSize: d * 0.4, fontWeight: 800, letterSpacing: '.02em', lineHeight: 1, boxShadow: `0 12px 24px -10px ${rgba(warna, 0.8)}` }}>
    {String(n).padStart(2, '0')}
  </div>);

/** penghubung putus-putus bertitik ujung (ref-03 · ref-04 · ref-15) — jalur SVG `d`, `g` = kemajuan 0…1 (sapuan pathLength), panah opsional */
export const Penghubung: React.FC<{ d: string; g: number; warna: string; tebal?: number; dash?: boolean; titik?: boolean; panah?: { x: number; y: number; sudut: number } }> =
  ({ d, g, warna, tebal = 4, dash = true, titik = true, panah }) => {
    if (g <= 0.001) return null;
    // jalur dipotong lewat masker sapuan (pathLength=1000) supaya pola putus-putus tidak ikut bergeser saat tumbuh
    const id = `m${Math.abs(d.split('').reduce((s, c) => (s * 31 + c.charCodeAt(0)) | 0, 7))}`;
    return (
      <g>
        <defs><mask id={id}><path d={d} stroke="#fff" strokeWidth={tebal + 16} fill="none" pathLength={1000} strokeDasharray={`${1000 * g} 1000`} strokeLinecap="round" /></mask></defs>
        <path d={d} stroke={warna} strokeWidth={tebal} fill="none" strokeLinecap="round" strokeDasharray={dash ? `${tebal * 0.1} ${tebal * 3.2}` : undefined} mask={`url(#${id})`} />
        {titik ? <circle cx={Number(d.split(/[ ,]+/)[1])} cy={Number(d.split(/[ ,]+/)[2])} r={tebal * 1.6} fill={warna} /> : null}
        {panah && g > 0.92 ? (
          <path d={`M ${panah.x} ${panah.y} l ${-Math.cos(panah.sudut - 0.5) * 20} ${-Math.sin(panah.sudut - 0.5) * 20} M ${panah.x} ${panah.y} l ${-Math.cos(panah.sudut + 0.5) * 20} ${-Math.sin(panah.sudut + 0.5) * 20}`}
            stroke={warna} strokeWidth={tebal + 1} strokeLinecap="round" fill="none" opacity={R(g, 0.92, 1, 0, 1)} />) : null}
      </g>);
  };

/** lencana chevron di tengah penghubung (ref-14): bulatan warna + "›" */
export const Chevron: React.FC<{ x: number; y: number; warna: string; p: number; d?: number; arah?: 'kanan' | 'bawah' | 'kiri' }> = ({ x, y, warna, p, d = 54, arah = 'kanan' }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, transformOrigin: `${d / 2}px ${d / 2}px`, transform: `${geser(x - d / 2, y - d / 2)} scale(${p})`,
    borderRadius: '50%', background: warna, display: 'grid', placeItems: 'center', boxShadow: `0 10px 20px -8px ${rgba(warna, 0.8)}` }}>
    <svg width={d * 0.46} height={d * 0.46} viewBox="0 0 24 24" style={{ transform: `rotate(${arah === 'bawah' ? 90 : arah === 'kiri' ? 180 : 0}deg)` }}>
      <path d="M 8 4 L 16 12 L 8 20" stroke={B.white} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>);

/* ═════════ karakter orang di lingkaran (port Video 02 parts/karakter.tsx) ═════════ */
export type PoseKarakter = { src: string; w: number; h: number; cx: number; cy: number; r: number; pita?: boolean };
/** murid berkemeja biru, tangan di saku (Video 02 S06 Investor, MURID_S06) — "kita"/orang pertama */
export const MURID: PoseKarakter = { src: 'karakter/murid_depan.webp', w: 1024, h: 1536, cx: 509, cy: 490, r: 270 };
/** investor berjas, menghadap depan (Video 02 S06 pembeli, INVESTOR_JAS) — kepala tampil sama besar dengan MURID */
export const INVESTOR_JAS: PoseKarakter = { src: 'karakter/investor_jas_asli.webp', w: 1129, h: 2000, cx: 578, cy: 695, r: 322 };

/** pusat lingkaran (x, y), diameter D (gambar diskalakan supaya jari-jari pose = D / 2); `s` = pop dari pusat lingkaran. Di atas garis tengah
 *  gambar UTUH (kepala menyembul), di bawahnya terpotong lengkung lingkaran. `pita` = bagian atas hanya selebar lingkaran (latar foto tak ikut). */
export const KarakterLingkar: React.FC<{ pose: PoseKarakter; x: number; y: number; D: number; s: number; warna: string; alfa?: number }> = ({ pose, x, y, D, s, warna, alfa = 1 }) => {
  if (s <= 0.001) return null;
  const k = D / 2 / pose.r, w = pose.w * k, h = pose.h * k, ax = pose.cx * k, ay = pose.cy * k, r = D / 2;
  const kiri = pose.pita ? ax - r : -4, kanan = pose.pita ? ax + r : w + 4;
  const klip = `path('M ${kiri} -4 H ${kanan} V ${ay} H ${ax + r} A ${r} ${r} 0 0 1 ${ax - r} ${ay} H ${kiri} Z')`;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transformOrigin: '0 0', transform: `${geser(x, y)} scale(${s})`, opacity: alfa < 1 ? alfa : undefined }}>
      <div style={{ position: 'absolute', left: -r, top: -r, width: D, height: D, borderRadius: '50%', background: warna }} />
      <Img src={staticFile(pose.src)} style={{ position: 'absolute', left: -ax, top: -ay, width: w, height: h, maxWidth: 'none', clipPath: klip }} />
    </div>);
};

/* ═════════ foto di lingkaran (port Video 02 FotoLingkar, masker={false}: foto utuh di atas lingkaran) ═════════ */
export type KunciFoto = 'brankas' | 'tabungan' | 'bank';
const FOTO: Record<KunciFoto, { src: string; rasio: number; lebar: number; dy: number }> = {
  // Video 02 12 Okt "ini gambar brankasnya" — Deposito, lingkaran Neon Blue, 0,84 D, pusat massa di pusat lingkaran
  brankas: { src: 'media/gedung/brankas.webp', rasio: 1039 / 1080, lebar: 0.84, dy: -0.04 },
  // Video 02 12 Okt (Celengan Pink dan Buku Tabungan) — Tabungan, lingkaran Dark Turquoise
  tabungan: { src: 'media/gedung/tabungan.webp', rasio: 1178 / 992, lebar: 1.1, dy: -0.1 },
  bank: { src: 'media/gedung/bank.webp', rasio: 1262 / 1166, lebar: 0.95, dy: -0.08 },
};
export const FotoBulat: React.FC<{ k: KunciFoto; x: number; y: number; d: number; warna: string; p: number }> = ({ k, x, y, d, warna, p }) => {
  if (p <= 0.001) return null;
  const o = FOTO[k], w = d * o.lebar, h = w / o.rasio;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transformOrigin: '0 0', transform: `${geser(x, y)} scale(${p})` }}>
      <div style={{ position: 'absolute', left: -d / 2, top: -d / 2, width: d, height: d, borderRadius: '50%', background: warna, boxShadow: `0 16px 34px -12px ${warna}aa` }} />
      <Img src={staticFile(o.src)} style={{ position: 'absolute', left: -w / 2, top: -h / 2 + o.dy * d, width: w, height: h, maxWidth: 'none' }} />
    </div>);
};

/* ═════════ masker keluar scene (brief Video 02 B) ═════════ */
export type Titik = { x: number; y: number; r: number };
const R_PENUH = Math.hypot(960, 540) + 30;
/** MASKER KELUAR: isi scene lama (anak) dipotong lingkaran yang menyusut dari selayar ke `ke` (simpul pertama scene baru) selama `dur`
 *  frame mulai `mulai`; isi ikut mengecil ke titik itu. Di dalam lingkaran = salinan latar (scene baru hanya tersingkap DI LUAR lingkaran).
 *  30 % akhir: cakram `warna` memudar menutup isi → saat mendarat lingkaran = cakram simpul scene baru (yang muncul tanpa pop di `mulai + dur`).
 *  Sebelum `mulai` anak tampil biasa; sesudah `mulai + dur` tidak dirender. */
export const durMasker = 60;
export const MaskerKeluar: React.FC<{ f: number; mulai: number; ke: Titik; warna: string; dur?: number; children: React.ReactNode }> =
  ({ f, mulai, ke, warna, dur = durMasker, children }) => {
    if (f >= mulai + dur) return null;
    if (f < mulai) return <AbsoluteFill>{children}</AbsoluteFill>;
    const t = R(f, mulai, mulai + dur, 0, 1, io);
    const cx = lerp(960, ke.x, t), cy = lerp(540, ke.y, t), r = lerp(R_PENUH, ke.r, t);
    const s = lerp(1, Math.max(0.12, (ke.r * 2.6) / 1920), t); // isi mengecil ke simpul
    const tutup = R(t, 0.62, 0.96, 0, 1);
    const cincin = Math.min(R(t, 0.02, 0.15, 0, 1), 1);
    return (
      <AbsoluteFill style={{ zIndex: 1 }}>
        <AbsoluteFill style={{ clipPath: `circle(${r}px at ${cx}px ${cy}px)` }}>
          {MODE_UKUR ? null : <Backdrop f={f} />}
          <AbsoluteFill style={{ transformOrigin: '0 0', transform: `translate(${cx}px, ${cy}px) scale(${s}) translate(-960px, -540px) rotate(0.001deg)` }}>
            {children}
          </AbsoluteFill>
          {tutup > 0.001 ? <div style={{ position: 'absolute', left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: '50%', background: warna, opacity: tutup }} /> : null}
        </AbsoluteFill>
        {cincin > 0.001 && r < 1100 ? (
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            <circle cx={cx} cy={cy} r={Math.max(0, r - 2)} fill="none" stroke={warna} strokeWidth={5} opacity={cincin * (1 - tutup)} />
          </svg>) : null}
      </AbsoluteFill>);
  };
