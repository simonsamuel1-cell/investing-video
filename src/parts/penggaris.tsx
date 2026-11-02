import React from 'react';
import { B, F } from '../theme';
import { SWIPE, blurArah, cin, cinV, skalaPop } from './kit';
import { popIn } from './pop';

/**
 * PENGGARIS TAHUN — salinan berparameter dari penggaris Scene 01 (s01/Scene01.tsx, disetujui Simon; Scene 01 tetap memakai salinannya sendiri supaya tidak
 * tersentuh). Simon 29 Okt (S11): "Untuk visualisasi ratusan ribu tahun, gunakan seperti yang kamu gunakan discene sebelumnya".
 * Tahun bergulir ke kanan (tahun lama datang dari kiri) 60 f inOut cubic, motion blur mendatar sebanding laju, tepi kiri-kanan memudar; garis = trim dari
 * tengah ke luar, tick pop (linear → easeOutBack), angka naik + menebal; keluar = swipe ke bawah sampai lewat frame.
 */
export const PenggarisTahun: React.FC<{ f: number; tahun: string[]; y: number; masuk: number; gulir: [number, number]; keluar: number; id: string;
  jarak?: number; angka?: number;
  /** VI01 S02 (Simon 30 Okt: "scene 2 kamu swipe ke atas juga bersamaan dengan animasi munculnya line, agar tidak terlihat tumpang tindih"): penggaris
   *  MASUK DARI BAWAH sejauh `naik` px dalam 60 f masuk yang sama (adegan lama sedang swipe ke atas) — 0 = muncul di tempat */
  naik?: number }> = ({ f, tahun, y, masuk: tMasuk, gulir, keluar: tKeluar, id, jarak = 600, angka = 92, naik = 0 }) => {
  if (f <= tMasuk - 30 || f >= tKeluar + 30) return null;
  const masuk = cin(f, tMasuk), keluar = cin(f, tKeluar);
  const d = gulir[1] - gulir[0], pusat = (gulir[0] + gulir[1]) / 2;
  const s = (tahun.length - 1) * cin(f, pusat, d);
  const laju = cinV(f, pusat, d);
  // blur baru menyala saat gulir sudah cepat (dulu menyala di laju ±4 % saat angka belum bergerak → satu frame "menajam/melunak" sendiri, judder f5137)
  const blur = blurArah('x', 12 * Math.max(0, laju - 0.2) / 0.8);
  const xs = (k: number) => 960 - (k - s) * jarak; // posisi layar (untuk memilih yang tampak)
  const x0 = (k: number) => 960 - k * jarak; // posisi DIAM di lapisan yang digeser
  const tickP = skalaPop(popIn(f, tMasuk));
  const GARIS = 6, TICK = 50;
  // 30 Okt malam (judder skala penuh S02 f5137): gulir = SATU transform CSS sub-piksel pada lapisan isi (dulu x tiap teks/garis di SVG berubah per frame →
  // Chrome membulatkan glif ke piksel, angka "menajam" sendiri satu frame di awal gulir). Pudar tepi = mask CSS di lapisan luar yang DIAM.
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translate3d(0, ${keluar * SWIPE + (1 - masuk) * naik}px, 0)`,
      WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 14%, #000 32%, #000 68%, transparent 86%, transparent 100%)',
      maskImage: 'linear-gradient(to right, transparent 0%, transparent 14%, #000 32%, #000 68%, transparent 86%, transparent 100%)' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translate3d(${s * jarak}px, 0, 0) rotate(0.001deg)`, filter: blur }}>
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <defs>
            {masuk < 1 ? <clipPath id={`${id}-trim`}><rect x={960 - 980 * masuk} y={0} width={1960 * masuk} height={1080} /></clipPath> : null}
          </defs>
          <g clipPath={masuk < 1 ? `url(#${id}-trim)` : undefined}>
            {Array.from({ length: tahun.length + 3 }, (_, j) => j - 2).map((k) => (
              <rect key={k} x={x0(k + 1) + 26} y={y - GARIS / 2} width={jarak - 52} height={GARIS} rx={GARIS / 2} fill={B.night} />))}
          </g>
          {tahun.map((th, k) => {
            const x = xs(k);
            if (x < -400 || x > 2320) return null;
            const xd = x0(k);
            return (
              <g key={th}>
                <rect x={xd - 5} y={y - TICK / 2} width={10} height={TICK} rx={3} fill={B.night} transform={`translate(${xd} ${y}) scale(${tickP}) translate(${-xd} ${-y})`} />
              </g>);
          })}
        </svg>
        {/* angka tahun = teks HTML yang naik lewat transform sub-piksel (judder f5137: `y` teks SVG dibulatkan Chrome di ekor ease → angka loncat 1 px) */}
        {tahun.map((th, k) => {
          const x = xs(k);
          if (x < -400 || x > 2320) return null;
          return (
            <div key={th} style={{ position: 'absolute', left: x0(k) - 300, top: y + 54 - 0.15 * angka, width: 600, textAlign: 'center', fontFamily: F, fontSize: angka,
              fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1, color: B.night, opacity: masuk < 0.9999 ? masuk : undefined,
              transform: `translate3d(0, ${(1 - masuk) * 40}px, 0) rotate(0.001deg)` }}>{th}</div>);
        })}
      </div>
    </div>);
};
