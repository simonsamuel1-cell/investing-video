import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 08 — frame 0 = awal Scene 08 (global BATAS.s8). Komposisi utama tidak disentuh (pola Video 02). */
export const S08_AWAL = BATAS.s8;
export const S08_LEN = BATAS.s9 - S08_AWAL;
export const IdeS08: React.FC = () => (
  <>
    <Sequence from={-S08_AWAL} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S08'))} />
  </>);
