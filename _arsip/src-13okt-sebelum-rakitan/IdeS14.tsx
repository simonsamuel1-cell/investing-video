import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 14 — frame 0 = awal Scene 14 (global BATAS.s14). Komposisi utama tidak disentuh (pola Video 02). */
export const S14_AWAL = BATAS.s14;
export const S14_LEN = BATAS.s15 - S14_AWAL;
export const IdeS14: React.FC = () => (
  <>
    <Sequence from={-S14_AWAL} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S14'))} />
  </>);
