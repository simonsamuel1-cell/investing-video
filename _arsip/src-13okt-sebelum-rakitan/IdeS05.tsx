import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 05 — frame 0 = awal Scene 05 (global BATAS.s5). Komposisi utama tidak disentuh (pola Video 02). */
export const S05_AWAL = BATAS.s5;
export const S05_LEN = BATAS.s6 - S05_AWAL;
export const IdeS05: React.FC = () => (
  <>
    <Sequence from={-S05_AWAL} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S05'))} />
  </>);
