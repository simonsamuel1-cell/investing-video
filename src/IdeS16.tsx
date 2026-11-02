import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 16 — frame 0 = awal Scene 16 (global BATAS.s16). Komposisi utama tidak disentuh (pola Video 02). */
export const S16_AWAL = BATAS.s16;
export const S16_LEN = BATAS.s17 - S16_AWAL;
export const IdeS16: React.FC = () => (
  <>
    <Sequence from={-S16_AWAL} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S16'))} />
  </>);
