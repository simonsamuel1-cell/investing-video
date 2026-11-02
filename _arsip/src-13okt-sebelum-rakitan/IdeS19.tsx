import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 19 — frame 0 = awal Scene 19 (global BATAS.s19). Komposisi utama tidak disentuh (pola Video 02). */
export const S19_AWAL = BATAS.s19;
export const S19_LEN = BATAS.s20 - S19_AWAL;
export const IdeS19: React.FC = () => (
  <>
    <Sequence from={-S19_AWAL} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S19'))} />
  </>);
