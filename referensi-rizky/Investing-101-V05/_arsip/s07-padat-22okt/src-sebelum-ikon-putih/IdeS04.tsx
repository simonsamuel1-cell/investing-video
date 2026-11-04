import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 04 — frame 0 = awal Scene 04 (global BATAS.s4). Komposisi utama memakai sumber yang sama. */
export const S04_AWAL = BATAS.s4;
export const S04_LEN = BATAS.s5 - S04_AWAL; // berakhir sebelum suara Scene 05
export const IdeS04: React.FC = () => (
  <>
    <Sequence from={-S04_AWAL} layout="none"><Babak vo={false} /></Sequence>
    {/* VO dipotong tepat di batas scene (scripts/potong-vo.py) — loop Studio tidak membocorkan suara scene lain */}
    <Audio src={staticFile(VO_IDE('S04'))} />
  </>);
