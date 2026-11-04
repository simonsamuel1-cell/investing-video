import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 11 — gaya rumah (27 Okt). frame 0 = BATAS.s11 (global); komposisi utama memakai sumber yang sama (Babak). */
export const S11_LEN = BATAS.s12 - BATAS.s11;
export const IdeS11: React.FC = () => (
  <>
    <Sequence from={-BATAS.s11} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S11'))} />
  </>);
