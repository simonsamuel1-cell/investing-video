import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { CharacterRig, HANDS_ON_HIPS, type Pose } from './CharacterRig';

/** UJI (26 Okt): CharacterRig.tsx + Untitled-1.svg kiriman Simon — pose netral, preset, dan siklus jalan/lari sederhana. Bukan bagian video. */
export const UJI_CR = 120;
const jalan = (u: number, amp: number): Pose => {
  const s = Math.sin(2 * Math.PI * u), c = Math.cos(2 * Math.PI * u);
  return {
    thighL: -22 * amp * s, thighR: 22 * amp * s,
    shinL: 40 * amp * Math.max(0, c), shinR: 40 * amp * Math.max(0, -c),
    upperArmL: 20 * amp * s, upperArmR: -20 * amp * s, forearmL: -20 * amp, forearmR: 20 * amp,
    bodyY: -6 * amp * Math.abs(c),
  };
};
export const UjiCharacterRig: React.FC = () => {
  const f = useCurrentFrame();
  const poses: [string, Pose][] = [
    ['netral', {}], ['HANDS_ON_HIPS', HANDS_ON_HIPS], ['lengan naik', { upperArmR: -150, upperArmL: 150, forearmR: 30, forearmL: -30, head: -15 }],
    ['jalan (animasi)', jalan(f / 60, 1)], ['lari (animasi)', jalan(f / 40, 2)], ['sendi ekstrem', { thighR: -45, shinR: 120, thighL: 45, shinL: 120, footL: 30, footR: -30 }],
  ];
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {poses.map(([nama, p], k) => (
        <div key={nama} style={{ position: 'absolute', left: 30 + k * 315, top: 60, width: 300, height: 760, outline: '1px dashed #ddd' }}>
          <CharacterRig pose={p} height={720} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 735, textAlign: 'center', font: '700 22px sans-serif' }}>{nama}</div>
        </div>))}
    </AbsoluteFill>);
};
