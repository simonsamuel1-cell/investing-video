import React, { useContext } from 'react';
import { KonteksSkala, keLokal, skalaPada } from '../skala';
import { AbsoluteFill, Img, getRemotionEnvironment, staticFile } from 'remotion';
import { B, F, R, io, lerp, rgba } from '../theme';
import { Backdrop, hueAt } from './Backdrop';
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

/** nomor bulat "01" (ref-04 · ref-09 · ref-21): lingkaran warna, angka putih dua digit.
 *  `cincin` (Simon 14 Okt S06 "bedakan warna icon, panel"): lingkaran PUTIH bercincin warna, angka midnight — tidak melebur dengan pita kartu sewarna */
export const Nomor: React.FC<{ x: number; y: number; n: number; warna: string; p: number; d?: number; cincin?: boolean }> = ({ x, y, n, warna, p, d = 64, cincin = false }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, transformOrigin: `${d / 2}px ${d / 2}px`, transform: `${geser(x - d / 2, y - d / 2)} scale(${p})`,
    borderRadius: '50%', background: cincin ? B.white : warna, border: `${cincin ? 5 : 4}px solid ${cincin ? warna : B.white}`, boxSizing: 'border-box', display: 'grid',
    placeItems: 'center', color: cincin ? B.night : B.white,
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
        {/* userSpaceOnUse: garis lurus mendatar ber-bbox tinggi 0 → masker objectBoundingBox tidak menggambar apa pun */}
        <defs><mask id={id} maskUnits="userSpaceOnUse" x={-200} y={-200} width={2320} height={1480}><path d={d} stroke="#fff" strokeWidth={tebal + 16} fill="none" pathLength={1000} strokeDasharray={`${1000 * g} 1000`} strokeLinecap="round" /></mask></defs>
        <path d={d} stroke={warna} strokeWidth={tebal} fill="none" strokeLinecap="round" strokeDasharray={dash ? `${tebal * 0.1} ${tebal * 3.2}` : undefined} mask={`url(#${id})`} />
        {/* (15 Okt, pindai hilang-dom S20) titik pangkal TUMBUH bersama 30 % awal garis — dulu langsung penuh di g > 0 dan hilang seketika saat garis ditarik */}
        {titik ? <circle cx={Number(d.split(/[ ,]+/)[1])} cy={Number(d.split(/[ ,]+/)[2])} r={tebal * 1.6 * io(Math.min(1, g / 0.3))} fill={warna} /> : null}
        {panah && g > 0.7 ? (
          <path d={`M ${panah.x} ${panah.y} l ${-Math.cos(panah.sudut - 0.5) * 20} ${-Math.sin(panah.sudut - 0.5) * 20} M ${panah.x} ${panah.y} l ${-Math.cos(panah.sudut + 0.5) * 20} ${-Math.sin(panah.sudut + 0.5) * 20}`}
            stroke={warna} strokeWidth={tebal + 1} strokeLinecap="round" fill="none" opacity={R(g, 0.7, 1, 0, 1)} />) : null}
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
/** karyawan Scene 01 (berkas Simon, duduk di sofa memegang HP) — kepala/r & puncak kepala/r disamakan dengan MURID & INVESTOR_JAS
 *  (lebar kepala 0,61 r · puncak 1,72 r di atas pusat, terukur); `pita`: bagian atas selebar lingkaran saja (sandaran & lengan sofa tak ikut) */
export const KARYAWAN: PoseKarakter = { src: 'karakter/karyawan-sofa.png', w: 1672, h: 941, cx: 790, cy: 640, r: 348, pita: true };
/** TIGA INVESTOR (berkas Simon 14 Okt, badan penuh berlatar transparan) — r & cy dari ukuran kepala terukur (lebar kepala 0,61 r · puncak 1,72 r di atas pusat)
 *  ORANG_MUDA = sosok yang sama dengan Scene 01/02 (kemeja biru muda) → juga dipakai sebagai "orang pertama" Scene 15 (Simon: "gunakan gambar orang yang sama") */
export const ORANG_MUDA: PoseKarakter = { src: 'karakter/orang_biru_muda.webp', w: 1145, h: 1374, cx: 582, cy: 488, r: 273 };
export const ORANG_SAKU: PoseKarakter = { src: 'karakter/orang_biru_saku.webp', w: 1024, h: 1536, cx: 511, cy: 494, r: 273 };
export const INVESTOR_NAVY: PoseKarakter = { src: 'karakter/investor_jas_navy.webp', w: 1024, h: 1536, cx: 516, cy: 464, r: 243 };

/** pusat lingkaran (x, y), diameter D (gambar diskalakan supaya jari-jari pose = D / 2); `s` = pop dari pusat lingkaran. Di atas garis tengah
 *  gambar UTUH (kepala menyembul), di bawahnya terpotong lengkung lingkaran. `pita` = bagian atas hanya selebar lingkaran (latar foto tak ikut). */
export const KarakterLingkar: React.FC<{ pose: PoseKarakter; x: number; y: number; D: number; s: number; warna: string; alfa?: number; cermin?: boolean }> = ({ pose, x, y, D, s, warna, alfa = 1, cermin = false }) => {
  if (s <= 0.001) return null;
  const k = D / 2 / pose.r, w = pose.w * k, h = pose.h * k, ax = pose.cx * k, ay = pose.cy * k, r = D / 2;
  const kiri = pose.pita ? ax - r : -4, kanan = pose.pita ? ax + r : w + 4;
  const klip = `path('M ${kiri} -4 H ${kanan} V ${ay} H ${ax + r} A ${r} ${r} 0 0 1 ${ax - r} ${ay} H ${kiri} Z')`;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transformOrigin: '0 0', transform: `${geser(x, y)} scale(${s})`, opacity: alfa < 1 ? alfa : undefined }}>
      <div style={{ position: 'absolute', left: -r, top: -r, width: D, height: D, borderRadius: '50%', background: warna }} />
      {/* cermin: gambar (sudah terpotong lingkaran) dibalik mendatar terhadap pusat lingkaran → orang menoleh ke arah sebaliknya */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transform: cermin ? 'scaleX(-1)' : undefined, transformOrigin: '0 0' }}>
        <Img src={staticFile(pose.src)} style={{ position: 'absolute', left: -ax, top: -ay, width: w, height: h, maxWidth: 'none', clipPath: klip }} />
      </div>
    </div>);
};

/* ═════════ foto di lingkaran (port Video 02 FotoLingkar, masker={false}: foto utuh di atas lingkaran) ═════════ */
export type KunciFoto = 'brankas' | 'tabungan' | 'bank' | 'rdPendapatanTetap' | 'rdIndeks' | 'rdSaham' | 'saham';
const FOTO: Record<KunciFoto, { src: string; rasio: number; lebar: number; dy: number }> = {
  // Video 02 12 Okt "ini gambar brankasnya" — Deposito, lingkaran Neon Blue, 0,84 D, pusat massa di pusat lingkaran
  brankas: { src: 'media/gedung/brankas.webp', rasio: 1039 / 1080, lebar: 0.84, dy: -0.04 },
  // Video 02 12 Okt (Celengan Pink dan Buku Tabungan) — Tabungan, lingkaran Dark Turquoise
  tabungan: { src: 'media/gedung/tabungan.webp', rasio: 1178 / 992, lebar: 1.1, dy: -0.1 },
  bank: { src: 'media/gedung/bank.webp', rasio: 1262 / 1166, lebar: 0.95, dy: -0.08 },
  // produk investasi (gambar realistis Simon 14 Okt) — sedikit melebihi lingkaran seperti foto celengan
  rdPendapatanTetap: { src: 'media/realistis/rd-pendapatan-tetap.webp', rasio: 1000 / 819, lebar: 1.08, dy: -0.06 },
  rdIndeks: { src: 'media/realistis/rd-indeks.webp', rasio: 1000 / 878, lebar: 1.05, dy: -0.06 },
  rdSaham: { src: 'media/realistis/rd-saham.webp', rasio: 1000 / 910, lebar: 1.05, dy: -0.06 },
  saham: { src: 'media/realistis/saham.webp', rasio: 1000 / 883, lebar: 1.05, dy: -0.06 },
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
/** Studio saja: isi yang menyusut dikunci rasternya (will-change) — tanpa ini Chrome meraster ulang seluruh scene tiap frame dan Studio
 *  tersendat di transisi (pelajaran Video 02 9 Okt). Render tidak memakai kunci ini (ketajaman penuh). */
const STUDIO = getRemotionEnvironment().isStudio;
/** MASKER KELUAR: isi scene lama (anak) dipotong lingkaran yang menyusut dari selayar ke `ke` (simpul pertama scene baru) selama `dur`
 *  frame mulai `mulai`; isi ikut mengecil ke titik itu. Di dalam lingkaran = salinan latar (scene baru hanya tersingkap DI LUAR lingkaran).
 *  30 % akhir: cakram `warna` memudar menutup isi → saat mendarat lingkaran = cakram simpul scene baru (yang muncul tanpa pop di `mulai + dur`).
 *  Sebelum `mulai` anak tampil biasa; sesudah `mulai + dur` tidak dirender. */
export const durMasker = 60;
export const MaskerKeluar: React.FC<{ f: number; mulai: number; ke: Titik; warna: string; dur?: number; children: React.ReactNode }> =
  ({ f, mulai, ke: keTuju, warna, dur = durMasker, children }) => {
    // skala adegan (skala.ts): titik tujuan ada di koordinat scene TUJUAN → ubah ke koordinat lokal scene ini supaya mendarat di titik layar yang sama
    const kKini = useContext(KonteksSkala);
    const ke = keLokal(keTuju, kKini, skalaPada(mulai + 30));
    if (f >= mulai + dur) return null;
    if (f < mulai) return <AbsoluteFill>{children}</AbsoluteFill>;
    const t = R(f, mulai, mulai + dur, 0, 1, io);
    const cx = lerp(960, ke.x, t), cy = lerp(540, ke.y, t), r = lerp(R_PENUH, ke.r, t);
    const s = lerp(1, Math.max(0.12, (ke.r * 2.6) / 1920), t); // isi mengecil ke simpul
    const tutup = R(t, 0.62, 0.96, 0, 1);
    const cincin = Math.min(R(t, 0.02, 0.15, 0, 1), 1);
    // LINGKARAN = kotak 2·R_PENUH bersudut bulat (overflow hidden) yang DISKALAKAN k = r / R_PENUH lewat transform, isi di dalamnya diskalakan
    // balik 1/k → posisi layar tetap. Semua transform (bukan clip-path yang dianimasikan): Studio cukup menyusun ulang lapisan, tanpa melukis
    // ulang latar & isi tiap frame (clip-path: jeda Studio 130–180 ms di tiap transisi, terukur studio_fps 13 Okt).
    const k = r / R_PENUH;
    const lapis = STUDIO ? { willChange: 'transform' as const } : {};
    return (
      <AbsoluteFill style={{ zIndex: 1 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 2 * R_PENUH, height: 2 * R_PENUH, borderRadius: '50%', overflow: 'hidden', transformOrigin: '0 0',
          transform: `translate(${cx - r}px, ${cy - r}px) scale(${k})`, ...lapis }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0',
            transform: `scale(${1 / k}) translate(${r - cx}px, ${r - cy}px)`, ...lapis }}>
            {/* latar SCENE LAMA di dalam lingkaran (luar lingkaran = latar scene baru; plan.ts berganti seketika di awal masker) */}
            {MODE_UKUR ? null : <Backdrop f={f} hue={hueAt(mulai - 1)} />}
            <AbsoluteFill style={{ transformOrigin: '0 0', transform: `translate(${cx}px, ${cy}px) scale(${s}) translate(-960px, -540px) rotate(0.001deg)`, ...lapis }}>
              {children}
            </AbsoluteFill>
          </div>
          {tutup > 0.001 ? <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: warna, opacity: tutup }} /> : null}
        </div>
        {cincin > 0.001 && r < 1100 ? (
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            <circle cx={cx} cy={cy} r={Math.max(0, r - 2)} fill="none" stroke={warna} strokeWidth={5} opacity={cincin * (1 - tutup)} />
          </svg>) : null}
      </AbsoluteFill>);
  };

/** CAKRAM PENDARATAN (revisi 14 Okt): masker scene lama mendarat sebagai cakram `warna` di titik `ke` → cakram itu memudar 20f sementara elemen
 *  pertama scene baru muncul dari titik yang sama (untuk elemen yang bukan lingkaran: tumpukan uang, kartu, orang). */
export type Masuk = Titik & { warna: string; mulai: number };
export const daratDari = (ke: Masuk) => ke.mulai + durMasker;
export const CakramDarat: React.FC<{ f: number; ke: Masuk }> = ({ f, ke }) => {
  const d = daratDari(ke);
  if (f < d || f >= d + 20) return null;
  return <div style={{ position: 'absolute', left: ke.x - ke.r, top: ke.y - ke.r, width: 2 * ke.r, height: 2 * ke.r, borderRadius: '50%', background: ke.warna,
    opacity: R(f, d, d + 20, 1, 0, io) }} />;
};
