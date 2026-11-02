import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 12 — gaya rumah (27 Okt). frame 0 = BATAS.s12 (global); komposisi utama memakai sumber yang sama (Babak). */
export const S12_LEN = BATAS.akhir - BATAS.s12;
export const IdeS12: React.FC = () => (
  <>
    <Sequence from={-BATAS.s12} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S12'))} />
  </>);
