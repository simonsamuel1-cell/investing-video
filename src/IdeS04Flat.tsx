import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 04 — VERSI 2D FLAT (27 Okt; Ide-S04 lama dihapus). frame 0 = BATAS.s4 (global); komposisi utama memakai sumber yang sama (Babak). */
export const S04F_LEN = BATAS.s5 - BATAS.s4;
export const IdeS04Flat: React.FC = () => (
  <>
    <Sequence from={-BATAS.s4} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S04'))} />
  </>);
