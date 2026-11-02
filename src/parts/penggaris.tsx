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
  jarak?: number; angka?: number }> = ({ f, tahun, y, masuk: tMasuk, gulir, keluar: tKeluar, id, jarak = 600, angka = 92 }) => {
  if (f <= tMasuk - 30 || f >= tKeluar + 30) return null;
  const masuk = cin(f, tMasuk), keluar = cin(f, tKeluar);
  const d = gulir[1] - gulir[0], pusat = (gulir[0] + gulir[1]) / 2;
  const s = (tahun.length - 1) * cin(f, pusat, d);
  const laju = cinV(f, pusat, d);
  const blur = blurArah('x', 12 * laju);
  const xs = (k: number) => 960 - (k - s) * jarak;
  const tickP = skalaPop(popIn(f, tMasuk));
  const GARIS = 6, TICK = 50;
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, transform: `translate3d(0, ${keluar * SWIPE}px, 0)` }}>
      <defs>
        <linearGradient id={`${id}-pudar`} x1={0} x2={1920} y1={0} y2={0} gradientUnits="userSpaceOnUse">
          <stop offset={0} stopColor="#fff" stopOpacity={0} /><stop offset={0.14} stopColor="#fff" stopOpacity={0} />
          <stop offset={0.32} stopColor="#fff" stopOpacity={1} /><stop offset={0.68} stopColor="#fff" stopOpacity={1} />
          <stop offset={0.86} stopColor="#fff" stopOpacity={0} /><stop offset={1} stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <mask id={`${id}-masker`} maskUnits="userSpaceOnUse" x={0} y={0} width={1920} height={1080}><rect x={0} y={0} width={1920} height={1080} fill={`url(#${id}-pudar)`} /></mask>
        <clipPath id={`${id}-trim`}><rect x={960 - 980 * masuk} y={0} width={1960 * masuk} height={1080} /></clipPath>
      </defs>
      <g mask={`url(#${id}-masker)`}>
        <g filter={blur}>
          <g clipPath={`url(#${id}-trim)`}>
            {Array.from({ length: tahun.length + 3 }, (_, j) => j - 2).map((k) => (
              <rect key={k} x={xs(k + 1) + 26} y={y - GARIS / 2} width={jarak - 52} height={GARIS} rx={GARIS / 2} fill={B.night} />))}
          </g>
          {tahun.map((th, k) => {
            const x = xs(k);
            if (x < -400 || x > 2320) return null;
            return (
              <g key={th}>
                <rect x={x - 5} y={y - TICK / 2} width={10} height={TICK} rx={3} fill={B.night} transform={`translate(${x} ${y}) scale(${tickP}) translate(${-x} ${-y})`} />
                <text x={x} y={y + 54 + angka * 0.74 + (1 - masuk) * 40} textAnchor="middle" fontFamily={F} fontSize={angka} fontWeight={800} letterSpacing="-0.01em"
                  fill={B.night} opacity={masuk}>{th}</text>
              </g>);
          })}
        </g>
      </g>
    </svg>);
};
