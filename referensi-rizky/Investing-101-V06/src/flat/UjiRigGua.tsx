import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { B } from '../theme';
import { BERDIRI, POSE_GAMBAR, TUNIK, Tokoh, gaya, ikLengan } from './rigGua';

/** UJI RIG GUA (26 Okt): atas = pose BERDIRI (harus = gambar edit Simon) dulu/kini/kelompok + pegang hp; bawah = siklus jalan & lari */
export const UJI_RIG_GUA = 240;
export const UjiRigGua: React.FC = () => {
  const f = useCurrentFrame();
  const hp = ikLengan({ ...BERDIRI, kepala: 10 }, 0, [0, -125], -30);
  return (
    <AbsoluteFill style={{ background: B.white }}>
      <svg width={1920} height={1080}>
        <line x1={0} x2={1920} y1={500} y2={500} stroke={B.grayLite} strokeWidth={3} />
        <line x1={0} x2={1920} y1={1050} y2={1050} stroke={B.grayLite} strokeWidth={3} />
        <Tokoh x={150} tanah={500} s={0.78} pose={POSE_GAMBAR} kostum="dulu" />
        <Tokoh x={430} tanah={500} s={0.78} pose={BERDIRI} kostum="dulu" />
        <Tokoh x={710} tanah={500} s={0.78} pose={hp} kostum="kini" kepala="lihat" ponsel />
        <Tokoh x={990} tanah={500} s={0.75} pose={BERDIRI} kostum="dulu" kepala={{ set: 'keriting', eks: 'netral' }} warna={TUNIK.oranye} />
        <Tokoh x={1270} tanah={500} s={0.7} pose={BERDIRI} kostum="dulu" kepala={{ set: 'wanita', eks: 'netral' }} warna={TUNIK.krem} />
        <Tokoh x={1550} tanah={500} s={0.76} pose={BERDIRI} kostum="dulu" kepala={{ set: 'ikal', eks: 'kaget' }} warna={TUNIK.cokelat} />
        <Tokoh x={1800} tanah={500} s={0.78} pose={gaya(f / 60, 1, 1)} kostum="dulu" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => <Tokoh key={k} x={110 + k * 115} tanah={1050} s={0.55} pose={gaya(k / 8, 0, 1)} kostum="dulu" />)}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => <Tokoh key={k} x={1040 + k * 110} tanah={1050} s={0.55} pose={gaya(k / 8, 1, 1)} kostum="dulu" />)}
      </svg>
    </AbsoluteFill>);
};
