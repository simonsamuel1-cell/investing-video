import React from 'react';
import { AbsoluteFill } from 'remotion';
import { B, F } from '../theme';
import { TokohKota } from './rigKota';
import { posePonsel } from '../s01flat/Scene01Flat';
import { BERDIRI } from './rigTegak';

/** UJI POSE MAIN HP (27 Okt): tokoh kota (pria-biru Untitled-1) di grid 10/50 satuan + kerangka (biru = sendi, merah putus-putus = tengah kepala →
 * pusat bayangan). Kiri: telunjuk menyentuh layar (f724) · kanan: melayang (f744, jeda membaca). Pose = posePonsel adegan (diukur dari figur pria-biru). */
export const UjiMainHp: React.FC<{ f1?: number; f2?: number }> = ({ f1 = 724, f2 = 744 }) => {
  const S = 1.2, TANAH = 1040;
  const grid = (cx: number) => {
    const g: React.ReactNode[] = [];
    for (let v = -260; v <= 260; v += 10) g.push(<line key={`x${v}`} x1={cx + v * S} x2={cx + v * S} y1={40} y2={TANAH + 10} stroke={v % 50 === 0 ? '#9BDDEE' : '#E2F4FA'} strokeWidth={v % 50 === 0 ? 1.2 : 0.6} />);
    for (let v = 0; v <= 800; v += 10) g.push(<line key={`y${v}`} x1={cx - 260 * S} x2={cx + 260 * S} y1={TANAH - v * S} y2={TANAH - v * S} stroke={v % 50 === 0 ? '#9BDDEE' : '#E2F4FA'} strokeWidth={v % 50 === 0 ? 1.2 : 0.6} />);
    return g;
  };
  return (
    <AbsoluteFill style={{ background: B.white }}>
      <svg width={1920} height={1080}>
        {[[520, f1, 'telunjuk menyentuh layar'], [1400, f2, 'telunjuk terangkat (jeda)']].map(([x, f, judul]) => (
          <g key={String(x)}>
            {grid(x as number)}
            <TokohKota x={x as number} tanah={TANAH} s={S * 0.82} pose={posePonsel(BERDIRI, f as number)} ponsel ketuk guide />
            <text x={(x as number) - 300} y={40} fontFamily={F} fontSize={26} fontWeight={800} fill={B.night}>{judul as string} · f{f as number}</text>
          </g>))}
      </svg>
    </AbsoluteFill>);
};
