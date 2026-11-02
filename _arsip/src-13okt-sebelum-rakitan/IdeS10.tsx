import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 10 — frame 0 = awal Scene 10 (global BATAS.s10). Komposisi utama tidak disentuh (pola Video 02). */
export const S10_AWAL = BATAS.s10;
export const S10_LEN = BATAS.s11 - S10_AWAL;
export const IdeS10: React.FC = () => (
  <>
    <Sequence from={-S10_AWAL} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S10'))} />
  </>);
