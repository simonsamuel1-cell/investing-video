import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 09 — analogi flat + gaya rumah (27 Okt). frame 0 = BATAS.s9 (global); komposisi utama memakai sumber yang sama (Babak). */
export const S09_LEN = BATAS.s10 - BATAS.s9;
export const IdeS09: React.FC = () => (
  <>
    <Sequence from={-BATAS.s9} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S09'))} />
  </>);
