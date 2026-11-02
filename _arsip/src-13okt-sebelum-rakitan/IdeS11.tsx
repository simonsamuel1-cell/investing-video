import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 11 — frame 0 = awal Scene 11 (global BATAS.s11). Komposisi utama tidak disentuh (pola Video 02). */
export const S11_AWAL = BATAS.s11;
export const S11_LEN = BATAS.s12 - S11_AWAL;
export const IdeS11: React.FC = () => (
  <>
    <Sequence from={-S11_AWAL} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S11'))} />
  </>);
