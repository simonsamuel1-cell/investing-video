import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 08 — gaya rumah (27 Okt). frame 0 = BATAS.s8 (global); komposisi utama memakai sumber yang sama (Babak). */
export const S08_LEN = BATAS.s9 - BATAS.s8;
export const IdeS08: React.FC = () => (
  <>
    <Sequence from={-BATAS.s8} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S08'))} />
  </>);
