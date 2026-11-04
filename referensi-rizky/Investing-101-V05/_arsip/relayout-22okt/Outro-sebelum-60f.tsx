import React from 'react';
import { Easing, getRemotionEnvironment, interpolate } from 'remotion';
import { B, CORET, F, rgba } from '../theme';
import { AiTuntun } from './aiTuntun';
import { OUTRO_BEAT } from './plan.gen';

/**
 * OUTRO "DI VIDEO SELANJUTNYA" — Investing 101 · Video 05 (naskah revisi 21 Okt: "Di video selanjutnya, kita akan bahas kesalahan-kesalahan
 * apa saja yang sering bikin investor salah langkah."). Pola & komponen = outro Video 03 20 Okt (maskot AI Tuntun + kartu video "Video
 * selanjutnya": pratinjau terjeda + tombol putar + label + judul topik), gaya kartu kaca putih, satu aksen per papan.
 *   1. "Di video selanjutnya,"            → halaman (maskot + kartu) naik dari bawah 60f, isi Scene 08 ikut naik keluar
 *   2. "kita akan bahas kesalahan-kesalahan apa saja" → tombol putar pop keluar, pratinjau diputar; judul baris 1 menyapu
 *   3. "yang sering bikin investor salah langkah."   → pratinjau: investor menyeberang sungai lewat batu loncatan (metafora sungai V04/V05);
 *      tanda peringatan muncul di dua batu ("sering" · "bikin"), investor melompat ke batu kedua ("investor") yang goyah & tenggelam ("salah")
 *      → tanda ✕ ("langkah"); judul baris 2 menyapu. Tidak mengarang isi video berikutnya — hanya gambaran "salah langkah".
 * Ketukan = forced alignment MMS_FA (scripts/gen-outro.py → plan.gen.ts), frame LOKAL outro (0 = awal blok).
 */

/* ── waktu & easing (standar 60f Simon: inOut cubic · pop Ease Out Back · keluar Ease In Back) ── */
const io = Easing.inOut(Easing.cubic);
const lin = (t: number) => t;
const R = (f: number, a: number, b: number, x = 0, y = 1, e: (t: number) => number = io) =>
  interpolate(f, [a, b], [x, y], { easing: e, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const C1 = 1.70158, C3 = C1 + 1;
const popIn = (f: number, at: number, d = 60) => {
  const t = R(f, at - d / 2, at + d / 2, 0, 1, lin);
  return t <= 0 ? 0 : 1 + C3 * Math.pow(t - 1, 3) + C1 * Math.pow(t - 1, 2);
};
const popOut = (f: number, at: number, d = 60) => {
  const t = R(f, at - d / 2, at + d / 2, 0, 1, lin);
  return t >= 1 ? 0 : 1 - (C3 * t * t * t - C1 * t * t);
};
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;

/* ── geometri (sama dengan outro seri TA: kelompok maskot + kartu berpusat di 960, tengah area aman) ── */
export const CY = 513;
const KW = 940, PAD = 24, TW = KW - 2 * PAD, TH = 400, TR = 18;
const LABEL_Y = PAD + TH + 24, LABEL_FS = 28, LABEL_LH = 36;
const JUDUL_FS = 50, JUDUL_LH = 62, JUDUL_GAP = 8, BAWAH = 30;
const H0 = LABEL_Y + LABEL_LH + BAWAH;
const MASKOT = { tinggi: 200, tinta: 168 };
const GAP_M = 62;
const KIRI = 960 - (MASKOT.tinta + GAP_M + KW) / 2;
const GEOM = { mx: KIRI + MASKOT.tinta / 2, kx: KIRI + MASKOT.tinta + GAP_M };
const KARTU: React.CSSProperties = { background: B.white, borderRadius: 32,
  boxShadow: `0 34px 60px -30px ${rgba(B.blue, 0.42)}, 0 12px 26px -16px ${rgba(B.night, 0.2)}, inset 0 0 0 1.5px ${rgba(B.white, 0.9)}` };

/* ── teks per kata = SATU sapuan 60f per frasa (tiap kata menempuh 45 % sapuan, naik 0,42× ukuran huruf) ── */
const WORD_SOFT = 0.45;
const wordP = (s: number, i: number, n: number) => n <= 1 ? Math.max(0, Math.min(1, s)) : Math.max(0, Math.min(1, (s - (i * (1 - WORD_SOFT)) / (n - 1)) / WORD_SOFT));
const Sapu: React.FC<{ f: number; at: number; teks: string; style: React.CSSProperties }> = ({ f, at, teks, style }) => {
  const s = R(f, at - 30, at + 30);
  const kata = teks.split(' '), up = Number(style.fontSize) * 0.42;
  return (
    <span style={{ ...style, display: 'inline-block', whiteSpace: 'nowrap' }}>
      {kata.map((w, i) => {
        const p = wordP(s, i, kata.length);
        return (
          <span key={`${w}${i}`} style={{ display: 'inline-block', whiteSpace: 'pre', opacity: p,
            transform: p > 0 && p < 1 ? `translate3d(0, ${(1 - p) * up + 0.03}px, 0) rotate(0.001deg)` : undefined }}>
            {w}{i < kata.length - 1 ? ' ' : ''}
          </span>);
      })}
    </span>);
};

/* ═════════ PRATINJAU: "kesalahan … yang sering bikin investor salah langkah" ═════════
 * sungai mendatar + tiga batu loncatan; investor (bulatan oranye, sama dengan penjelajah peta Scene 08) dari tepi kiri ke batu 1, tanda
 * peringatan di batu 2 & 3, investor ke batu 2 → batu goyah & tenggelam → ✕. Tujuan (bendera) di tepi kanan. Warna: turkis air, oranye penanda. */
const SUNGAI_Y = { atas: 236, bawah: 336 };
const BATU = [{ x: 262, y: 288 }, { x: 456, y: 288 }, { x: 650, y: 288 }];
const TEPI = { kiri: 150, kanan: TW - 150 };
const AWAL = { x: 86, y: 262 };
const loncat = (f: number, at: number, a: { x: number; y: number }, b: { x: number; y: number }, d = 40) => {
  const t = R(f, at - d / 2, at + d / 2);
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t - 64 * Math.sin(Math.PI * t), t };
};

const Pratinjau: React.FC<{ f: number }> = ({ f }) => {
  const k = OUTRO_BEAT.k;
  const muncul = R(f, OUTRO_BEAT.putar - 30, OUTRO_BEAT.putar + 30);
  const goyah = R(f, k.salah - 20, k.salah + 30);       // batu 2 miring & tenggelam
  const silang = popIn(f, k.langkah + 6);
  const atas1 = { x: BATU[0].x, y: BATU[0].y - 26 }, atas2 = { x: BATU[1].x, y: BATU[1].y - 26 };
  const l1 = loncat(f, k.apa, AWAL, atas1), l2 = loncat(f, k.investor, atas1, atas2);
  let p = l1.t < 1 ? l1 : l2;
  p = { ...p, y: p.y + 30 * goyah };
  const peringatan = [popIn(f, k.sering), popIn(f, k.bikin)];
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: muncul }}>
      <svg width={TW} height={TH} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <linearGradient id="outroAir" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={B.turqLite} /><stop offset="0.5" stopColor={B.turq} /><stop offset="1" stopColor={B.turqLite} />
          </linearGradient>
        </defs>
        {/* tepi kiri & kanan (daratan) */}
        <rect x={0} y={SUNGAI_Y.atas - 6} width={TEPI.kiri} height={SUNGAI_Y.bawah - SUNGAI_Y.atas + 12} rx={14} fill={B.white} stroke={rgba(B.grayLite, 0.6)} strokeWidth={2} />
        <rect x={TEPI.kanan} y={SUNGAI_Y.atas - 6} width={TW - TEPI.kanan} height={SUNGAI_Y.bawah - SUNGAI_Y.atas + 12} rx={14} fill={B.white} stroke={rgba(B.grayLite, 0.6)} strokeWidth={2} />
        {/* air */}
        <rect x={TEPI.kiri} y={SUNGAI_Y.atas} width={TEPI.kanan - TEPI.kiri} height={SUNGAI_Y.bawah - SUNGAI_Y.atas} fill="url(#outroAir)" />
        {[[200, 256], [560, 262], [330, 318], [720, 314]].map(([x, y], i) => (
          <path key={i} d={`M ${x - 22} ${y} q 6 -6 11 0 t 11 0 t 11 0 t 11 0`} fill="none" stroke={B.white} strokeWidth={3} strokeLinecap="round" opacity={0.85} />))}
        {/* batu loncatan */}
        {BATU.map((b, i) => {
          const g = i === 1 ? goyah : 0;
          return (
            <g key={i} transform={`translate(${b.x} ${b.y + 22 * g}) rotate(${-16 * g})`} opacity={1 - 0.45 * g}>
              <ellipse cx={0} cy={6} rx={58} ry={20} fill={rgba(B.night, 0.12)} />
              <ellipse cx={0} cy={0} rx={56} ry={20} fill="#ECE9F8" stroke={B.blueLite} strokeWidth={3} />
            </g>);
        })}
        {/* tujuan: bendera di tepi kanan */}
        <line x1={TW - 76} x2={TW - 76} y1={SUNGAI_Y.atas - 92} y2={SUNGAI_Y.atas + 30} stroke={B.night} strokeWidth={5} strokeLinecap="round" />
        <path d={`M ${TW - 74} ${SUNGAI_Y.atas - 90} L ${TW - 18} ${SUNGAI_Y.atas - 72} L ${TW - 74} ${SUNGAI_Y.atas - 54} Z`} fill={B.blue} />
      </svg>
      {/* tanda peringatan di batu 2 & 3 */}
      {BATU.slice(1).map((b, i) => peringatan[i] > 0.001 ? (
        <div key={i} style={{ position: 'absolute', left: b.x - 26, top: b.y - 112, width: 52, height: 52, borderRadius: '50%', background: B.orange, color: B.white,
          display: 'grid', placeItems: 'center', fontFamily: F, fontWeight: 800, fontSize: 32, lineHeight: 1, transform: `scale(${peringatan[i]})`,
          boxShadow: `0 8px 16px -8px ${rgba(B.orange, 0.9)}`, opacity: i === 0 ? 1 - silang : 1 }}>!</div>) : null)}
      {/* investor */}
      {l1.t > 0 || f >= k.apa ? (
        <div style={{ position: 'absolute', left: p.x - 24, top: p.y - 24, width: 48, height: 48, borderRadius: '50%', background: B.orange, border: `4px solid ${B.white}`,
          boxSizing: 'border-box', boxShadow: `0 8px 18px -6px ${rgba(B.orange, 0.9)}` }} />) : (
        <div style={{ position: 'absolute', left: AWAL.x - 24, top: AWAL.y - 24, width: 48, height: 48, borderRadius: '50%', background: B.orange, border: `4px solid ${B.white}`,
          boxSizing: 'border-box', boxShadow: `0 8px 18px -6px ${rgba(B.orange, 0.9)}` }} />)}
      {/* salah langkah: ✕ */}
      {silang > 0.001 ? (
        <div style={{ position: 'absolute', left: BATU[1].x - 30, top: BATU[1].y - 118, width: 60, height: 60, borderRadius: '50%', background: CORET, color: B.white,
          display: 'grid', placeItems: 'center', fontFamily: F, fontWeight: 800, fontSize: 34, lineHeight: 1, transform: `scale(${silang})`,
          boxShadow: `0 10px 20px -8px ${rgba(CORET, 0.8)}` }}>✕</div>) : null}
    </div>);
};

/* ═════════ halaman outro ═════════ */
export const Outro: React.FC<{ f: number; mendarat?: boolean }> = ({ f, mendarat }) => {
  const { judul, putar } = OUTRO_BEAT;
  /* naik dari bawah bersama isi Scene 20 yang naik keluar (Babak), 60f inOut cubic */
  const e = mendarat ? 1 : R(f, 0, 60);
  const dy = (1 - e) * 1080;
  const tumbuhJ = judul.map((j) => R(f, j.at - 50, j.at + 10));
  const H = H0 + tumbuhJ.reduce((s, g, i) => s + g * (i === 0 ? JUDUL_GAP + JUDUL_LH : JUDUL_LH), 0);
  const top = CY - H / 2;
  const tabir = 0.5 * (1 - R(f, putar - 30, putar + 30));
  const tombol = popOut(f, putar);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: geser(0, dy) }}>
      <AiTuntun f={f} x={GEOM.mx} y={CY} tinggi={MASKOT.tinggi} t0={-20} />
      <div style={{ position: 'absolute', left: GEOM.kx, top, width: KW, height: H, ...KARTU }}>
        {/* ekor chat menunjuk maskot (sama dengan kartu "Video berikutnya" Investing 101 V02) */}
        <svg width={28} height={44} viewBox="0 0 28 44" style={{ position: 'absolute', left: -26, top: H / 2 - 22 }}>
          <path d="M28 0 L0 22 L28 44 Z" fill={B.white} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 32 }}>
          <div style={{ position: 'absolute', left: PAD, top: PAD, width: TW, height: TH, borderRadius: TR, overflow: 'hidden', background: '#FAFAFE',
            boxShadow: `inset 0 0 0 1.5px ${rgba(B.grayLite, 0.4)}` }}>
            <Pratinjau f={f} />
            {tabir > 0.001 ? <div style={{ position: 'absolute', inset: 0, background: B.white, opacity: tabir }} /> : null}
            {tombol > 0.001 ? (
              <div style={{ position: 'absolute', left: TW / 2 - 56, top: TH / 2 - 56, width: 112, height: 112, borderRadius: '50%', background: B.blue,
                display: 'grid', placeItems: 'center', transform: `scale(${tombol})`, boxShadow: `0 14px 30px -12px ${rgba(B.blue, 0.67)}` }}>
                <svg width={52} height={52} viewBox="0 0 52 52"><path d="M18 11 L42 26 L18 41 Z" fill={B.white} strokeLinejoin="round" stroke={B.white} strokeWidth={3} /></svg>
              </div>) : null}
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: LABEL_Y, height: LABEL_LH, textAlign: 'center', fontFamily: F, fontWeight: 800,
            fontSize: LABEL_FS, lineHeight: `${LABEL_LH}px`, color: B.blue, letterSpacing: '.01em' }}>Video selanjutnya</div>
          {judul.map((j, i) => (
            <div key={j.teks} style={{ position: 'absolute', left: 0, right: 0, top: LABEL_Y + LABEL_LH + JUDUL_GAP + i * JUDUL_LH, height: JUDUL_LH,
              textAlign: 'center', lineHeight: `${JUDUL_LH}px` }}>
              <Sapu f={f} at={j.at} teks={j.teks} style={{ fontFamily: F, fontWeight: 800, fontSize: JUDUL_FS, color: B.night, letterSpacing: '-.01em' }} />
            </div>))}
        </div>
      </div>
    </div>);
};

const STUDIO = typeof window !== 'undefined' && getRemotionEnvironment().isStudio;
/** Pra-lukis Studio (pelajaran outro TA 20 Okt: macet 16–18 frame saat outro pertama terlihat): selama OUTRO_PRA frame sebelum masuk,
 *  halaman dilukis DI POSISI MENDARAT dengan opasitas 0,002 (< 0,5 level) supaya maskot, kartu & gambar sudah diurai. Render: 0. */
export const OUTRO_PRA = STUDIO ? 60 : 0;
/** `g` = frame lokal outro (0 = awal blok; negatif = fase pra-lukis). STRUKTUR elemen sama di kedua fase (beda struktur = pasang ulang). */
export const OutroPanggung: React.FC<{ g: number }> = ({ g }) => (
  <div style={{ position: 'absolute', inset: 0, opacity: g < 0 ? 0.002 : 1 }}>
    <Outro f={Math.max(0, g)} mendarat={g < 0} />
  </div>);
