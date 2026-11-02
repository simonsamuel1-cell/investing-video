import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 03 — frame 0 = awal Scene 03 (global BATAS.s3, sesudah suara Scene 02 habis). Komposisi utama memakai sumber yang sama. */
export const S03_AWAL = BATAS.s3;
export const S03_LEN = BATAS.s4 - S03_AWAL; // berakhir sebelum suara Scene 04
export const IdeS03: React.FC = () => (
  <>
    <Sequence from={-S03_AWAL} layout="none"><Babak vo={false} /></Sequence>
    {/* VO dipotong tepat di batas scene (scripts/potong-vo.py) — loop Studio tidak membocorkan suara scene lain */}
    <Audio src={staticFile(VO_IDE('S03'))} />
  </>);
