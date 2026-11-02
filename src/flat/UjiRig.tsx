import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { B } from '../theme';
import { BERDIRI, TUNIK, Tokoh, gaya, ikLengan } from './rig';

/** UJI RIG (26 Okt): baris atas = pose diam (kini, dulu, 3 anggota kelompok); baris bawah = siklus jalan & lari bergerak — bukan bagian video */
export const UJI_RIG = 240;
export const UjiRig: React.FC = () => {
  const f = useCurrentFrame();
  const ponsel = ikLengan({ ...BERDIRI, kepala: 12 }, 0, [15, -20], -32);
  return (
    <AbsoluteFill style={{ background: B.white }}>
      <svg width={1920} height={1080}>
        <line x1={0} x2={1920} y1={500} y2={500} stroke={B.grayLite} strokeWidth={4} />
        <line x1={0} x2={1920} y1={1040} y2={1040} stroke={B.grayLite} strokeWidth={4} />
        <Tokoh id="a" x={150} tanah={500} s={1.8} pose={ponsel} kostum="kini" kepala="lihat" ponsel />
        <Tokoh id="b" x={430} tanah={500} s={1.8} pose={BERDIRI} kostum="dulu" />
        <Tokoh id="c" x={710} tanah={500} s={1.7} pose={BERDIRI} kostum="dulu" kepala={{ set: 'keriting', eks: 'netral' }} warna={TUNIK.oranye} />
        <Tokoh id="d" x={990} tanah={500} s={1.65} pose={BERDIRI} kostum="dulu" kepala={{ set: 'wanita', eks: 'netral' }} warna={TUNIK.krem} />
        <Tokoh id="e" x={1270} tanah={500} s={1.75} pose={BERDIRI} kostum="dulu" kepala={{ set: 'ikal', eks: 'kaget' }} warna={TUNIK.cokelat} />
        <Tokoh id="f" x={1550} tanah={500} s={1.75} pose={gaya(f / 60, 1, 1)} kostum="dulu" kepala={{ set: 'keriting', eks: 'kaget' }} warna={TUNIK.oranye} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => <Tokoh key={k} id={`j${k}`} x={120 + k * 120} tanah={1040} s={1.3} pose={gaya(k / 8, 0, 1)} kostum="kini" />)}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => <Tokoh key={k} id={`l${k}`} x={1060 + k * 110} tanah={1040} s={1.3} pose={gaya(k / 8, 1, 1)} kostum="dulu" />)}
      </svg>
    </AbsoluteFill>);
};
