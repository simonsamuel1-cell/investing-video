import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 01 — VERSI 2D FLAT (disetujui Simon 27 Okt; Ide-S01 lama dihapus). Memotong Babak yang sama dengan komposisi utama. */
export const S01F_LEN = BATAS.s2;
export const IdeS01Flat: React.FC = () => (
  <>
    <Sequence from={0} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_IDE('S01'))} />
  </>);
