import React from 'react';
import { B, rgba } from '../theme';

/**
 * SUNGAI tampak atas (Simon 20 Okt: "sungai tidak terlalu terlihat, mungkin kamu bisa mencari referensi atau download saja").
 * Vektor Freepik/Magnific "seamless border with river top view" (#8792440) = REFERENSI susunan saja (unduhan butuh login; gaya realistisnya
 * tidak ditiru — feedback_referensi_layout_saja): tepian terang seperti pasir, air pekat bergaris tepi, alur tengah lebih terang, riak putih,
 * bentuk sedikit berliku. Warna brand: air turkis #5CC8E3, alur & garis tepi turkis muda, tepian putih.
 * Masuk: air "mengalir" dari atas ke bawah (pita tersingkap ke bawah, easeInOut cubic dari pemanggil). Ujung atas/bawah memudar.
 */
export const SUNGAI_AMP = 26;
/** lebar jembatan jalan kaki: air 380 + tepian 56 + 12 */
export const JEMBATAN_W = 448;
/** pusat sungai pada ketinggian y (berliku halus, satu lengkung-S sepanjang layar) */
export const pusatSungai = (y: number, cx = 960, top = 110) => cx + SUNGAI_AMP * Math.sin((2 * Math.PI * (y - top)) / 1150 + 0.5);

const pita = (cx: number, top: number, bottom: number, lebar: number, n = 48) => {
  const kiri: string[] = [], kanan: string[] = [];
  for (let i = 0; i <= n; i++) {
    const y = top + ((bottom - top) * i) / n, c = pusatSungai(y, cx, top);
    kiri.push(`${(c - lebar / 2).toFixed(1)},${y.toFixed(1)}`);
    kanan.push(`${(c + lebar / 2).toFixed(1)},${y.toFixed(1)}`);
  }
  return `M ${kiri.join(' L ')} L ${kanan.reverse().join(' L ')} Z`;
};

/** riak: garis gelombang pendek di dalam air (posisi tetap, pola tidak berulang terlihat) */
const RIAK = [
  { t: 0.08, dx: -70, w: 70 }, { t: 0.15, dx: 60, w: 54 }, { t: 0.24, dx: -20, w: 80 }, { t: 0.33, dx: 90, w: 48 },
  { t: 0.41, dx: -95, w: 58 }, { t: 0.5, dx: 30, w: 76 }, { t: 0.58, dx: -55, w: 50 }, { t: 0.66, dx: 80, w: 66 },
  { t: 0.75, dx: -30, w: 72 }, { t: 0.84, dx: 70, w: 52 }, { t: 0.92, dx: -80, w: 60 },
];
const gelombang = (x: number, y: number, w: number) => {
  const s = w / 4;
  return `M ${x - w / 2} ${y} q ${s / 2} -7 ${s} 0 t ${s} 0 t ${s} 0 t ${s} 0`;
};

export const Sungai: React.FC<{ id: string; cx?: number; top: number; bottom: number; lebar?: number; p: number; alfa?: number }> =
  ({ id, cx = 960, top, bottom, lebar = 380, p, alfa = 1 }) => {
    if (p <= 0.001 || alfa <= 0.001) return null;
    const h = bottom - top;
    return (
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: alfa < 0.9999 ? alfa : undefined }}>
        <defs>
          {/* air "mengalir" masuk: tersingkap dari atas ke bawah */}
          <clipPath id={`alir-${id}`}><rect x={0} y={top - 40} width={1920} height={(h + 80) * p} /></clipPath>
          {/* ujung atas & bawah memudar (sungai berlanjut di luar bingkai) */}
          <linearGradient id={`pudar-${id}`} x1="0" y1={top} x2="0" y2={bottom} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.1" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.8" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.95" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id={`topeng-${id}`} maskUnits="userSpaceOnUse" x={0} y={0} width={1920} height={1200}>
            <rect x={0} y={top} width={1920} height={h} fill={`url(#pudar-${id})`} />
          </mask>
          <linearGradient id={`air-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={B.turq} />
            <stop offset="0.5" stopColor="#7BD3EA" />
            <stop offset="1" stopColor={B.turq} />
          </linearGradient>
        </defs>
        <g mask={`url(#topeng-${id})`} clipPath={`url(#alir-${id})`}>
          {/* tepian terang (seperti pasir di referensi) + bayangan lembut */}
          <path d={pita(cx, top, bottom, lebar + 56)} fill={rgba(B.white, 0.92)} style={{ filter: `drop-shadow(0 18px 28px ${rgba(B.turq, 0.35)})` }} />
          {/* air */}
          <path d={pita(cx, top, bottom, lebar)} fill={`url(#air-${id})`} />
          <path d={pita(cx, top, bottom, lebar)} fill="none" stroke={B.turqLite} strokeWidth={5} />
          {/* alur tengah lebih terang */}
          <path d={pita(cx + 10, top, bottom, lebar * 0.36)} fill={rgba(B.turqLite, 0.55)} />
          {/* riak putih */}
          {RIAK.map((r, i) => {
            const y = top + h * r.t;
            return <path key={i} d={gelombang(pusatSungai(y, cx, top) + r.dx, y, r.w)} fill="none" stroke={B.white} strokeWidth={4} strokeLinecap="round" opacity={0.85} />;
          })}
        </g>
      </svg>);
  };
