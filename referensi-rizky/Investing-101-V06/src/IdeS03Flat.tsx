import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 03 — VERSI 2D FLAT (27 Okt; Ide-S03 lama dihapus). frame 0 = BATAS.s3 (global); komposisi utama memakai sumber yang sama (Babak). */
export const S03F_LEN = BATAS.s4 - BATAS.s3;
export const IdeS03Flat: React.FC = () => (
  <>
    <Sequence from={-BATAS.s3} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S03'))} />
  </>);
