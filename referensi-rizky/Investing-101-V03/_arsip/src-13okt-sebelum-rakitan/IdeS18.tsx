import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 18 — frame 0 = awal Scene 18 (global BATAS.s18). Komposisi utama tidak disentuh (pola Video 02). */
export const S18_AWAL = BATAS.s18;
export const S18_LEN = BATAS.s19 - S18_AWAL;
export const IdeS18: React.FC = () => (
  <>
    <Sequence from={-S18_AWAL} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S18'))} />
  </>);
