import React from 'react';
import { Img, staticFile } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Baloo2';
import { B, rgba } from '../theme';
import { alfaP, opa, useGeser } from '../parts/kit';

/**
 * PEMBUKA SCENE 01 ("Di pelajaran sebelumnya, kita sudah belajar mengenali diri sendiri.") — susunan screenshot Simon 19 Okt:
 * layar berbingkai gelap di kiri berisi kartu judul pelajaran sebelumnya (logo Tuntun Academy + "Investing 101 / Cari Investasi yang
 * Cocok? Kenali Dirimu Dulu") dengan bilah pemutar video gaya screenshot ke-2 (⏮ ⏸ ⏭ · progres turkis · volume · layar penuh),
 * guru berdiri di kanan menunjuk layar (foto Simon "Smiling businessman pointing upward", dipangkas ke alfanya).
 * Kartu judul = kanvas intro 1920×1080 yang diperkecil: logo dipotong dari frame akhir intro asli (000. BG Video/007. Intro App,
 * Video 03 — x 260…1658, y 267…512); judul memakai font intro (Baloo 2 Medium 60 px, diukur: "Investing 101" lebar tinta 330 px).
 */
const { fontFamily: BALOO } = loadFont('normal', { weights: ['500'], subsets: ['latin'] });

export const LAYAR = { x: 120, y: 126, w: 1174, h: 660, bezel: 12, r: 44, bar: 76 };
const DALAM = { w: LAYAR.w - 2 * LAYAR.bezel, h: LAYAR.h - 2 * LAYAR.bezel }; // 1150 × 636
const K = DALAM.w / 1920;
// isi intro (tinta y 271…790, tengah 530,5) di tengah bidang di atas bilah kontrol
const OFF_Y = (DALAM.h - LAYAR.bar) / 2 - 530.5 * K;
const LOGO = { x: 260, y: 267, w: 1398, h: 245 };
// Baloo 2 Medium 60 px, line-height 60: tinta huruf besar mulai ±5,5 px di bawah tepi kotak baris (diukur ulang dari render)
const JUDUL = { size: 60, tinta1: 672, tinta2: 737, tintaDiKotak: 5.5, tinggiTinta: 42 };
const SOROT = { padX: 18, padY: 14, jarak: 20, radius: 14 };

/** guru menunjuk (crop 774×1593; ujung jari di crop x 8, y 226; puncak rambut y 61) */
export const GURU = { src: 'karakter/guru_menunjuk.png', w: 774, h: 1593, s: 0.64, x: 1356, y: 166 };
/** foto yang mencapai tepi bawah memudar 925→975 di atas pita subtitle */
const PUDAR = { a: 925, b: 975 };

const Ikon: React.FC<{ d: string; x: number; size?: number }> = ({ d, x, size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: 'absolute', left: x - size / 2, top: (LAYAR.bar - size) / 2 }}>
    <path d={d} fill={B.white} />
  </svg>);
const IKON = {
  mundur: 'M6 5h2.4v14H6zM20 5v14L9.5 12z',
  jeda: 'M6.5 5h4v14h-4zM13.5 5h4v14h-4z',
  putar: 'M7 4.5v15l12.5-7.5z',
  maju: 'M15.6 5H18v14h-2.4zM4 5v14l10.5-7z',
  suara: 'M4 9h4l5-4.5v15L8 15H4zM16 8.2a5 5 0 0 1 0 7.6l-1.3-1.4a3.2 3.2 0 0 0 0-4.8zM18.4 5.6a8.6 8.6 0 0 1 0 12.8l-1.3-1.4a6.7 6.7 0 0 0 0-10z',
  penuh: 'M4 4h6v2.2H6.2V10H4zM14 4h6v6h-2.2V6.2H14zM4 14h2.2v3.8H10V20H4zM17.8 14H20v6h-6v-2.2h3.8z',
};

/** pusat layar (untuk memindah/memperkecil layar di scene lain lewat `Pindah`) */
export const PUSAT_LAYAR = { x: LAYAR.x + LAYAR.w / 2, y: LAYAR.y + LAYAR.h / 2 };
/** bidang isi di atas bilah pemutar (koordinat lokal) — untuk `isi` pengganti kartu judul */
export const BIDANG_ISI = { w: DALAM.w, h: DALAM.h - LAYAR.bar };

/** layar pemutar: `s` = skala pop (0…1+), `progres` 0…1, `sorot` 0…1 (kotak Neon Blue menyapu "Kenali Dirimu Dulu").
 *  `isi` (Scene 06 "pelajaran berikutnya") menggantikan kartu judul pelajaran sebelumnya; `putar` = ikon ▶ (belum diputar) alih-alih ⏸. */
export const LayarPelajaran: React.FC<{ s: number; progres: number; sorot: number; isi?: React.ReactNode; putar?: boolean }> = ({ s, progres, sorot, isi, putar = false }) => {
  const ny = useGeser();
  if (s <= 0.001) return null;
  const jalur = { x0: 186, x1: DALAM.w - 150 };
  const isiX = jalur.x0 + (jalur.x1 - jalur.x0) * progres;
  const kotakAtas = JUDUL.tintaDiKotak - SOROT.padY;
  return (
    <div style={{ position: 'absolute', left: LAYAR.x, top: LAYAR.y, width: LAYAR.w, height: LAYAR.h, borderRadius: LAYAR.r, background: B.night,
      transform: `translateY(${ny(s, 60)}px)`, opacity: opa(alfaP(s)), boxShadow: `0 34px 70px -34px ${rgba(B.night, 0.45)}` }}>
      <div style={{ position: 'absolute', left: LAYAR.bezel, top: LAYAR.bezel, width: DALAM.w, height: DALAM.h, borderRadius: LAYAR.r - LAYAR.bezel, overflow: 'hidden',
        background: `linear-gradient(165deg, ${B.white} 0%, ${B.white} 55%, ${B.blueWash} 100%)` }}>
        {isi ? <div style={{ position: 'absolute', left: 0, top: 0, width: BIDANG_ISI.w, height: BIDANG_ISI.h }}>{isi}</div> : null}
        {/* kartu judul = kanvas intro 1920×1080 diperkecil K */}
        {isi ? null : <div style={{ position: 'absolute', left: 0, top: OFF_Y, width: 1920, height: 1080, transformOrigin: '0 0', transform: `scale(${K})` }}>
          <Img src={staticFile('brand/academy-logo.png')} style={{ position: 'absolute', left: LOGO.x, top: LOGO.y, width: LOGO.w, height: LOGO.h }} />
          {[{ teks: 'Investing 101', tinta: JUDUL.tinta1 }, { teks: null, tinta: JUDUL.tinta2 }].map((b, i) => (
            <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: b.tinta - JUDUL.tintaDiKotak, textAlign: 'center', whiteSpace: 'pre',
              fontFamily: BALOO, fontWeight: 500, fontSize: JUDUL.size, lineHeight: `${JUDUL.size}px`, color: B.blue }}>
              {b.teks ?? (
                <>
                  <span>Cari Investasi yang Cocok?</span>
                  <span style={{ position: 'relative', display: 'inline-block', marginLeft: 15 + SOROT.jarak }}>
                    Kenali Dirimu Dulu
                    {sorot > 0.001 ? (
                      <span style={{ position: 'absolute', left: -SOROT.padX, top: kotakAtas, height: JUDUL.tinggiTinta + 2 * SOROT.padY,
                        width: `calc(${sorot} * (100% + ${2 * SOROT.padX}px))`, background: B.blue, borderRadius: SOROT.radius, overflow: 'hidden',
                        opacity: Math.min(1, sorot * 6) }}>
                        <span style={{ position: 'absolute', left: SOROT.padX, top: -kotakAtas, color: B.white, whiteSpace: 'pre' }}>Kenali Dirimu Dulu</span>
                      </span>) : null}
                  </span>
                </>)}
            </div>))}
        </div>}
        {/* bilah pemutar (screenshot ke-2): ⏮ ⏸ ⏭ · progres · suara · layar penuh */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: LAYAR.bar, background: rgba(B.night, 0.92) }}>
          <Ikon d={IKON.mundur} x={44} size={26} />
          <Ikon d={putar ? IKON.putar : IKON.jeda} x={92} />
          <Ikon d={IKON.maju} x={140} size={26} />
          <div style={{ position: 'absolute', left: jalur.x0, top: LAYAR.bar / 2 - 4, width: jalur.x1 - jalur.x0, height: 8, borderRadius: 4, background: rgba(B.white, 0.28) }} />
          <div style={{ position: 'absolute', left: jalur.x0, top: LAYAR.bar / 2 - 4, width: isiX - jalur.x0, height: 8, borderRadius: 4, background: B.turq }} />
          <div style={{ position: 'absolute', left: isiX - 11, top: LAYAR.bar / 2 - 11, width: 22, height: 22, borderRadius: '50%', background: B.white }} />
          <Ikon d={IKON.suara} x={DALAM.w - 98} size={28} />
          <Ikon d={IKON.penuh} x={DALAM.w - 48} size={26} />
        </div>
      </div>
    </div>);
};

/** guru berdiri di kanan, menunjuk layar; `s` = skala pop terhadap tengah badan yang tampak */
export const GuruMenunjuk: React.FC<{ s: number }> = ({ s }) => {
  const ny = useGeser();
  if (s <= 0.001) return null;
  const w = GURU.w * GURU.s, h = GURU.h * GURU.s;
  const a = PUDAR.a - GURU.y, b = PUDAR.b - GURU.y;
  const mask = `linear-gradient(to bottom, #000 ${a}px, transparent ${b}px)`;
  return (
    <div style={{ position: 'absolute', left: GURU.x, top: GURU.y, width: w, height: h, transform: `translateY(${ny(s, 60)}px)`, opacity: opa(alfaP(s)),
      WebkitMaskImage: mask, maskImage: mask }}>
      <Img src={staticFile(GURU.src)} style={{ width: w, height: h }} />
    </div>);
};

/** memindah & memperkecil layar (beserta isinya) ke titik lain: (x, y) = pusat baru, k = skala */
export const Pindah: React.FC<{ x: number; y: number; k: number; children: React.ReactNode }> = ({ x, y, k, children }) => (
  <div style={{ position: 'absolute', inset: 0, transformOrigin: `${PUSAT_LAYAR.x}px ${PUSAT_LAYAR.y}px`,
    transform: `translate(${x - PUSAT_LAYAR.x}px, ${y - PUSAT_LAYAR.y}px) scale(${k})` }}>{children}</div>);
