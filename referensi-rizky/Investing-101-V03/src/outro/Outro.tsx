import React from 'react';
import { Easing, Img, getRemotionEnvironment, interpolate, staticFile } from 'remotion';
import { B, F, rgba } from '../theme';
import { Icon } from '../parts/kit';
import type { KunciIkon } from '../ikon';
import { AiTuntun } from './aiTuntun';
import { OUTRO_BEAT } from './plan.gen';

/**
 * OUTRO "DI VIDEO SELANJUTNYA" — Investing 101 · Video 03 (Simon 20 Okt: "aku ingin menambahkan outro untuk video ini (video 3)";
 * "jadi stylenya sama kan dengan Investing 101"). Naskah: "Di video selanjutnya, kita akan bahas cara mengenali diri sendiri sebelum
 * menentukan investasi yang paling cocok."
 *
 * Pola = penutup Investing 101 V02 yang disetujui (maskot AI Tuntun + kartu chat "Video berikutnya", Scene 13) dalam bentuk KARTU VIDEO
 * seperti outro seri Technical Analysis 20 Okt (pratinjau terjeda + tombol putar + label + judul topik); gaya = kartu kaca Video 03
 * (putih, sudut 32, bayangan kaca ungu brand), huruf Plus Jakarta Sans, satu aksen (Neon Blue) per papan.
 *   1. "Di video selanjutnya,"                 → halaman (maskot + kartu dengan pratinjau terjeda) naik dari bawah, 60f, isi Scene 20 ikut naik keluar
 *   2. "kita akan bahas cara mengenali diri sendiri" → kartu memanjang ke bawah (pusat tetap) lalu judul menyapu
 *   3. "sebelum menentukan investasi yang paling cocok." → tombol putar pop keluar, pratinjau diputar: PROFIL KAMU terisi (tujuan · jangka
 *      waktu · profil risiko, berjenjang 20f dari "sebelum") → garis profil → instrumen tergambar di "paling" → instrumen itu menyala + centang di "cocok"
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

/* ═════════ PRATINJAU: "mengenali diri sendiri sebelum menentukan investasi yang paling cocok" ═════════
 * kiri  = kartu PROFIL KAMU (avatar + tiga baris: tujuan · jangka waktu · profil risiko, bilah terisi berjenjang)
 * kanan = tiga instrumen (gambar realistis Video 03 + nama); garis putus-putus dari profil tergambar ke instrumen yang paling cocok,
 *         instrumen itu menyala (bingkai ungu + centang pop) dan dua lainnya meredup. Satu aksen: Neon Blue. */
const PROFIL = { x: 40, y: 34, w: 380, h: 332 };
const BARIS: { teks: string; ikon: KunciIkon; isi: number }[] = [
  { teks: 'Tujuan', ikon: 'targetUtama', isi: 0.74 },
  { teks: 'Jangka waktu', ikon: 'jangkaWaktu', isi: 0.52 },
  { teks: 'Profil risiko', ikon: 'profilRisiko', isi: 0.63 },
];
const TILE = { x: 520, w: 332, h: 92, y: [84, 200, 316] };
const INSTR = [
  { nama: 'Reksa dana', gambar: 'media/realistis/rd-pasar-uang.webp' },
  { nama: 'Obligasi', gambar: 'media/realistis/obligasi-pemerintah.webp' },
  { nama: 'Saham', gambar: 'media/realistis/saham.webp' },
];
const COCOK = 1; // instrumen yang dipilih (tengah → garis profil lurus mendatar)
const LATAR_BILAH = '#ECEAF7';

const Pratinjau: React.FC<{ f: number }> = ({ f }) => {
  const k = OUTRO_BEAT.k;
  const garis = R(f, k.paling - 30, k.paling + 30);
  const nyala = R(f, k.cocok - 30, k.cocok + 30);
  const centang = popIn(f, k.cocok + 8);
  const x0 = PROFIL.x + PROFIL.w + 10, x1 = TILE.x - 10, yG = TILE.y[COCOK];
  return (
    <>
      {/* kartu profil */}
      <div style={{ position: 'absolute', left: PROFIL.x, top: PROFIL.y, width: PROFIL.w, height: PROFIL.h, borderRadius: 22, background: B.white,
        boxShadow: `0 18px 34px -22px ${rgba(B.blue, 0.45)}, inset 0 0 0 1.5px ${rgba(B.grayLite, 0.5)}`, fontFamily: F }}>
        <div style={{ position: 'absolute', left: 24, top: 22, width: 64, height: 64, borderRadius: '50%', background: B.blueWash, display: 'grid', placeItems: 'center' }}>
          <Icon name="orangA" size={38} color={B.blue} />
        </div>
        <div style={{ position: 'absolute', left: 104, top: 22, height: 64, display: 'flex', alignItems: 'center', fontSize: 27, fontWeight: 800, color: B.night }}>Profil kamu</div>
        <div style={{ position: 'absolute', left: 24, right: 24, top: 104, height: 2, background: rgba(B.grayLite, 0.45) }} />
        {BARIS.map((b, i) => {
          const y = 126 + i * 68;
          const isi = b.isi * R(f, k.sebelum + 20 * i - 30, k.sebelum + 20 * i + 30);
          return (
            <React.Fragment key={b.teks}>
              <div style={{ position: 'absolute', left: 24, top: y, width: 48, height: 48, borderRadius: '50%', background: B.blueWash, display: 'grid', placeItems: 'center' }}>
                <Icon name={b.ikon} size={28} color={B.blue} />
              </div>
              <div style={{ position: 'absolute', left: 88, top: y - 1, fontSize: 21, fontWeight: 700, color: B.night, lineHeight: '26px', whiteSpace: 'nowrap' }}>{b.teks}</div>
              <div style={{ position: 'absolute', left: 88, top: y + 34, width: 268, height: 10, borderRadius: 5, background: LATAR_BILAH, overflow: 'hidden' }}>
                {isi > 0.001 ? <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 268 * isi, borderRadius: 5, background: B.blue }} /> : null}
              </div>
            </React.Fragment>);
        })}
      </div>
      {/* garis profil → instrumen yang paling cocok (trim path, putus-putus tetap lewat masker) */}
      <svg width={TW} height={TH} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {garis > 0.001 ? (
          <g>
            <defs><mask id="outroGaris" maskUnits="userSpaceOnUse" x={0} y={0} width={TW} height={TH}>
              <path d={`M ${x0} ${yG} L ${x1} ${yG}`} pathLength={1} stroke="#fff" strokeWidth={14} strokeDasharray={`${garis} 2`} fill="none" /></mask></defs>
            <path d={`M ${x0} ${yG} L ${x1} ${yG}`} stroke={B.blue} strokeWidth={4} strokeLinecap="round" strokeDasharray="0.4 12.8" fill="none" mask="url(#outroGaris)" />
            <circle cx={x0} cy={yG} r={6.4 * io(Math.min(1, garis / 0.3))} fill={B.blue} />
          </g>) : null}
      </svg>
      {/* instrumen */}
      {INSTR.map((s, i) => {
        const dipilih = i === COCOK;
        const redup = dipilih ? 1 : 1 - 0.55 * nyala;
        return (
          <div key={s.nama} style={{ position: 'absolute', left: TILE.x, top: TILE.y[i] - TILE.h / 2, width: TILE.w, height: TILE.h, borderRadius: 18, background: B.white,
            boxShadow: `0 14px 28px -20px ${rgba(B.blue, 0.4)}, inset 0 0 0 ${dipilih ? 1.5 + 1.5 * nyala : 1.5}px ${dipilih ? rgba(B.blue, nyala) : rgba(B.grayLite, 0.5)}`,
            opacity: redup < 1 ? redup : undefined, fontFamily: F }}>
            {dipilih && nyala > 0.001 ? <div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: rgba(B.blue, 0.07 * nyala) }} /> : null}
            <Img src={staticFile(s.gambar)} style={{ position: 'absolute', left: 16, top: TILE.h / 2 - 32, width: 64, height: 64, objectFit: 'contain' }} />
            <div style={{ position: 'absolute', left: 96, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontSize: 24, fontWeight: 800, color: B.night }}>{s.nama}</div>
            {dipilih && centang > 0.001 ? (
              <div style={{ position: 'absolute', right: 22, top: TILE.h / 2 - 20, width: 40, height: 40, borderRadius: '50%', background: B.blue, display: 'grid', placeItems: 'center',
                transform: `scale(${centang})`, boxShadow: `0 8px 16px -8px ${rgba(B.blue, 0.8)}` }}>
                <svg width={22} height={22} viewBox="0 0 22 22"><path d="M5 11.5 L9.5 16 L17 7" fill="none" stroke={B.white} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>) : null}
          </div>);
      })}
    </>);
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
