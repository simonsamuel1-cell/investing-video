import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 03 — frame 0 = awal Scene 03 (global BATAS.s3). Komposisi utama tidak disentuh (pola Video 02). */
export const S03_AWAL = BATAS.s3;
export const S03_LEN = BATAS.s4 - S03_AWAL;
export const IdeS03: React.FC = () => (
  <>
    <Sequence from={-S03_AWAL} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S03'))} />
  </>);
