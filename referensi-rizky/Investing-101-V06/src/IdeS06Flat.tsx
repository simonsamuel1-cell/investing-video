import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 06 — VERSI 2D FLAT (scene analogi, 27 Okt). frame 0 = BATAS.s6 (global); komposisi utama memakai sumber yang sama (Babak). */
export const S06F_LEN = BATAS.s7 - BATAS.s6;
export const IdeS06Flat: React.FC = () => (
  <>
    <Sequence from={-BATAS.s6} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S06'))} />
  </>);
