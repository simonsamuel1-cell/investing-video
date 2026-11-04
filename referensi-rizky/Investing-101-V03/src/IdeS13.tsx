import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 13 — frame 0 = awal Scene 13 (global BATAS.s13). Komposisi utama tidak disentuh (pola Video 02). */
export const S13_AWAL = BATAS.s13;
export const S13_LEN = BATAS.s14 - S13_AWAL;
export const IdeS13: React.FC = () => (
  <>
    <Sequence from={-S13_AWAL} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S13'))} />
  </>);
