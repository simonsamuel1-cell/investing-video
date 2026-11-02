import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 17 — frame 0 = awal Scene 17 (global BATAS.s17). Komposisi utama tidak disentuh (pola Video 02). */
export const S17_AWAL = BATAS.s17;
export const S17_LEN = BATAS.s18 - S17_AWAL;
export const IdeS17: React.FC = () => (
  <>
    <Sequence from={-S17_AWAL} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S17'))} />
  </>);
