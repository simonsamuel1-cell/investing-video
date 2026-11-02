import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 10 — gaya rumah (27 Okt). frame 0 = BATAS.s10 (global); komposisi utama memakai sumber yang sama (Babak). */
export const S10_LEN = BATAS.s11 - BATAS.s10;
export const IdeS10: React.FC = () => (
  <>
    <Sequence from={-BATAS.s10} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S10'))} />
  </>);
