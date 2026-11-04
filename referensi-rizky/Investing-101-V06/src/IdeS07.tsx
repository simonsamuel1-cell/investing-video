import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 07 — gaya rumah (27 Okt). frame 0 = BATAS.s7 (global); komposisi utama memakai sumber yang sama (Babak). */
export const S07_LEN = BATAS.s8 - BATAS.s7;
export const IdeS07: React.FC = () => (
  <>
    <Sequence from={-BATAS.s7} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S07'))} />
  </>);
