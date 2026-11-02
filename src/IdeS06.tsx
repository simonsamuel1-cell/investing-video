import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 06 — frame 0 = awal Scene 06 (global BATAS.s6). Komposisi utama tidak disentuh (pola Video 02). */
export const S06_AWAL = BATAS.s6;
export const S06_LEN = BATAS.s7 - S06_AWAL;
export const IdeS06: React.FC = () => (
  <>
    <Sequence from={-S06_AWAL} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S06'))} />
  </>);
