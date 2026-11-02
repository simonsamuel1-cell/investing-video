import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 02 — VERSI 2D FLAT (27 Okt; Ide-S02 lama dihapus). frame 0 = BATAS.s2 (global); komposisi utama memakai sumber yang sama (Babak). */
export const S02F_LEN = BATAS.s3 - BATAS.s2;
export const IdeS02Flat: React.FC = () => (
  <>
    <Sequence from={-BATAS.s2} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S02'))} />
  </>);
