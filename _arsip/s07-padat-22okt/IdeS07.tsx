import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 07 — frame 0 = awal Scene 07 (global BATAS.s7). Komposisi utama memakai sumber yang sama. */
export const S07_AWAL = BATAS.s7;
export const S07_LEN = BATAS.s8 - S07_AWAL; // berakhir sebelum suara Scene 08
export const IdeS07: React.FC = () => (
  <>
    <Sequence from={-S07_AWAL} layout="none"><Babak vo={false} /></Sequence>
    {/* VO dipotong tepat di batas scene (scripts/potong-vo.py) — loop Studio tidak membocorkan suara scene lain */}
    <Audio src={staticFile(VO_IDE('S07'))} />
  </>);
