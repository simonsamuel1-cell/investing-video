import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 15 — frame 0 = awal Scene 15 (global BATAS.s15). Komposisi utama tidak disentuh (pola Video 02). */
export const S15_AWAL = BATAS.s15;
export const S15_LEN = BATAS.s16 - S15_AWAL;
export const IdeS15: React.FC = () => (
  <>
    <Sequence from={-S15_AWAL} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S15'))} />
  </>);
