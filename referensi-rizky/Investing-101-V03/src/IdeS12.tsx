import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 12 — frame 0 = awal Scene 12 (global BATAS.s12). Komposisi utama tidak disentuh (pola Video 02). */
export const S12_AWAL = BATAS.s12;
export const S12_LEN = BATAS.s13 - S12_AWAL;
export const IdeS12: React.FC = () => (
  <>
    <Sequence from={-S12_AWAL} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S12'))} />
  </>);
