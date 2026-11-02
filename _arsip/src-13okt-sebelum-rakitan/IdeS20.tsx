import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 20 — frame 0 = awal Scene 20 (global BATAS.s20). Komposisi utama tidak disentuh (pola Video 02). */
export const S20_AWAL = BATAS.s20;
export const S20_LEN = BATAS.akhir - S20_AWAL;
export const IdeS20: React.FC = () => (
  <>
    <Sequence from={-S20_AWAL} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S20'))} />
  </>);
