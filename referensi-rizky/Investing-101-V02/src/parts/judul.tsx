import React from 'react';
import { B, F, R, io } from '../theme';
import { MODE_UKUR, Sorot, geserSorot } from './kit';

/**
 * judul TEXT naskah — sapuan per kata 60f dipusatkan di `at`; token terakhir disorot (blok ungu tumbuh kiri→kanan,
 * huruf yang tertutup jadi putih — sama dengan judul Scene 01/02). `keluar` = naik + pudar 60f (diganti judul berikutnya).
 */
export const Judul: React.FC<{ f: number; kata: string[]; at: number; sorotAt: number; keluar?: number; size?: number }> = ({ f, kata, at, sorotAt, keluar, size = 52 }) => {
  if (MODE_UKUR) return null;
  const sweep = R(f, at - 30, at + 30, 0, 1); // linear — easing di tiap kata
  const out = keluar === undefined ? 0 : R(f, keluar - 30, keluar + 30, 0, 1, io);
  if (sweep <= 0 || out >= 1) return null;
  const h = R(f, sorotAt - 30, sorotAt + 30, 0, 1, io);
  const st: React.CSSProperties = { fontFamily: F, fontSize: size, fontWeight: 800, letterSpacing: '-.02em', color: B.night };
  const n = kata.length;
  const geser = geserSorot(kata[n - 1], size); // spasi seragam sebelum kotak tampil
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 64, textAlign: 'center', opacity: 1 - out, transform: `translateY(${-24 * out}px)` }}>
      <span style={{ display: 'inline-block' }}>
        {kata.map((w, i) => {
          const p = io(Math.max(0, Math.min(1, (sweep - (i * 0.55) / (n - 1)) / 0.45))); // tiap kata inOut cubic sendiri
          const last = i === n - 1;
          return (
            <span key={w} style={{ ...st, display: 'inline-block', opacity: p, transform: `translate3d(${last ? 0 : geser * (1 - h)}px, ${(1 - p) * 22 + 0.03}px, 0) rotate(0.001deg)`, whiteSpace: 'pre', position: 'relative' }}>
              {last ? (
                <Sorot w={w} h={h} size={size} />) : `${w} `}
            </span>);
        })}
      </span>
    </div>);
};

