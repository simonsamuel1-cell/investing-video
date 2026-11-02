import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 02 — frame 0 = awal Scene 02 (global BATAS.s2, sesudah suara Scene 01 habis). Komposisi utama tidak disentuh (pola Video 02). */
export const S02_AWAL = BATAS.s2;
export const S02_LEN = BATAS.s3 - S02_AWAL; // berakhir sebelum suara Scene 03
export const IdeS02: React.FC = () => (
  <>
    <Sequence from={-S02_AWAL} layout="none"><Babak vo={false} /></Sequence>
    {/* VO dipotong tepat di batas scene (scripts/potong-vo.py) — loop Studio tidak membocorkan suara scene lain */}
    <Audio src={staticFile(VO_IDE('S02'))} />
  </>);
