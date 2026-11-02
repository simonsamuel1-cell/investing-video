import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 07 — frame 0 = awal Scene 07 (global BATAS.s7). Komposisi utama tidak disentuh (pola Video 02). */
export const S07_AWAL = BATAS.s7;
export const S07_LEN = BATAS.s8 - S07_AWAL;
export const IdeS07: React.FC = () => (
  <>
    <Sequence from={-S07_AWAL} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S07'))} />
  </>);
