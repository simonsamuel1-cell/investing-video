import React from 'react';
import { Easing, getRemotionEnvironment, interpolate } from 'remotion';
import { B, bayanganKecil, CORET, F, rgba, SISI } from '../theme';
import { AiTuntun } from './aiTuntun';
import { Icon, KataTopeng, kataP, kataV } from '../parts/kit';
import { OUTRO_BEAT } from './plan.gen';

/**
 * OUTRO "DI VIDEO SELANJUTNYA" — Investing 101 · Video 06 (VO outro: "Di video selanjutnya, kita akan lihat bagaimana Tuntun membantu investor
 * berpikir lebih jernih dan mengurangi kesalahan sebelum mengambil keputusan."). Pola & komponen = outro Video 05 (salinan, disetujui seri: maskot
 * AI Tuntun + kartu video "Video selanjutnya": pratinjau terjeda + tombol putar + label + judul topik). Judul = ENDING BRIDGE dokumen:
 * "Bagaimana Tuntun Membantu Investor Mengurangi Kesalahan".
 *   1. "Di video selanjutnya,"  → halaman naik dari bawah 60f
 *   2. "bagaimana Tuntun membantu investor" → tombol putar pop keluar, pratinjau diputar; judul baris 1 menyapu
 *   3. "berpikir lebih jernih" → kabut di atas ikon otak menipis; "mengurangi kesalahan" → tiga ✕ di tombol keputusan pop keluar satu per satu;
 *      "keputusan" → ✓ di tombol keputusan. Tidak mengarang fitur/isi video berikutnya — hanya gambaran "berpikir jernih, kesalahan berkurang".
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
  boxShadow: `0 10px 22px -14px ${rgba(B.blue, 0.3)}, 0 3px 8px -5px ${rgba(B.night, 0.12)}, inset 0 0 0 1.5px ${rgba(B.white, 0.9)}` }; // diperkecil 22 Okt sore

/* ── teks per kata BERTOPENG (aturan wajib 22 Okt: swipe sampai keluar "frame"-nya, tanpa pudar) — sama dengan WordText isi video ── */
const Sapu: React.FC<{ f: number; at: number; teks: string; style: React.CSSProperties }> = ({ f, at, teks, style }) => {
  const kata = teks.split(' '), size = Number(style.fontSize);
  return (
    <span style={{ ...style, display: 'inline-block', whiteSpace: 'nowrap' }}>
      {kata.map((w, i) => <KataTopeng key={`${w}${i}`} masuk={kataP(f, at, i, kata.length)} vMasuk={kataV(f, at, i, kata.length)} size={size}>{w}{i < kata.length - 1 ? ' ' : ''}</KataTopeng>)}
    </span>);
};

/* ═════════ PRATINJAU: "berpikir lebih jernih dan mengurangi kesalahan sebelum mengambil keputusan" ═════════
 * ikon otak (kabut menipis di "jernih") ⇢ kaca pembesar memeriksa ⇢ tombol KEPUTUSAN: tiga ✕ pop keluar satu per satu ("mengurangi" · "kesalahan"),
 * lalu ✓ ("keputusan"). Ikon lingkaran putih bertepi warna (aturan ikon). */
const PUSAT = [{ x: 170, y: 200 }, { x: 446, y: 200 }, { x: 722, y: 200 }];
const Lingkar: React.FC<{ x: number; y: number; d: number; warna: string; ikon: 'otak' | 'saring' | 'keputusan'; p?: number }> = ({ x, y, d, warna, ikon, p = 1 }) => (
  <div style={{ position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: '50%', background: B.white, border: `${SISI}px solid ${warna}`,
    boxSizing: 'border-box', display: 'grid', placeItems: 'center', transform: `scale(${p})`, boxShadow: bayanganKecil(warna) }}><Icon name={ikon} size={d * 0.52} color={warna} /></div>);
const Pratinjau: React.FC<{ f: number }> = ({ f }) => {
  const k = OUTRO_BEAT.k;
  const muncul = R(f, OUTRO_BEAT.putar - 30, OUTRO_BEAT.putar + 30);
  const kabut = 1 - R(f, k.jernih - 30, k.jernih + 30);
  const panah = [R(f, k.investor - 30, k.investor + 30), R(f, k.berpikir - 30, k.berpikir + 30)];
  const silang = [k.mengurangi - 10, k.mengurangi + 14, k.kesalahan + 6].map((t) => popOut(f, t));
  const cek = popIn(f, k.keputusan);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: muncul }}>
      <svg width={TW} height={TH} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {[0, 1].map((i) => (
          <line key={i} x1={PUSAT[i].x + 80} x2={PUSAT[i].x + 80 + (PUSAT[i + 1].x - PUSAT[i].x - 160) * panah[i]} y1={200} y2={200} stroke={B.blueLite} strokeWidth={4}
            strokeDasharray="12 13" strokeLinecap="round" />))}
      </svg>
      <Lingkar x={PUSAT[0].x} y={PUSAT[0].y} d={140} warna={B.blue} ikon="otak" />
      {/* kabut di atas otak — menipis di "jernih" */}
      {kabut > 0.001 ? [[-40, -30, 70], [30, -10, 80], [-10, 34, 74]].map(([dx, dy, r], i) => (
        <div key={i} style={{ position: 'absolute', left: PUSAT[0].x + dx - r, top: PUSAT[0].y + dy - r, width: 2 * r, height: 2 * r, borderRadius: '50%',
          background: `radial-gradient(circle, ${rgba('#C9CCE0', 0.95)} 0%, ${rgba('#C9CCE0', 0)} 70%)`, opacity: kabut }} />)) : null}
      <Lingkar x={PUSAT[1].x} y={PUSAT[1].y} d={140} warna={B.turq} ikon="saring" p={popIn(f, k.berpikir)} />
      <Lingkar x={PUSAT[2].x} y={PUSAT[2].y} d={140} warna={cek > 0.5 ? '#2FB36E' : B.orange} ikon="keputusan" p={popIn(f, k.investor + 20)} />
      {/* tiga ✕ kesalahan di sekitar tombol keputusan → pop keluar satu per satu */}
      {/* Simon 30 Okt ("tiap object muncul harus ada animasi masuk & keluarnya"): ✕ dulu dipasang di investor + 20 saat pop-nya sudah 1/3 jalan (muncul
          seketika) → kini dipasang begitu pop mulai */}
      {[[-74, -64], [78, -58], [0, 92]].map(([dx, dy], i) => silang[i] > 0.001 && popIn(f, k.investor + 30 + 8 * i) > 0 ? (
        <div key={i} style={{ position: 'absolute', left: PUSAT[2].x + dx - 24, top: PUSAT[2].y + dy - 24, width: 48, height: 48, borderRadius: '50%', background: B.white,
          border: `${SISI}px solid ${CORET}`, boxSizing: 'border-box', color: CORET, display: 'grid', placeItems: 'center', fontFamily: F, fontWeight: 800, fontSize: 24, lineHeight: 1,
          transform: `scale(${silang[i] * popIn(f, k.investor + 30 + 8 * i)})`, boxShadow: bayanganKecil(CORET) }}>✕</div>) : null)}
      {cek > 0.001 ? (
        <div style={{ position: 'absolute', left: PUSAT[2].x + 46, top: PUSAT[2].y - 74, width: 56, height: 56, borderRadius: '50%', background: B.white, border: `${SISI}px solid #2FB36E`,
          boxSizing: 'border-box', display: 'grid', placeItems: 'center', transform: `scale(${cek})`, boxShadow: bayanganKecil('#2FB36E') }}><Icon name="tersedia" size={30} color="#2FB36E" /></div>) : null}
    </div>);
};

/* ═════════ halaman outro ═════════ */
export const Outro: React.FC<{ f: number; mendarat?: boolean }> = ({ f, mendarat }) => {
  const { judul, putar } = OUTRO_BEAT;
  /* naik dari bawah bersama ekor Scene 12 (Babak), 60f inOut cubic */
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
      {/* posisi lewat translate3d sub-piksel (dulu `top` bulat: kartu yang memanjang pelan saat judul masuk meloncat 1 px — pindai piksel 24 Okt) */}
      <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(GEOM.kx, top), width: KW, height: H, ...KARTU }}>
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
              <div style={{ position: 'absolute', left: TW / 2 - 56, top: TH / 2 - 56, width: 112, height: 112, borderRadius: '50%', background: B.white, border: `${SISI}px solid ${B.blue}`,
                boxSizing: 'border-box', display: 'grid', placeItems: 'center', transform: `scale(${tombol})`, boxShadow: bayanganKecil(B.blue) }}>
                <svg width={52} height={52} viewBox="0 0 52 52"><path d="M18 11 L42 26 L18 41 Z" fill={B.blue} strokeLinejoin="round" stroke={B.blue} strokeWidth={3} /></svg>
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
