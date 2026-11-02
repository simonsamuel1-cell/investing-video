import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 09 — frame 0 = awal Scene 09 (global BATAS.s9). Komposisi utama tidak disentuh (pola Video 02). */
export const S09_AWAL = BATAS.s9;
export const S09_LEN = BATAS.s10 - S09_AWAL;
export const IdeS09: React.FC = () => (
  <>
    <Sequence from={-S09_AWAL} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S09'))} />
  </>);
