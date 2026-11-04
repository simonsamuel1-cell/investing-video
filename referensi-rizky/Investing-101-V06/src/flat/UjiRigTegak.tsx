import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { B, F } from '../theme';
import { GridChar, GuideChar } from './GuideChar';
import { JALAN_FRAME, TEGAK_LURUS, TokohTegak, gaya, panjangSiklus } from './rigTegak';

/** UJI RIG TEGAK (26 Okt malam): kiri = pose dasar tegak di atas guide; kanan = jalan & lari di tempat, tanah bergerak sejauh langkah
 * (kaki tumpu harus diam terhadap garis-garis tanah), kerangka sendi digambar di atas tokoh. Jalan = 72 frame per siklus (kunci tiap 9 frame, Simon); lari = laju adegan 8,4 px/f @0,82. */
export const UJI_RIG_TEGAK = 600;
const S_ADEGAN = 0.82;
const Treadmill: React.FC<{ f: number; r: 0 | 1; N: number; x: number; tanah: number; s: number; judul: string; warna: string }> = ({ f, r, N, x, tanah, s, judul, warna }) => {
  const u = f / N, jalan = u * panjangSiklus(r) * s;
  const jarak = 60;
  return (
    <g>
      <line x1={x - 520} x2={x + 520} y1={tanah} y2={tanah} stroke={B.grayLite} strokeWidth={3} />
      {Array.from({ length: 18 }, (_, k) => {
        const gx = x - 520 + ((((k * jarak - jalan) % (18 * jarak)) + 18 * jarak) % (18 * jarak));
        return gx > x + 520 ? null : <line key={k} x1={gx} x2={gx} y1={tanah} y2={tanah + 14} stroke={B.gray} strokeWidth={3} />;
      })}
      <TokohTegak x={x} tanah={tanah} s={s} pose={gaya(u, r, 1)} guide />
      <text x={x + 520} y={tanah + 44} textAnchor="end" fontFamily={F} fontSize={16} fontWeight={600} fill={B.gray}>garis tanah bergerak sejauh langkah — kaki tumpu harus diam terhadapnya</text>
      <text x={x - 520} y={tanah - 400} fontFamily={F} fontSize={28} fontWeight={800} fill={warna}>{judul}</text>
      <text x={x - 520} y={tanah - 368} fontFamily={F} fontSize={18} fontWeight={600} fill={B.gray}>1 siklus = {N.toFixed(0)} frame · frame {Math.floor(f % N)} · fase {(u % 1).toFixed(2)}</text>
    </g>);
};
export const UjiRigTegak: React.FC = () => {
  const f = useCurrentFrame();
  const S = 1.75, X = 360, TANAH = 1000;
  return (
    <AbsoluteFill style={{ background: B.white }}>
      <svg width={1920} height={1080}>
        <GridChar x={X} tanah={TANAH} s={S} x0={90} x1={300} y0={-10} y1={530} />
        <TokohTegak x={X} tanah={TANAH} s={S} pose={TEGAK_LURUS} />
        <GuideChar x={X} tanah={TANAH} s={S} x0={90} x1={300} />
        <text x={40} y={50} fontFamily={F} fontSize={28} fontWeight={800} fill={B.night}>Pose dasar: berdiri tegak di guide</text>
        <line x1={700} x2={700} y1={30} y2={1050} stroke={B.grayLite} strokeWidth={2} />
        <Treadmill f={f} r={0} N={JALAN_FRAME} x={1300} tanah={500} s={0.82} judul="JALAN" warna={B.turq} />
        <Treadmill f={f} r={1} N={(panjangSiklus(1) * S_ADEGAN) / 8.4} x={1300} tanah={1010} s={0.82} judul="LARI" warna={B.blue} />
      </svg>
    </AbsoluteFill>);
};
